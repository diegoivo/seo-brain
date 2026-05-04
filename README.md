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
| **6. Pesquisa & Dados** | 3 skills DataForSEO (volume + competitor pages + competitor keywords). Provider abstraction + GSC/GA4 em roadmap v2. | ✅ |

---

## Quick start

```bash
git clone https://github.com/diegoivo/seobrain.git seobrain    # ou o nome que quiser
cd seobrain
# Abra o Claude Code (ou Codex/Cursor) aqui e diga:
#   "crie um projeto chamado <nome-do-cliente>"
```

O agente lê `AGENTS.md`, cria o projeto em `projects/<nome>/`, faz `cd` e roda `/onboard`. Sem `npm install` na raiz — o framework não tem dependências próprias (só APIs nativas do Node 18+). O `web/` de cada projeto instala suas deps do Next.js sob demanda.

| Harness | O que dizer |
|---|---|
| **Claude Code** | "crie um projeto chamado X" → depois `/onboard` |
| **Codex CLI** | "crie projeto X e execute o onboard" |
| **Antigravity** | "crie projeto X e execute o onboard" |
| **Cursor** | "rode a skill onboard no projeto X" |

> **Multi-projeto:** cada `projects/<nome>/` é autocontido (próprio `brain/`, `content/`, `web/`). É git-ignored no repo do framework. Pode virar repo próprio do cliente: `cd projects/<nome> && git init && git remote add origin <url>`.

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
- `site-clone` — extrai paleta/fontes/logo de site existente via [agent-browser](https://github.com/vercel-labs/agent-browser) (Vercel Labs). Pré-requisito: `npm i -g agent-browser && agent-browser install`. Sem ele a skill aborta — não há fallback (clonar visual via WebFetch entrega paleta inferida sobre class names, dado impreciso).
- `setup-email` — Resend
- `setup-images` — Unsplash/Pexels (free) ou OpenAI Image
- `setup-domain` — configura URL Vercel temporária após primeiro deploy
- `seobrain-ship` — pipeline release completo (commit → preview → smoke pre-merge → confirm → main → prod)
- `add-cms` — Payload + Neon (gatilho ≥100 páginas/3 meses)

**SEO técnico:**
- `seo-tecnico` — auditoria via seo-score
- `perf-audit` — Lighthouse via PageSpeed + fallback local

**Pesquisa & Dados (Pilar Dados):**
- `keywords-volume` — volume + CPC + dificuldade de 1 ou N keywords (DataForSEO, ~$0.05/keyword)
- `competitor-pages` — top 100 URLs orgânicas de um domínio (~$0.30/domínio)
- `competitor-keywords` — top 100 keywords ranqueadas de um domínio (~$0.30/domínio)
- Setup: copie `.env.example` → `.env.local`, preencha `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` (signup: https://app.dataforseo.com/register).

**QA:**
- `qa` — sub-agents independentes (design, content, tech) criticam output **antes** de apresentar

---

## Estrutura

```
seobrain/                          ← REPO PÚBLICO DO FRAMEWORK
├── AGENTS.md                      source-of-truth (instruções do agente)
├── CLAUDE.md, .cursorrules        stubs apontando pra AGENTS.md
├── .claude/
│   ├── skills/                    30+ skills markdown
│   ├── commands/                  /aprovado, /onboard, /plano
│   └── settings.json              hooks (session-start, pre-tool-use)
├── scripts/                       CLI tools compartilhadas
│   ├── lib/project-root.mjs       resolve cwd → projeto ativo
│   ├── new-project.mjs            cria projects/<nome>/ a partir do template
│   └── *.mjs                      brain-lint, seo-score, perf-audit, etc
├── docs/                          referências canônicas (typography, grid, etc)
├── templates/
│   └── project/                   esqueleto de projeto (esqueleto, NÃO o seu projeto)
├── projects/                      git-ignored — projetos do usuário moram aqui
│   ├── cliente-a/                 ← projeto autocontido
│   │   ├── brain/                 LLM Wiki da marca (Karpathy + Obsidian)
│   │   ├── content/               posts + páginas
│   │   ├── web/                   Next.js SSG (Lighthouse 100 baseline)
│   │   ├── plans/                 planos de execução do projeto
│   │   ├── package.json           scripts delegando ao framework via ../../
│   │   └── .git/                  opcional — repo próprio do cliente
│   └── cliente-b/                 ← outro projeto
└── scratch/                       git-ignored — rascunhos do dev do framework
```

---

## Comandos úteis

**Da raiz do framework** (sem deps, só Node 18+):
```bash
node scripts/new-project.mjs <nome>   # cria projects/<nome>/
# ou: npm run new <nome>              # mesmo efeito, via npm script
```

**De dentro de um projeto** (`cd projects/<nome>`):
```bash
npm run brain:lint              # valida Brain (orphans, broken refs, stale)
npm run seo:score <url>         # SEO Score (auto-detecta profile)
npm run perf:audit <url>        # Lighthouse via PSI + fallback local
npm run web:install             # instala deps do Next.js (1ª vez)
npm run web:dev                 # Next.js em porta aleatória
npm run web:build               # build de produção
```

---

## Editar o Brain no Obsidian

Setup completo em [`docs/obsidian-setup.md`](./docs/obsidian-setup.md). Resumo:

1. Instale [Obsidian](https://obsidian.md) (free).
2. Abra `projects/<nome>/brain/` como vault (cada projeto tem seu Brain próprio).
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
