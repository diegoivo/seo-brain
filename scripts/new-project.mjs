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

const FRAMEWORK_ROOT = resolveFrameworkRoot() ?? resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_DIR = join(FRAMEWORK_ROOT, "templates/project");

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

const projectsDir = join(FRAMEWORK_ROOT, "projects");
const dest = join(projectsDir, name);

if (existsSync(dest)) {
  console.error(`❌ Projeto já existe: projects/${name}`);
  console.error("   Escolha outro nome ou apague antes.");
  exit(1);
}

if (!existsSync(TEMPLATE_DIR)) {
  console.error(`❌ Template não encontrado: ${TEMPLATE_DIR}`);
  exit(1);
}

console.log(`\n🚀 Criando projeto "${name}" em projects/${name}/\n`);

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
console.log(`  cd projects/${name}`);
console.log(`  # Claude Code:        /onboard`);
console.log(`  # Codex / Antigravity: "execute o onboard"`);
console.log("");
if (!doInstall) {
  console.log(`Quando for rodar o site (Next.js):`);
  console.log(`  cd projects/${name} && npm run web:install`);
  console.log("");
}
console.log(`Para virar repo do cliente depois (opcional):`);
console.log(`  cd projects/${name} && git init && git remote add origin <url>`);
console.log("");

function patchFile(path, projectName) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  writeFileSync(path, content.replaceAll("PROJECT_NAME", projectName));
}

function isValidName(s) {
  return /^[a-z0-9][a-z0-9-]*$/.test(s);
}
