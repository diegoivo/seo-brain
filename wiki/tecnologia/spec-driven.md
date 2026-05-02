---
title: Spec-driven — protocolo para tarefas técnicas
tags: [tecnologia, processo, fonte-de-verdade]
updated: 2026-05-02
---

# Spec-driven — protocolo SPEC → TESTS → EXECUTE → QA

> **Iron law**: nenhuma mudança em código sem (1) spec escrita, (2) test escrito,
> (3) test rodado em RED, (4) QA sub-agent reportando GREEN.

Este protocolo se aplica a **toda** skill que toca código: `scaffold-ssg`,
`scaffold-payload`, `publicar`, `onboarding` (parte técnica). Skills puramente
editoriais (`conteudo`, `wiki`) ficam fora.

## Fase 1 — SPEC

Escreve `docs/specs/<task>.md` com o template:

```markdown
# Spec: <slug-da-task>

## Objetivo
<1 frase declarativa>

## Critérios de aceitação (cada um vira 1 teste no browser)

- [ ] **AC-1**: <descrição testável, ex: "home renderiza H1 com texto contendo o nome da marca">
- [ ] **AC-2**: ...
- [ ] **AC-3**: ...

## Anti-objetivos
<O que esta task NÃO vai mudar — para evitar scope creep>

## Risco / rollback
<Como reverter se quebrar>
```

**Regra**: cada AC precisa ser testável em browser. Se você não consegue
escrever um teste Playwright que valida, refaça o AC.

## Fase 2 — TESTS

Para cada AC, escreve um teste em `tests/<task>.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("<task>", () => {
  test("AC-1: home renderiza H1 com nome da marca", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("AC-2: ...", async ({ page }) => { /* ... */ });
});
```

Roda **antes** de implementar (RED — devem falhar):

```bash
npm run test:browser -- tests/<task>.spec.ts
```

Se algum AC passa antes da implementação, o AC está mal escrito ou redundante.
Refaça.

## Fase 3 — EXECUTE (workers paralelos)

Implementa via `Agent` tool, **um worker por arquivo/módulo independente**.

```
Worker A: edita lib/site-config.ts
Worker B: edita app/page.tsx
Worker C: edita components/site-header.tsx
```

Workers rodam em **paralelo** (uma única mensagem com múltiplos `Agent` tool
calls). Sem polling. Sem coordenação cruzada. A skill principal espera todos
retornarem antes de prosseguir.

**Constraints aos workers**:
- Cada worker recebe path absoluto + diff esperado em texto.
- Worker não toca nada fora do seu arquivo.
- Worker reporta diff aplicado em ≤200 palavras.

Após os workers retornarem, roda os tests novamente (devem passar — GREEN):

```bash
npm run test:browser -- tests/<task>.spec.ts
```

## Fase 4 — QA (sub-agent independente)

Invoca `Agent` tool com prompt que **não foi escrito pelo agent que implementou**:

```
Você é o QA sub-agent. Sua tarefa: validar que docs/specs/<task>.md foi
implementado conforme spec.

Faça nesta ordem:
1. Leia docs/specs/<task>.md
2. Rode tests/<task>.spec.ts via npm run test:browser
3. Para cada AC, reporte:
   - status (passou / falhou / não testado)
   - evidência (output do teste, screenshot path)
4. Compare a implementação (git diff vs main) com a spec
5. Reporte divergências (mudanças que não estão cobertas pela spec)

NÃO modifique código. Só reporte. Use formato:

```
QA REPORT — <task>

ACs:
- [✅] AC-1 — <evidência>
- [❌] AC-2 — <motivo>

Divergências detectadas:
- <mudança em arquivo X que não está em nenhum AC>

Veredito: APROVADO | REPROVADO
```
```

Se REPROVADO, a skill original volta para Fase 3 e corrige. Não é o QA quem
corrige.

## Antipatterns

- ❌ Implementar antes de escrever spec.
- ❌ Spec sem AC verificável em browser.
- ❌ Skip de RED — "vou rodar só no final".
- ❌ Workers que tocam o mesmo arquivo (race condition).
- ❌ QA escrito pelo mesmo agent que implementou (perde independência).
- ❌ Modificar código durante QA (perde rastreabilidade).

## Onde isso fica documentado

Toda skill técnica referencia este arquivo no topo da SKILL.md:

```
> Esta skill segue o protocolo spec-driven em
> [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md).
```

Se você está editando uma skill técnica e o protocolo não se aplica (raro),
documente o motivo na própria SKILL.md.
