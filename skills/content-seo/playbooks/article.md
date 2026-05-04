
# Artigo

Pipeline completo de criação de artigo seguindo a filosofia do kit.

## HARD STOPs

1. **`intent-analyst` NÃO rodou** → abortar com:
   > "Preciso rodar `/content-seo` antes pra saber a forma certa do artigo (informacional, comercial, transacional). Roda primeiro."
2. **`brain/index.md` é template** → redirecionar para `/seobrain:start`.
3. **`proprietary_claims` faltando ou genéricos** → bloquear (não auto-resolver).

Sem hard stops, **não escreva**.

## Pipeline

### 1. Brain primeiro
- Leia `brain/index.md`, `brain/tom-de-voz.md`, `brain/personas.md`, `brain/principios-agentic-seo.md`.
- Leia verbetes relevantes em `brain/glossario/`.
- Liste o que o brain diz sobre o tema **antes** de qualquer pesquisa externa.

### 2. Confirmar tópico e os 3 POVs proprietários
- Confirme tópico, persona-alvo e objetivo de negócio.
- Se `proprietary_claims` ausentes/genéricos: **pergunte** "Quais 3 opiniões fortes você tem sobre este tema **que não são consenso de mercado**?" (3 vezes "que não são consenso" — força diferenciação).
- Documente. Vão para `proprietary_claims[]` no frontmatter.

### 3. Análise de intenção (HARD GATE)
- Roda `/content-seo` com a query/tópico.
- Recebe: intenção dominante + tamanho-alvo (palavras) + forma recomendada.
- **Sem isso, abortar.**

### 4. Pesquisa de SERP (Skyscraper)
- Web search dos top 10 resultados para a query.
- Identifica:
  - Estrutura média (palavras, headings, recursos).
  - Gaps que ninguém preenche.
  - O que pode ser superado em ~20% extensão e profundidade (apenas se intenção justificar).

### 5. Estrutura
- H1: keyword principal mais à esquerda + capitalização brasileira.
- H2 inicial: resumo do conceito.
- TL;DR no início (2-3 frases citáveis por LLMs — GEO).
- H2/H3 como **perguntas** quando intenção for informacional (GEO).
- FAQs ao final (geram FAQPage schema).

### 6. Redação
- Tom de voz seguindo `brain/tom-de-voz.md`.
- Frases curtas (≤25 palavras), parágrafos enxutos (3-4 frases).
- Voz ativa.
- Antivícios de IA banidos.
- Capitalização brasileira em todos os headings.
- Pelo menos 3 estatísticas com fonte+data (GEO).
- Quotes de especialistas com credenciais (GEO).
- Internal linking ≥3 (consultar `content/posts/index.md` e `content/site/index.md`).

### 7. Imagens (skill `seo-imagens`)
- Sugerir e/ou validar imagens conforme checklist.
- Alt descritivo, formato correto, peso ≤100kb.

### 8. Frontmatter completo
Use o template `content/posts/_template.md`. Campos críticos:

```yaml
title:                  # 30-60 chars, contém primary_keyword
description:            # 120-160 chars
slug:                   # kebab-case
date:                   # ISO 8601
status: draft           # draft | published
canonical:              # URL absoluta
schema_type:            # Article | BlogPosting | HowTo | FAQPage
primary_keyword:
secondary_keywords: []
search_intent:          # do intent-analyst
target_words:           # do intent-analyst — usado pelo article-quality.mjs
target_persona:         # ref a brain/personas.md
brain_refs: []          # paths para verbetes do glossário
proprietary_claims: []  # mínimo 3 — POV proprietário
author:                 # ref a brain/autores/<slug>.md
tldr:                   # 2-3 frases citáveis (GEO) — só em informacional
faq: []                 # FAQPage schema — só onde aplicar
cover_image:            # SEMPRE — thumb default em /blog
cover_image_alt:
og_image:
og_image_alt:
internal_links: []
cluster:
reading_time:           # calculado pelo article-quality
```

### 9. Validação automática via `article-quality.mjs`

LLMs são ruins de contar. Script faz isso:

```bash
node scripts/article-quality.mjs content/posts/<slug>.md --strict
```

Verifica:
- **Palavras** dentro de ±20% do `target_words` (high severity)
- **Parágrafos com ≥3 frases** em ≥70% do total (high severity)
- **Bullets ≤ 2 listas no artigo todo** (high severity) — resolve "muito bullet point"
- **Frases ≤25 palavras** em ≥80% (medium)
- **Heading hierarchy** (h2 antes de h3) (medium)
- **1 H1 único** (low)

Se algum **high** falha, **refazer** antes de entregar. Não publique 47 palavras quando alvo é 1500 (sessão real).

### 10. Validação on-page (skill `seo-onpage`)
Roda checklist de URL/H1/intro/visuais/links.

### 11. Cover image obrigatória
Se `cover_image` ausente, dispare `/branding-images` para gerar/escolher antes de salvar.

### 12. Indexação
Adiciona em `content/posts/index.md` (lista cronológica) com link, data, categoria, cover.

## Output

Arquivo `.md` em `content/posts/<slug>.md` com `status: draft`, `cover_image` preenchida. Apresenta ao usuário com:

- Score do `article-quality.mjs` visível
- Preview do post em `http://localhost:XXXX/blog/<slug>` (dev server)
- 3 perguntas granulares específicas

## Princípios

- **HARD STOP em intent-analyst.** Sem ele, não escreva.
- **Bullets ≤ 2 por artigo.** Padrão.
- **Parágrafos com ≥3 frases.** Sem prosa fina.
- **Tamanho via script, não LLM.** Conta palavras com regex.
- **Cover obrigatória.** Thumb em listagem.
- **Antivícios IA banidos** — usar lint do `tom-de-voz.md`.
