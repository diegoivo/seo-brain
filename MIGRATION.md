# Migration Guide — SEO Brain v0.1.0

Esta versão converte SEO Brain em **plugin Claude Code distribuível**. Mudanças significativas pra usuários da v0.x antiga.

## Resumo

- **33 skills → 24** (consolidação por domínio).
- **Naming PT-BR → EN** (alinhado com marketplaces globais).
- **Plugin layout:** `skills/`, `commands/`, `hooks/`, `.claude-plugin/` no root (era `.claude/`).
- **`AGENTS.md` deletado do plugin root.** No projeto, gerado automaticamente por `scripts/init-agents-md.mjs`.

## Para projetos pré-v0.1.0

Se você já tem projeto criado por `npm run new <nome>` em versão antiga:

```bash
cd projects/<nome>
node ${CLAUDE_PLUGIN_ROOT}/scripts/migrate-existing-project.mjs
```

(Ou se em dev local: `node ../../scripts/migrate-existing-project.mjs`.)

Isso vai:
1. Remover hook duplicado de `.claude/settings.json` (agora plugin manifest registra).
2. Regenerar AGENTS.md no projeto a partir de `skills/seo-brain/SKILL.md`.
3. Reportar drift (brain >30 dias, etc.).

## Cheat sheet — skill renames

### Pipeline + framework entry
| Antigo | Novo |
|---|---|
| /onboard | /seo-brain:start |
| /plano | /plan |
| /aprovado | /approved |
| /seo-brain-ship | /ship |

### LLM Wiki (era "Brain")
| Antigo | Novo |
|---|---|
| /onboard-brain | /wiki-init |
| /update-brain | /wiki-update |
| /brain-lint | /wiki-lint |

### Branding (consolidada v0.2.0 — `/branding` única com 7 modos)

**v0.2.0 (2026-05-04)**: as 6 skills `branding-*` foram fundidas em uma única `/branding` com modos. Todas as funcionalidades preservadas; nova feature `export` (brandbook.md/.html/.pdf).

| Antigo (v0.1.x) | Novo (v0.2.0) |
|---|---|
| /design-init / /branding-init | `/branding discover` |
| /onboard-brandbook / /branding-onboard | `/branding apply` |
| /brandbook / /branding-brandbook | `/branding apply` (rotas vivas) |
| /setup-images / /branding-images | `/branding images` |
| /qa-design / /branding-review | `/branding review` |
| /site-clone + /clone-fidelity / /branding-clone | `/branding import <url>` |
| (novo) | `/branding export` (brandbook.md + .html + .pdf) |
| (novo) | `/branding list` (lista marcas no repo) |

### Content
| Antigo | Novo |
|---|---|
| /artigo + /blogpost + /intent-analyst + /geo-checklist | /content-seo (consolidado, decision tree) |
| /qa-content | /content-seo-review |

### Technical SEO
| Antigo | Novo |
|---|---|
| /seo-tecnico + /seo-onpage + /seo-imagens + /perf-audit | /technical-seo (consolidado, playbooks) |
| /seo-estrategia | /seo-strategy |
| /qa-tech | /website-qa |

### SEO Data
| Antigo | Novo |
|---|---|
| /keywords-volume + /competitor-pages + /competitor-keywords | /seo-data (consolidado, playbooks) |

### Website
| Antigo | Novo |
|---|---|
| /site-criar | /website-create |
| /web-best-practices | /website-bestpractices |
| /add-cms | /website-cms |
| /setup-domain | /website-domain |
| /setup-email | /website-email |

## Skills consolidadas — como invocar

Skills consolidadas têm decision tree dentro de SKILL.md que roteia pra `playbooks/`. Você não invoca um playbook direto — invoca a skill agregadora e ela escolhe.

Exemplos:
- "escrever artigo" → `/content-seo` carrega `playbooks/article.md`
- "blogpost completo 6 etapas" → `/content-seo` carrega `playbooks/blogpost.md`
- "auditar SEO de uma página" → `/technical-seo` carrega `playbooks/single-page.md`
- "rodar lighthouse" → `/technical-seo` carrega `playbooks/performance.md`

## Onde foi parar /onboard?

Absorvido em `/seo-brain:start`. Mesmas 5 fases (identidade, posicionamento, design, voz, escopo), agora orquestradas pelo entry point.

## Onde foi parar /qa?

Continua existindo, mas agora é skill **fina** (10 linhas) que dispara 3 reviewers em paralelo via `Task`:
- `/branding review` (era `/qa-design` / `/branding-review`)
- `/content-seo-review` (era `/qa-content`)
- `/website-qa` (era `/qa-tech`)

UX pra você é a mesma: roda `/qa` e os 3 sub-agents validam. Diferença é que agora cada reviewer é skill própria invocável standalone se precisar.

## Onde foi parar AGENTS.md?

Deletado do plugin root. Conteúdo virou canonical em `skills/seo-brain/SKILL.md` (single source of truth).

Para harnesses não-Claude (Codex, Antigravity, Cursor), o `scripts/init-agents-md.mjs` gera AGENTS.md no projeto na 1ª execução de `/seo-brain:start`.

## Onde foi parar CLAUDE.md?

Deletado do plugin root. Plugin Claude Code não precisa — skills são auto-descobertas.

Cada IDE/projeto pode criar seu próprio CLAUDE.md se quiser instruções específicas.

## Token usage

- **Pré-v0.1.0** (com AGENTS.md import via CLAUDE.md): ~5052 tokens carregados em SessionStart.
- **v0.1.0**: ~2300 tokens (só frontmatters de 24 skills, sem AGENTS.md).
- **Saving:** ~2700 tokens/sessão.

## Precisa de ajuda?

- Issues: https://github.com/diegoivo/seo-brain/issues
- Plan original: `scratch/plans/skills-refactor-plugin-2026-05-04.md` (no repo)
