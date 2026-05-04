---
name: qa
description: QA orchestrator — runs domain reviewers in parallel before presenting work or shipping. Invokes editorial review (voice + capitalization + GEO + POVs via /content-seo review playbook) and technical review (build + lighthouse + seo-score + a11y + schema via /website qa playbook). When branding skill becomes available again, will also invoke its review playbook. Consolidates priority-ranked report (P0/P1/P2). Use when user asks "qa", "validate before deploy", "validation", "revisão final", "antes de aprovar", "before PR", "QA all".
allowed-tools:
  - Read
  - Bash
  - Task
---

# /qa — orchestrator paralelo de QA

Skill **fina** que dispara reviewers de domínio em paralelo via `Task` tool. Cada reviewer é um playbook dentro de uma skill consolidada.

**Diretiva inegociável:** os sub-agents rodam **em paralelo**, nunca sequencial.

## Quando rodar

- Antes de "está pronto, pode aprovar?"
- Antes de criar PR (`/ship`).
- Antes de deploy.
- Quando o usuário pedir "qa", "validation", "revisão final".

## Pipeline

### 1. Disparar sub-agents em paralelo

Numa **única mensagem** com tool calls Agent simultâneos:

```
Agent(general-purpose):  carregar skills/content-seo/playbooks/review.md, validar copy
Agent(general-purpose):  carregar skills/website/playbooks/qa.md, validar (build+lighthouse+seo-score)
```

Quando o pacote de branding for reintegrado em outra branch, adicionar:

```
Agent(general-purpose):  carregar skills/branding/playbooks/review.md, validar visual
```

Cada um produz `.cache/qa-runs/<task>-<role>.md`.

### 2. Consolidar

Agente lê os reports. Produz consolidated em `.cache/qa-runs/<task>.md`:

```markdown
# QA — <task>

## Veredicto: APROVADO / BLOQUEADO / APROVADO COM RESSALVAS

## Bloqueios (P0)
- [website-qa]  Build falha em /sobre — TS error linha 23
- [content-review] Headline em CAPS LOCK ("COMO OTIMIZAR")

## Atenção (P1)
- [website-qa] Schema FAQPage ausente em /blog/post-x

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
- **BLOQUEADO** (1+ P0): **não retorna controle** até corrigir. Loop limitado a 3 rodadas.

## Princípios

- **Paralelo sempre.** Reviewers numa única mensagem com múltiplos tool calls.
- **Cada reviewer é especialista no domínio.** /qa apenas orquestra.
- **P0/P1/P2 priorizado.** P0 bloqueia, P1 negocia, P2 informa.
- **Loop limitado a 3.** Escalar para usuário se falhar.
- **Nunca apresentar trabalho sem QA.** Etapa antes de "feito?".

## Reviewers invocados (playbooks)

- `skills/content-seo/playbooks/review.md` — voz, capitalização BR, antivícios IA, POVs, GEO, schema.
- `skills/website/playbooks/qa.md` — build, TypeScript, Lighthouse, seo-score, schema válido, sitemap.
- `skills/branding/playbooks/review.md` — visual, grid, AI-slop (a ser reintegrado em outra branch).

Ver SKILL.md / playbook de cada um pra critérios completos.
