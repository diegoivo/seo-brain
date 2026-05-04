
# /seo-data — top URLs orgânicas de um concorrente

Lista top 100 páginas de um domínio com tráfego orgânico estimado, número de keywords ranqueando e posições médias. Útil para skyscraper analysis e topic cluster discovery.

## Pré-requisitos

1. **Credenciais DataForSEO** em `.env.local` (ver `.env.example`).
2. **Domínio target** sem `https://` ou path. Ex: `conversion.com.br`.

## Input

- 1 domínio: `/seo-data conversion.com.br`
- Multiple: `/seo-data conversion.com.br,resultadosdigitais.com.br` (vai rodar 2 calls, custo dobrado)

Flags:
- `--country=BR` (default 2076)
- `--language=pt` (default pt)
- `--limit=100` (default 100, max 1000)
- `--min-traffic=10` (filtra páginas com <10 sessões orgânicas/mês)
- `--no-confirm` — pula prompt de custo

## Pipeline

### 1. Parse domínio
Normaliza: remove `https://`, `www.`, trailing `/`. Valida formato (regex domínio).

### 2. Pre-flight
Credenciais + cost preview:
```
[dataforseo] custo estimado: ~$0.30 USD (1 × $0.30)
[dataforseo] domínio: conversion.com.br
Continuar? [s/N]
```

### 3. Chamada API
Endpoint: `POST /v3/dataforseo_labs/google/relevant_pages/live`

Payload:
```json
[{
  "target": "conversion.com.br",
  "language_code": "pt",
  "location_code": 2076,
  "limit": 100,
  "filters": [["metrics.organic.etv", ">=", 10]]
}]
```

### 4. Parse resposta
Por página:
- `page_address` (URL completa)
- `etv` (estimated traffic value, sessões/mês)
- `count` (keywords ranqueadas)
- `pos_1` (keywords em P1), `pos_2_3`, `pos_4_10`, `pos_11_20`, `pos_21_30`
- `top_keyword` (a keyword com mais tráfego)

### 5. Output triplo
Salva em `brain/seo/data/competitors/<dominio>-pages-<date>.{md,csv,json}`

**Markdown:**
```markdown
# Páginas orgânicas — conversion.com.br

Data: 2026-05-03
Locale: BR/pt-br
Custo: $0.30 USD
Total páginas: 100

| URL | ETV (mês) | Keywords | Top 1 | Top keyword |
|---|---|---|---|---|
| /blog/technical-seo | 12450 | 320 | 18 | seo técnico |
| /blog/llm-wiki | 8900 | 180 | 22 | llm wiki |
| ...

## Insights
- Top 5 por tráfego: ...
- Páginas com mais keywords em P1: ...
- Categorias dominantes (por path): /blog/ (78), /servicos/ (12), /sobre/ (1)
```

**CSV:** flat com todas colunas.

**JSON:** estrutura completa para automação.

### 6. Sumário ao usuário
```
✅ 100 páginas extraídas de conversion.com.br, $0.30 USD.
Top 3 por tráfego: /blog/technical-seo (12450), /blog/llm-wiki (8900), /blog/geo (7200).
Categorias dominantes: /blog/ (78), /servicos/ (12).

Output salvo em:
  brain/seo/data/competitors/conversion-com-br-pages-2026-05-03.md
  brain/seo/data/competitors/conversion-com-br-pages-2026-05-03.csv
  brain/seo/data/competitors/conversion-com-br-pages-2026-05-03.json

Próximos passos:
- /seo-data <dominio> — quais keywords levam tráfego pra estas páginas
- /seo-strategy — usa esses dados pra propor topic clusters
- /content-seo <topico> — escrever skyscraper sobre tópico dominante
```

## Edge cases

| Caso | Ação |
|---|---|
| Domínio com www. | Normaliza, remove |
| Subdomínio (`blog.foo.com`) | Aceita, busca subdomain específico |
| Path no input | Erro: "use só domínio raiz" |
| Domínio sem tráfego orgânico | Retorna lista vazia, salva md com "sem dados" |
| 402 saldo insuficiente | "Recarregue: https://app.dataforseo.com/billing" |
| Multiple domínios | Confirm extra (custo multiplica) |

## Cost guards

- Default 1 domínio = $0.30
- Multi-domain dobra. Aviso explícito.
- `--limit=1000` cobra mesmo se não atingir 1000 — avisa.

## Diferença para outras skills

| Skill | Output |
|---|---|
| `/seo-data` | URLs com tráfego (orientado a páginas) |
| `/seo-data` | Keywords ranqueadas (orientado a queries) |
| `/seo-data` | Volume + CPC de keywords escolhidas (orientado a research) |

## Princípios

- **Cost preview sempre.** Multi-domain confirm extra.
- **Triple output.** Para automação + planilha + leitura humana.
- **Filtro etv>=10 default.** Remove ruído. Override com `--min-traffic=0`.
- **Locale BR-first.** Configurável.
