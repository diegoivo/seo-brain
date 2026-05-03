# Agentic SEO Kit

> Multi-harness SEO/GEO orchestrator. Brain (wiki) como fonte de verdade humana, sub-agents especialistas, Skyscraper como filosofia, GEO embutido. Vercel + Vercel Marketplace por padrão.

> ⚠️ **Não pule o onboarding.** Este kit nasce como **template**. O Brain e o design system precisam ser preenchidos com o **seu** projeto antes de gerar qualquer site ou conteúdo. Sem isso, o resultado vai usar defaults genéricos.

---

## Quick start

**Importante:** clone para um diretório novo. Não trabalhe dentro do repo do próprio kit.

```bash
# 1. Crie um diretório novo
mkdir meu-projeto && cd meu-projeto

# 2. Clone sem histórico do kit (você vai querer git limpo no seu projeto)
git clone --depth 1 https://github.com/diegoivo/agentic-seo-kit.git .
rm -rf .git

# 3. Inicie git limpo no seu projeto
git init && git add -A && git commit -m "chore: bootstrap from agentic-seo-kit"

# 4. Instale dependências e skills
npm run setup
cd web && npm install && cd ..
```

Depois, abra seu coding agent no diretório e dispare o onboard:

| Harness | Como invocar |
|---|---|
| **Claude Code** | `/onboard` |
| **Codex CLI** | "execute o onboard" ou "rode o onboarding" |
| **Antigravity** | "execute o onboard" ou "quero fazer o onboard" |
| **Cursor** | "rode a skill onboard" |
| **Aider** | "execute o onboard" |

Slash commands (`/onboard`, `/aprovado`, `/plano`, `/site-criar`) são convenção do Claude Code. Em outros harnesses, use texto natural — o agent reconhece via `description` da skill.

---

## Onboarding: 3 modos

O `/onboard` pergunta no início qual modo você quer:

| Modo | Quando usar | Comportamento |
|---|---|---|
| **Manual / guiado** | Marca nova, sem material existente, quer pensar tudo | Pergunta a pergunta (~18 perguntas, ~15 min) |
| **Intermediário** ⭐ default | Tem alguma referência ou quer balanço fricção/qualidade | Perguntas em batch por fase. Sub-agent pesquisa material existente. Você valida pontos críticos |
| **Auto** | Marca já existente com presença online forte, quer protótipo rápido | Sub-agents fazem tudo, você aprova um diff final |

Em qualquer modo, o agente sempre traz a **opção recomendada** ao lado de cada decisão.

---

## Pipeline padrão pós-onboard

1. **`/site-criar`** — gera estrutura padrão (home + 1 serviço + blog + sobre + contato) com Lighthouse 95+ por construção
2. **`/setup-email`** — configura Resend para form de contato
3. **`/artigo`** — escreve posts seguindo Brain + Skyscraper + GEO
4. **`/perf-audit`** — Lighthouse pós-deploy (PageSpeed API + fallback local)
5. **`/aprovado`** — registra mudanças no Brain
6. **`/plano`** — antes de qualquer mudança não-trivial, agente cria um plano em `plans/` aprovado por você

Skills bloqueiam (hard gate) se Brain ainda estiver em estado `template`.

---

## Estrutura

```
.
├── AGENTS.md                  source-of-truth (todos os harnesses)
├── CLAUDE.md                  stub @AGENTS.md
├── .cursorrules / .aider.conf.yml
├── .claude-plugin/            manifest plugin Claude Code
├── .claude/
│   ├── skills/                15+ skills (markdown puro = portátil)
│   ├── commands/              /aprovado, /onboard, /plano
│   └── settings.json          hooks
├── brain/                     wiki — fonte canônica
│   ├── index.md               posicionamento + resumo
│   ├── config.md              estado operacional (domínios, integrações)
│   ├── tom-de-voz.md
│   ├── personas.md
│   ├── principios-agentic-seo.md
│   ├── glossario/index.md
│   ├── tecnologia/index.md    decisões arquiteturais
│   ├── DESIGN.md              gerado por /design-init
│   ├── backlog.md
│   └── seo/reports/           outputs SEO Score + Lighthouse
├── content/                   markdown drafts/publicações
├── plans/                     planos de execução (versionados)
├── web/                       Next.js SSG Vercel-ready
├── scripts/                   CLI (seo-score, perf-audit, brain-lint)
└── docs/integrations/         integrações opcionais
```

---

## Skills do kit

| Skill | Função |
|---|---|
| **`onboard`** | Onboarding interativo (3 modos, 5 fases) |
| **`plano`** | Cria plano em `plans/<slug>-<date>.md` antes de tarefa não-trivial |
| **`site-criar`** | Estrutura padrão completa (home + serviço + blog + sobre + contato) |
| `scaffold-page` | Cria UMA página específica |
| `brandbook` | Brandbook visual em rota Next.js, espelha o Brain |
| `setup-email` | Configura Resend para form de contato |
| `web-best-practices` | Snippets canônicos Lighthouse 95+ (consulta obrigatória de site-criar) |
| `perf-audit` | PageSpeed Insights + fallback Lighthouse local |
| `seo-tecnico` | Auditoria técnica via `seo-score.mjs` (profiles auto: home/page/post/landing) |
| `seo-onpage` / `seo-imagens` / `seo-estrategia` | Otimizações específicas |
| `geo-checklist` | 20 itens GEO consolidados |
| `intent-analyst` | Sub-agent que analisa intenção de busca |
| `design-init` | 10 perguntas → DESIGN.md único, anti-AI-slop |
| `add-cms` | Bolt-on Payload + Neon (gatilho ≥100 páginas/3 meses) |
| `update-brain` | Mantém Brain atualizado (disparada por `/aprovado`) |
| `brain-lint` | Valida frontmatter e freshness |
| `artigo` | Pipeline completo de artigo |

---

## Comandos úteis

```bash
npm run seo:score https://meu-site.com    # SEO Score (auto-detecta profile)
npm run perf:audit https://meu-site.com   # Lighthouse via PageSpeed/local
npm run brain:lint                         # valida Brain
npm run brain:lint:strict                  # exit 1 em erros (CI)
npm run skills:list                        # lista skills externas instaladas
npm run skills:update                      # atualiza skills externas
npm run web:dev                            # Next.js em porta aleatória
npm run kit:reset-template                 # reseta Brain pra template (migration)
```

---

## Quando o gatilho de banco dispara

Default: estático (`/content/*.md` + Next.js SSG). **Adicione Payload + Neon apenas** quando:
- ≥100 páginas dinâmicas em 3 meses, **ou**
- Editor não-técnico publicando, **ou**
- Necessidade de UI editorial.

Quando disparar: `/add-cms`.

---

## Integrações opcionais

Documentadas em `docs/integrations/`. **Fora de `npm run setup`** — entram só sob pedido explícito.

- [Stitch](docs/integrations/stitch.md) — importa design system de um projeto Stitch existente (alternativa ao `/design-init`)

---

## Filosofia

- **Brain primeiro.** Sempre leia `brain/` antes de pesquisar fora.
- **Skyscraper por padrão**, com `intent-analyst` arbitrando forma.
- **POV proprietário > consenso.** `proprietary_claims[]` exige ≥3.
- **Citável por LLMs.** TL;DR (em posts), FAQ schema, llms.txt, definições autocontidas.
- **Capitalização brasileira** em todos os títulos.
- **Primeiro viewport** é restrição de design.
- **Feedback granular.** Skills apresentam 2-3 decisões específicas, nunca "está bom?".
- **Plano antes de mudar.** Tarefas não-triviais geram `plans/<slug>-<date>.md` com aprovação do usuário.
- **Recomendado sempre presente.** Em qualquer pergunta, agente sugere a opção que ele escolheria.

---

## Migração para quem clonou antes

Se você clonou versões anteriores, veja `docs/migrations/`.

---

## Licença

MIT.
