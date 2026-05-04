#!/usr/bin/env node
// SessionStart hook — injeta contexto inicial no Claude Code.
// Roda quando plugin é carregado (registrado em hooks/hooks.json).

import { existsSync, statSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Node version check — requer >=20 (não bloqueia, só avisa)
const [nodeMajor] = process.versions.node.split(".").map(Number);
if (nodeMajor < 20) {
  console.error(`⚠️  SEO Brain requires Node ≥20. Current: ${process.versions.node}`);
}

// Resolve lib path. Quando hook roda como plugin, ${CLAUDE_PLUGIN_ROOT} aponta pro plugin cache.
// Quando dev local, fileURLToPath aponta pro hooks/ no repo.
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || dirname(dirname(fileURLToPath(import.meta.url)));
const libPath = join(PLUGIN_ROOT, "scripts/lib/project-root.mjs");

let resolveProjectRoot, isFrameworkRoot, resolveFrameworkRoot;
try {
  ({ resolveProjectRoot, isFrameworkRoot, resolveFrameworkRoot } = await import(libPath));
} catch {
  // Lib não disponível — modo degradado, exit silencioso.
  process.exit(0);
}

const FRESHNESS_DAYS = 30;
const messages = [];

const projectRoot = resolveProjectRoot();
const frameworkRoot = resolveFrameworkRoot();

if (!projectRoot && isFrameworkRoot()) {
  // Modo 1 — desenvolvimento do framework, sem projeto ativo.
  const projects = listProjects(frameworkRoot);
  messages.push("🧠 SEO Brain v0.1.5 — framework root, sem projeto ativo.");
  messages.push("   Use /seo-brain:start para listar/criar projetos.");
  if (projects.length > 0) {
    messages.push("   Projetos disponíveis:");
    for (const p of projects) messages.push(`     • cd projects/${p}`);
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
    messages.push("🚀 Projeto em estado TEMPLATE. Rode /seo-brain:start para popular brain + branding.");
  } else if (templated.length > 0) {
    messages.push("⚠️  Onboarding incompleto. Arquivos ainda em estado template:");
    for (const f of templated) messages.push(`   - ${f}`);
    messages.push("   Rode /seo-brain:start pra retomar.");
  } else {
    const brainIndex = join(projectRoot, "brain/index.md");
    if (existsSync(brainIndex)) {
      const ageDays = (Date.now() - statSync(brainIndex).mtimeMs) / 86400000;
      if (ageDays > FRESHNESS_DAYS) {
        messages.push(`📚 brain/index.md tem ${Math.round(ageDays)} dias sem atualização. Considere uma revisão geral via /wiki (update playbook).`);
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
