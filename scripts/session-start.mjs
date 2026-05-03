#!/usr/bin/env node
// SessionStart hook — injeta contexto inicial no Claude Code.
// Detecta estado do kit (template vs initialized) via frontmatter kit_state.

import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FRESHNESS_DAYS = 30;
const messages = [];

const BRAIN_FILES = [
  "brain/index.md",
  "brain/personas.md",
  "brain/principios-agentic-seo.md",
  "brain/tom-de-voz.md",
  "brain/tecnologia/index.md",
  "brain/DESIGN.md",
  "brain/backlog.md",
  "brain/glossario/index.md",
];

const templated = [];
for (const f of BRAIN_FILES) {
  const path = join(ROOT, f);
  if (!existsSync(path)) continue;
  const state = readKitState(path);
  if (state === "template") templated.push(f);
}

if (templated.length === BRAIN_FILES.length) {
  // Estado template integral — primeira execução.
  messages.push("🚀 Kit em estado TEMPLATE. Rode /onboard para iniciar seu projeto.");
  messages.push("   18 perguntas em 5 fases (~10 min). Sem isso, qualquer site/conteúdo gerado vai usar defaults genéricos.");
} else if (templated.length > 0) {
  // Onboard parcial.
  messages.push("⚠️  Onboarding incompleto. Arquivos ainda em estado template:");
  for (const f of templated) messages.push(`   - ${f}`);
  messages.push("   Rode /onboard para retomar.");
} else {
  // Estado inicializado — checks normais.
  const brainIndex = join(ROOT, "brain/index.md");
  if (existsSync(brainIndex)) {
    const ageDays = (Date.now() - statSync(brainIndex).mtimeMs) / 86400000;
    if (ageDays > FRESHNESS_DAYS) {
      messages.push(`📚 brain/index.md tem ${Math.round(ageDays)} dias sem atualização. Considere uma revisão geral.`);
    }
  }

  const skillsLock = join(ROOT, ".claude/skills-lock.json");
  if (existsSync(skillsLock)) {
    const ageDays = (Date.now() - statSync(skillsLock).mtimeMs) / 86400000;
    if (ageDays > FRESHNESS_DAYS) {
      messages.push(`🧰 Skills externas com ${Math.round(ageDays)} dias sem update. Quando conveniente: npm run skills:update`);
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
