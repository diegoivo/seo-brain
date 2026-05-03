# SEO Brain

> Framework de **SEO Agêntico** — clone, preencha o Brain, e seu site nasce com Lighthouse 95+, brandbook visual e conteúdo otimizado para LLMs (GEO) por construção.

> ⚠️ **Aviso — Experimental.** SEO Brain é um framework em desenvolvimento ativo. As skills decidem, escrevem e publicam com pouca supervisão direta. **Não use em produção sem revisão humana 100% do output gerado** — copy, código, decisões de marca, dados estruturados. O framework otimiza por velocidade de iteração, não por correção definitiva. Em dúvida, leia, edite, aprove.

Referência conceitual: [agenticseo.sh](https://agenticseo.sh) · Multi-harness (Claude Code, Codex, Cursor, Antigravity).

---

## Os 6 pilares

| Pilar | O que cobre | Maturidade |
|---|---|---|
| **1. Brain** (LLM Wiki) | Wiki proprietária da marca seguindo [metodologia Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). 1 entidade = 1 arquivo. Otimizada para Obsidian. | ✅ |
| **2. Brandbook** | DESIGN.md (metodologia Google Stitch) + brandbook visual no navegador. Narrativo no Brain, visual aplicado em rotas Next. | ✅ |
| **3. Conteúdo** | Pipeline `/blogpost` (mapa de termos → concorrentes → consenso → headings → briefing → escrita) conectado a tom de voz e POVs proprietários. | ✅ |
| **4. Tecnologia** | Stack opinado para dev com IA atingindo Lighthouse 95+ por construção. Next.js 16 SSG + Vercel. | ✅ |
| **5. SEO Técnico** | Avaliação contínua via `seo-score.mjs` (10 categorias) + `perf-audit` (PageSpeed/Lighthouse). | ✅ |
| **6. Dados** | Gestão dos principais dados (GA, GSC, Plausible). | 🔜 versão futura |

---

## Quick start

```bash
npx github:diegoivo/seobrain bootstrap meu-projeto
cd meu-projeto
```

Abra seu coding agent no diretório:

| Harness | Como invocar |
|---|---|
| **Claude Code** | `/onboard` |
| **Codex CLI** | "execute o onboard" |
| **Antigravity** | "execute o onboard" |
| **Cursor** | "rode a skill onboard" |

---

## Filosofia

Brain primeiro, sempre. Sem Brain, não há site nem conteúdo.

- **Brain** é a fonte de verdade do julgamento humano da marca. POVs proprietários (mín. 3), tom de voz, personas, princípios, glossário.
- **Brandbook** é fortemente recomendado antes de criar site (mas não bloqueante para conteúdo).
- **Editar o Brain pelo Obsidian** — abra a pasta `brain/` como vault. Frontmatter YAML, wikilinks `[[...]]` e callouts funcionam nativamente.

---

## Skills (20+)

Skills do framework em `.claude/skills/`. Markdown puro = portátil entre harnesses.

**Onboarding & núcleo:**
- `onboard` — split em brain + brandbook, controlado por `onboard.md`
- `plano` — todo trabalho não-trivial gera plano em `plans/`
- `aprovado` (slash command) — atualiza brain após tarefa

**Brain:**
- `update-brain` — mantém Brain atualizado pós-tarefa
- `brain-lint` — valida frontmatter, freshness, orphans, broken refs

**Brandbook:**
- `design-init` — 10 perguntas → DESIGN.md anti-AI-slop
- `brandbook` — 8 rotas web visuais (cores picker, tipografia switcher, voz, componentes, layout, marca, aplicações)
- `brandbook-pdf` — exporta PDF print-ready

**Conteúdo:**
- `blogpost` — pipeline 6 etapas (substitui o antigo `/artigo`)
- `intent-analyst` — sub-agent análise de intenção
- `seo-imagens`, `geo-checklist`, `seo-onpage`, `seo-estrategia`

**Tecnologia & site:**
- `web-best-practices` — biblioteca de snippets `.tsx` canônicos
- `site-criar` — orquestra estrutura padrão (home + serviço + blog + sobre + contato)
- `site-clone` — extrai paleta/fontes/logo de site existente via agent-browser, leva tokens pro brandbook
- `setup-email` — Resend
- `setup-images` — Unsplash/Pexels (free) ou OpenAI Image
- `add-cms` — Payload + Neon (gatilho ≥100 páginas/3 meses)

**SEO técnico:**
- `seo-tecnico` — auditoria via seo-score
- `perf-audit` — Lighthouse via PageSpeed + fallback local

**QA:**
- `qa` — sub-agents independentes (design, content, tech) criticam output **antes** de apresentar

---

## Estrutura

```
.
├── AGENTS.md                  source-of-truth
├── CLAUDE.md, .cursorrules    stubs
├── .claude/
│   ├── skills/                20+ skills markdown
│   ├── commands/              /aprovado, /onboard, /plano
│   └── settings.json          hooks
├── brain/                     LLM Wiki (Karpathy + Obsidian)
│   ├── index.md               MoC navegável (wikilinks)
│   ├── log.md                 append-only (operações)
│   ├── config.md              estado operacional
│   ├── tom-de-voz.md
│   ├── tecnologia/index.md
│   ├── personas/              1 arquivo por persona
│   ├── povs/                  1 arquivo por POV proprietário
│   ├── glossario/             1 arquivo por verbete
│   ├── sources/               fontes brutas imutáveis
│   ├── DESIGN.md              design system narrativo
│   └── seo/reports/
├── content/
│   ├── posts/
│   └── site/
├── plans/                     planos de execução versionados
├── web/                       Next.js SSG (Lighthouse 100 baseline)
│   └── src/app/brandbook/     rotas pré-scaffolded (cores, tipografia, voz, etc.)
├── scripts/                   CLI tools
└── docs/integrations/
```

---

## Comandos úteis

```bash
npm run brain:lint              # valida Brain (orphans, broken refs, stale)
npm run seo:score <url>         # SEO Score (auto-detecta profile)
npm run perf:audit <url>        # Lighthouse via PSI + fallback local
npm run web:dev                 # Next.js em porta aleatória
npm run brandbook:pdf           # exporta brandbook para PDF
```

---

## Editar o Brain no Obsidian

Setup completo em [`docs/obsidian-setup.md`](./docs/obsidian-setup.md). Resumo:

1. Instale [Obsidian](https://obsidian.md) (free).
2. Abra `brain/` como vault.
3. Edite com wikilinks `[[arquivo]]`, tags `#brand`, callouts `> [!warning]`.
4. Plugins recomendados: **Templater** (templates de verbetes), **Dataview** (dashboards read-only).

Não há `/brain viewer` no Next porque seria duplicação ruim — Obsidian já é a melhor ferramenta para navegar wiki estruturada.

---

## Decisões canônicas do framework

Documentação que **não muda por projeto** — herdada de todo bootstrap:

- [`docs/grid-system.md`](./docs/grid-system.md) — CSS Grid 12-col + Subgrid + Container Queries + spacing 4-base.
- [`docs/typography.md`](./docs/typography.md) — perfect fourth (1.333) sobre body 1.125rem, line-height 1.7, measure 65ch, anchor-down spacing.
- [`docs/hero-backgrounds.md`](./docs/hero-backgrounds.md) — 5 modelos canônicos de hero não-AI-slop.
- [`docs/obsidian-setup.md`](./docs/obsidian-setup.md) — workflow recomendado para o brain.

A marca específica entra em **fontes** (Google/Bunny) e **paleta** (6 papéis funcionais). Escala, grid e ritmo permanecem.

---

## Filosofia editorial

- **Brain primeiro.** Sempre leia `brain/` antes de pesquisar fora.
- **POV proprietário > consenso.** `proprietary_claims[]` exige ≥3 não-genéricos.
- **Skyscraper com intenção como árbitro.**
- **Citável por LLMs.** TL;DR, FAQ schema, llms.txt, definições autocontidas.
- **Capitalização brasileira** em todos os títulos.
- **Sub-agents em paralelo sempre que possível.**
- **QA antes de apresentar.** Sub-agents independentes criticam o output.

---

## Licença

MIT. Use, adapte, contribua.

---

**Domínio:** [agenticseo.sh](https://agenticseo.sh) (referência conceitual). Domínio do framework: TBD.
