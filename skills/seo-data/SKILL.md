---
name: seo-data
description: SEO research data via DataForSEO API + setup interativo de credenciais. Keyword search volume, CPC, difficulty, SERP analysis, competitor pages (top 100 organic URLs), competitor keywords (top 100 ranked keywords). Pay-as-you-go pricing with cost preview before each call. Brazilian Portuguese (pt-br) defaults. Triple output (md + csv + json) in brain/seo/data/. Inclui configuração interativa de credenciais via servidor HTTP local efêmero (form em 127.0.0.1, validação grátis, upsert em .env.local). Use when user asks "keyword research", "search volume", "CPC", "keyword difficulty", "competitor pages", "competitor keywords", "SERP analysis", "ranked keywords", "pesquisar palavra-chave", "volume de busca", "para quais keywords concorrente rankeia", "URLs de tráfego", "DataForSEO", "configurar DataForSEO", "credenciais DataForSEO", "setup DataForSEO", "salvar API key DataForSEO". Routes to playbooks/keywords-volume.md, competitor-pages.md, competitor-keywords.md, or config.md. Renamed from /seo-data + /dataforseo-config (consolidated v0.1.5).
allowed-tools:
  - Read
  - Write
  - Bash
---

# /seo-data — pesquisa SEO empacotada (DataForSEO)

Pesquisa SEO via DataForSEO API — pay-as-you-go com **cost preview obrigatório** antes de cada chamada. Default Brasil/pt-br. Output triplo (md + csv + json) em `brain/seo/data/`. Inclui setup interativo de credenciais.

## Quando usar

- "configurar DataForSEO", "setup DataForSEO", "salvar API key" → config (primeira vez)
- "volume de keyword", "search volume", "CPC", "keyword difficulty" → keywords-volume
- "competitor pages", "URLs de tráfego do concorrente" → competitor-pages
- "competitor keywords", "para quais keywords site rankeia" → competitor-keywords

## Decision tree

```
Tipo de operação?
  ├── Configurar credenciais DataForSEO (primeira vez ou rotação) → playbooks/config.md
  │   Custo: 0 (validação via endpoint grátis)
  │
  ├── Volume/CPC/dificuldade de keywords (1 ou N) → playbooks/keywords-volume.md
  │   Custo: ~$0.05/keyword
  │
  ├── Top URLs orgânicas de um domínio concorrente → playbooks/competitor-pages.md
  │   Custo: ~$0.30/domínio (top 100 páginas)
  │
  └── Top keywords pelas quais um domínio rankeia → playbooks/competitor-keywords.md
      Custo: ~$0.30/domínio (top 100 keywords)
```

## Pré-condições não-negociáveis

1. **Credenciais em `.env.local`** (não comitadas):
   ```
   DATAFORSEO_LOGIN=seu_login
   DATAFORSEO_PASSWORD=sua_senha
   ```
   Sem isso: rode `playbooks/config.md` primeiro.

2. **Cost preview SEMPRE.** Antes de chamar a API, exibir custo estimado e pedir confirmação. Nunca rodar sem aprovação explícita.

3. **Locale default Brasil/pt-br.** Para outros locales, passar `--locale=us-en` ou similar.

4. **Output triplo obrigatório**: `<slug>.md` (legível), `<slug>.csv` (planilha), `<slug>.json` (dados estruturados). Salvar em `brain/seo/data/{keywords,competitors}/`.

## Playbooks

- `playbooks/config.md` — setup interativo de `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`. Sobe form em `127.0.0.1`, valida via endpoint gratuito, upsert em `.env.local`. Sem custo.
- `playbooks/keywords-volume.md` — DataForSEO Search Volume API. 1 ou múltiplas keywords. Output: volume mensal, CPC ($), competition (0-1), keyword difficulty.
- `playbooks/competitor-pages.md` — DataForSEO Labs Relevant Pages API. Top 100 URLs orgânicas com tráfego estimado, posições, keywords-foco.
- `playbooks/competitor-keywords.md` — DataForSEO Labs Ranked Keywords API. Top 100 keywords ranqueadas com posição, volume, tráfego estimado, URL ranqueando.

## References

- `references/dataforseo-cost-table.md` — tabela de custos transparentes (todas as APIs).

## Outputs

- `projects/<nome>/.env.local` — config (upsert seguro, preserva outras vars)
- `brain/seo/data/keywords/<slug>.{md,csv,json}` — keywords-volume
- `brain/seo/data/competitors/<domain>-pages.{md,csv,json}` — competitor-pages
- `brain/seo/data/competitors/<domain>-keywords.{md,csv,json}` — competitor-keywords

## Princípios

- **Cost preview é não-negociável.** Usuário aprova antes de cada chamada paga.
- **Validação antes do disco.** Credenciais nunca gravadas sem validar primeiro.
- **Locale BR default.** Ajustar só com flag explícita.
- **Output triplo.** Markdown legível + CSV planilha + JSON automação.
- **Loopback only para config.** Servidor de credenciais escuta apenas em `127.0.0.1`.
- **Roadmap v2:** abstração `KeywordProvider` interface pra suportar Google Search Console (free), GA4, attribution. Hoje DataForSEO é provider concreto único.
