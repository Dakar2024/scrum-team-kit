#!/usr/bin/env node
// Definition of Done — hook TaskCompleted, multiplateforme (Node).
// Porte qualite legere : lint ruff si projet Python et ruff dispo. Volontairement
// leger (pas la suite de tests complete) pour ne pas bruler de tokens a chaque tache.
// exit 2 = bloque la completion et renvoie le message a l'agent ; exit 0 = laisse passer.

import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Vider stdin (entree JSON du hook ; non utilisee ici).
try { await new Promise((r) => { let s = ""; process.stdin.on("data", (c) => (s += c)); process.stdin.on("end", r); setTimeout(r, 200); }); } catch { /* ignore */ }

function looksPython() {
  if (existsSync("requirements.txt") || existsSync("pyproject.toml")) return true;
  try {
    const stack = ["."];
    let seen = 0;
    while (stack.length && seen < 2000) {
      const dir = stack.pop();
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name === ".git" || e.name === "node_modules" || e.name === ".venv") continue;
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) stack.push(p);
        else if (e.name.endsWith(".py")) return true;
        seen++;
      }
    }
  } catch { /* ignore */ }
  return false;
}

function hasRuff() {
  const probe = spawnSync(process.platform === "win32" ? "ruff.exe" : "ruff", ["--version"], { stdio: "ignore", shell: false });
  if (!probe.error) return true;
  // fallback: via PATH shell resolution
  const probe2 = spawnSync("ruff", ["--version"], { stdio: "ignore", shell: true });
  return !probe2.error && probe2.status === 0;
}

const problems = [];

if (looksPython() && hasRuff()) {
  const r = spawnSync("ruff", ["check", "."], { encoding: "utf8", shell: true });
  if (r.status !== 0) problems.push("ruff check a echoue :\n" + ((r.stdout || "") + (r.stderr || "")).trim());
}

if (problems.length) {
  process.stderr.write(
    "Definition of Done non respectee avant de clore la tache.\n\n" +
    problems.join("\n\n") +
    "\n\nCorrige le lint, puis verifie : tests verts (pytest/vitest), revue qa-reviewer, doc tech-writer si livrable."
  );
  process.exit(2);
}

process.exit(0);
