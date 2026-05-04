#!/usr/bin/env node
// migrate-existing-project — atualiza projeto pré-v0.1.0 pra usar plugin novo.
// Roda no cwd do projeto. Detecta drift e corrige.
//
// O que faz:
//   1. Remove hook de templates/.claude/settings.json (agora plugin manifest registra)
//   2. Atualiza paths em scripts referenced nos package.json/web (../../scripts → ${CLAUDE_PLUGIN_ROOT}/scripts)
//   3. Regenera AGENTS.md a partir do skills/seobrain/SKILL.md
//   4. Reporta drift detectado
//
// Uso:
//   cd projects/<nome>
//   node ${CLAUDE_PLUGIN_ROOT}/scripts/migrate-existing-project.mjs

import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";

const cwd = process.cwd();
const pkg = join(cwd, "package.json");
const settingsPath = join(cwd, ".claude/settings.json");

if (!existsSync(pkg)) {
  console.error("❌ package.json não encontrado. Roda dentro do projeto.");
  process.exit(1);
}

const pkgJson = JSON.parse(readFileSync(pkg, "utf8"));
if (!pkgJson["seobrain-project"]) {
  console.error("❌ Não é projeto SEO Brain (faltando 'seobrain-project: true' no package.json).");
  process.exit(1);
}

console.log(`🔧 Migrando projeto ${pkgJson.name} pra v0.1.0...\n`);

const issues = [];

// 1. Check .claude/settings.json
if (existsSync(settingsPath)) {
  const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  if (settings.hooks?.SessionStart || settings.hooks?.PreToolUse) {
    console.log("  ✓ Removendo hooks de .claude/settings.json (agora plugin registra)");
    delete settings.hooks;
    settings["// migrated"] = "v0.1.0 — hooks moved to plugin manifest";
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } else {
    console.log("  ℹ️  .claude/settings.json sem hooks (já OK).");
  }
}

// 2. Regenerate AGENTS.md
const initScript = process.env.CLAUDE_PLUGIN_ROOT
  ? join(process.env.CLAUDE_PLUGIN_ROOT, "scripts/init-agents-md.mjs")
  : join(cwd, "..", "..", "scripts/init-agents-md.mjs");

if (existsSync(initScript)) {
  console.log(`  ✓ Regenerando AGENTS.md via ${initScript}...`);
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync("node", [initScript, "--force"], { stdio: "inherit" });
  if (r.status !== 0) issues.push("AGENTS.md regen falhou");
} else {
  issues.push(`init-agents-md.mjs não encontrado em ${initScript}. Plugin instalado?`);
}

// 3. Check brain/ freshness
const brainIndex = join(cwd, "brain/index.md");
if (existsSync(brainIndex)) {
  const ageDays = (Date.now() - statSync(brainIndex).mtimeMs) / 86400000;
  if (ageDays > 30) {
    issues.push(`brain/index.md tem ${Math.round(ageDays)} dias. Considere /wiki-update.`);
  }
}

console.log(`\n${issues.length === 0 ? "✓" : "⚠️"} Migração concluída.\n`);
if (issues.length > 0) {
  console.log("Issues:");
  for (const i of issues) console.log(`  - ${i}`);
}

console.log("\nPróximos passos:");
console.log("  /seobrain:start         (load context)");
console.log("  /wiki-update            (refresh brain se >30 dias)");
console.log("  /qa                     (validate before next change)");
