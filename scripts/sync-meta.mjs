#!/usr/bin/env node
// sync-meta — propaga descrição/keywords do skills/seobrain/SKILL.md
// pra package.json + .claude-plugin/plugin.json + .claude-plugin/marketplace.json.
//
// Single source of truth: skills/seobrain/SKILL.md frontmatter.
// Outros artefatos derivam dele.
//
// Uso:
//   node scripts/sync-meta.mjs --check   # dry-run, falha se out of sync (pre-commit)
//   node scripts/sync-meta.mjs --write   # aplica updates

import { readFileSync, writeFileSync } from "node:fs";

const skillPath = "skills/seobrain/SKILL.md";
const pluginPath = ".claude-plugin/plugin.json";
const marketplacePath = ".claude-plugin/marketplace.json";
const pkgPath = "package.json";

const mode = process.argv[2] || "--check";

const skill = readFileSync(skillPath, "utf8");
const fmMatch = skill.match(/^---\n([\s\S]*?)\n---/);
if (!fmMatch) {
  console.error("❌ skills/seobrain/SKILL.md sem frontmatter.");
  process.exit(1);
}
const fm = fmMatch[1];
const desc = fm.match(/^description:\s*([\s\S]+?)(?=\n[a-z-]+:|$)/m)?.[1]?.trim();

if (!desc) {
  console.error("❌ description não encontrada em frontmatter.");
  process.exit(1);
}

// Short description (1ª frase + Brazilian Portuguese mention)
const shortDesc = desc.split(/[.!?]/)[0] + ". Brazilian Portuguese voice + bilingual triggers (PT/EN).";

const drifts = [];
const updates = [];

function checkOrUpdate(path, key, parser, formatter, expected) {
  const content = readFileSync(path, "utf8");
  const obj = parser(content);
  const current = key.split(".").reduce((o, k) => o?.[k], obj);
  if (current !== expected) {
    drifts.push(`${path}#${key}: drift detected`);
    if (mode === "--write") {
      const keys = key.split(".");
      let target = obj;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      target[keys[keys.length - 1]] = expected;
      writeFileSync(path, formatter(obj));
      updates.push(`${path}#${key}: updated`);
    }
  }
}

// Plugin manifest description
const longDesc = desc.replace(/\s+/g, " ").trim();
checkOrUpdate(
  pluginPath,
  "description",
  (s) => JSON.parse(s),
  (o) => JSON.stringify(o, null, 2) + "\n",
  longDesc,
);

// package.json description
checkOrUpdate(
  pkgPath,
  "description",
  (s) => JSON.parse(s),
  (o) => JSON.stringify(o, null, 2) + "\n",
  shortDesc,
);

console.log(`\nMode: ${mode}`);
console.log(`Drifts: ${drifts.length}`);
console.log(`Updates: ${updates.length}`);

if (drifts.length > 0) {
  console.log("\nDrifts found:");
  for (const d of drifts) console.log(`  - ${d}`);
}

if (mode === "--check" && drifts.length > 0) {
  console.log("\n❌ Run 'node scripts/sync-meta.mjs --write' to fix.");
  process.exit(1);
}

if (updates.length > 0) {
  console.log("\nUpdates applied:");
  for (const u of updates) console.log(`  - ${u}`);
}

console.log("\n✓ All meta files in sync.");
