#!/usr/bin/env node
// Installe l'equipe d'agents Scrum dans un projet cible. Multiplateforme (Node).
// Usage : node install.mjs <chemin-projet> [--force]
//   copie .claude/ (agents, skills, hooks, settings, statusline), le CLAUDE.md et les
//   templates docs, puis cree docs/scrum/. Ne fusionne pas : si .claude/ existe deja,
//   demande confirmation (sauf --force).

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const kit = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const force = args.includes("--force");
const target = args.find((a) => !a.startsWith("--"));

if (!target) {
  console.error("Usage : node install.mjs <chemin-projet> [--force]");
  process.exit(1);
}

if (!existsSync(target)) {
  mkdirSync(target, { recursive: true });
  console.log(`Cree le dossier cible : ${target}`);
}

const targetClaude = join(target, ".claude");
if (existsSync(targetClaude) && !force) {
  const rl = createInterface({ input, output });
  const ans = await rl.question(`${targetClaude} existe deja. Ecraser agents/skills/hooks du kit ? (o/N) `);
  rl.close();
  if (ans.trim().toLowerCase() !== "o") { console.log("Annule."); process.exit(1); }
}

// 1) .claude/
cpSync(join(kit, ".claude"), targetClaude, { recursive: true });
console.log("Copie : .claude/ (agents, skills, hooks, settings.json, statusline.js)");

// 2) CLAUDE.md — ne pas ecraser un CLAUDE.md projet existant
const targetClaudeMd = join(target, "CLAUDE.md");
if (existsSync(targetClaudeMd)) {
  cpSync(join(kit, "CLAUDE.md"), join(target, "CLAUDE.kit.md"));
  console.log("CLAUDE.md existant conserve ; regles du kit copiees en CLAUDE.kit.md (a fusionner).");
} else {
  cpSync(join(kit, "CLAUDE.md"), targetClaudeMd);
  console.log("Copie : CLAUDE.md");
}

// 3) Templates docs + arborescence Scrum
const docs = join(target, "docs");
mkdirSync(join(docs, "scrum", "sprints", "sprint-01"), { recursive: true });
mkdirSync(join(docs, "design", "mockups"), { recursive: true });
cpSync(join(kit, "docs-templates"), join(docs, "docs-templates"), { recursive: true });
const backlog = join(docs, "scrum", "product-backlog.md");
if (!existsSync(backlog)) writeFileSync(backlog, "# Product Backlog\n");
const handoff = join(docs, "scrum", "handoff.md");
if (!existsSync(handoff)) writeFileSync(handoff, "# Handoff — etat repris en debut de session suivante\n");
console.log("Cree : docs/scrum/ + docs/design/ + docs/docs-templates/");

console.log("\nTermine. Dans le projet, lancer la session lead :");
console.log(`    cd ${target}`);
console.log("    claude --agent scrum-master\n");
console.log("Note: Agent Teams est experimental ; session interactive requise et");
console.log("CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 (deja dans .claude/settings.json).");
