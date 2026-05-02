---
title: Performance
tags: [tecnologia, performance]
updated: 2026-05-02
---

# Performance — como o kit garante PageSpeed 100

## Por construção

- **SSG export estático** — HTML pronto, nada de servidor por requisição.
- **`next/font/google`** com `display: swap` — fontes self-hosted no build, sem CLS.
- **`next/image` com `unoptimized: true`** — necessário no export; use imagens já
  otimizadas em `public/` (WebP, dimensões certas).
- **Tailwind purge** automático — só CSS usado vai para o bundle.
- **Zero JS de terceiros na home** — sem GA, GTM, hotjar, intercom. Se precisar,
  lazy-load após interação (`requestIdleCallback`).
- **Sem bibliotecas de animação** — `transition` e `transform` em CSS bastam.

## Métricas alvo

| Métrica | Alvo |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | ≥95 |
| SEO | 100 |
| LCP | <1.5s |
| CLS | 0 |
| INP | <100ms |

## O que costuma derrubar o 100

1. **Imagens grandes em hero** — sempre dimensione antes (`width`/`height`).
2. **JS 3rd party síncrono** — analytics deve ser lazy.
3. **Fontes via `<link>`** — use `next/font` sempre.
4. **Frames de iframe** (YouTube, Vimeo) — use `loading="lazy"` + thumbnail clicável.

## Validação

- Build local: `npm run build` deve gerar `out/` sem warnings.
- PageSpeed: rodar duas vezes (cold + warm) para descontar cold start.
- Se cair <100, o report mostra qual asset/audit. Não tente "consertar tudo" — vá
  no maior offender primeiro.
