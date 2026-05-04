# /gsc-google-search-console — coverage (sitemaps + indexação)

Lista todos os sitemaps submetidos pra property no GSC + status de cada um (last submitted, last downloaded, warnings, errors, contents type breakdown, indexação).

## Pré-requisitos

1. **Setup OAuth rodado** (ver `playbooks/setup.md`).
2. **Sitemaps submetidos** ao GSC (Settings → Sitemaps no Search Console). Sem sitemaps submetidos, skill retorna lista vazia (não é erro).

## Inputs

- Sem flags: `node scripts/gsc-coverage.mjs` → lista todos os sitemaps + status

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

### 3. Sitemap-index não traz children via API
Limitação do GSC: `sitemaps.get` em sitemap-index retorna o mesmo shape — não traz lista de children. Mantém o registro top-level apenas.

### 4. Output triplo

`brain/seo/data/gsc/coverage-<date>.{md,csv,json}`

**Markdown**:
```markdown
# GSC Coverage — Sitemaps (2026-05-04)

- **Property:** sc-domain:exemplo.com.br
- **Total sitemaps:** 3

## Sitemaps submetidos
| Path | Tipo | Submetido | Última leitura | URLs | Indexadas | Warnings | Errors |
|---|---|---|---|---|---|---|---|

## Resumo
- **Total URLs submetidas:** 462
- **Total indexadas:** 436 (94.4%)
- **Não indexadas:** 26
- **Sitemaps com errors:** 1
- **Sitemaps com warnings:** 0
- **Sitemaps nunca lidos:** 0

## ⚠️ Sitemaps com errors
- /sitemap-blog.xml — 2 error(s). Revise no GSC.

## 🚨 Indexação baixa (se < 90%)
Possíveis causas: noindex, canonical apontando pra outra URL,
páginas órfãs, bloqueio em robots.txt.
```

**CSV**: 1 row por sitemap. **JSON**: payload completo + totals.

### 5. Audit log
Append em `brain/seo/data/gsc/_log.jsonl`.

### 6. Sumário ao usuário

```
✅ GSC coverage extraído.

Property: sc-domain:exemplo.com.br
Sitemaps: 33

URLs submetidas: 223.687
URLs indexadas:  239 (0.1%)

⚠️  26 sitemap(s) com errors:
    • /sitemap-old.xml  →  1 error(s)
    Revise em https://search.google.com/search-console/sitemaps

Output em: brain/seo/data/gsc/coverage-2026-05-04.{md,csv,json}
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Sem credenciais | Aborta, instrui rodar `playbooks/setup.md` |
| Nenhum sitemap submetido | "Sem sitemaps. Submeta em search.google.com/search-console/sitemaps" |
| 401/403 | Mensagens já tratadas no `gsc-client::normalizeError` |
| sitemap-index com 0 sub-sitemaps | Mostra como sitemap normal |

## Não-escopo deste playbook

- **URL Inspection API** (status de indexação per-URL com diagnóstico). Cota separada (2.000/dia). Vira playbook futuro `playbooks/inspect-url.md` se necessário.
- **Index Coverage report** (a tela "Pages" do GSC). API não expõe esses dados de forma estruturada — só via export CSV manual no UI.

## Princípios

- **Indexação reportada pode estar subdimensionada.** GSC API conta apenas URLs no sitemap específico. Pra realidade total, olhe o relatório "Pages" no GSC web.
- **Sitemaps de subdomínios mortos poluem o relatório.** Limpe submissions antigas no GSC web pra dados mais úteis.

## Implementação

Script: `scripts/gsc-coverage.mjs`. Helpers: `scripts/gsc-client.mjs`, `scripts/lib/gsc-output.mjs`.
