#!/usr/bin/env node
// SessionStart hook — injeta contexto inicial no Claude Code.
// Detecta o contexto do agente:
//   1. Raiz do framework (sem projeto ativo) → orienta a fazer cd ou /new
//   2. Dentro de um projeto, brain template → orienta /onboard
//   3. Dentro de um projeto inicializado → checks de freshness

import { existsSync, statSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  resolveProjectRoot,
  isFrameworkRoot,
  resolveFrameworkRoot,
} from "./lib/project-root.mjs";

const FRESHNESS_DAYS = 30;
const messages = [];

const projectRoot = resolveProjectRoot();
const frameworkRoot = resolveFrameworkRoot();

if (!projectRoot && isFrameworkRoot()) {
  // Modo 1 — desenvolvimento do framework, sem projeto ativo.
  const projects = listProjects(frameworkRoot);
  messages.push("🧠 SEO Brain framework — modo desenvolvimento (sem projeto ativo).");
  if (projects.length === 0) {
    messages.push("   Nenhum projeto criado ainda. Para começar:");
    messages.push("     npm run new <nome>");
  } else {
    messages.push("   Projetos disponíveis:");
    for (const p of projects) messages.push(`     • cd projects/${p}`);
    messages.push("   Ou crie novo: npm run new <nome>");
  }
} else if (!projectRoot) {
  // Contexto desconhecido. Não opina.
  process.exit(0);
} else {
  // Modos 2 e 3 — agente está dentro de um projeto.
  const BRAIN_FILES = [
    "brain/index.md",
    "brain/tom-de-voz.md",
    "brain/tecnologia/index.md",
    "brain/DESIGN.md",
    "brain/backlog.md",
    "brain/glossario/index.md",
  ];

  const templated = [];
  for (const f of BRAIN_FILES) {
    const path = join(projectRoot, f);
    if (!existsSync(path)) continue;
    const state = readKitState(path);
    if (state === "template") templated.push(f);
  }

  if (templated.length === BRAIN_FILES.length) {
    messages.push("🚀 Projeto em estado TEMPLATE. Rode /onboard para iniciar.");
    messages.push("   Sem isso, qualquer site/conteúdo gerado vai usar defaults genéricos.");
  } else if (templated.length > 0) {
    messages.push("⚠️  Onboarding incompleto. Arquivos ainda em estado template:");
    for (const f of templated) messages.push(`   - ${f}`);
    messages.push("   Rode /onboard para retomar.");
  } else {
    const brainIndex = join(projectRoot, "brain/index.md");
    if (existsSync(brainIndex)) {
      const ageDays = (Date.now() - statSync(brainIndex).mtimeMs) / 86400000;
      if (ageDays > FRESHNESS_DAYS) {
        messages.push(`📚 brain/index.md tem ${Math.round(ageDays)} dias sem atualização. Considere uma revisão geral.`);
      }
    }
  }
}

if (messages.length === 0) process.exit(0);

console.log("\n--- Agentic SEO Kit — checks de contexto ---");
for (const m of messages) console.log(m);
console.log("---\n");

function readKitState(path) {
  try {
    const content = readFileSync(path, "utf8");
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) return null;
    const kv = m[1].match(/^kit_state:\s*(\S+)/m);
    return kv ? kv[1] : null;
  } catch {
    return null;
  }
}

function listProjects(root) {
  const dir = join(root, "projects");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}
