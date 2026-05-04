#!/usr/bin/env node
// new-project — copia templates/project/ para projects/<nome>/.
// Substitui placeholders. Por padrão NÃO instala deps do web/ (só roda
// `npm install` se passar --install ou quando o site for de fato usado).
//
// Uso (a partir da raiz do framework):
//   node scripts/new-project.mjs <nome>            # sem npm install
//   node scripts/new-project.mjs <nome> --install  # instala deps do web/ tambem
//   npm run new <nome>                             # mesmo efeito (sem install)

import { spawnSync } from "node:child_process";
import {
  cpSync, existsSync, readFileSync, writeFileSync, mkdirSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, exit } from "node:process";
import { resolveFrameworkRoot } from "./lib/project-root.mjs";

// Plugin install path (CLAUDE_PLUGIN_ROOT) — onde o template vive.
// Quando dev local, fileURLToPath aponta pro repo. Quando rodando como plugin,
// CLAUDE_PLUGIN_ROOT é setado pelo Claude Code.
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT
  ?? resolveFrameworkRoot()
  ?? resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_DIR = join(PLUGIN_ROOT, "templates/project");

// Target dir — onde projeto é criado. Default é process.cwd() se não estiver
// dentro do framework root (modo plugin). Se cwd === framework root, usa projects/ dentro.
const userCwd = process.cwd();
const isInsideFramework = userCwd === PLUGIN_ROOT || userCwd.startsWith(PLUGIN_ROOT + "/");
const TARGET_BASE = process.env.SEOBRAIN_TARGET_DIR
  ?? (isInsideFramework ? join(PLUGIN_ROOT, "projects") : userCwd);

const args = argv.slice(2);
const name = args.find((a) => !a.startsWith("--"));
const doInstall = args.includes("--install");

if (!name) {
  console.error("Uso: npm run new <nome>");
  console.error("Exemplo: npm run new cliente-a");
  exit(2);
}

if (!isValidName(name)) {
  console.error(`❌ Nome inválido: "${name}".`);
  console.error("   Use apenas a-z, 0-9, hífen. Sem espaços ou caracteres especiais.");
  exit(2);
}

const projectsDir = TARGET_BASE;
const dest = join(projectsDir, name);

// Reject dangerous targets
if (dest === "/" || dest === process.env.HOME || dest === userCwd) {
  console.error(`❌ Target inválido: ${dest}`);
  console.error("   Crie projeto a partir de um diretório diferente do home/root/cwd.");
  exit(2);
}

if (existsSync(dest)) {
  console.error(`❌ Projeto já existe: projects/${name}`);
  console.error("   Escolha outro nome ou apague antes.");
  exit(1);
}

if (!existsSync(TEMPLATE_DIR)) {
  console.error(`❌ Template não encontrado: ${TEMPLATE_DIR}`);
  exit(1);
}

console.log(`\n🚀 Criando projeto "${name}" em ${dest}\n`);

mkdirSync(projectsDir, { recursive: true });

console.log("  · Copiando template...");
cpSync(TEMPLATE_DIR, dest, {
  recursive: true,
  filter: (src) => !src.includes("node_modules") && !src.endsWith(".next"),
});

console.log("  · Personalizando package.json e README...");
patchFile(join(dest, "package.json"), name);
patchFile(join(dest, "README.md"), name);

if (doInstall) {
  console.log("  · Instalando deps do web/...");
  const r = spawnSync("npm", ["install"], {
    cwd: join(dest, "web"),
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.warn("  ⚠️  npm install falhou. Rode manualmente: cd projects/" + name + "/web && npm install");
  }
}

console.log(`\n✅ Pronto.\n`);
console.log(`Próximos passos:`);
console.log(`  cd ${dest}`);
console.log(`  # Claude Code:        /seo-brain:start`);
console.log(`  # Codex / Antigravity: "execute o seo-brain"`);
console.log("");
if (!doInstall) {
  console.log(`Quando for rodar o site (Next.js):`);
  console.log(`  cd ${dest} && npm run web:install`);
  console.log("");
}
console.log(`Para virar repo do cliente depois (opcional):`);
console.log(`  cd ${dest} && git init && git remote add origin <url>`);
console.log("");

function patchFile(path, projectName) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  writeFileSync(path, content.replaceAll("PROJECT_NAME", projectName));
}

function isValidName(s) {
  return /^[a-z0-9][a-z0-9-]*$/.test(s);
}
