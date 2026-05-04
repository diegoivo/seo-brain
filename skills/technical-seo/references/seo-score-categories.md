# SEO Score — 10 categorias detalhadas

Documenta as 10 categorias scoradas por `scripts/seo-score.mjs` (total 100 pontos). Roda em URL pública (produção) ou build local (`./web/.next`).

## 1. Indexabilidade (12 pts)

- robots.txt válido e otimizado
- sitemap.xml atualizado
- canonical único e auto-referente
- HTTPS + HSTS
- Redirecionamentos 301 corretos
- HREFLANG (se i18n)

## 2. Core Web Vitals (15 pts)

- LCP <2.5s
- INP <200ms
- CLS <0.1
- TTFB <800ms

Para CWV real, exportar `PAGESPEED_API_KEY` (Google PageSpeed API). Sem ela, skipped.

## 3. Schema markup (10 pts)

- Article/BlogPosting (post)
- FAQPage (post + landing com FAQ)
- Person (autoria, sameAs LinkedIn)
- Organization (sameAs)
- BreadcrumbList (page, post, landing)
- Service/Product (landing)

## 4. Meta tags (10 pts)

- `<title>` ≤60 chars com keyword principal
- `<meta description>` 140-160 chars com CTA
- OpenGraph completo (og:title, og:description, og:image, og:type)
- Twitter Card (`summary_large_image`)

## 5. Semântica HTML (10 pts)

- 1 H1 único por página
- Hierarquia H2/H3 sem pulos (H1 → H2 → H3, não H1 → H3)
- Landmarks (`<main>`, `<nav>`, `<article>`, `<aside>`, `<footer>`)
- Lang declarado (`<html lang="pt-BR">`)

## 6. Internal linking (8 pts)

- ≥3 links contextuais por página
- Anchor descritivo (não "clique aqui")
- Linking estratégico baseado em topic clusters

## 7. Imagens (8 pts)

- SVG para logo/vetores/ícones
- WebP/JPEG para fotografias (não PNG)
- Peso ≤100kb (Squoosh)
- Lazy loading (`loading="lazy"`, exceto LCP image)
- ALT descritivo (não keyword stuffing)
- Nome de arquivo descritivo (`titulo-do-post.jpg`)

## 8. Conteúdo (12 pts)

- Original, valioso, atualizado
- Keyword principal no primeiro parágrafo (natural)
- LSI keywords ao longo do texto
- Listas e tabelas onde fizer sentido
- Flesch PT-BR ≥50 (Martins/Ghiraldelo)
- 800-2500 palavras (intent-dependent)

## 9. GEO — Generative Engine Optimization (10 pts)

- TL;DR (2-3 frases citáveis no início)
- FAQs estruturadas (FAQPage schema)
- Person schema com sameAs (E-E-A-T)
- llms.txt na raiz
- Blocos de definição autocontidos
- Pelo menos 3 estatísticas com fonte
- Quotes de especialistas com credenciais

## 10. Acessibilidade (5 pts)

- Contraste WCAG AA mínimo
- Foco visível
- ARIA labels onde necessário
- Skip-to-content link
- Forms com label associada

## Targets

- **Lighthouse:** ≥95 (alvo 100)
- **seo-score:** ≥90 (alvo 100)

Princípio: se página sai com Lighthouse 82, o template está errado, não o caso particular. Copiar de `/website-bestpractices`.
