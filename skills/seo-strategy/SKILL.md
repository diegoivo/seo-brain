---
name: seo-strategy
description: SEO strategy planning in 7 consolidated steps — competitor analysis, technical health, positioning, keyword mapping, topic clusters, linkbait, link building. Use when user asks "SEO strategy", "estratégia de SEO", "plano de SEO", "como crescer no SEO", "topic cluster", "growth plan", "SEO roadmap", "competitive analysis", "link building plan", or when starting a project that needs growth strategy beyond per-page optimization. Renamed from /seo-estrategia (v0.1.0).
allowed-tools:
  - Read
  - Write
  - WebFetch
  - WebSearch
---

# Estratégia de SEO

Aplica a estratégia em 7 passos. Foco em projetos que querem dominar um nicho em 12-24 meses.

## Quando rodar

- Início de um projeto novo.
- Replanejamento estratégico (semestral/anual).
- Antes de definir um pillar/cluster novo.

## Os 7 passos

### 1. Concorrentes claros (3 sites alcançáveis)
- Liste 3 concorrentes que você possa ultrapassar em 12-24 meses.
- **Não comece concorrendo com os maiores sites do Brasil.**
- Ferramentas: SimilarWeb, SEMrush, Ubersuggest.
- A estratégia deve dizer **como você chega lá** e **como ultrapassa** cada um.

### 2. Saúde técnica primeiro
- Antes de tudo, garanta SEO técnico.
- Foque em pontos com **menor esforço e maior potencial** de gerar resultado.
- Use a skill `seo-tecnico` para auditoria.

### 3. Posicionamento de marca
- A marca **precisa ter potencial** de ser uma das maiores do nicho.
- Sem posicionamento sólido, SEO escala ladeira abaixo.
- Documentar em `brain/index.md`.

### 4. Mapeamento de palavras-chave
- Liste keywords que você **e os 3 concorrentes** compartilham.
- SEMrush facilita a extração.
- Identifique keywords que você **já ranqueia mas atrás** dos concorrentes — são as oportunidades de impacto rápido.

### 5. Páginas de maior tráfego dos concorrentes
- Mapeie quais páginas geram mais tráfego para cada concorrente.
- Recrie/melhore suas páginas existentes.
- Crie novas páginas onde houver gap.
- Otimize cada uma para superar todas as palavras-chave relevantes.

### 6. Topic Clusters
- Estruture todas as páginas em **topic clusters**.
- Comece preferencialmente por **um único pilar**.
- Pillar → cluster pages → suporte.
- Documente o mapa de clusters em `brain/seo/clusters.md`.

### 7. Conteúdo, linkbait e link building (nesta ordem)
- **Conteúdo de qualidade** — menor quantidade, mais qualidade.
- **Linkbait** — páginas altamente lincáveis (dados exclusivos, pesquisas próprias, ferramentas).
- **Link building com assessoria de imprensa (Data-Driven PR)** — não compre links, não troque, não faça guest post.

## Output

`brain/seo/estrategia.md` com:
- Os 3 concorrentes + análise resumida
- Status atual da saúde técnica (referência ao último seo-score)
- Posicionamento (link para `brain/index.md`)
- Lista de keywords priorizadas
- Mapa de topic clusters
- Plano de linkbait e PR (12-24 meses)

Esta estratégia é simples e poderosa. A execução é difícil — não a complexidade.
