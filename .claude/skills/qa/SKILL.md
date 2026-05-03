---
name: qa
description: QA orquestrador antes de apresentar trabalho ao usuário. Roda 3 sub-agents em paralelo — qa-design (visual + tipografia + grid + AI-slop), qa-content (voz + capitalização + antivícios + skyscraper + GEO), qa-tech (build + lighthouse + seo-score + a11y). Consolida em relatório priorizado. Sempre paralelo, nunca sequencial. Use antes de "apresentar para aprovação", "entregar", "fechar PR" ou quando o usuário pedir "qa", "validação", "revisão final".
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
---

# /qa — orquestrador de QA pré-apresentação

**Diretiva inegociável:** os 3 sub-agents rodam em **paralelo**. Nunca sequencial. Cada um produz um relatório curto; o orquestrador consolida e prioriza.

## Quando rodar

- Antes de "está pronto, pode aprovar?"
- Antes de criar PR.
- Antes de deploy.
- Quando o usuário pedir explicitamente.

## Inputs

- Escopo: arquivos modificados desde o último commit, ou alvo passado pelo usuário (ex.: `/qa pages/sobre`).
- Brain do projeto (regras de voz, antipadrões).

## Pipeline

### 1. Disparar 3 sub-agents em paralelo

Em uma única mensagem, invoque 3 chamadas Agent simultâneas:

```
[parallel]
  Agent(qa-design): valida design system aplicado, AI-slop, grid, tipografia
  Agent(qa-content): valida voz, capitalização BR, antivícios IA, GEO
  Agent(qa-tech):    valida build, lighthouse, seo-score, a11y, schema
```

Cada sub-agent escreve relatório curto em `.cache/qa-runs/<task>-<role>.md`.

### 2. Consolidar

Leia os 3 relatórios. Produza relatório-mestre `.cache/qa-runs/<task>.md`:

```markdown
# QA — <task>

## Veredicto: APROVADO / BLOQUEADO / APROVADO COM RESSALVAS

## Bloqueios (P0)
- [tech]  Build falha em /sobre — TS error linha 23
- [content] Headline em CAPS LOCK ("COMO OTIMIZAR") — capitalização BR não aplicada

## Atenção (P1)
- [design] Botão primário usa shadow-md (AI-slop) — substituir por --shadow-soft
- [content] FAQ 3 começa com "É importante ressaltar..." (antivício)

## Polimento (P2)
- [tech] Imagem hero sem `priority`, LCP estimado 3.2s

## Métricas
- Lighthouse: Perf 92 / SEO 100 / A11y 97 / BP 100
- seo-score: 88
- Build: ✅
```

### 3. Escalar ou retornar

- **APROVADO:** retorna para o orquestrador-pai (ou usuário) com sumário.
- **APROVADO COM RESSALVAS:** lista P1 e P2, pergunta se quer corrigir agora ou seguir.
- **BLOQUEADO:** lista P0, **não retorna o controle** até ser corrigido. Loop limitado a **3 rodadas** (regra do AGENTS.md). Após 3 falhas, escalar com opções.

---

## Sub-agent: qa-design

**Verifica:**
- DESIGN.md aplicado (cores `--color-*`, fontes `--font-*`, escala `--text-*`).
- Grid canônico usado (12-col / subgrid quando faz sentido / spacing 4-base).
- Tipografia: line-height 1.7 em parágrafos, measure 65ch em `.prose`, anchor-down em headings.
- Hero cabe em 100dvh mobile (regra do primeiro viewport).
- AI-slop banido: gradiente purple→blue, shadow-md sem custom var, cards brancos com sombra sutil em fundo gray-50, ícones em todas as posições óbvias.
- `text-wrap: balance` em headings, `pretty` em body.

**Não verifica:** semântica de copy, performance, schema (esses ficam em qa-content e qa-tech).

**Output:** `.cache/qa-runs/<task>-design.md` com lista priorizada (P0/P1/P2).

---

## Sub-agent: qa-content

**Verifica:**
- Capitalização BR em todos os headings (apenas 1ª maiúscula + nomes próprios; siglas ok).
- Antivícios IA: lista em `brain/tom-de-voz.md` (vale destacar, no cenário atual, em síntese, navegando pelas águas, desbloqueando, etc.).
- Voz: ativa, frases ≤ 25 palavras, parágrafos ≤ 4 frases.
- POVs proprietários no frontmatter (`proprietary_claims[]`) — não consenso.
- TL;DR presente e citável (2-3 frases) para conteúdo informacional.
- FAQs estruturadas → schema `FAQPage` no JSON-LD.
- Internal links: consultou `content/posts/index.md` e `content/site/index.md`?

**Não verifica:** design ou build.

**Output:** `.cache/qa-runs/<task>-content.md`.

---

## Sub-agent: qa-tech

**Verifica:**
- `cd web && npm run build` passa sem erro.
- TypeScript sem erros (`tsc --noEmit`).
- `node scripts/seo-score.mjs <url|path>` ≥ 90 (alvo 100).
- Lighthouse mínimos (via `/perf-audit` se disponível): Perf 95 / SEO 100 / A11y 95 / BP 95.
- HTML semântico: `<main id="main">`, hierarquia H1→H2→H3 sem pular, alt em imagens não-decorativas.
- JSON-LD válido (Article / FAQPage / Person quando aplicável).
- `metadataBase` setado, OG tags presentes.
- Sitemap, robots, llms.txt batem com rotas.

**Não verifica:** design ou voz.

**Output:** `.cache/qa-runs/<task>-tech.md`.

---

## Estado e retomada

Diretório `.cache/qa-runs/` é git-ignored. Cada rodada de QA grava 4 arquivos:
- `<task>-design.md`
- `<task>-content.md`
- `<task>-tech.md`
- `<task>.md` (consolidado)

Loops do AGENTS.md (3 rodadas máx) usam estes arquivos para persistir contexto entre tentativas.

## Diretiva inegociável: paralelo

Sub-agents rodam em paralelo. Nunca:
- ❌ "Vou rodar qa-design primeiro."
- ❌ "Aguardo qa-tech terminar pra começar qa-content."

Sempre:
- ✅ Disparar os 3 numa única mensagem com 3 tool uses.

Latência de QA cai 3× e a consolidação é mais nítida quando os 3 relatórios chegam juntos.

## Princípios

- **Paralelo sempre.** Disparar os 3 numa única mensagem.
- **Cada sub-agent é especialista.** Não duplica responsabilidade.
- **P0/P1/P2 priorizado.** P0 bloqueia, P1 negocia, P2 informa.
- **Loop limitado a 3 rodadas.** Após isso escalar para o usuário com opções.
- **Nunca apresentar trabalho sem QA.** É a última etapa antes do "feito?".
