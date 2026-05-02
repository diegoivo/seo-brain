---
name: scaffold-payload
description: Caminho não-default — scaffold Payload CMS v3 + frontend Next.js para sites grandes (>50 posts ou >3 autores). Triggers em "/scaffold-payload", "preciso de CMS visual". Esta skill ATIVA invoca a skill payload do plugin global e exige confirmação humana.
---

# Skill `scaffold-payload` — caminho não-default

> ⚠️ **Esta skill toca código.** Segue o protocolo spec-driven em
> [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md):
> escreve `docs/specs/scaffold-payload.md`, gera tests no agent-browser,
> roda RED, executa via workers paralelos, QA sub-agent independente.

> ⚠️ **Esta NÃO é a skill recomendada por padrão.**
>
> Para 80% dos casos, use `scaffold-ssg`. Esta skill só faz sentido se:
> - Mais de 3 autores escrevendo no site
> - Mais de 50 posts previstos no ano 1
> - Cliente exige CMS visual (não-dev edita conteúdo)
> - Catálogo dinâmico com >100 itens (produtos, vagas, eventos)

## Pergunta de confirmação obrigatória

Antes de continuar, **pergunte ao usuário**:

> "Você confirmou que precisa de Payload? O caminho default `scaffold-ssg` é
> mais simples (PageSpeed 100 sem cache extra, Vercel free, <30 min até
> primeiro post).
>
> Payload adiciona: Postgres (Neon), auth do admin, schema de collections,
> migrations, custo mensal $0-20.
>
> Confirme com 'sim, payload' para prosseguir, ou diga o motivo para validarmos
> juntos."

Sem confirmação explícita, **pare e instrua a usar `scaffold-ssg`**.

## Passos (após confirmação)

### 1. Delegue para skills do plugin Vercel

Em ordem de preferência:

1. **`vercel:vercel-payload`** — guia oficial Payload v3 + Vercel + Neon.
2. **`payload`** — best practices Payload (collections, fields, hooks, access).
3. **`vercel-payload`** (variante global) — debugging cold starts e seed.

Se nenhuma disponível, siga o fallback inline (passo 2).

### 2. (Inline fallback) Bootstrap manual

Stack:
- Next.js 15 App Router (mesmo que SSG)
- Payload CMS v3 com adapter `@payloadcms/db-postgres`
- Neon Postgres (via Vercel Marketplace)
- Vercel Blob para mídia

Estrutura:

```
src/
├── app/                    # mesmas páginas que SSG, mas server-rendered
├── payload.config.ts       # config Payload
├── payload-types.ts        # gerado por payload generate:types
└── collections/
    ├── Posts.ts            # equivalente ao MDX em SSG
    ├── Pages.ts
    ├── Authors.ts
    ├── Media.ts
    └── Tags.ts
```

### 3. Schema mínimo obrigatório

Posts collection deve ter os mesmos campos do frontmatter MDX em SSG:

- `title` (text, required)
- `slug` (text, required, unique)
- `description` (textarea, max 155)
- `body` (richText)
- `date` (date, required)
- `author` (relationship → Authors)
- `keywords` (array of text)
- `ogImage` (upload → Media)
- `intencao` (select: informacional|navegacional|comercial|transacional)
- `povs` (array of textarea)
- `fontes` (array of group { titulo, url, acessado })

### 4. Não derrubar PageSpeed 100

Payload por default não é tão rápido quanto SSG estático. Mitigações:

- **ISR** com `revalidate` longo (`revalidate: 3600`).
- **Cache layer** (Vercel Edge Cache + tags).
- **Imagens** servidas via Vercel Blob com `next/image`.
- **Admin UI separada do front** — `/admin` em outra deployment ou no mesmo
  projeto mas isolado por `middleware`.

### 5. Migração SSG → Payload

Se o usuário já tem posts em `content/*.mdx`:

```bash
# Script de migração (criar em scripts/migrate-mdx-to-payload.ts)
# Lê content/*.mdx → cria posts via Payload Local API
```

### 6. Reporte

```
Payload v3 + Next.js bootstrap iniciado.

Próximos passos manuais:
1. Provisionar Neon via `vercel link` + Marketplace
2. Configurar PAYLOAD_SECRET em .env.local
3. Rodar `pnpm payload migrate` para criar tabelas
4. Acessar /admin para criar primeiro user

Para conteúdo: use o admin UI, NÃO a skill conteudo (essa é só para SSG/MDX).
Os princípios da wiki ainda se aplicam — copie wiki/conteudo/principios.md
para o brief do redator humano.
```

## Aviso final

- Payload **complica** o stack. Se você não tem certeza que precisa, não use.
- A skill `conteudo` deste kit é desenhada para MDX, não para Payload. Em
  Payload, o redator é humano, com a wiki como brief.
- Reverter de Payload para SSG depois é trabalhoso. Pense duas vezes.
