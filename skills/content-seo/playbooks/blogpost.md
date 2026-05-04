
# /content-seo — pipeline editorial em 6 etapas

Substitui `/content-seo`. Cada etapa **entrega um artefato concreto** salvo em `.cache/content-seo/<slug>/<step>.md` e **exige aprovação explícita** antes de avançar. O usuário pode reciclar etapas (ex.: "refazer a 3 com outro ângulo") sem refazer o início.

## HARD STOPs (antes de qualquer etapa)

1. `brain/index.md` em `kit_state: template` → redirecionar para `/seo-brain:start`.
2. `intent-analyst` ainda não rodou pra essa query → rodar antes da etapa 1.
3. Sem 3 POVs proprietários no brain → bloquear na etapa 3.

---

## Etapa 1 — Mapa de termos

**Objetivo:** levantar o universo lexical do tema. Termo-mãe + variações + intenções secundárias.

**Inputs:**
- Query/tema do usuário.
- Output do `intent-analyst` (intenção dominante + forma).
- `brain/index.md` + `brain/glossario/` (termos da casa).

**Processo (sub-agents em paralelo, 4 buscas):**
1. WebSearch da query principal — coletar 10 primeiros resultados.
2. WebSearch da query + "PT-BR" — Google PT-BR retorna SERP regional.
3. WebSearch "people also ask" + tema (use site:google.com/search).
4. Leitura do `brain/glossario/` para termos proprietários.

**Output (`step-1-termos.md`):**
- Termo primário (1).
- Termos secundários (3-7).
- Termos relacionados (5-10).
- Termos do glossário a citar.
- Volume relativo (alto/médio/baixo, baseado em quantos concorrentes batem).

**Aprovação:** mostrar mapa, perguntar "termos primário e secundários ok? algum a remover?". Espera confirmação.

---

## Etapa 2 — Análise de concorrentes (skyscraper baseline)

**Objetivo:** estabelecer a régua a superar. Skyscraper: ~20% mais profundo que o melhor concorrente, **se a intenção pedir**.

**Inputs:** termo primário + termos secundários da etapa 1.

**Processo (sub-agents em paralelo, 3-5 fetches):**
1. WebFetch dos 3-5 primeiros resultados orgânicos.
2. Para cada: extrair título, H1, H2s, contagem de palavras, número de imagens, número de FAQs, schema (FAQPage? HowTo? Article?).
3. Identificar o **melhor concorrente** (mais profundo + UX melhor) — alvo a superar.
4. Identificar **gaps de cobertura** (perguntas que ninguém respondeu bem).

**Output (`step-2-concorrentes.md`):**
- Tabela: URL · título · H2s · palavras · gaps.
- Melhor concorrente identificado + por quê.
- Gaps de cobertura (3-5 pontos que **nenhum** concorrente cobre bem).
- Tamanho-alvo proposto (palavras): melhor concorrente × 1.2 (skyscraper) ou tamanho-alvo do `intent-analyst` se intenção for transacional.

**Anti-padding:** se a intenção for transacional, skyscraper **não justifica padding**. Conversão (CTA + form) acima da dobra; profundidade abaixo. Documente como vai separar crítico (conversão) de suporte (profundidade).

**Aprovação:** mostra tabela + gaps + tamanho-alvo. Pergunta se cobertura está boa.

---

## Etapa 3 — Consenso vs POV proprietário (BLOQUEANTE)

**Objetivo:** mapear o que **todo mundo já diz** (consenso) e ancorar onde **só esta marca diz** (POVs proprietários, do brain).

**Inputs:** etapa 2 (textos dos concorrentes) + `brain/povs/`.

**Processo:**
1. Liste o **consenso** do nicho: 5-10 afirmações que aparecem em 3+ concorrentes.
2. Carregue os 3+ POVs proprietários do brain (`brain/povs/<slug>.md`).
3. Para cada POV: identifique **qual consenso ele contesta**.
4. Se algum POV não contestar consenso, é candidato fraco — sinalize.
5. Identifique 1-2 POVs **a destacar** neste artigo (não todos os 5+ — foco).

**Output (`step-3-pov.md`):**
- Lista de consenso.
- POVs proprietários selecionados (1-2).
- Para cada: tese, contra qual consenso, evidência da marca (link a `brain/povs/<slug>.md`).
- `proprietary_claims[]` para frontmatter.

**Bloqueante:** se POVs disponíveis no brain forem consenso (ex.: "SEO técnico importa", "conteúdo bom vence"), pause:

> Os POVs do brain para este tema são consenso. Posso (a) propor 3 POVs *contra* o consenso identificado na etapa 2 pra você reagir, ou (b) você escreve POVs próprios agora. Qual?

**Aprovação:** mostra POVs selecionados + frase-síntese de cada. Espera "go".

---

## Etapa 4 — Headings + meta + slug + FAQs

**Objetivo:** estrutura editorial fechada antes de escrever uma palavra.

**Inputs:** etapas 1-3.

**Processo:**
1. **Slug:** termo primário em kebab-case PT-BR, sem stopwords desnecessárias. Máx 5 palavras.
2. **H1:** termo primário, capitalização brasileira (apenas 1ª maiúscula + nomes próprios), 50-60 chars.
3. **Meta description:** 140-160 chars, ativa, com termo primário, com promessa do POV destacado.
4. **H2s:** outline de 5-9 itens, ancorando termos secundários e gaps de cobertura. Headings devem ser **frases**, não rótulos genéricos (ex.: ✅ "Por que o consenso de keyword density está errado" / ❌ "Keyword density").
5. **FAQs:** 4-8 perguntas reais (do "people also ask"), respostas em 2-3 frases citáveis.
6. **TL;DR:** 2-3 frases no topo, citáveis por LLM.

**Output (`step-4-estrutura.md`):**
- Slug.
- H1 (com contagem de chars).
- Meta description (com contagem de chars).
- Outline de H2s (numerado).
- FAQs (perguntas + resposta seca de 2-3 frases).
- TL;DR.

**Aprovação:** mostra estrutura completa. Pergunta granular: "3 decisões pra validar:
1. H1 — escolhi [X], mas [Y] é alternativa que ressoa em [Z]. Mantém?
2. H2 número [N] toca [tema] — quer separar em 2 ou consolidar?
3. FAQ [N] é forte demais (cobra postura), ou tá bom?"

---

## Etapa 5 — Briefing consolidado

**Objetivo:** documento único que serve de input pra escrita (etapa 6) e de auditável pós-publicação.

**Output (`step-5-briefing.md` + frontmatter pré-preenchido):**

```yaml
---
title: <H1 da etapa 4>
slug: <slug>
date: <data>
description: <meta description>
intent: <output do intent-analyst>
audience: <persona principal do brain>
target_words: <da etapa 2>
primary_term: <da etapa 1>
secondary_terms: [<lista>]
proprietary_claims:
  - <POV 1 destacado>
  - <POV 2 destacado>
brain_refs:
  - brain/povs/<slug>.md
  - brain/glossario/<termo>.md
faqs:
  - q: <pergunta 1>
    a: <resposta seca>
  - q: <pergunta 2>
    a: <resposta seca>
tldr: <2-3 frases>
status: draft
---
```

Mais:
- Outline H2 → 1 parágrafo de instrução por H2 (o que cobre, qual gap atende, qual POV cita).
- Lista de internal links (consultar `content/posts/index.md` + `content/site/index.md`).
- 2-3 imagens previstas (alt provisório) — pós-escrita roda `/technical-seo`.

**Aprovação:** "briefing fechado, posso escrever?"

---

## Etapa 6 — Escrita

**Inputs:** `step-5-briefing.md` (frontmatter + outline + POVs).

**Princípios da escrita:**
- Voz ativa, frases ≤ 25 palavras, parágrafos ≤ 4 frases.
- Capitalização brasileira em todos os headings.
- Antivícios IA banidos (lista em `brain/tom-de-voz.md`).
- Cada H2 abre com afirmação proprietária, depois desenvolve com evidência.
- TL;DR no topo. FAQs antes do fechamento.
- JSON-LD `Article` + `FAQPage` (se houver FAQs) — schemas via `/website` references/bestpractices.md.

**Pós-escrita (auto):**
1. `node scripts/article-quality.mjs <path>` — valida tamanho, parágrafos, bullets, antivícios.
2. Se algum gate falhar, pause e mostre o relatório (não auto-corrija — pode quebrar voz).
3. Roda `/content-seo` (citabilidade, llms.txt, FAQ schema, autoria) — output em `brain/seo/reports/`.
4. Roda `/technical-seo` (URL, intro, headings, internal links).

**Saída final:** `content/posts/<slug>.md` com frontmatter + corpo + JSON-LD ao final em bloco `<script>` (consumido pelo Next).

---

## Re-rodar etapas

Cada artefato (`step-N-<nome>.md`) é independente. Comandos:

- `/content-seo --redo step=2` — refaz só a análise de concorrentes (mantém termos da etapa 1).
- `/content-seo --resume` — continua da última etapa aprovada.

Cache em `.cache/content-seo/<slug>/`.

## Sub-agents em paralelo

Diretiva inegociável (ver AGENTS.md):

- Etapa 1: 4 buscas WebSearch em paralelo.
- Etapa 2: WebFetch dos 3-5 concorrentes em paralelo.
- Etapa 4: outline + meta + faqs podem ser propostos em sub-agents paralelos depois consolidados.

Sequencial: etapas entre si (cada uma depende da anterior). Dentro de cada etapa: paralelo.

## Auto-commit por etapa

```bash
git add content/drafts/<slug>/ .cache/content-seo/<slug>/
git commit -m "chore(blogpost): <slug> — etapa <N> aprovada"
```

Etapa 6 (publicação): `git mv` do `content/drafts/<slug>.md` → `content/posts/<slug>.md` + commit `feat(content): blogpost <slug>`.

## Diferença vs `/content-seo` antigo

| Eixo | /content-seo | /content-seo |
|---|---|---|
| Etapas | implícitas dentro de uma só skill | 6 explícitas, cada uma com gate |
| Artefatos | só o post final | 6 markdown + post final |
| Re-rodar parte | não | sim, etapa por etapa |
| Aprovação | uma só no fim | granular por etapa |
| Auditoria | só git history | `.cache/content-seo/<slug>/` permanece |

`/content-seo` permanece no repo para retro-compatibilidade — mas a recomendação é `/content-seo`.
