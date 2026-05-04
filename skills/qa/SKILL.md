---
name: qa
description: QA orchestrator — runs 3 domain reviewers in parallel before presenting work or shipping. Invokes /branding-review (visual + grid + AI-slop check), /content-seo-review (voice + capitalization + GEO + POVs), /website-qa (build + lighthouse + seo-score + a11y + schema). Consolidates priority-ranked report (P0/P1/P2). Use when user asks "qa", "validate before deploy", "validation", "revisão final", "antes de aprovar", "before PR", "QA all".
allowed-tools:
  - Read
  - Bash
  - Task
---

# /qa — orchestrator paralelo de QA

Skill **fina** que dispara 3 reviewers de domínio em paralelo via `Task` tool. Cada reviewer é uma skill independente (`branding-review`, `content-seo-review`, `website-qa`).

**Diretiva inegociável:** os 3 sub-agents rodam **em paralelo**, nunca sequencial.

## Quando rodar

- Antes de "está pronto, pode aprovar?"
- Antes de criar PR (`/ship`).
- Antes de deploy.
- Quando o usuário pedir "qa", "validation", "revisão final".

## Pipeline

### 1. Disparar 3 sub-agents em paralelo

Numa **única mensagem** com 3 tool calls Agent simultâneos:

```
Agent(general-purpose):  carregar skills/branding-review/SKILL.md, validar
Agent(general-purpose):  carregar skills/content-seo-review/SKILL.md, validar
Agent(general-purpose):  carregar skills/website-qa/SKILL.md, validar (build+lighthouse+seo-score)
```

Cada um produz `.cache/qa-runs/<task>-<role>.md`.

### 2. Consolidar

Agente lê os 3 reports. Produz consolidated em `.cache/qa-runs/<task>.md`:

```markdown
# QA — <task>

## Veredicto: APROVADO / BLOQUEADO / APROVADO COM RESSALVAS

## Bloqueios (P0)
- [website-qa]  Build falha em /sobre — TS error linha 23
- [content-seo-review] Headline em CAPS LOCK ("COMO OTIMIZAR")

## Atenção (P1)
- [branding-review] Botão primário usa shadow-md (AI-slop)

## Polimento (P2)
- [website-qa] Imagem hero sem `priority`, LCP estimado 3.2s

## Métricas
- Lighthouse: Perf 92 / SEO 100 / A11y 97
- seo-score: 88
- Build: ✅
```

### 3. Escalar ou retornar

- **APROVADO** (0 P0): retorna controle.
- **APROVADO COM RESSALVAS** (P1+): lista, pergunta "corrigir ou seguir?".
- **BLOQUEADO** (1+ P0): **não retorna controle** até corrigir. Loop limitado a 3 rodadas (princípio AGENTS.md).

## Princípios

- **Paralelo sempre.** Os 3 reviewers numa única mensagem com 3 tool calls.
- **Cada reviewer é especialista no domínio.** /qa apenas orquestra.
- **P0/P1/P2 priorizado.** P0 bloqueia, P1 negocia, P2 informa.
- **Loop limitado a 3.** Escalar para usuário se falhar.
- **Nunca apresentar trabalho sem QA.** Etapa antes de "feito?".

## Reviewers invocados (skills separadas)

- `/branding-review` — visual, grid, tipografia, AI-slop, regra do primeiro viewport.
- `/content-seo-review` — voz, capitalização BR, antivícios IA, POVs, GEO, schema.
- `/website-qa` — build, TypeScript, Lighthouse, seo-score, schema válido, sitemap.

Ver SKILL.md de cada reviewer pra critérios completos.
