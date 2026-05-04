
# /seo-data — keywords ranqueadas de um concorrente

Lista top 100 keywords para as quais um domínio rankeia no Google, com posição atual, volume mensal, tráfego estimado e URL ranqueando. Diferente de `/seo-data` (orientado a páginas), esta skill é orientada a queries.

## Pré-requisitos

1. **Credenciais DataForSEO** em `.env.local`.
2. **Domínio target** sem protocolo ou path.

## Input

- 1 domínio: `/seo-data conversion.com.br`
- Multiple (custo multiplica): `/seo-data conversion.com.br,rdstation.com`

Flags:
- `--country=BR` (default 2076)
- `--language=pt` (default pt)
- `--limit=100` (default, max 1000)
- `--min-position=10` (default 30 — só keywords em top 30; reduzir aumenta custo de processamento)
- `--min-volume=10` (filtra long-tail)
- `--no-confirm`

## Pipeline

### 1. Parse + normaliza domínio
Remove `https://`, `www.`, trailing `/`. Valida.

### 2. Pre-flight
Cost preview:
```
[dataforseo] custo estimado: ~$0.30 USD
[dataforseo] domínio: conversion.com.br
[dataforseo] filtros: top 30 posições, vol >=10
Continuar? [s/N]
```

### 3. Chamada API
Endpoint: `POST /v3/dataforseo_labs/google/ranked_keywords/live`

Payload:
```json
[{
  "target": "conversion.com.br",
  "language_code": "pt",
  "location_code": 2076,
  "limit": 100,
  "filters": [
    ["ranked_serp_element.serp_item.rank_group", "<=", 30],
    ["keyword_data.keyword_info.search_volume", ">=", 10]
  ],
  "order_by": ["keyword_data.keyword_info.search_volume,desc"]
}]
```

### 4. Parse resposta
Por keyword:
- `keyword`
- `position` (rank_group atual)
- `search_volume` (mensal)
- `cpc` (USD)
- `competition` (LOW/MEDIUM/HIGH)
- `traffic_estimate` (ETV)
- `ranking_url` (URL específica que rankeia)
- `serp_item_type` (organic, featured_snippet, video, etc)

### 5. Output triplo
`brain/seo/data/competitors/<dominio>-keywords-<date>.{md,csv,json}`

**Markdown:**
```markdown
# Keywords ranqueadas — conversion.com.br

Data: 2026-05-03
Locale: BR/pt-br
Custo: $0.30 USD
Total keywords: 100 (top 30, vol≥10)

| Keyword | Pos | Volume | URL |
|---|---|---|---|
| seo técnico | 1 | 4400 | /blog/technical-seo |
| llm wiki | 1 | 320 | /blog/llm-wiki |
| ...

## Distribuição por posição
- P1: 12 keywords
- P2-3: 18
- P4-10: 35
- P11-20: 25
- P21-30: 10

## Categorias dominantes
- /blog/: 78 keywords (78%)
- /servicos/: 15
- /sobre/: 7

## Quick wins (P11-20, vol≥500)
- "seo agência" pos 14, vol 880 → potencial subir top 10
- "consultoria seo" pos 12, vol 590 → idem
```

**CSV** + **JSON**: estrutura completa.

### 6. Sumário ao usuário
```
✅ 100 keywords extraídas de conversion.com.br, $0.30 USD.
P1 keywords: 12 (12%). Top tema: SEO técnico (28 keywords relacionadas).
Quick wins: 5 keywords em P11-20 com vol≥500 — subir top 10 com on-page improvement.

Output em brain/seo/data/competitors/conversion-com-br-keywords-2026-05-03.{md,csv,json}

Próximos passos:
- /seo-data <dominio> — ver quais URLs do concorrente concentram esse tráfego
- /seo-strategy — usar esses dados pra topic clusters do nosso site
- /content-seo <quick-win-keyword> — atacar keyword em P11-20 com volume
```

## Edge cases

| Caso | Ação |
|---|---|
| Domínio sem rankings | "Domínio não rankeia em top 30 com filtros aplicados. Tente `--min-position=100` (custo igual)" |
| Subdomain | Aceita, query específica |
| Path no input | Erro: "domínio raiz apenas" |
| Featured snippet | Marca no output (`serp_item_type: featured_snippet`) |
| 402 sem saldo | Mensagem de signup/billing |

## Princípios

- **Quick wins first.** Output highlight de keywords P11-20 (subir top 10 é alavanca rápida).
- **Categorias por path.** Agrupa por primeiro path (/blog/, /servicos/) — visualização editorial.
- **Triple output.**
- **Locale BR-first.**

## Diferença para `/seo-data`

| Pergunta | Skill |
|---|---|
| "Quais URLs do site dão tráfego?" | `/seo-data` |
| "Pra quais palavras o site rankeia?" | `/seo-data` |

Frequentemente rodadas em sequência: pages mostra ONDE o tráfego vem; keywords mostra POR QUAL pesquisa.
