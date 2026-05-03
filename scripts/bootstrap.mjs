#!/usr/bin/env node
// Bootstrap — clona o Agentic SEO Kit pra um diretório novo, limpa o .git
// do kit, inicia git limpo e instala dependências. Multi-plataforma.
//
// Uso (a partir de qualquer lugar):
//   npx github:diegoivo/agentic-seo-kit bootstrap meu-projeto
//
// Ou manual:
//   node scripts/bootstrap.mjs <nome-do-projeto>

import { execSync, spawnSync } from "node:child_process";
import { existsSync, rmSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { argv, exit, platform } from "node:process";

const REPO = "https://github.com/diegoivo/seobrain.git";

const target = argv[2];
if (!target) {
  console.error("Uso: bootstrap <nome-do-projeto>");
  console.error("Exemplo: bootstrap meu-blog");
  exit(2);
}

const dest = resolve(target);
const name = basename(dest);

if (existsSync(dest)) {
  console.error(`❌ Diretório já existe: ${dest}`);
  console.error("   Escolha outro nome ou apague antes.");
  exit(1);
}

console.log(`\n🚀 Bootstrap SEO Brain em ${dest}\n`);
console.log(`   ⚠️  Framework experimental. Revise tudo antes de produção.\n`);

const steps = [
  { name: "Criando diretório", run: () => mkdirSync(dest, { recursive: true }) },
  { name: "Clonando kit", run: () => sh(`git clone --depth 1 ${REPO} .`, dest) },
  { name: "Limpando .git do kit", run: () => rmSync(resolve(dest, ".git"), { recursive: true, force: true }) },
  { name: "Iniciando git limpo", run: () => {
      sh("git init", dest);
      sh("git add -A", dest);
      sh('git commit -m "chore: bootstrap from agentic-seo-kit" --quiet', dest);
    }
  },
  { name: "Instalando deps raiz + skills (npm run setup)", run: () => sh("npm run setup", dest) },
  { name: "Instalando deps do /web", run: () => sh("npm install", resolve(dest, "web")) },
];

for (const step of steps) {
  process.stdout.write(`  · ${step.name}... `);
  try {
    step.run();
    console.log("✓");
  } catch (err) {
    console.log("✗");
    console.error(`\n❌ Falhou em "${step.name}": ${err.message}\n`);
    console.error("Você pode retomar manualmente seguindo o README.");
    exit(1);
  }
}

console.log(`\n✅ Pronto. Próximos passos:\n`);
console.log(`  cd ${target}`);
console.log(`  # No Claude Code:        /onboard`);
console.log(`  # No Codex/Antigravity:  "execute o onboard"`);
console.log(`\n   /onboard tem 3 modos:`);
console.log(`     • Express (default) — 1 pergunta aberta, agente decide tudo`);
console.log(`     • Guiado — perguntas em batch por fase`);
console.log(`     • Auto — 1 mensagem só, agent faz e mostra diff final`);
console.log(`\nDocs: https://github.com/diegoivo/seobrain\n`);

function sh(cmd, cwd) {
  const result = spawnSync(cmd, {
    cwd,
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim() || `exit ${result.status}`;
    throw new Error(err.split("\n").slice(0, 3).join(" | "));
  }
  return result.stdout;
}
