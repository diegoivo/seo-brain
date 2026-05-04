---
title: Dados de SEO — pesquisa e GSC
tags: [brain, seo, data]
created: TEMPLATE
updated: TEMPLATE
status: template
sources: []
---

# Dados de SEO

> [!info] Pasta de evidências
> Aqui ficam dados puxados pelas skills do **Pilar Dados**. Cada execução salva 3 arquivos: `.md` (humano), `.csv` (planilha), `.json` (automação).

## Subpastas

| Pasta | Skill | O que tem |
|---|---|---|
| `keywords/` | `/keywords-volume` | Volume + CPC + dificuldade de keywords (DataForSEO) |
| `competitors/` | `/competitor-pages`, `/competitor-keywords` | Páginas e keywords de concorrentes (DataForSEO) |
| `gsc/` | `/gsc-google-search-console (performance)`, `/gsc-google-search-console (coverage)` | Dados reais do site no Google Search Console (grátis) |

## Convenção de nomes

```
<skill>-<YYYY-MM-DD>-<escopo>.{md,csv,json}
```

Exemplos:
- `keywords/seo-agentico-2026-05-04.md`
- `gsc/performance-2026-05-04-queries.md`
- `gsc/coverage-2026-05-04.json`

## Audit log

Cada subpasta tem um `_log.jsonl` com 1 linha por execução: timestamp, skill, escopo, custo (se aplicável). Útil pra auditoria de gastos com APIs pagas (DataForSEO) e tracking de quando dados foram puxados pela última vez.
