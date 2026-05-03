# Agentic SEO Kit

> ⚠️ **Não pule o onboarding.** Este kit nasce como **template**. O Brain (wiki do projeto) e o design system precisam ser preenchidos com o **seu** projeto antes de gerar qualquer site ou conteúdo. Sem isso, o resultado vai usar defaults genéricos e perder o ponto principal do kit.

## O que é

Repositório template + plugin Claude Code para projetos de SEO/GEO. Multi-harness: roda primariamente em **Claude Code**, com portabilidade para Codex, Cursor e Antigravity via `AGENTS.md`.

**Filosofia em uma frase:** Brain (wiki) como fonte de verdade humana, sub-agents especialistas, Skyscraper como filosofia, GEO embutido como princípio editorial, estático por padrão, Vercel Marketplace como caminho default.

## Quick start

```bash
gh repo create meu-projeto --template diegoivo/agentic-seo-kit
cd meu-projeto
npm run setup
```

Abra no Claude Code e digite:

```
/onboard
```

**18 perguntas em 5 fases (~10 min):**
1. **Identidade** — nome do projeto, sobre você, domínio
2. **Posicionamento** — USP em uma frase, persona principal, 3 POVs proprietários
3. **Design system** — chama `/design-init` (10 perguntas anti-AI-slop)
4. **Tom de voz** — calibração sobre o default Estadão + capitalização BR
5. **Escopo** — tipo do projeto, gatilho de banco

Cada fase salva incremental e pede feedback granular. Você pode pausar e retomar.

## Só depois rode

- `/scaffold-page` — cria páginas Next.js consumindo o Brain
- `/artigo` — escreve posts seguindo Brain + Skyscraper + GEO
- `/seo-tecnico` — auditoria pós-deploy

Estas skills **abortam** se o Brain ainda estiver em `kit_state: template`. É proposital.

## Estrutura

```
.
├── AGENTS.md                  source-of-truth (todos os harnesses leem)
├── CLAUDE.md                  stub @AGENTS.md
├── .cursorrules               stub
├── .aider.conf.yml            stub
├── .claude-plugin/            manifest do plugin Claude Code
├── .claude/
│   ├── skills/                12 skills (markdown puro = portátil)
│   ├── commands/              /aprovado, /onboard
│   └── settings.json          hooks (SessionStart, PreToolUse)
├── brain/                     wiki — fonte canônica do julgamento humano
│   ├── index.md
│   ├── tom-de-voz.md
│   ├── personas.md
│   ├── principios-agentic-seo.md
│   ├── glossario/index.md
│   ├── tecnologia/index.md
│   ├── DESIGN.md              gerado por /design-init
│   ├── backlog.md
│   └── seo/reports/           outputs do SEO Score
├── content/
│   ├── posts/                 markdown — drafts e publicações
│   └── site/
├── web/                       Next.js SSG (Vercel-ready)
├── scripts/                   CLI agnósticos
│   ├── seo-score.mjs          10 categorias, Flesch PT-BR, GEO peso 10
│   ├── brain-lint.mjs         valida frontmatter, freshness
│   ├── content-sync.mjs       pipeline markdown→Payload (no-op até add-cms)
│   ├── session-start.mjs      hook detecta kit_state e sugere /onboard
│   └── pre-tool-use.mjs       hook PreToolUse (auto vs confirmação)
└── docs/integrations/         integrações opcionais (Stitch)
```

## Skills do kit (13)

| Skill | Função |
|---|---|
| **`onboard`** | **Onboarding interativo (5 fases, 18 perguntas)** |
| `seo-tecnico` | Auditoria técnica completa (`seo-score.mjs`) |
| `seo-onpage` | Otimização de uma página/post |
| `seo-estrategia` | Estratégia em 7 passos (concorrentes → linkbait → PR) |
| `seo-imagens` | Checklist de imagens (formato, peso, alt, lazy) |
| `geo-checklist` | 20 itens GEO consolidados |
| `intent-analyst` | Sub-agent que analisa intenção de busca |
| `design-init` | 10 perguntas → DESIGN.md único, anti-AI-slop |
| **`scaffold-page`** | **Cria páginas Next.js consumindo o Brain (hard gate em kit_state)** |
| `add-cms` | Bolt-on Payload + Neon (≥100 páginas/3 meses) |
| `update-brain` | Mantém o Brain atualizado (disparada por `/aprovado`) |
| `brain-lint` | Valida frontmatter e freshness |
| `artigo` | Pipeline completo de criação de artigo |

## Comandos úteis

```bash
npm run seo:score https://meu-site.com   # roda SEO Score em URL
npm run brain:lint                        # valida o Brain
npm run brain:lint:strict                 # exit 1 em erros (CI)
npm run skills:list                       # lista skills externas instaladas
npm run skills:update                     # atualiza skills externas
npm run web:dev                           # Next.js em porta aleatória
npm run kit:reset-template                # ⚠️ reseta brain pra estado template (se você clonou antes do onboard)
```

## Quando o gatilho de banco dispara

Estado inicial: estático (`/content/*.md` + Next.js SSG). **Adicione Payload + Neon apenas** quando:
- O site terá ≥100 páginas dinâmicas em 3 meses, **ou**
- Editor não-técnico precisa publicar, **ou**
- Existe necessidade comprovada de UI editorial.

Quando disparar, peça ao agente: *"Roda `/add-cms`."*

## Integrações opcionais

Documentadas em `docs/integrations/`. **Não fazem parte de `npm run setup`** — entram apenas sob pedido explícito, para evitar dependências externas que o usuário do kit não pediu.

- [Stitch](docs/integrations/stitch.md) — importa design system de um projeto Stitch existente (alternativa ao `/design-init`)

## Filosofia editorial

- **Brain primeiro.** Sempre leia `brain/` antes de pesquisar fora.
- **Skyscraper por padrão**, com `intent-analyst` arbitrando a forma.
- **POV proprietário > consenso.** Frontmatter `proprietary_claims[]` exige ≥3.
- **Citável por LLMs.** TL;DR, FAQ schema, llms.txt, definições autocontidas.
- **Capitalização brasileira** em todos os títulos.
- **Primeiro viewport** é restrição de design (nunca estoura).
- **Feedback granular.** Skills sempre apresentam 2-3 decisões específicas para validar, não "está bom?".

## Migração para quem clonou antes do onboarding

Se você clonou o kit antes desta versão, o Brain está com conteúdo do kit em vez de templates vazios. Veja `docs/migrations/v0-to-onboard.md`.

## Licença

MIT.
