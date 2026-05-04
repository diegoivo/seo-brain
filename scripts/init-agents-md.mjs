#!/usr/bin/env node
// init-agents-md — gera AGENTS.md mínimo num projeto SEO Brain.
// Invocado por /seo-brain:start na 1ª execução em projeto novo (modo Codex/Antigravity/Cursor).
//
// Não toca em CLAUDE.md (cada IDE pode criar o seu).
// Não toca em projetos com AGENTS.md já existente (a menos que --force).
//
// Uso:
//   node scripts/init-agents-md.mjs                # gera no cwd
//   node scripts/init-agents-md.mjs --force        # sobrescreve

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { argv, exit } from "node:process";

const target = join(process.cwd(), "AGENTS.md");
const force = argv.includes("--force");

if (existsSync(target) && !force) {
  console.error(`❌ AGENTS.md já existe em ${target}`);
  console.error("   Use --force para sobrescrever.");
  exit(1);
}

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || join(process.cwd(), "..", "..");
const skillPath = join(PLUGIN_ROOT, "skills/seo-brain/SKILL.md");

if (!existsSync(skillPath)) {
  console.error(`❌ skills/seo-brain/SKILL.md não encontrado em ${PLUGIN_ROOT}`);
  console.error("   Verifique se o plugin SEO Brain está instalado corretamente.");
  exit(1);
}

const skillContent = readFileSync(skillPath, "utf8");
// Strip frontmatter
const body = skillContent.replace(/^---\n[\s\S]*?\n---\n/, "");

const agentsMd = `# SEO Brain Framework

> Auto-gerado por \`scripts/init-agents-md.mjs\` em ${new Date().toISOString().split("T")[0]}.
> Single source of truth: \`skills/seo-brain/SKILL.md\` (no plugin Claude Code).
> Para regenerar: \`node ${PLUGIN_ROOT}/scripts/init-agents-md.mjs --force\`

Você é orquestrador do **SEO Brain**. Coordena sub-agentes especialistas via skills do plugin Claude Code (ou via texto natural em outros harnesses).

${body}

---

## Skills disponíveis (resumo)

Plugin Claude Code: \`/plugin install seo-brain@seo-brain-marketplace\` (uma vez).

Em harnesses sem suporte a plugin (Codex, Antigravity, Cursor), invocar por texto natural:

- "execute o seo-brain" / "iniciar SEO Brain"
- "escrever artigo" / "create blog post" → \`content-seo\`
- "auditar SEO" → \`technical-seo\`
- "qa antes do deploy" → \`qa\`
- "validar voz" → \`content-seo-review\`
- "criar site" → \`website-create\`
- "pesquisar keywords" → \`seo-data\`
`;

writeFileSync(target, agentsMd);
console.log(`✓ AGENTS.md gerado em ${target}`);
console.log(`  ${agentsMd.split("\n").length} linhas, ${agentsMd.length} chars.`);
