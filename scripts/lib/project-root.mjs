// Resolve a raiz de um projeto SEO Brain ou do framework.
// Projeto = pasta com package.json contendo "seo-brain-project": true.
// Framework = pasta com package.json contendo "name": "seo-brain".
//
// Sobe da cwd procurando o marcador. Retorna null se não achar.

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";

export function resolveProjectRoot(start = cwd()) {
  return findUp(start, (pkg) => pkg["seo-brain-project"] === true);
}

export function resolveFrameworkRoot(start = cwd()) {
  return findUp(start, (pkg) => pkg.name === "seo-brain");
}

export function isProjectRoot(path = cwd()) {
  return readPackage(path)?.["seo-brain-project"] === true;
}

export function isFrameworkRoot(path = cwd()) {
  return readPackage(path)?.name === "seo-brain";
}

// Resolve raiz de projeto OU aborta com mensagem clara.
// Use em scripts que SÓ fazem sentido dentro de um projeto.
export function requireProjectRoot() {
  const root = resolveProjectRoot();
  if (root) return root;
  console.error("");
  console.error("❌ Nenhum projeto SEO Brain ativo.");
  console.error("");
  console.error("   Este comando precisa rodar de dentro de um projeto.");
  console.error("   Opções:");
  console.error("     • cd projects/<nome>  (se já existe)");
  console.error("     • npm run new <nome>  (na raiz do framework, cria novo)");
  console.error("");
  process.exit(2);
}

function findUp(start, predicate) {
  let dir = resolve(start);
  while (true) {
    const pkg = readPackage(dir);
    if (pkg && predicate(pkg)) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function readPackage(dir) {
  const pkgPath = resolve(dir, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, "utf8"));
  } catch {
    return null;
  }
}
