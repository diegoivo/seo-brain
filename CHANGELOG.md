# Changelog

Todas as mudanças notáveis no SEO Brain. Segue [Keep a Changelog](https://keepachangelog.com/) e [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-05-04

**🎉 Inaugural release como Claude Code plugin.**

### BREAKING CHANGES

- **33 skills → 24** via consolidação por domínio (progressive disclosure).
- **Skill names PT-BR → EN** pra alinhar com marketplaces globais.
- **AGENTS.md e CLAUDE.md deletados do plugin root.** Single source of truth: `skills/seobrain/SKILL.md`. Para harnesses não-Claude, `scripts/init-agents-md.mjs` gera AGENTS.md no projeto.
- **Plugin layout:** `skills/`, `commands/`, `hooks/`, `.claude-plugin/` no root (antes era `.claude/`).
- **Hook session-start movido** de `templates/project/.claude/settings.json` pra `hooks/hooks.json` (plugin manifest). Evita double-firing.

Ver [MIGRATION.md](./MIGRATION.md) pra cheat sheet completo.

### Added

- **Plugin Claude Code distribuível**: `/plugin marketplace add diegoivo/seobrain && /plugin install seobrain@seobrain-marketplace`.
- **Skill `seobrain`** — entry point com princípios + recipe + 6 pilares + harness compatibility.
- **Skill `branding-clone`** — consolida site-clone + clone-fidelity (visual clone + fidelity QA).
- **Skill `content-seo`** — consolida artigo + blogpost + intent-analyst + geo-checklist (decision tree).
- **Skill `technical-seo`** — consolida seo-tecnico + seo-onpage + seo-imagens + perf-audit.
- **Skill `seo-data`** — consolida keywords-volume + competitor-pages + competitor-keywords.
- `scripts/validate-skills.mjs` — frontmatter rules.
- `scripts/eval-skill-matching.mjs` — regression eval pra description matching.
- `scripts/measure-token-baseline.mjs` — token usage benchmark.
- `scripts/init-agents-md.mjs` — gera AGENTS.md no projeto pra Codex/Antigravity/Cursor.
- `scripts/migrate-existing-project.mjs` — atualiza projetos pré-v0.1.0.
- `scripts/sync-meta.mjs` — propaga description/keywords de `seobrain/SKILL.md` pra package.json/plugin.json.
- `tests/prompts.jsonl` — 20 prompts pra eval matching (PT+EN).
- `tests/critical-prompts.jsonl` — 5 prompts E2E outcome eval.
- `tests/e2e/install-and-create.mjs` — smoke test cross-platform.
- `MIGRATION.md` — guia completo pra migrar de versões anteriores.
- `docs/release-process.md` — fluxo de release + yank criteria.

### Changed

- `scripts/new-project.mjs`: usa `process.cwd()` em vez de `import.meta.url`. Permite usuário criar projetos em qualquer dir quando plugin instalado.
- `hooks/session-start.mjs`: Node version check em runtime, sugere `/seobrain:start` em vez de `/onboard`.
- Description de todas as skills reescrita com **buyer keywords** (SEO audit, GEO, AI Overviews, E-E-A-T, schema markup, DataForSEO, AI-slop) e **triggers bilíngues** (PT+EN).
- `package.json`: keywords[] expandido pra 12 termos, `version` removido durante dev (commit SHA).

### Removed

- Skill `/onboard` — absorvida em `/seobrain:start`.
- Skills duplicadas: `qa-design`, `qa-content`, `qa-tech` viram `branding-review`, `content-seo-review`, `website-qa`.
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
