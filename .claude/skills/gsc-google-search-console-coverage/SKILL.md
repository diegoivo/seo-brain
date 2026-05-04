---
name: gsc-google-search-console-coverage
description: Lista sitemaps submetidos no Google Search Console + status (warnings, erros, última leitura). Mostra quantas URLs cada sitemap tem e quantas foram indexadas. Output triplo (markdown + CSV + JSON) em brain/seo/data/gsc/. Use quando o usuário pedir "status sitemap", "indexação GSC", "sitemap erros", "coverage Search Console", "URLs indexadas". Pilar Dados. Custo GRÁTIS. Pré-requisito - rodar /gsc-google-search-console-setup uma vez.
allowed-tools:
  - Read
  - Write
  - Bash
---

# /gsc-google-search-console-coverage — sitemaps + indexação

Lista todos os sitemaps submetidos pra property no GSC + status de cada um (last submitted, last downloaded, warnings, errors, contents type breakdown, indexação).

## Pré-requisitos

1. **`/gsc-google-search-console-setup` rodado**.
2. **Sitemaps submetidos** ao GSC (Settings → Sitemaps no Search Console). Sem sitemaps submetidos, skill retorna lista vazia (não é erro).

## Inputs

- Sem flags: `/gsc-google-search-console-coverage` → lista todos os sitemaps + status

## Pipeline

### 1. Pré-flight
- Carrega credenciais
- Verifica cwd = projeto ativo

### 2. Lista sitemaps
Endpoint: `sitemaps.list` com `siteUrl=<property>`.

Resposta traz array `sitemap[]`:
```json
{
  "path": "https://exemplo.com.br/sitemap.xml",
  "lastSubmitted": "2026-04-01T10:00:00Z",
  "isPending": false,
  "isSitemapsIndex": false,
  "type": "sitemap",
  "lastDownloaded": "2026-05-03T08:00:00Z",
  "warnings": "0",
  "errors": "0",
  "contents": [
    { "type": "web", "submitted": "142", "indexed": "139" }
  ]
}
```

### 3. Para sitemap-index, descer um nível
Se `isSitemapsIndex=true`, agente faz chamada extra `sitemaps.get` em cada sub-sitemap pra trazer detalhe.

### 4. Output triplo

`brain/seo/data/gsc/coverage-<date>.{md,csv,json}`

**Markdown**:
```markdown
# GSC Coverage — Sitemaps (2026-05-04)

Property: https://exemplo.com.br/
Total sitemaps: 3

## Sitemaps submetidos

| Path | Tipo | Submetido | Última leitura | URLs | Indexadas | Warnings | Errors |
|---|---|---|---|---|---|---|---|
| /sitemap.xml | index | 2026-04-01 | 2026-05-03 | 231 | 218 | 0 | 0 |
| /sitemap-blog.xml | sitemap | 2026-04-01 | 2026-05-03 | 89 | 87 | 0 | 2 |
| /sitemap-pages.xml | sitemap | 2026-04-01 | 2026-05-03 | 142 | 131 | 0 | 0 |

## Resumo

- **Total URLs submetidas:** 462
- **Total indexadas:** 436 (94.4%)
- **Não indexadas:** 26
- **Sitemaps com errors:** 1
- **Sitemaps com warnings:** 0
- **Sitemaps nunca lidos:** 0
```

**CSV**: 1 row por sitemap.

**JSON**:
```json
{
  "property": "...",
  "fetched_at": "...",
  "totals": { "sitemaps": 3, "submitted": 462, "indexed": 436 },
  "sitemaps": [...]
}
```

### 5. Audit log
Append em `brain/seo/data/gsc/_log.jsonl`.

### 6. Sumário ao usuário

```
✅ GSC coverage extraído.

Property: https://exemplo.com.br/
3 sitemaps submetidos.

Total URLs:        462
Indexadas:         436 (94.4%)
Sitemaps c/ erros: 1

⚠️  /sitemap-blog.xml tem 2 errors. Revise no GSC:
   https://search.google.com/search-console/sitemaps?resource_id=https://exemplo.com.br/

Output salvo em:
  brain/seo/data/gsc/coverage-2026-05-04.md
  brain/seo/data/gsc/coverage-2026-05-04.csv
  brain/seo/data/gsc/coverage-2026-05-04.json
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Sem credenciais | Aborta, instrui `/gsc-google-search-console-setup` |
| Nenhum sitemap submetido | "Sem sitemaps. Submeta em search.google.com/search-console/sitemaps" |
| 401/403 | Mensagens já tratadas no `gsc-client::normalizeError` |
| sitemap-index com 0 sub-sitemaps | Mostra como sitemap normal |

## Não-escopo

- **URL Inspection API** (status de indexação per-URL com diagnóstico). Cota separada (2.000/dia). Vira `/gsc-inspect-url` futuro.
- **Index Coverage report** (a tela "Pages" do GSC). API não expõe esses dados de forma estruturada — só via export CSV manual no UI.

## Implementação

Script: `scripts/gsc-coverage.mjs`. Helpers: `scripts/gsc-client.mjs`, `scripts/lib/gsc-output.mjs`.
