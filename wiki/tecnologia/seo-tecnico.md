---
title: SEO técnico
tags: [tecnologia, seo]
updated: 2026-05-02
---

# SEO técnico

Onde cada peça mora no kit:

| Peça | Arquivo | Quem gera |
|---|---|---|
| Title / Description / OG | `app/layout.tsx` (default) + `generateMetadata` por página | Next.js metadata API |
| JSON-LD `Organization` | `app/page.tsx` | `lib/seo.ts → buildOrganizationJsonLd()` |
| JSON-LD `Article` | `app/blog/[slug]/page.tsx` | `lib/seo.ts → buildArticleJsonLd()` |
| Sitemap | `app/sitemap.ts` | Next.js MetadataRoute |
| Robots | `app/robots.ts` | Next.js MetadataRoute |
| URL canônica | derivada de `siteConfig.url` | `lib/site-config.ts` |
| Trailing slash | `next.config.ts → trailingSlash: true` | Next.js |

## Regras

- Toda página deve ter `title` ≤60 chars com keyword principal no início.
- `description` ≤155 chars, ação implícita.
- Posts MDX têm frontmatter `keywords` (3-5) que vai pra meta keywords + JSON-LD.
- Cada estatística citada precisa de link inline para fonte verificável (princípio
  6 em [[../conteudo/principios]]).
- `siteConfig.url` em `lib/site-config.ts` deve ser atualizado antes de publicar.

## Open Graph image

- Default `/og-default.png` em `public/`.
- Posts podem sobrescrever via frontmatter `ogImage: "/og-meu-post.png"`.
- Tamanho recomendado: 1200×630, sem texto ilegível em thumb.

## Trailing slash e canonização

`trailingSlash: true` força `/blog/foo/` em vez de `/blog/foo`. Mantém consistência
com export estático (cada rota vira `index.html` numa pasta) e evita 301 redirect
em servidores estáticos.
