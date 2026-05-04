---
name: wiki
description: LLM Wiki (brain/) management — initialization, update, and lint of the project knowledge base. Init populates brain/ with identity, positioning, personas, proprietary POVs, voice, scope, deploy config (phase 1 of project onboarding). Update writes learnings/decisions after task approval (triggered by /approved). Lint validates required frontmatter, index files, freshness (>30 days warning), POVs declared, voice canonical. Use when user asks "init brain", "popular o brain", "populate wiki", "knowledge base init", "rodar fase brain", "refazer brain", "update brain", "atualizar wiki", "documentar mudanças", "save learnings", "lint brain", "validate wiki", "validar brain", "brain check", "drift detection", or after /approved. Renamed from /wiki-init + /wiki-update + /wiki-lint (consolidated v0.1.5).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - WebSearch
  - WebFetch
---

# /wiki — gestão do LLM Wiki (brain/)

Suite única para popular, atualizar e validar o **Brain** (Karpathy LLM Wiki) do projeto.

## Quando usar

- "init brain", "popular o brain", "rodar fase brain", "refazer brain" → init
- "/approved", "update brain", "atualizar wiki", "documentar mudanças" → update
- "lint brain", "validar brain", "brain check", "drift detection" → lint

## Decision tree

```
1. Qual operação?
   ├── inicializar brain do zero (fase 1 onboarding) → playbooks/init.md
   ├── atualizar após tarefa concluída (/approved)   → playbooks/update.md
   └── validar integridade (CI ou pré-PR)            → playbooks/lint.md
```

## Playbooks

- `playbooks/init.md` — fase 1 do onboarding. 6 sub-fases (identidade, personas, POVs, voz, glossário, tecnologia) com auto-commit. Modos: auto / express (default) / guiado. Aceita inputs do orquestrador `/seo-brain:start` ou roda standalone.
- `playbooks/update.md` — disparado pelo `/approved`. Atualiza `brain/index.md`, `brain/config.md`, `brain/tecnologia/`, `brain/glossario/`, `brain/backlog.md` conforme o diff da tarefa concluída. Identifica padrões repetíveis e sugere conversão em skill.
- `playbooks/lint.md` — roda `node scripts/wiki-lint.mjs`. Erros (frontmatter ausente, ≥3 POVs, arquivos core ausentes) e warnings (>30 dias, DESIGN.md ausente).

## Princípios

- **POVs proprietários bloqueiam.** Sem 3 POVs proprietários (não-consenso), o `init` pausa.
- **Datas absolutas (ISO 8601).** Sem "ontem", "semana passada".
- **Não duplique.** Estado vivo (URLs, IDs) → `config.md`. Decisões e por-quês → `tecnologia/index.md`.
- **Atualize, não acumule.** Decisão superada vai pra histórico, não fica concorrendo.
- **Antivícios IA banidos.** Lint regex contra "vale destacar", "no cenário atual", "delve", "crucial", "robust", "tapestry" etc.
