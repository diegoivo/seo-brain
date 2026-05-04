---
name: technical-seo
description: Technical SEO suite — full site audit, single-page on-page optimization, image SEO, Lighthouse + Core Web Vitals (LCP, INP, CLS, TTFB) performance audit, AND strategic planning in 7 steps (competitor analysis, technical health, positioning, keyword mapping, topic clusters, linkbait, link building). 10-category SEO score (0-100) covering indexability, CWV, schema markup, meta tags, HTML semantics, internal linking, images, content, GEO, accessibility. Use when user asks "audit SEO", "auditar SEO técnico", "rodar SEO técnico", "checar SEO", "lighthouse", "PageSpeed", "core web vitals", "schema markup", "optimize page", "otimizar esta página", "revisar SEO on-page", "SEO de imagens", "image SEO", "LCP", "INP", "CLS", "SEO strategy", "estratégia de SEO", "plano de SEO", "como crescer no SEO", "topic cluster", "growth plan", "SEO roadmap", "competitive analysis", "link building plan". Routes to playbooks/full-audit.md, single-page.md, images.md, performance.md, or strategy.md. Renamed from /technical-seo + /seo-strategy (consolidated v0.1.5).
allowed-tools:
  - Bash
  - Read
  - Write
  - WebFetch
  - WebSearch
---

# /technical-seo — auditoria técnica + estratégia

Auditoria técnica de SEO via `scripts/seo-score.mjs` (10 categorias, 100 pontos) + checks por escopo + planejamento estratégico em 7 passos. **NÃO é QA de build** (isso é `/website` qa playbook). É análise de score + plano de crescimento.

## Quando usar

- Pós-deploy: smoke de SEO técnico.
- Antes de campanha ou migração.
- "audit SEO", "rodar SEO técnico", "lighthouse", "core web vitals" → audit
- Otimizar página específica ("revisar SEO on-page") → single-page
- "SEO strategy", "plano de SEO", "topic cluster", "growth plan" → strategy

## Decision tree

```
Qual operação?
  ├── Auditar site todo (URL produção) → playbooks/full-audit.md
  ├── Auditar uma página/post específico → playbooks/single-page.md
  ├── Auditar imagens (peso, formato, ALT) → playbooks/images.md
  ├── Auditar performance (Lighthouse + CWV) → playbooks/performance.md
  └── Planejar estratégia de crescimento (7 passos) → playbooks/strategy.md
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

- Audit: `brain/seo/reports/<slug>-<date>.{json,md}` com score total (0-100), breakdown por categoria, itens reprovados priorizados (P0/P1/P2), próximos passos.
- Strategy: `brain/seo/estrategia.md` com 3 concorrentes, mapa de keywords, topic clusters, plano linkbait + PR.

## Princípios

- **Score nunca bloqueia.** Alerta com recomendações priorizadas. Usuário decide.
- **Se página sai com Lighthouse 82, o template está errado.** Não improvisar — copiar de `/website` references/bestpractices.md.
- **Para CWV reais, exporte `PAGESPEED_API_KEY`.** Sem ela, CWV skipped (não penaliza score).
- **technical-seo é análise + plano. QA de build/funcionamento é `/website` qa playbook.**
- **Estratégia ≠ execução.** O plano em 7 passos é simples; o difícil é fazer.
