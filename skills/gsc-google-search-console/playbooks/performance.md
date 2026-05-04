# /gsc-google-search-console — performance (queries + páginas + oportunidades)

Puxa dados reais de performance do site (queries que trazem tráfego, posição, CTR, impressões) via API `searchanalytics.query`. Identifica oportunidades automaticamente: queries em pos 5-15 com CTR abaixo do benchmark — onde subir 1-2 posições traz upside maior.

## Pré-requisitos

1. **Setup OAuth rodado** (ver `playbooks/setup.md`). Skill aborta com instrução clara se credenciais ausentes.
2. **Estar dentro de um projeto** (`cd projects/<nome>`).
3. **Property tem dados.** Sites muito novos (<2 meses) podem retornar dataset vazio — esperado, GSC ainda não coletou.

## Inputs

- Sem flags: `node scripts/gsc-performance.mjs` → últimos 90 dias, top 100 queries + top 100 pages
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
Endpoint: `searchanalytics.query`. Pra `--dimension=both`: 2 chamadas (query + page) em paralelo.

### 4. Parse + ordenação
Por row: `query` ou `page`, `clicks`, `impressions`, `ctr` (0-1), `position` (média). Ordena por clicks desc.

### 5. Análise de oportunidades

Filtra queries com:
- `position` entre 5.0 e 15.0
- `impressions >= 100`
- `ctr` abaixo do benchmark esperado pra essa posição

**Benchmark CTR por posição** (curva conservadora baseada em estudos públicos):
- pos 1: 28% · pos 2: 15% · pos 3: 11% · pos 4: 8% · pos 5: 6%
- pos 6: 4.5% · pos 7: 3.5% · pos 8: 2.8% · pos 9: 2.2% · pos 10: 1.8%
- pos 11-15: 1.0%

Pra cada query oportunidade, calcula upside:
```
clicks_atuais = ctr * impressions
clicks_se_top3 = 0.11 * impressions  (assume mover pra pos 3)
upside_mensal = (clicks_se_top3 - clicks_atuais) / 3   (90d → mês)
```

Ordena por upside desc. Top 25.

### 6. Output triplo

`brain/seo/data/gsc/performance-<date>-queries.{md,csv,json}` (e `-pages` se aplicável).

**Markdown** (humano):
```markdown
# GSC Performance — Queries (2026-05-04)

- **Property:** sc-domain:exemplo.com.br
- **Período:** 2026-02-04 → 2026-05-02 (90 dias)
- **Total queries:** 100
- **Total clicks:** 17.780
- **Total impressões:** 2.945.251

## Top 50 queries por clicks
| # | Query | Clicks | Impressões | CTR | Posição |
|---|---|---|---|---|---|

## Oportunidades — pos 5-15 com CTR abaixo do esperado
| Query | Pos | Impressões | CTR atual | CTR esperado | Upside (clicks/mês) |
|---|---|---|---|---|---|
```

**CSV**: tabela bruta. **JSON**: payload completo + metadata + opportunities.

### 7. Audit log
Append em `brain/seo/data/gsc/_log.jsonl` (1 linha por execução).

### 8. Sumário ao usuário

```
✅ GSC performance extraído.

Total queries: 100 (17.780 clicks)
Total páginas: 100 (55.795 clicks)

Top 3 queries:
  1. conversion           2660 clicks (pos 2.2)
  2. claude code          1755 clicks (pos 6.6)
  3. storytelling         1681 clicks (pos 3.1)

🎯 25 oportunidades identificadas (pos 5-15, CTR baixo):
  • claude code              +11876 clicks/mês
  • antigravity              +8159 clicks/mês
  • contador de caracteres   +4229 clicks/mês

Output em: brain/seo/data/gsc/performance-2026-05-04-*.{md,csv,json}

Próximos passos sugeridos:
  - Pra queries oportunidade, /technical-seo single-page <url-da-página>
  - /gsc-google-search-console coverage pra verificar indexação das top
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Sem credenciais | Aborta, instrui rodar `playbooks/setup.md` |
| Property nova/sem dados | "Dataset vazio. Pode ser site novo (<2 meses) ou property sem tráfego." |
| 401/403 | Mensagens já tratadas no `gsc-client::normalizeError` |
| Anonymized queries | Não vêm como rows (GSC esconde queries com poucos cliques). Documentado no MD. |
| Range > 480d | Aborta, instrui usar max 480 |
| `--limit > 25000` | Aborta, instrui paginar manualmente |

## Princípios

- **Dados reais > estimativas.** GSC mostra o que o Google de fato fez. Use junto de DataForSEO (`/seo-data`) que estima volume potencial de mercado.
- **Oportunidades são hipóteses.** Upside calculado é teórico (assume CTR benchmark + subida real pra top 3). Sirva como prioridade, não promessa.
- **2-3d de delay sempre.** Janela termina em hoje-2d. Não dá pra ver "últimas 24h" de verdade.
- **Anonymized queries são esperadas.** GSC esconde queries de cauda longa por privacidade.

## Implementação

Script: `scripts/gsc-performance.mjs`. Helpers: `scripts/gsc-client.mjs`, `scripts/lib/gsc-output.mjs`.
