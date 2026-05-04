---
name: gsc-google-search-console
description: Google Search Console — dados reais e gratuitos do próprio site. OAuth setup guiado pelo Chrome real (BYO credentials), top queries + top páginas + análise de oportunidades (queries em pos 5-15 com CTR baixo), status de sitemaps + indexação. Output triplo (md + csv + json) em brain/seo/data/gsc/. Pilar Dados (complementar ao DataForSEO). Use quando o usuário pedir "Google Search Console", "GSC", "configurar GSC", "queries do GSC", "performance Search Console", "top queries reais", "oportunidades SEO", "tráfego orgânico real", "posição média", "CTR real", "sitemap status", "indexação GSC". Routes para playbooks/setup.md (OAuth uma vez), playbooks/performance.md (queries + páginas), ou playbooks/coverage.md (sitemaps).
allowed-tools:
  - Read
  - Write
  - Bash
---

# /gsc-google-search-console — Google Search Console

Conexão com a API oficial do Google Search Console. **Grátis**, quota 1.200 req/min/projeto. Complementa o `/seo-data` (DataForSEO, estimativas pagas de mercado) com **dados reais** do próprio site: queries que de fato trazem tráfego, posição média real, CTR real, indexação real.

## Quando usar

- "Google Search Console", "GSC", "Search Console".
- "configurar GSC", "conectar GSC", "OAuth Google".
- "top queries", "queries do GSC", "performance Search Console".
- "tráfego orgânico real", "posição média real", "CTR real".
- "oportunidades SEO" (queries em pos 5-15 com CTR baixo).
- "status sitemap", "sitemap erros", "indexação GSC", "URLs indexadas".

## Decision tree

```
O que precisa fazer?
  ├── Configurar GSC pela primeira vez (OAuth) → playbooks/setup.md
  │   ~5min, cria seu próprio OAuth client (BYO), sem app verification
  │
  ├── Ver queries + páginas + oportunidades → playbooks/performance.md
  │   Default últimos 90 dias, dados reais via searchanalytics.query
  │
  └── Ver status de sitemaps + indexação → playbooks/coverage.md
      Sitemaps submetidos, warnings, errors, taxa de indexação
```

## Pré-condições não-negociáveis

1. **Estar dentro de um projeto SEO Brain** (`pwd` deve mostrar `projects/<nome>/`). Skill aborta se rodada na raiz do framework.

2. **OAuth configurado** (`playbooks/setup.md` rodou ao menos uma vez). Sem isso, performance/coverage abortam com mensagem acionável.

3. **Credenciais em `.env.local`** (não comitadas, populadas pelo setup):
   ```
   GSC_CLIENT_ID=...
   GSC_CLIENT_SECRET=GOCSPX-...
   GSC_REFRESH_TOKEN=1//...
   GSC_PROPERTY=sc-domain:exemplo.com.br  ou  https://exemplo.com.br/
   ```

4. **Output triplo obrigatório** em `brain/seo/data/gsc/`:
   - `<skill>-<date>.md` — humano + agente next-turn
   - `<skill>-<date>.csv` — planilha
   - `<skill>-<date>.json` — automação

## Playbooks

- `playbooks/setup.md` — fluxo OAuth interativo guiado pelo Chrome real do usuário. Cria projeto Google Cloud, habilita Search Console API, cria OAuth Desktop client, captura refresh_token via callback localhost. Salva credenciais em `.env.local` + atualiza `brain/config.md`.
- `playbooks/performance.md` — `searchanalytics.query` API. Top queries + top páginas (default 90d, top 100). Análise de oportunidades automática: queries em pos 5-15 com CTR abaixo do benchmark, ordenadas por upside estimado se subir pra top 3.
- `playbooks/coverage.md` — `sitemaps.list` API. Sitemaps submetidos + status (warnings, errors, indexação). Identifica sitemaps com problemas e taxa de indexação baixa.

## References

- `references/oauth-troubleshooting.md` — erros comuns no OAuth (access_denied, invalid_grant, 0 properties) + soluções.

## Outputs

- `brain/seo/data/gsc/performance-<date>-queries.{md,csv,json}` — top queries + oportunidades
- `brain/seo/data/gsc/performance-<date>-pages.{md,csv,json}` — top páginas
- `brain/seo/data/gsc/coverage-<date>.{md,csv,json}` — sitemaps + indexação
- `brain/seo/data/gsc/_log.jsonl` — audit trail (1 linha por execução)

## Princípios

- **BYO credentials.** Cliente cria seu próprio OAuth client no Google Cloud Console. Sem dependência de app verificado pelo Google, sem cap de 100 usuários, credenciais isoladas por projeto.
- **Setup manual guiado.** Sem automação de browser. Robusto em qualquer harness, sessão Google do usuário já está ativa no Chrome real.
- **Falha cedo + acionável.** Credenciais ausentes ou inválidas → mensagem clara apontando o playbook certo.
- **GSC tem 2-3d de delay.** Range de datas termina sempre em hoje-2d. Documentar nas saídas.
- **Anonymized queries.** GSC esconde queries com poucos cliques (privacidade) — esperado, documentado nas saídas.

## DataForSEO vs GSC — quando usar qual

| Caso de uso | Provider |
|---|---|
| Volume estimado de keyword nova (que ainda não trago tráfego) | DataForSEO (`/seo-data`) |
| Análise de concorrentes (top URLs, top keywords deles) | DataForSEO (`/seo-data`) |
| Dimensionamento de mercado, CPC, dificuldade | DataForSEO (`/seo-data`) |
| **Queries reais que trazem tráfego pro meu site** | **GSC (este)** |
| **CTR real, posição média real, oportunidades de subida** | **GSC (este)** |
| **Status de indexação, sitemaps, coverage** | **GSC (este)** |

Os dois são complementares — GSC olha pra dentro (meu site), DataForSEO olha pra fora (mercado + concorrentes).

## Implementação

Scripts compartilhados em `scripts/`:
- `gsc-client.mjs` — auth OAuth2 + token refresh + error handling normalizado
- `gsc-setup.mjs` — fluxo interativo (chamado por `playbooks/setup.md`)
- `gsc-auth-headless.mjs` — variante não-interativa (helper pra agentes)
- `gsc-performance.mjs` — searchanalytics + análise de oportunidades
- `gsc-coverage.mjs` — sitemaps.list + agregação
- `lib/gsc-output.mjs` — helpers de output triplo (md + csv + json)
- `lib/env-local.mjs` — loader de .env.local
