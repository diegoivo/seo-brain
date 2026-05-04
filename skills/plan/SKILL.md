---
name: plan
description: Execution plan generator — writes plans/<slug>-<date>.md before non-trivial tasks. Lists objective, success criteria (FE = visual user approval; BE = agent verifies via build/typecheck/test), checkboxed steps, risks. Last step always updates LLM Wiki. Use when user asks "create plan", "criar plano", "execution plan", "plano de execução", "plan before coding", "antes de implementar", or for changes to web/, package.json, dependencies, new page, new content, voice changes, architectural decisions. Auto-invoked when agent identifies non-trivial work.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
---

# /plan

Plano de execução em `plans/<slug>-<data>.md`. Pensa antes de fazer, registra para histórico, atualiza Brain ao final.

## Quando criar plano (não-trivial)

- Adicionar/mudar dependência (`package.json`).
- Mexer em `web/` substantivamente (nova página, novo componente compartilhado, mudar layout root).
- Mudar tecnologia, deploy, banco, integração externa.
- Mudar tom de voz, posicionamento, princípios da marca.
- Criar conteúdo (vira plano simples — uma única tarefa: escrever artigo X com brief Y).
- Migração de schema, refatoração transversal.
- Setup de serviço externo (Resend, Vercel, Neon).

## Quando NÃO criar plano (trivial)

- Typo, ajuste de copy de uma frase.
- Trocar valor de cor pontual (já dentro do DESIGN.tokens).
- Renomear variável local.
- Comentário, formatação, lint fix.
- Pergunta direta de quem-é-isso, onde-está-aquilo.

Em dúvida: se o usuário vai querer revisar antes de executar → plano. Se é "faça já que confio" → executa direto.

## Estrutura do plano

Arquivo em `plans/<slug>-<YYYY-MM-DD>.md`. Slug em kebab-case do que vai ser feito.

```markdown
---
title: <título curto>
created: 2026-05-03T12:00:00Z
status: draft | aprovado | em-execução | concluído | abandonado
type: web | content | tech | brand | other
---

# <Título>

## Objetivo

[1-2 frases: o que esta tarefa entrega e por quê]

## Critérios de sucesso

### Frontend (aprovação visual do usuário)
- [ ] <critério verificável só pelos olhos do usuário, ex: "hero passa a sensação de autoridade">
- [ ] <ex: "CTA primário está claro acima da dobra mobile">

### Backend / técnico (agente verifica sozinho)
- [ ] `npm run web:build` passa sem erros
- [ ] `npm run web:typecheck` passa
- [ ] `seo-score.mjs` ≥ 90 no profile auto-detectado
- [ ] Lighthouse Performance ≥ 95 (se tiver URL para auditar)
- [ ] Sem `<img>` direto, fontes via `next/font`

## Etapas

- [ ] 1. <etapa concreta>
- [ ] 2. <etapa concreta>
- [ ] ...
- [ ] N-1. Self-test (build + seo-score)
- [ ] **N. Atualizar Brain** (`config.md` se mudou estado operacional, `tecnologia/index.md` se mudou stack, `content/site/index.md` se nova página, etc.) — **ETAPA OBRIGATÓRIA**

## Riscos

- <risco 1 + mitigação>
- <risco 2 + mitigação>

## Decisões abertas

- <ponto que precisa ser confirmado pelo usuário antes de executar>

## Notas pós-execução

(preenchido após concluir — o que aprendi, o que mudaria)
```

## Pipeline da skill

1. Confira se a tarefa é trivial — se for, recuse o plano e execute direto explicando "isso é trivial, vou direto".
2. Crie `plans/` se não existe.
3. Gere o plano com slug do tipo `criar-pagina-sobre`, `add-dep-resend`, `migrar-payload`.
4. Apresente o plano ao usuário com 2-3 perguntas granulares (nunca "tá bom?"). Foque em decisões abertas.
5. Aguarde aprovação. Status passa para `aprovado`.
6. Execute as etapas em ordem, marcando checkboxes conforme avança.
7. Critérios FE: na entrega, apresente cada um pro usuário validar.
8. Critérios BE: rode você mesmo, marque ✅/❌, fixa antes de declarar pronto.
9. **Última etapa OBRIGATÓRIA:** atualize o Brain. Não pule.
10. Status final: `concluído`. Adicione "Notas pós-execução" curtas.

## Versionamento

`plans/` é versionado em git. Commitamos planos junto com a feature — vira histórico de decisões. Não use `.cache/` para isso.

## Princípio: critérios FE vs BE

- **FE** = "só o usuário sabe se está bom" → valida visualmente, ressoa com o tom, comunica o objetivo. Agente apresenta, usuário aprova.
- **BE** = "tem resposta objetiva" → build passa, types passam, score numérico atinge target. Agente roda, agente verifica.

Não misture. FE em prosa avaliativa, BE em comando + valor esperado.

## Princípio: feedback granular ao apresentar plano

Ao apresentar o plano para aprovação, **não pergunte** "tá bom?". Aponte 2-3 escolhas que você fez e que merecem validação:

> "3 decisões deste plano que queria validar:
> 1. Vou usar Resend (free tier 3k/mês). OK ou prefere alternativa?
> 2. O form vai ter campo 'tipo de interesse' (select) — útil ou enxuto demais?
> 3. Vou criar `app/api/contact/route.ts` (não Server Action) — afeta como você customiza depois. Concorda?"

## Quando o plano fica em `abandonado`

Se decidir não executar, atualize status para `abandonado` e adicione nota com motivo. Mantém histórico — útil para "por que não fizemos X meses atrás".
