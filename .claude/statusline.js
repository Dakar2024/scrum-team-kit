#!/usr/bin/env node
// Statusline multiplateforme (Windows / Linux / macOS) — tourne sous Node, fourni
// avec Claude Code. Affiche modele, dossier, contexte et cout pour garder un oeil
// sur la consommation (abonnement Pro). Lit le JSON de Claude Code sur stdin.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let d = {};
  try { d = JSON.parse(raw); } catch { /* entree vide ou invalide : on degrade */ }

  const model = d?.model?.display_name || "claude";
  const dirPath = d?.workspace?.current_dir || "";
  const dir = dirPath ? dirPath.replace(/[\\/]+$/, "").split(/[\\/]/).pop() : "";

  let ctx = "";
  const used = d?.context?.used_tokens;
  const max = d?.context?.max_tokens;
  if (used && max) ctx = `ctx ${Math.round((used / max) * 100)}%`;

  let cost = "";
  const usd = d?.cost?.total_cost_usd;
  if (usd) cost = `$${Number(usd).toFixed(2)}`;

  const parts = [`[${model}]`];
  if (dir) parts.push(dir);
  if (ctx) parts.push(ctx);
  if (cost) parts.push(cost);
  process.stdout.write(parts.join("  "));
});
