---
title: Stack
tags: [tecnologia, decisao]
updated: 2026-05-02
---

# Stack do agentic-seo-kit

## Default: Next.js 15 + App Router + SSG (`output: 'export'`)

- **Next.js 15** App Router, React 19, TypeScript estrito.
- **Tailwind 3.4** com tokens consumidos de [[../../DESIGN.tokens.json]].
- **MDX** para posts em `content/*.mdx` via `next-mdx-remote/rsc`.
- **`gray-matter`** para frontmatter.
- **`next/font/google`** para fontes (nunca `<link>`).
- **`next/image`** com `unoptimized: true` (necessário no export estático).

## Quando usar Payload em vez de SSG

A diretriz default é **SSG**. Só vá para Payload se ao menos uma destas for
verdadeira:

- Mais de 3 autores escrevendo no site.
- Mais de 50 posts previstos no ano 1.
- Cliente exige CMS visual (não-dev edita conteúdo).
- Há catálogo dinâmico (produtos, eventos, vagas) com >100 itens.

Para os outros 80% dos casos (site de marca, blog 1 autor, landing institucional),
SSG é mais rápido até o primeiro post, mais barato (Vercel free), e atinge
PageSpeed 100 sem cache layer adicional.

Ver também [[../conteudo/principios]] para o POV editorial e [[performance]] para
o que sustenta o 100 no PageSpeed.

## Não substituir sem instrução explícita

- Não troque Tailwind por CSS Modules / styled-components.
- Não adicione client-side router (App Router já cobre).
- Não inclua Analytics 3rd party na home (mata o PageSpeed). Se precisar, lazy-load
  após interação.
- Não adicione bibliotecas de animação. Use CSS puro (`transition`, `transform`).
