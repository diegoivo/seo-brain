---
name: agent-browser
description: Wrapper para o gstack/browse daemon — headless browser para QA spec-driven do site. Triggers em "/browser", "qa visual", "valida no browser", "abre o site". Usado pelas skills técnicas para validar specs no browser real (ver wiki/tecnologia/spec-driven.md).
---

# agent-browser — wrapper do daemon gstack/browse

> Esta skill **não duplica** o gstack daemon. Ela é um wrapper de invocação
> que delega para o daemon `browse` global do host quando disponível, com
> fallback para Playwright local.

## Pré-condições

Pelo menos uma das ferramentas abaixo precisa estar instalada:

1. **gstack daemon** (preferido) — instalado globalmente via `npm i -g gstack`.
   Detectar com `which browse` ou `which gstack`.
2. **Playwright local** — instalado no projeto via `npm i -D @playwright/test`
   + `npx playwright install chromium`.

Se nenhum disponível, **pare** e instrua o usuário:

> "Para usar a skill agent-browser, instale uma destas opções:
>
> 1. gstack global (recomendado): `npm i -g gstack` — daemon compartilhado, mais rápido.
> 2. Playwright local: `npm i -D @playwright/test && npx playwright install chromium` — autocontido no projeto.
>
> Depois, rode novamente."

## Comandos disponíveis

| Verbo | O quê faz |
|---|---|
| `navigate <url>` | Abre URL e captura screenshot. |
| `assert <selector> <expected>` | Verifica conteúdo/estado de elemento. |
| `screenshot <path>` | Salva screenshot em path relativo (default `tests/__screenshots__/`). |
| `lighthouse <url>` | Roda Lighthouse local e retorna JSON com scores. |
| `diff <before> <after>` | Diff visual entre dois screenshots. |
| `run-spec <test-file>` | Roda Playwright spec específico. |

## Modo gstack (preferido)

Se `gstack` ou `browse` estão no PATH:

```bash
# Navegação simples
browse navigate http://localhost:3000

# Validação spec-driven
browse assert "h1" "SEO Agêntico"

# Lighthouse
browse lighthouse http://localhost:3000 --output=json
```

A skill `gstack` global tem documentação completa. Esta skill apenas roteia
chamadas do kit para o daemon.

## Modo Playwright local (fallback)

Se gstack não disponível, gere/use specs em `tests/`:

```ts
// tests/exemplo.spec.ts
import { test, expect } from "@playwright/test";

test("home renderiza hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText(/SEO/i);
});
```

Rodar:

```bash
npm run test:browser     # alias para `npx playwright test`
npm run test:browser:ui  # alias para `npx playwright test --ui`
```

## Uso pelas skills técnicas (spec-driven)

Skills `scaffold-ssg`, `scaffold-payload`, `publicar`, `onboarding` (na parte
técnica) seguem o protocolo em [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md):

1. Escrevem `docs/specs/<task>.md` com critérios verificáveis.
2. Geram `tests/<task>.spec.ts` — 1 teste por critério.
3. Rodam tests **antes** (devem falhar — RED).
4. Implementam.
5. Rodam tests **depois** (devem passar — GREEN).
6. QA sub-agent independente revisa.

Esta skill é a ferramenta dos passos 3 e 5.

## QA sub-agent independente

Quando uma skill técnica termina implementação, ela invoca `Agent` tool com
prompt:

```
Você é o QA sub-agent. Sua tarefa: rodar os specs em tests/<task>.spec.ts via
agent-browser e comparar com docs/specs/<task>.md. Reporte:
- Critérios atendidos
- Critérios falhados
- Divergências entre spec e implementação

Não corrija nada. Só reporte.
```

O sub-agent **não modifica código** — só valida e reporta. Quem corrige é a
skill original que escreveu o código.

## Não modifique

- Não escreva fora de `tests/`, `docs/specs/`, `tests/__screenshots__/`.
- Não exponha credenciais em screenshots — use mocks.
- Não tente rodar gstack daemon e Playwright ao mesmo tempo.
