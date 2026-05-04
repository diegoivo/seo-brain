---
name: gsc-google-search-console-performance
description: Extrai dados reais de performance do site no Google Search Console — top queries, top páginas, CTR, posição média, e oportunidades (queries em pos 5-15 com CTR baixo). Output triplo (markdown + CSV + JSON) em brain/seo/data/gsc/. Default últimos 90 dias. Use quando o usuário pedir "queries do GSC", "performance Search Console", "top queries", "oportunidades SEO", "tráfego orgânico real", "posição média", "CTR real". Pilar Dados. Custo GRÁTIS. Pré-requisito - rodar /gsc-google-search-console-setup uma vez.
allowed-tools:
  - Read
  - Write
  - Bash
---

# /gsc-google-search-console-performance — Search Console Analytics

Puxa dados reais de performance do site (queries que trazem tráfego, posição, CTR, impressões) via API `searchanalytics.query`. Identifica oportunidades automaticamente: queries que estão em pos 5-15 com CTR abaixo do benchmark — onde subir 1-2 posições traz upside maior.

## Pré-requisitos

1. **`/gsc-google-search-console-setup` rodado** no projeto. Skill aborta com instrução clara se credenciais ausentes.
2. **Estar dentro de um projeto** (`cd projects/<nome>`).
3. **Property tem dados.** Sites muito novos (<2 meses) podem retornar dataset vazio — esperado, GSC ainda não coletou.

## Inputs

- Sem flags: `/gsc-google-search-console-performance` → últimos 90 dias, top 100 queries + top 100 pages
- `--days=30` — janela alternativa (max 480d, GSC retém ~16 meses)
- `--limit=500` — quantos rows pedir (max 25.000 por chamada)
- `--dimension=query` — só queries (default = both)
- `--dimension=page` — só páginas
- `--no-opportunities` — pula análise de oportunidades

## Pipeline

### 1. Pré-flight
- Carrega credenciais via `gsc-client::loadCredentials()` — falha cedo se ausentes
- Verifica cwd = projeto ativo
- Valida `--days` (1-480), `--limit` (1-25000)

### 2. Range de datas
- `gsc-client::dateRangeDays(days)` — fim em hoje-2d (compensa delay GSC), início em fim-N dias
- Loga: `[gsc-performance] range: 2026-02-04 → 2026-05-02 (90 dias)`

### 3. Chamada API
Endpoint: `searchanalytics.query`

Payload pra dimension=query:
```json
{
  "startDate": "2026-02-04",
  "endDate": "2026-05-02",
  "dimensions": ["query"],
  "rowLimit": 100,
  "type": "web"
}
```

Pra dimension=both: 2 chamadas (query + page) em paralelo.

### 4. Parse + ordenação
Por row:
- `query` ou `page`
- `clicks`
- `impressions`
- `ctr` (0-1, multiplica por 100 pra display)
- `position` (média)

Ordena por clicks desc.

### 5. Análise de oportunidades

Filtra queries com:
- `position` entre 5.0 e 15.0
- `impressions >= 100`
- `ctr` abaixo do benchmark esperado pra essa posição

Benchmark CTR por posição (curva conservadora baseada em estudos públicos):
- pos 1: 28%
- pos 2: 15%
- pos 3: 11%
- pos 4: 8%
- pos 5: 6%
- pos 6: 4.5%
- pos 7: 3.5%
- pos 8: 2.8%
- pos 9: 2.2%
- pos 10: 1.8%
- pos 11-15: 1.0%

Pra cada query oportunidade, calcula upside:
```
clicks_atuais = ctr * impressions
clicks_se_top3 = 0.11 * impressions  (assume mover pra pos 3)
upside = clicks_se_top3 - clicks_atuais
```

Ordena por upside desc.

### 6. Output triplo

`brain/seo/data/gsc/performance-<date>-queries.{md,csv,json}` (e `-pages` se aplicável).

**Markdown** (humano):
```markdown
# GSC Performance — Queries (2026-05-04)

Property: https://exemplo.com.br/
Período: 2026-02-04 → 2026-05-02 (90 dias)
Total queries com dados: 1.247
Total clicks no período: 8.430

## Top queries por clicks

| # | Query | Clicks | Impressões | CTR | Posição |
|---|---|---|---|---|---|
| 1 | seo agêntico | 412 | 8.230 | 5.0% | 3.2 |
| 2 | ... |

## Oportunidades — queries em pos 5-15 com CTR abaixo do esperado

| Query | Pos atual | Impr. | CTR atual | Upside (clicks/mês) |
|---|---|---|---|---|
| llm wiki | 8.4 | 2.100 | 1.2% | +180 |
```

**CSV**: tabela bruta sem agrupamento.

**JSON**:
```json
{
  "property": "https://exemplo.com.br/",
  "fetched_at": "2026-05-04T10:30:00Z",
  "range": { "start": "2026-02-04", "end": "2026-05-02", "days": 90 },
  "totals": { "clicks": 8430, "impressions": 142000 },
  "rows": [...],
  "opportunities": [...]
}
```

### 7. Audit log
Append em `brain/seo/data/gsc/_log.jsonl`:
```json
{"ts":"2026-05-04T10:30:00Z","skill":"gsc-performance","range":"90d","rows":100}
```

### 8. Sumário ao usuário

```
✅ GSC performance extraído.

Período: 2026-02-04 → 2026-05-02 (90 dias)
Total clicks: 8.430
Total impressions: 142.000
CTR médio: 5.9%
Posição média: 12.3

Top 3 queries:
  1. seo agêntico       — 412 clicks (pos 3.2)
  2. llm wiki           — 218 clicks (pos 4.8)
  3. content marketing  — 187 clicks (pos 6.1)

🎯 5 oportunidades identificadas (pos 5-15, CTR baixo):
  • llm wiki              upside +180 clicks/mês
  • seo brasil            upside +95 clicks/mês
  • ...

Output salvo em:
  brain/seo/data/gsc/performance-2026-05-04-queries.md
  brain/seo/data/gsc/performance-2026-05-04-queries.csv
  brain/seo/data/gsc/performance-2026-05-04-queries.json
  brain/seo/data/gsc/performance-2026-05-04-pages.md
  ...

Próximos passos sugeridos:
  - Para queries oportunidade, /seo-onpage <página-relevante>
  - /gsc-google-search-console-coverage pra verificar se as páginas top estão indexadas
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Sem credenciais | Aborta, instrui `/gsc-google-search-console-setup` |
| Property nova/sem dados | "Dataset vazio. Pode ser site novo (<2 meses) ou property sem tráfego." |
| 401/403 | Mensagens já tratadas no `gsc-client::normalizeError` |
| Anonymized queries | Não vêm como rows (GSC esconde queries com poucos cliques). Documentado no MD. |
| Range > 480d | Aborta, instrui usar max 480 |
| `--limit > 25000` | Aborta, instrui paginar manualmente |

## Implementação

Script: `scripts/gsc-performance.mjs`. Helpers: `scripts/gsc-client.mjs`, `scripts/lib/gsc-output.mjs`.
