# Os 6 pilares do SEO Brain

## 1. LLM Wiki — meta-pilar (Karpathy methodology)

LLM Wiki é **substrato**, não pilar paralelo aos outros. Tudo que vem abaixo depende dele.

| Arquivo | Conteúdo |
|---|---|
| `brain/index.md` | Resumo: posicionamento, único, domínio, porta, última atualização |
| `brain/tom-de-voz.md` | Voz, antivícios IA banidos, capitalização BR (canônico) |
| `brain/personas/` | 1 arquivo por persona |
| `brain/povs/` | 1 arquivo por POV proprietário |
| `brain/glossario/` | Definições proprietárias, 1 verbete por arquivo |
| `brain/tecnologia/index.md` | Stack atual; decisão sobre banco de dados |
| `brain/DESIGN.md` + `DESIGN.tokens.json` | Design system (gerado por `/branding-init`) |
| `brain/config.md` | Domínios temporário/definitivo, env, deploy target |
| `brain/seo/data/` | Dados de pesquisa do Pilar Dados (DataForSEO outputs) |
| `brain/seo/reports/` | Relatórios SEO Score |
| `brain/backlog.md` | Pendências, ideias, estado |

Atualizado automaticamente após `/approved` (skill `wiki-update`).

## 2. Branding — design + identidade visual

`brain/DESIGN.md` segue metodologia Google (10 perguntas em `/branding-init` que produzem decisões opinativas). Brandbook visual em `web/src/app/brandbook/` consome os tokens.

**Regra:** narrativo (manifesto, voz, personas) mora no LLM Wiki. Visual (cores, tipografia, grid, motion) mora no brandbook. Voz é Wiki (texto), tom visual é brandbook (cores).

Quem importa visual de site existente: `/branding-clone` extrai tokens + valida fidelidade.

## 3. Content SEO — voz BR + skyscraper + GEO

- **Skyscraper default.** Conteúdo informacional supera o melhor concorrente da SERP em ~20% de extensão e profundidade. Modo não-skyscraper só com pedido explícito.
- **Intenção define a forma.** Skyscraper não justifica padding. `/content-seo` carrega `playbooks/intent-analysis.md` antes de escrever.
- **POV proprietário > consenso.** Cada artigo carrega 3-5 POVs em `proprietary_claims[]` no frontmatter, referenciando `brain/glossario/`.
- **GEO embutido.** TL;DR (2-3 frases citáveis), FAQs estruturadas (gera FAQPage schema), `Person` schema em autoria, `llms.txt` na raiz.
- **Linkagem interna.** Antes de publicar, consulta `content/posts/index.md` e `content/site/index.md`.

`/content-seo` faz pipeline editorial completo. `/content-seo-review` valida pós-fato.

## 4. Technical SEO — por construção, não auditoria pós-fato

- **SEO Score** (`scripts/seo-score.mjs`, 10 categorias ponderadas: CWV, indexabilidade, meta, semântica, schema, internal links, imagens, conteúdo, GEO, A11y).
- **Targets toda página criada:** Lighthouse ≥95 (alvo 100), seo-score ≥90 (alvo 100). São pré-condições do código, não auditoria.
- **Score nunca bloqueia publicação.** Alerta com recomendações priorizadas. Usuário decide.
- **Princípio:** se página sai com Lighthouse 82, **o template está errado**, não o caso particular. Não improvisar — copiar de `/website-bestpractices`.

## 5. SEO Strategy — planejamento

`/seo-strategy` cobre estratégia em 7 passos: análise de concorrentes, saúde técnica, posicionamento, mapeamento de palavras-chave, topic clusters, linkbait, link building. Use quando o usuário pedir "estratégia de SEO", "plano de SEO", "topic cluster".

## 6. SEO Data — research empacotado

`/seo-data` via DataForSEO (Pay-as-you-go, custos transparentes em `references/dataforseo-cost-table.md`):

- Search Volume API — volume + CPC + dificuldade (~$0.05/keyword)
- Relevant Pages API — top 100 URLs orgânicas (~$0.30/domínio)
- Ranked Keywords API — top 100 keywords ranqueadas (~$0.30/domínio)

Skills auxiliares do mesmo pilar:
- `/dataforseo-config` — setup interativo de credenciais via form local (porta aleatória em 127.0.0.1, valida via endpoint gratuito, grava `.env.local`).
- `/rank-tracker` — monitor de posições orgânicas no Google. Sub-comandos `add` / `remove` / `list` / `update` / `history`. 3 modos com trade-offs claros entre tempo e custo (batch async high default, batch async normal opt-in, live síncrono opt-in). Storage híbrido: `keywords.json` (config) + SQLite (snapshots time-series, `node:sqlite` nativo) + reports md/csv/json.

Todas: cost preview obrigatório, locale BR/pt-br default, output triplo (`.md` + `.csv` + `.json`).

**Roadmap v0.2.0:** abstração de provider (`KeywordProvider` interface) para suportar Google Search Console (free), GA4, attribution.

## Tecnologia (transversal)

- **Default:** Next.js SSG puro, sem banco, sem CMS. Conteúdo em `/content/*.md`. Pré-renderização sempre que possível.
- **Vercel é plataforma padrão.** Serviços externos vêm do **Vercel Marketplace**.
- **Stack:** Next.js (App Router, SSG), shadcn/ui, Tailwind v4. Tipografia perfect fourth (1.333), line-height 1.7, measure 65ch.
- **CMS sob gatilho:** Adicione Payload CMS + Neon Postgres apenas quando: ≥100 páginas dinâmicas em 3 meses, OU editor não-técnico publicando, OU UI de edição comprovada. Skill `/website-cms` faz bolt-on.
- **Pipeline:** `Think → Plan → Build → Test → Ship → Document`. Tarefas não-triviais começam por `/plan`. Build com sub-agents paralelos + `/qa` orquestrador. Loop limitado a 3 rodadas.
- **Ship:** `/ship` orquestra commit → push → preview → smoke pre-merge → confirmação → merge main → smoke prod.
