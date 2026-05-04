---
name: technical-seo
description: Technical SEO audit suite — full site audit, single-page on-page optimization, image SEO, Lighthouse + Core Web Vitals (LCP, INP, CLS, TTFB) performance audit. 10-category SEO score (0-100) covering indexability, CWV, schema markup, meta tags, HTML semantics, internal linking, images, content, GEO, accessibility. Renamed from /seo-tecnico + /seo-onpage + /seo-imagens + /perf-audit (consolidated v0.1.0). Use when user asks "audit SEO", "auditar SEO técnico", "rodar SEO técnico", "checar SEO", "lighthouse", "PageSpeed", "core web vitals", "schema markup", "optimize page", "otimizar esta página", "revisar SEO on-page", "SEO de imagens", "image SEO", "LCP", "INP", "CLS". Routes to playbooks/full-audit.md (full site), single-page.md (one URL), images.md (image-specific), or performance.md (Lighthouse + CWV).
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
---

# /technical-seo — auditoria técnica

Auditoria técnica de SEO via `scripts/seo-score.mjs` (10 categorias, 100 pontos) + checks por escopo. **NÃO é QA de build** (isso é `/website-qa`). É análise de score, não pass/fail.

## Quando usar

- Pós-deploy: smoke de SEO técnico.
- Antes de campanha ou migração.
- "audit SEO", "rodar SEO técnico", "lighthouse", "core web vitals".
- Otimizar página específica ("revisar SEO on-page").

## Decision tree

```
Escopo da auditoria?
  ├── Site todo (URL produção) → playbooks/full-audit.md
  ├── Uma página/post específico → playbooks/single-page.md
  ├── Imagens (peso, formato, ALT) → playbooks/images.md
  └── Performance (Lighthouse + CWV) → playbooks/performance.md
```

## 10 categorias do SEO Score

(Documentadas em detalhe em `references/seo-score-categories.md`.)

| # | Categoria | Peso |
|---|---|---|
| 1 | Indexabilidade (robots, sitemap, canonical, HTTPS) | 12 |
| 2 | Core Web Vitals (LCP, INP, CLS, TTFB) | 15 |
| 3 | Schema markup (Article, FAQPage, Person, BreadcrumbList) | 10 |
| 4 | Meta (title, description, OG, Twitter Card) | 10 |
| 5 | Semântica HTML (H1 único, hierarquia, landmarks) | 10 |
| 6 | Internal linking (≥3 contextuais, anchor descritivo) | 8 |
| 7 | Imagens (formato, peso ≤100kb, ALT, lazy) | 8 |
| 8 | Conteúdo (Flesch PT-BR ≥50, keyword no 1º parágrafo) | 12 |
| 9 | GEO (TL;DR, FAQs, llms.txt, Person schema) | 10 |
| 10 | Acessibilidade (contraste, foco, ARIA) | 5 |

**Targets:** Lighthouse ≥95 (alvo 100), seo-score ≥90 (alvo 100). São pré-condições de código, não auditoria pós-fato.

## Profiles (auto-detect via path)

| Profile | Path | Checa TL;DR | FAQ | Article schema | Breadcrumb |
|---|---|---|---|---|---|
| `home` | `/` | ❌ | ❌ | ❌ | ❌ |
| `page` | `/sobre`, `/contato` | ❌ | ❌ | ❌ | ✅ |
| `post` | `/blog/...`, `/posts/...` | ✅ | ✅ | ✅ | ✅ |
| `landing` | `/servicos/...`, `/produtos/...` | ❌ | ✅ | ❌ | ✅ |

## Outputs

`brain/seo/reports/<slug>-<date>.{json,md}` com:
- Score total (0-100)
- Breakdown por categoria
- Itens reprovados priorizados (P0/P1/P2)
- Próximos passos

## Princípios

- **Score nunca bloqueia.** Alerta com recomendações priorizadas. Usuário decide.
- **Se página sai com Lighthouse 82, o template está errado.** Não improvisar — copiar de `/website-bestpractices`.
- **Para CWV reais, exporte `PAGESPEED_API_KEY`.** Sem ela, CWV skipped (não penaliza score).
- **technical-seo é análise. QA de build/funcionamento é `/website-qa`.**
