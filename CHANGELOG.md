# Changelog

Todas as mudanças notáveis no SEO Brain. Segue [Keep a Changelog](https://keepachangelog.com/) e [Semantic Versioning](https://semver.org/).

## [0.2.0] — 2026-05-04

**Consolidação total das skills de branding em uma única `/branding`** (rebuild dedicado prometido na 0.1.5).

### BREAKING CHANGES

- **6 skills de branding fundidas em 1**: `branding-init`, `branding-onboard`, `branding-brandbook`, `branding-clone`, `branding-images`, `branding-review` → `/branding` única com modos.
- **Sintaxe nova**: `/branding <modo>` em vez de `/branding-<x>`. Modos: `discover`, `import <url>`, `apply`, `export`, `images`, `review`, `list`.
- **Diretórios das 6 antigas removidos** de `skills/`. Cross-refs em outras skills atualizadas.

### Added

- **Skill `/branding`** consolidada com 7 modos (segue padrão progressive disclosure da 0.1.5).
- **Modo `export`** (novo) — gera `brand/<slug>/brandbook.md/.html/.pdf` (puppeteer-core + Chrome do sistema).
- **Modo `list`** (novo) — lista marcas em `brain/`, `projects/<slug>/brain/` e exportadas em `brand/`.
- **References maduras** em `skills/branding/references/`: brand-archetypes (12 Mark & Pearson), color-system, typography-guide, audit-checklist, web-interface-guidelines, brandbook-format.
- **Assets**: `design-companion.template.html` (preview ao vivo durante discover), `pdf-generator.mjs` (puppeteer-core), 3 page templates (institutional, blog, dashboard).
- **Spec assertivo + QA prompt** em `skills/branding/tests/` para validação por sub-agente independente.

### Migration

Cheat sheet em `MIGRATION.md`. Funcionalidades preservadas 1:1; `discover` herda anti-AI-slop + primeiro-viewport; `import` herda multi-fase + perguntas de fidelidade bloqueantes.

## [0.1.5] — 2026-05-04

**Consolidação de pacotes via progressive disclosure (27→11 skills, –59%).**

### BREAKING CHANGES

- **Skill names consolidados por pilar.** Cada pacote vira uma única skill com `SKILL.md` (router) + `playbooks/` (procedimentos) + `references/` (conhecimento sob demanda). Triggers antigos preservados na description da skill consolidada.
- **Pacote `branding-*` removido temporariamente.** Outra branch trata o rebuild dedicado (entregue em 0.2.0).

### Renames

| Antes (skills antigas) | Depois (skill + playbook) |
|---|---|
| `/wiki-init` `/wiki-update` `/wiki-lint` | `/wiki` (init / update / lint) |
| `/content-seo` `/content-seo-review` | `/content-seo` (article / blogpost / intent-analysis / review) |
| `/technical-seo` `/seo-strategy` | `/technical-seo` (full-audit / single-page / images / performance / strategy) |
| `/seo-data` `/dataforseo-config` | `/seo-data` (keywords-volume / competitor-pages / competitor-keywords / config) |
| `/website-create` `/website-bestpractices` `/website-cms` `/website-domain` `/website-email` `/website-qa` | `/website` (create / domain / email / cms / qa + references/bestpractices.md + snippets/) |

### Removed

- 16 SKILL.md duplicados (consolidados nos routers acima).
- 6 skills `branding-*` (rebuild em outra branch — reintegrado em 0.2.0).

### Kept standalone

- `/seo-brain` (entry framework), `/plan`, `/qa`, `/ship`, `/approved`
- `/rank-tracker`, `/gsc-google-search-console` (Pilar Dados, escopo independente)

### Token impact

- Skill list (descriptions sempre carregadas pelo Claude scanner) cai de ~8KB para ~3KB.
- Quando uma skill é "ativada", carrega 1 playbook (~2KB) em vez da SKILL.md inteira de cada irmã.

### Validation

- `npm run validate`: 11 skills, 0 errors, 0 warnings esperados.
- Refs cruzadas atualizadas: `seo-brain/SKILL.md`, `qa/SKILL.md`, `ship/SKILL.md`, `commands/`, `hooks/session-start.mjs`.
- `tests/prompts.jsonl` reescrito (26 prompts, novos nomes), `tests/critical-prompts.jsonl` ajustado.
- `package.json` versão `0.1.5`, `plugin.json` description atualizada (count 11).

## [0.1.0] — 2026-05-04

**🎉 Inaugural release como Claude Code plugin.**

### BREAKING CHANGES

- **33 skills → 24** via consolidação por domínio (progressive disclosure).
- **Skill names PT-BR → EN** pra alinhar com marketplaces globais.
- **AGENTS.md e CLAUDE.md deletados do plugin root.** Single source of truth: `skills/seo-brain/SKILL.md`. Para harnesses não-Claude, `scripts/init-agents-md.mjs` gera AGENTS.md no projeto.
- **Plugin layout:** `skills/`, `commands/`, `hooks/`, `.claude-plugin/` no root (antes era `.claude/`).
- **Hook session-start movido** de `templates/project/.claude/settings.json` pra `hooks/hooks.json` (plugin manifest). Evita double-firing.

Ver [MIGRATION.md](./MIGRATION.md) pra cheat sheet completo.

### Added

- **Plugin Claude Code distribuível**: `/plugin marketplace add diegoivo/seo-brain && /plugin install seo-brain@seo-brain-marketplace`.
- **Skill `seo-brain`** — entry point com princípios + recipe + 6 pilares + harness compatibility.
- **Skill `branding-clone`** — consolida site-clone + clone-fidelity (visual clone + fidelity QA). _(absorvida em `/branding import` na v0.2.0)_
- **Skill `content-seo`** — consolida artigo + blogpost + intent-analyst + geo-checklist (decision tree).
- **Skill `technical-seo`** — consolida seo-tecnico + seo-onpage + seo-imagens + perf-audit.
- **Skill `seo-data`** — consolida keywords-volume + competitor-pages + competitor-keywords.
- `scripts/validate-skills.mjs` — frontmatter rules.
- `scripts/eval-skill-matching.mjs` — regression eval pra description matching.
- `scripts/measure-token-baseline.mjs` — token usage benchmark.
- `scripts/init-agents-md.mjs` — gera AGENTS.md no projeto pra Codex/Antigravity/Cursor.
- `scripts/migrate-existing-project.mjs` — atualiza projetos pré-v0.1.0.
- `scripts/sync-meta.mjs` — propaga description/keywords de `seo-brain/SKILL.md` pra package.json/plugin.json.
- `tests/prompts.jsonl` — 20 prompts pra eval matching (PT+EN).
- `tests/critical-prompts.jsonl` — 5 prompts E2E outcome eval.
- `tests/e2e/install-and-create.mjs` — smoke test cross-platform.
- `MIGRATION.md` — guia completo pra migrar de versões anteriores.
- `docs/release-process.md` — fluxo de release + yank criteria.

### Changed

- `scripts/new-project.mjs`: usa `process.cwd()` em vez de `import.meta.url`. Permite usuário criar projetos em qualquer dir quando plugin instalado.
- `hooks/session-start.mjs`: Node version check em runtime, sugere `/seo-brain:start` em vez de `/onboard`.
- Description de todas as skills reescrita com **buyer keywords** (SEO audit, GEO, AI Overviews, E-E-A-T, schema markup, DataForSEO, AI-slop) e **triggers bilíngues** (PT+EN).
- `package.json`: keywords[] expandido pra 12 termos, `version` removido durante dev (commit SHA).

### Removed

- Skill `/onboard` — absorvida em `/seo-brain:start`.
- Skills duplicadas: `qa-design`, `qa-content`, `qa-tech` viram `/branding review` (v0.2.0), `content-seo-review`, `website-qa`.
- AGENTS.md e CLAUDE.md do plugin root.

### Token impact

- SessionStart load: **5052 → ~2300 tokens** (-54%, ~2700/sessão saved).
- AGENTS.md (137 linhas, ~1.6k tokens) não carrega mais via @import.
- Skill frontmatters: 33 × 100 → 24 × 100 = -1k tokens.

### Validation

- `node scripts/validate-skills.mjs`: 24 skills, 0 errors, 0 warnings.
- `node tests/e2e/install-and-create.mjs`: cross-platform smoke ✓.
- Pre-refactor matching baseline: top1=65%, top3=80%, top5=85%.

### Marketplace strategy

Distribuição via 8 canais:
1. GitHub topics + README (infra, day 0)
2. awesome-claude-skills PR (22k stars community list, day 1)
3. claudemarketplaces.com (120k visitors/mês, day 1)
4. mcpmarket.com/tools/skills (day 2)
5. claudeskills.info (day 2)
6. awesome-claude-plugins (day 3)
7. claude-seo.md/skills (nicho, day 3)
8. anthropic/claude-plugins-official PR (após validação externa)

### Concorrentes mapeados

- huifer/claude-code-seo (104⭐)
- searchfit-seo (Anthropic official directory)
- inhouseseo/superseo-skills (v0.2.0)
- aaron-he-zhu/seo-geo-claude-skills
- AgriciDaniel/claude-seo

**Diferencial defensável:** Brazilian Portuguese first + proprietary POVs (Karpathy LLM Wiki) + parallel sub-agents.
