#!/usr/bin/env node
// kit:reset-template — para quem clonou o kit antes do onboarding-v1.
// Faz backup do brain atual e restaura templates vazios com kit_state: template.

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { argv, exit } from "node:process";

const ROOT = process.cwd();
const FORCE = argv.includes("--force");

console.log("\n⚠️  kit:reset-template — reset do Brain para estado template");
console.log("   Esta operação substitui o conteúdo de brain/ por templates vazios.\n");

const brainPath = join(ROOT, "brain");
if (!existsSync(brainPath)) {
  console.log("❌ brain/ não existe. Você está no diretório certo?");
  exit(1);
}

if (!FORCE) {
  console.log("Para confirmar, rode: npm run kit:reset-template -- --force");
  console.log("(Backup será salvo em brain/.backup-pre-onboard-<timestamp>/)\n");
  exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = join(ROOT, "brain", `.backup-pre-onboard-${stamp}`);
mkdirSync(backupDir, { recursive: true });

console.log(`📦 Fazendo backup em ${backupDir}...`);
copyTree(brainPath, backupDir, [".backup-pre-onboard-"]);

console.log("⚠️  Para restaurar templates vazios, copie de origin/main os arquivos:");
console.log("   - brain/index.md");
console.log("   - brain/personas.md");
console.log("   - brain/principios-agentic-seo.md");
console.log("   - brain/tom-de-voz.md");
console.log("   - brain/tecnologia/index.md");
console.log("   - brain/DESIGN.md");
console.log("   - brain/backlog.md");
console.log("   - brain/glossario/index.md");
console.log("\nOu rode: git checkout origin/main -- brain/\n");
console.log("Depois rode /onboard no Claude Code.\n");

function copyTree(src, dst, skipPrefixes = []) {
  const entries = readdirSync(src);
  for (const e of entries) {
    if (skipPrefixes.some(p => e.startsWith(p))) continue;
    const s = join(src, e);
    const d = join(dst, e);
    const stat = statSync(s);
    if (stat.isDirectory()) {
      mkdirSync(d, { recursive: true });
      copyTree(s, d, skipPrefixes);
    } else {
      mkdirSync(dirname(d), { recursive: true });
      copyFileSync(s, d);
    }
  }
}
