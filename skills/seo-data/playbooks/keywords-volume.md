
# /seo-data — Search Volume API

Puxa volume mensal, CPC e competition de uma ou N keywords via DataForSEO. Salva resultado em formato triplo para diferentes consumidores: humano (md), planilha (csv), automação (json).

## Pré-requisitos

1. **Credenciais.** `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` em `.env.local`. Ver `.env.example`. Sem isso: skill aborta com mensagem de signup.
2. **Brain initialized** (não-template). Para queries fazerem sentido no contexto da marca.

## Inputs

- 1 keyword: `/seo-data "seo agentico"`
- N keywords (até 1000 por chamada): `/seo-data "seo agentico, geo, llm wiki, cms next.js"` (CSV-style)
- Arquivo: `/seo-data --file=brain/seo/keywords-research.txt` (1 keyword por linha)

Flags opcionais:
- `--country=BR` (default 2076 BR) — códigos: https://docs.dataforseo.com/v3/serp/google/locations/
- `--language=pt` (default pt)
- `--no-confirm` — pula prompt de custo (use só em CI/scripts)

## Pipeline

### 1. Parse input
Normaliza separadores (vírgula, newline, semicolon). Deduplica. Limita 1000.

### 2. Pre-flight
- Carrega credenciais (`scripts/dataforseo-client.mjs::loadCredentials`)
- Se ausente: aborta com mensagem de signup (link DataForSEO + custo aprox)

### 3. Cost preview
```
[dataforseo] custo estimado: ~$0.50 USD (10 × $0.05)
[dataforseo] queries: seo agêntico, geo, llm wiki, cms next.js, content marketing...
Continuar? [s/N]
```

Se `--no-confirm`: pula. Senão: aguarda input.

### 4. Chamada API
Endpoint: `POST /v3/keywords_data/google_ads/search_volume/live`

Payload:
```json
[{
  "language_code": "pt",
  "location_code": 2076,
  "keywords": ["seo agentico", "geo", ...]
}]
```

### 5. Parse resposta
Extrai por keyword:
- `keyword`
- `search_volume` (média mensal)
- `cpc` (USD)
- `competition` (LOW/MEDIUM/HIGH)
- `competition_index` (0-100)
- `monthly_searches` (últimos 12 meses, array)

### 6. Output triplo
Salva em `brain/seo/data/keywords/<slug>-<date>.{md,csv,json}` onde slug = primeira keyword normalizada (ou hash se >5 keywords).

**Markdown** (humano + agente next-turn):
```markdown
# Keywords Volume — <data>

Query: <queries originais>
Locale: BR/pt-br
Custo: $X.XX USD

| Keyword | Volume | CPC (USD) | Competition | Index |
|---|---|---|---|---|
| seo agentico | 880 | 2.45 | MEDIUM | 32 |
| ...

## Observações
- Top 3 por volume: ...
- CPC mais alto: ...
- Sem dados (vol=null): ...
```

**CSV** (planilha):
```csv
keyword,search_volume,cpc,competition,competition_index
seo agentico,880,2.45,MEDIUM,32
...
```

**JSON** (automação):
```json
{
  "query": ["seo agentico", "geo"],
  "locale": {"location_code": 2076, "language_code": "pt"},
  "fetched_at": "2026-05-03T10:30:00Z",
  "cost_usd": 0.50,
  "keywords": [
    {"keyword": "seo agentico", "search_volume": 880, "cpc": 2.45, ...}
  ]
}
```

### 7. Sumário ao usuário
```
✅ 10 keywords processadas, $0.50 USD gasto.
Top 3 por volume: seo agentico (880), llm wiki (320), geo (210).
CPC mais alto: cms next.js ($4.20).

Output salvo em:
  brain/seo/data/keywords/seo-agentico-2026-05-03.md
  brain/seo/data/keywords/seo-agentico-2026-05-03.csv
  brain/seo/data/keywords/seo-agentico-2026-05-03.json

Próximos passos sugeridos:
- /technical-seo (strategy playbook) para criar topic clusters a partir destas keywords
- /content-seo <keyword> para um artigo skyscraper
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Credenciais ausentes | Aborta, instrui signup + .env.local |
| 401 Unauthorized | "Credenciais inválidas. Confira `.env.local`." |
| 429 rate limit | Backoff exponencial automático (250ms→2s, 4 retries) |
| 402 Payment Required | "Saldo DataForSEO insuficiente. Recarregue em https://app.dataforseo.com/billing" |
| keyword com volume null | Mantém na tabela, marca como "sem dados" |
| >1000 keywords | Para. "DataForSEO aceita até 1000 por chamada. Divida em batches." |
| `--country=ZZ` inválido | Lista códigos suportados, aborta |

## Cost guards

- Skill **sempre** mostra preview antes de chamar (exceto `--no-confirm`).
- Para >100 keywords: força confirm explícito (`s` em vez de Enter).
- Log do custo em `brain/seo/data/keywords/_log.jsonl` (audit trail mensal).

## Output canônico

Arquivos sempre em `brain/seo/data/keywords/`. Skill `/technical-seo (strategy playbook)` consome estes arquivos para topic clusters.

## Princípios

- **Cost preview obrigatório.** Nunca queima crédito sem aviso.
- **Triple output.** md (humano) + csv (sheets) + json (automação).
- **Locale BR-first.** Default 2076/pt; override por flag.
- **Falha cedo.** Credenciais ausentes = aborta antes de qualquer call.
