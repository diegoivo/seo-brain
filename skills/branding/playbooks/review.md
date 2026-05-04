# Playbook: `/branding review`

Sub-agente QA visual — chamado pelo `/qa` em paralelo com outros revisores antes de PR. Lê DESIGN.md + globals.css + componentes alterados, compara contra `references/audit-checklist.md`.

Não toca em copy nem build. Apenas reporta — correção é decisão do orquestrador-pai.

## Quando rodar

- **Automaticamente** pelo `/qa` antes de cada PR (em paralelo com `/content-seo-review` e `/website-qa`).
- **Manualmente** quando usuário pedir "validar design", "brand review", "design QA", "design audit", "revisão visual", "validar design system", "AI-slop check".

## Inputs

- Diff dos arquivos modificados (via `git diff --name-only`).
- `web/src/app/**/*.tsx` (rotas afetadas).
- `web/src/app/globals.css`.
- `brain/DESIGN.md` + `brain/DESIGN.tokens.json`.
- `references/audit-checklist.md` (carregada sob demanda).
- `docs/grid-system.md` + `docs/typography.md` (canônicos do framework).

## Processo

### 1. Identifica arquivos alterados

```bash
git diff --name-only origin/main...HEAD -- 'web/**/*.tsx' 'web/**/*.css'
```

### 2. Para cada arquivo, varre antipadrões

Use `Grep` contra a lista do `audit-checklist.md`:

#### P0 (bloqueante)

- **A1.4** Hex hardcoded em `.tsx`:
  ```bash
  grep -nE '#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b' web/src/app/**/*.tsx
  ```
- **A2.1** Inter sem justificativa (heurística: `font-inter` + ausência de comentário justificando).
- **A2.6** `.prose` sem `max-width`.
- **A4.1** Hero não cabe em 100dvh mobile (regra do primeiro viewport — verifique mentalmente).
- **B1.1** Skip link como primeiro filho de `<body>`.
- **B1.2** `<header>`/`<main>`/`<nav>` semânticos (não `<div>` com classe).
- **B2.1** `:focus-visible` outline em interativos.
- **B3.1** Contraste WCAG AA texto normal ≥ 4.5:1.
- **B4.1** `prefers-reduced-motion: reduce` desativa animations.
- **C1.1** `<meta name="color-scheme">`.
- **C2.1** Nada hardcoded — todos os tokens via CSS vars.
- **C3.1** `font-display: swap`.
- **C3.2** Apenas fontes grátis (cf. A2.2).

#### P1 (atenção)

- **A1.1** Gradiente purple→blue:
  ```bash
  grep -nE 'from-purple-[0-9]+ to-blue-[0-9]+|from-blue-[0-9]+ to-purple-[0-9]+|from-cyan-[0-9]+ to-purple-[0-9]+' web/src/app/**/*.tsx
  ```
- **A1.2** Paleta exclusivamente slate/zinc/gray sem accent.
- **A2.3** Headings ≥ 2rem com tracking 0 (sem tight).
- **A2.4** `text-wrap: balance` em headings, `pretty` em body — ausência.
- **A2.5** Body com line-height < 1.5.
- **A4.2** Headline mobile com `text-[15vw]+` ou `font-size: 7rem+`.
- **A4.3** Hero mobile com 4+ blocos verticais.
- **A4.4** Border-radius 8px universal (todos elementos).
- **A4.5** Spacing fora de scale 4-base (`p-7`, `gap-5`).
- **A5.1** Cards brancos com `shadow-md` em `bg-gray-50`.
- **A5.2** `shadow-md`/`shadow-lg` direto sem custom var:
  ```bash
  grep -nE '\bshadow-(sm|md|lg|xl|2xl)\b' web/src/app/**/*.tsx
  ```
- **B2.3** Foco visível com contraste < 3:1.
- **B3.3** Bordas de input com contraste < 3:1.

#### P2 (polimento)

- **A2.7** `font-variant-numeric: tabular-nums` ausente em conteúdo numérico.
- **A2.8** Eyebrow sem letter-spacing 0.08–0.12em uppercase.
- **A4.6** Grid não-canônico em página principal (flex ad-hoc onde 12-col cabe).
- **A5.3** Botões sem cobrir 5 estados (default/hover/focus/active/disabled).
- **C2.3** Preconnect Google/Bunny Fonts ausente.

### 3. Compara com Brain

- Tokens usados batem com `brain/DESIGN.tokens.json`?
- Hex hardcoded sinaliza divergência (P0 A1.4).
- Fontes citadas no código batem com `font` em tokens.json?

### 4. Verificação mental do hero

Se há `web/src/app/page.tsx` ou rota com `hero`:

- Conta blocos verticais no `<header>` ou hero section.
- Estima altura em mobile (375×812):
  - Header (8% = ~65px).
  - Eyebrow + headline + sub (50% = ~406px).
  - Mídia (30% = ~244px).
  - CTAs (12% = ~97px).
- Se total > 100dvh → P0 A4.1.

## Output

`.cache/qa-runs/<task>-design.md`:

```markdown
# QA design — <task>

Gerado em <data>. Por: /branding review.

## P0 (bloqueio)
- [arquivo:linha] (A1.4) Hex hardcoded `#1649FF` em vez de `var(--accent)`.
- [arquivo:linha] (A4.1) Hero estoura primeira dobra em 375×812 (estimado 920px > 812px).

## P1 (atenção)
- [arquivo:linha] (A5.2) `shadow-md` direto. Trocar por `var(--shadow-elevation-1)`.
- [arquivo:linha] (A1.1) Gradiente `from-purple-500 to-blue-500` detectado.

## P2 (polimento)
- [arquivo:linha] (A2.7) Métricas sem `font-variant-numeric: tabular-nums`.

## Veredicto
APROVADO / APROVADO COM RESSALVAS / BLOQUEADO

## Métricas observadas
- Hero mobile: cabe / não cabe em 100dvh
- Grid canônico: usado / não usado / parcial
- AI-slop ocorrências: N (gradient: 1, shadow-md: 2, slate-only: 0)
- Contraste WCAG: PASS / FAIL count
- Fontes: grátis / paga detectada — qual
```

## Veredicto

- **Qualquer P0** → **BLOQUEADO**.
- **Zero P0, ≥1 P1** → **APROVADO COM RESSALVAS**.
- **Zero P0, zero P1** → **APROVADO**.

## Princípios

- **Curto.** Relatório lê em 1 minuto. Sem prosa.
- **Linha-citável.** `[file:line]` para cada item — orquestrador navega direto.
- **ID citável.** `(A1.1)` cita check do `audit-checklist.md`.
- **P0 trava.** Veredicto BLOQUEADO se algum P0.
- **Não corrige.** Reporta. Correção é decisão do orquestrador-pai.

## Sub-agente independente (chamado pelo /qa)

Para uso pelo `/qa` orquestrador, espera ser invocado via `Task` tool com prompt:

> Carregue `skills/branding/playbooks/review.md` e `skills/branding/references/audit-checklist.md`. Rode os checks contra os arquivos modificados em `git diff --name-only origin/main...HEAD`. Produza `.cache/qa-runs/<task>-design.md` no formato documentado. Devolva veredicto.

## Conclusão

Não atualiza Brain. Não muda código. Apenas reporta no caminho `.cache/qa-runs/<task>-design.md` e devolve veredicto ao chamador.
