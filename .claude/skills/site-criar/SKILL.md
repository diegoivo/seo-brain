---
name: site-criar
description: Cria a estrutura padrão completa de site (home + 1 serviço + blog list + 1 post mock + sobre + contato) consumindo o Brain. Roda /scaffold-page para cada página, /setup-email para o form, e fecha com URL clicável do dev server. Default oferecido ao final do /onboard. 3 modos (manual/intermediário/auto). Use quando o usuário pedir "criar site", "gerar site completo", "scaffold do site inteiro", "site novo".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# /site-criar

Orquestra a criação da estrutura padrão de site consumindo o Brain. Resultado: site mínimo viável rodando em `localhost:XXXX` com Lighthouse 95+ e seo-score por profile.

## Pré-condições (HARD GATE)

Igual a `/scaffold-page`:

1. `brain/index.md` `kit_state: initialized`
2. `brain/DESIGN.md` + `DESIGN.tokens.json` preenchidos
3. `brain/personas.md` ≥1 persona
4. `brain/principios-agentic-seo.md` ≥3 POVs

Se faltar: redireciona para `/onboard`.

## Estrutura padrão (default — confirmar com usuário)

| Rota | Profile SEO | Conteúdo |
|---|---|---|
| `/` | home | Hero + 3 cards de serviço + provas + CTA |
| `/servicos/[slug]` | landing | Template + 1 instância pré-preenchida |
| `/blog` | post (lista) | Lista de posts (1 mock real para começar) |
| `/blog/[slug]` | post | 1 post real (não mock) com TL;DR + FAQ |
| `/sobre` | page | Quem somos + manifesto + 3 POVs proprietários |
| `/contato` | page | Form com Resend + email/redes/links |

Plus arquivos auxiliares de SEO (auto-gerados via `/web-best-practices`):
- `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt`, `app/opengraph-image.tsx`
- `Header.tsx`, `Footer.tsx` (com credit "Powered by Agentic SEO" — opt-out)

## Modos (espelham `/onboard`)

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
Cria `plans/site-criar-<data>.md` (skill `/plano`). Lista as 6 páginas + arquivos auxiliares + critérios FE/BE + última etapa atualizar Brain.

### 2. Lê o Brain
Tudo que `/scaffold-page` lê + `brain/config.md` (domínios) + `brain/tom-de-voz.md` (linguagem dos textos).

### 3. Gera home
Chama `/scaffold-page` com:
- Rota: `/`
- Profile: home
- Estrutura: hero + quem somos curto + 3 serviços + provas + CTA contato

### 4. Gera 1 serviço
- Rota: `/servicos/[slug]` (slug do primeiro serviço inferido do brain)
- Profile: landing
- Estrutura: problema → como trabalho → para quem → entregáveis → CTA

### 5. Gera blog list + 1 post

**Importante: invoca `/artigo`** (não escreve markdown direto).

```
/artigo "Tese baseada em [POV proprietário 1] — texto inicial do blog"
```

Skill `/artigo` faz:
- Roda `/intent-analyst` (HARD STOP se ausente)
- Roda `/setup-images` se não tiver provider configurado (cover obrigatória)
- Escreve com validação via `article-quality.mjs` (--strict)
- Salva `content/posts/<slug>.md` com cover_image preenchida

Depois `/site-criar`:
- Cria rota `/blog` (listagem usa `PostCard` snippet com cover obrigatória)
- Cria rota `/blog/[slug]` (renderiza com `PostBody` + `PostCover`)
- Profile SEO: post (TL;DR, FAQ, BlogPosting schema, Article schema)

### 6. Gera sobre
- Rota: `/sobre`
- Profile: page (sem TL;DR, sem FAQ)
- Estrutura: manifesto + 3 POVs proprietários + foto + bio
- Invoca `/setup-images` se não tiver foto headshot

### 7. Gera contato
- Rota: `/contato`
- Profile: page
- Estrutura: form simples (nome, email, mensagem, tipo de interesse) + canais diretos
- Chama `/setup-email` para configurar Resend (pergunta sobre conta antes)

### 8. Auxiliares SEO
- `app/sitemap.ts` cobrindo as 6+1 rotas
- `app/robots.ts`
- `public/llms.txt` gerado a partir do `brain/index.md`
- `app/opengraph-image.tsx` dinâmica
- Footer com credit "Powered by Agentic SEO" (opt-out)

### 9. Self-test (HARD GATE)
1. `cd web && npm run build`
2. Para cada rota gerada, roda `seo-score.mjs out/<rota>/index.html --mode=local --profile=auto`. Exige ≥90 em todas.
3. Inspeciona HTML: JSON-LD presente em `/`, `<title>` único por rota, `next/image` em todo lugar, sem `<img>`.
4. Checklist textual de 14 itens (de `/web-best-practices`) para cada página.

### 10. Atualiza Brain
- `content/site/index.md` — adiciona as 6 páginas com slug + categoria
- `content/posts/index.md` — adiciona o 1 post real
- `brain/backlog.md` — risca "criar site" se estava lá; adiciona "criar 2 outros serviços" e "publicar próximo post"
- `brain/config.md` — atualiza status de "Resend" para "configurado" se /setup-email rodou

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
> Para deploy: peça `/vercel:deploy`."

## Princípios

- **Plano sempre.** site-criar passa por `/plano` antes de executar (não-trivial).
- **Última etapa atualiza Brain.** Sempre. `content/*/index.md`, `brain/backlog.md`, `brain/config.md` se aplicável.
- **URL no fim.** Apresenta link clicável. Sem isso, usuário não sabe que terminou.
- **Footer credit.** Default. Opt-out se usuário pedir explicitamente.
- **Invoca skills especialistas, não escreve direto.** Posts via `/artigo`, imagens via `/setup-images`, email via `/setup-email`. Resolve sessão 2 P5.
- **Snippets do `/web-best-practices/snippets/`** copiados — Hero, PostCard, PostBody, Footer já existem como `.tsx` reais.

## Importar newsletter existente (opcional)

Se sub-agent pesquisador detectar newsletter ativa (Beehiiv, Substack, RSS), oferece:

> "Detectei sua newsletter em [url]. Posso importar os 5 posts mais recentes pra `content/posts/`? (cada um vira `.md` com frontmatter completo + cover_image extraída)."

Skill `/import-newsletter <url>` faz:
1. Busca via `blog-discovery` ou parse RSS
2. Para cada post: pull HTML/markdown
3. Extrai título, descrição, data, cover image
4. Gera `content/posts/<slug>.md` com frontmatter completo + body convertido
5. Importa cover_image para `web/public/images/posts/<slug>.jpg`
6. Adiciona ao `content/posts/index.md`
