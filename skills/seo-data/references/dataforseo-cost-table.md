# DataForSEO — tabela de custos transparentes

Pay-as-you-go. Todas as chamadas passam por cost preview antes de execução.

| API | Endpoint | Custo (USD) | Output |
|---|---|---|---|
| Search Volume | `keywords_data/google/search_volume/live` | ~$0.05 / keyword | volume mensal, CPC, competition |
| Keyword Difficulty | `dataforseo_labs/google/keyword_difficulty/live` | ~$0.05 / keyword | KD score 0-100 |
| Relevant Pages | `dataforseo_labs/google/relevant_pages/live` | ~$0.30 / domínio | top 100 URLs orgânicas |
| Ranked Keywords | `dataforseo_labs/google/ranked_keywords/live` | ~$0.30 / domínio | top 100 keywords ranqueadas |
| SERP API | `serp/google/organic/live/regular` | ~$0.005 / SERP | top 10 resultados |

## Locale defaults

- Default: `language_code: "pt"`, `location_code: 2076` (Brazil)
- US English: `language_code: "en"`, `location_code: 2840`

## Confirmação obrigatória

Antes de qualquer chamada:
```
Cost preview:
  - 10 keywords × $0.05 = $0.50
  - Locale: BR/pt-br
  - Endpoint: search_volume

Confirmar? [y/n]
```

Sem confirmação explícita do usuário, abortar.
