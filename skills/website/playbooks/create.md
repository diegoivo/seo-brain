# Playbook: website create

Orquestra a criação da estrutura padrão de site consumindo o Brain. Resultado: site mínimo viável rodando em `localhost:XXXX` com Lighthouse 95+ e seo-score por profile.

## Pré-condições (HARD GATE)

1. `brain/index.md` `kit_state: initialized`
2. `brain/DESIGN.md` + `DESIGN.tokens.json` preenchidos
3. `brain/personas.md` ≥1 persona
4. `brain/principios-agentic-seo.md` ≥3 POVs

Se faltar: redireciona para `/seobrain:start` (orquestra wiki + branding).

## Setup técnico antes de criar páginas

- Portas aleatórias via `get-port` (cheque disponibilidade antes de abrir dev server)
- Footer canônico em `skills/website/snippets/Footer.tsx` com credit "Powered by SEO Brain" (link `https://github.com/diegoivo/seobrain`). Opt-out se usuário pedir explicitamente.

## Estrutura padrão (default — confirmar com usuário)

| Rota | Profile SEO | Conteúdo |
|---|---|---|
| `/` | home | Hero + 3 cards de serviço + provas + CTA |
| `/servicos/[slug]` | landing | Template + 1 instância pré-preenchida |
| `/blog` | post (lista) | Lista de posts (1 mock real para começar) |
| `/blog/[slug]` | post | 1 post real (não mock) com TL;DR + FAQ |
| `/sobre` | page | Quem somos + manifesto + 3 POVs proprietários |
| `/contato` | page | Form com Resend + email/redes/links |

Plus arquivos auxiliares de SEO (auto-gerados via `references/bestpractices.md`):
- `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, `app/opengraph-image.tsx`
- `Header.tsx`, `Footer.tsx` (com credit "Powered by SEO Brain" — opt-out)

## Modos

### Manual / guiado
Pergunta sobre cada página antes de gerar (rota, intent, foto, CTA).

### Intermediário (default)
Confirma estrutura padrão de uma vez:
> "Vou gerar a estrutura padrão (home + 1 serviço + blog + 1 post + sobre + contato).
>
> Recomendações para validar:
> 1. Serviço inicial: **[inferido do brain]** — ok ou outro?
> 2. Blog post inicial: **[título inferido dos POVs]** — ok ou outro?
> 3. Página de sobre: usar manifesto extraído do `brain/index.md` e `principios-agentic-seo.md`?
>
> Aceita ou ajusta?"

### Auto
Decide tudo com base no brain. Mostra resumo de páginas que vão ser criadas e pergunta "vai?".

## Pipeline

### 1. Plano
Cria `plans/website-create-<data>.md` (skill `/plan`). Lista as 6 páginas + arquivos auxiliares + critérios FE/BE + última etapa atualizar Brain.

### 2. Lê o Brain
`brain/index.md`, `brain/DESIGN.md`, `DESIGN.tokens.json`, `brain/personas/`, `brain/povs/`, `brain/config.md` (domínios), `brain/tom-de-voz.md` (linguagem dos textos).

### 3. Gera home
Aplica snippets canônicos de `references/bestpractices.md`:
- Rota: `/`
- Profile: home
- Estrutura: hero + quem somos curto + 3 serviços + provas + CTA contato

### 4. Gera 1 serviço
- Rota: `/servicos/[slug]` (slug do primeiro serviço inferido do brain)
- Profile: landing
- Estrutura: problema → como trabalho → para quem → entregáveis → CTA

### 5. Gera blog list + 1 post

**Importante: invoca `/content-seo`** (não escreve markdown direto).

```
/content-seo "Tese baseada em [POV proprietário 1] — texto inicial do blog"
```

Skill `/content-seo` faz:
- Roda intent-analysis (HARD STOP se ausente)
- Aciona fluxo de imagens da branding (cover obrigatória)
- Escreve com validação via `article-quality.mjs` (--strict)
- Salva `content/posts/<slug>.md` com cover_image preenchida

Depois `create`:
- Cria rota `/blog` (listagem usa `PostCard` snippet com cover obrigatória)
- Cria rota `/blog/[slug]` (renderiza com `PostBody` + `PostCover`)
- Profile SEO: post (TL;DR, FAQ, BlogPosting schema, Article schema)

### 6. Gera sobre
- Rota: `/sobre`
- Profile: page (sem TL;DR, sem FAQ)
- Estrutura: manifesto + 3 POVs proprietários + foto + bio
- Aciona fluxo de imagens da branding se não tiver foto headshot

### 7. Gera contato
- Rota: `/contato`
- Profile: page
- Estrutura: form simples (nome, email, mensagem, tipo de interesse) + canais diretos
- Chama `playbooks/email.md` para configurar Resend (pergunta sobre conta antes)

### 8. Auxiliares SEO
- `app/sitemap.ts` cobrindo as 6+1 rotas
- `app/robots.ts`
- `public/llms.txt` gerado a partir do `brain/index.md`
- `app/opengraph-image.tsx` dinâmica
- Footer com credit "Powered by SEO Brain" (opt-out)

### 9. Self-test (HARD GATE)
1. `cd web && npm run build`
2. Para cada rota gerada, roda `seo-score.mjs out/<rota>/index.html --mode=local --profile=auto`. Exige ≥90 em todas.
3. Inspeciona HTML: JSON-LD presente em `/`, `<title>` único por rota, `next/image` em todo lugar, sem `<img>`.
4. Checklist textual de 14 itens (de `references/bestpractices.md`) para cada página.

### 10. Atualiza Brain
- `content/site/index.md` — adiciona as 6 páginas com slug + categoria
- `content/posts/index.md` — adiciona o 1 post real
- `brain/backlog.md` — risca "criar site" se estava lá; adiciona "criar 2 outros serviços" e "publicar próximo post"
- `brain/config.md` — atualiza status de "Resend" para "configurado" se `playbooks/email.md` rodou

### 11. Sobe dev server e fecha com URL
```bash
cd web && npm run dev  # aleatória via get-port
```

Mensagem final:
> "Site no ar! 🚀
>
> 👉 **http://localhost:XXXX/**
>
> Páginas geradas:
> - http://localhost:XXXX/ — home
> - http://localhost:XXXX/servicos/[slug]
> - http://localhost:XXXX/blog
> - http://localhost:XXXX/blog/[slug-do-post]
> - http://localhost:XXXX/sobre
> - http://localhost:XXXX/contato
> - http://localhost:XXXX/brandbook (referência viva, dev-only)
>
> Quality: build OK, seo-score por página: home **94**, sobre **92**, contato **91**, post **96**.
>
> 3 decisões para validar:
> 1. **[decisão visual A]**
> 2. **[decisão visual B]**
> 3. **[decisão visual C]**
>
> Para deploy: peça `/vercel:deploy` ou `/ship`."

## Princípios

- **Plano sempre.** create passa por `/plan` antes de executar (não-trivial).
- **Última etapa atualiza Brain.** Sempre. `content/*/index.md`, `brain/backlog.md`, `brain/config.md` se aplicável.
- **URL no fim.** Apresenta link clicável. Sem isso, usuário não sabe que terminou.
- **Footer credit.** Default. Opt-out se usuário pedir explicitamente.
- **Invoca skills especialistas, não escreve direto.** Posts via `/content-seo`, email via `playbooks/email.md`. Resolve sessão 2 P5.
- **Snippets do `snippets/`** copiados — Hero, PostCard, PostBody, Footer já existem como `.tsx` reais.

## Importar newsletter existente (opcional)

Se sub-agent pesquisador detectar newsletter ativa (Beehiiv, Substack, RSS), oferece:

> "Detectei sua newsletter em [url]. Posso importar os 5 posts mais recentes pra `content/posts/`? (cada um vira `.md` com frontmatter completo + cover_image extraída)."

Fluxo:
1. Busca via `blog-discovery` ou parse RSS
2. Para cada post: pull HTML/markdown
3. Extrai título, descrição, data, cover image
4. Gera `content/posts/<slug>.md` com frontmatter completo + body convertido
5. Importa cover_image para `web/public/images/posts/<slug>.jpg`
6. Adiciona ao `content/posts/index.md`
