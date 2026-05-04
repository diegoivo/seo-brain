# Compatibilidade com outros harnesses

Plugin Claude Code é a distribuição primária. Mas o framework foi desenhado pra funcionar também em outros harnesses que leem AGENTS.md natively.

## Matriz de compatibilidade

| Harness | Slash commands | Plugin install | AGENTS.md (projeto) | CLAUDE.md (projeto) |
|---|---|---|---|---|
| **Claude Code** | ✅ `/seobrain:start` | ✅ `/plugin install seobrain` | ❌ não precisa | ❌ não precisa |
| **Codex CLI** | ❌ | ❌ | ✅ Gerado por `init-agents-md.mjs` na 1ª execução | ❌ |
| **Antigravity** | ❌ | ❌ | ✅ Idem | ❌ |
| **Cursor** | parcial | ❌ | ✅ Idem | ❌ (usa `.cursorrules` se preferir) |

## Como funciona em harnesses não-Claude

`scripts/init-agents-md.mjs` é invocado pela skill `seobrain` na primeira execução de `/seobrain:start` num projeto. Ele:

1. Lê `${CLAUDE_PLUGIN_ROOT}/skills/seobrain/SKILL.md` (canonical SOT).
2. Gera versão simplificada como `<projeto>/AGENTS.md`.
3. Não toca em CLAUDE.md (cada IDE pode criar o seu).

Codex/Antigravity descobrem o AGENTS.md no projeto e leem natively. Cursor lê `.cursorrules` se existir, senão AGENTS.md.

## Triggers em texto natural (todos os harnesses)

Skills funcionam via **description matching**:

| Pedido do usuário | Skill que matcheia |
|---|---|
| "execute o seobrain" / "iniciar SEO Brain" | `seobrain` |
| "criar projeto" / "novo cliente X" | `seobrain` (modo create-project) |
| "escrever artigo" / "criar post" | `content-seo` |
| "auditar SEO" / "audit SEO técnico" | `technical-seo` |
| "qa antes do deploy" | `qa` |
| "rodar lighthouse" | `technical-seo` (playbooks/performance.md) |

Skill matchea pela description (frontmatter), não pelo nome do slash. Funciona em qualquer harness compatível com Anthropic Agent Skills format.

## Limites

- Codex/Antigravity não rodam hooks → session-start.mjs não dispara automaticamente. Usuário entra no projeto e o agente lê AGENTS.md manualmente.
- Slash commands ficam restritos ao Claude Code. Em outros harnesses, usar texto natural.
- Plugin updates (`/plugin update`) só funcionam em Claude Code. Outros harnesses precisam `git pull` no repo do projeto OU re-clonar o framework.
