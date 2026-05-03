---
title: Sistema de grid — filosofia canônica
tags: [docs, grid, design-system, layout]
created: 2026-05-03
updated: 2026-05-03
status: initialized
---

# Sistema de grid — filosofia canônica do SEO Brain

> Todo site gerado pelo SEO Brain herda este sistema. É **opinativo por construção**: você não escolhe entre flexbox ad-hoc, grid customizado, ou framework de UI. Você usa o grid canônico — e quando precisar fugir dele, justifica.

## Por quê grid canônico

Sites de marca (não dashboards) sofrem três doenças:

1. **Layout AI-slop** — cada seção um espaçamento diferente, alinhamento por sorte.
2. **Mobile improvisado** — desktop pensado primeiro, mobile como afterthought.
3. **Componentes desalinhados** — card grid + sidebar + hero, cada um num grid próprio, nada bate.

A cura: **um único grid global, com spacing scale canônica e subgrid herdando alinhamento**. Decisões já tomadas. Aplicação trivial.

## Stack escolhida

### CSS Grid 12 colunas + Subgrid + Container Queries

**Por quê não Tailwind grid utilities?** Porque grid utility (`grid-cols-12`) resolve o pai, mas **não comunica com os filhos**. Subgrid herda colunas e linhas do grid pai — alinhamento gratuito, sem cálculo manual.

**Por quê não CSS-in-JS / styled-components?** Tailwind v4 + custom CSS é mais rápido, server-component-friendly, e elimina runtime overhead. Grid é estrutural, não estilo.

**Por quê não Bootstrap / Bulma?** Frameworks de grid baseados em float ou flexbox (Bootstrap 4) ou que não suportam subgrid (Bulma) fazem tudo o que CSS Grid nativo faz, com mais peso e menos poder.

### Suporte navegador (2026)

| Feature | Safari | Chrome | Firefox | Edge |
|---|---|---|---|---|
| CSS Grid | 10.1+ | 57+ | 52+ | 16+ |
| Subgrid | 16+ | 117+ | 71+ | 117+ |
| Container Queries | 16+ | 105+ | 110+ | 105+ |

Cobertura global > 95% (caniuse, fev/2026). Sem polyfill. Sem fallback.

## Anatomia do grid

### Colunas: 12 (responsivo escalonado)

```
mobile  (< 768px):   4 colunas  | gap 16px  | margin 24px
tablet  (≥ 768px):   8 colunas  | gap 24px  | margin 40px
desktop (≥ 1280px): 12 colunas  | gap 32px  | max-width 1200px
```

12 não é arbitrário: é divisível por 1, 2, 3, 4, 6, 12 — qualquer fração comum cabe.

### Spacing scale: 4-base

```
4   8   12   16   24   32   48   64   96   128  (px)
```

**Por quê 4-base e não 8-base?** 8-base força saltos grandes (8 → 16 → 24 → 32). 4-base permite micro-ajustes (12, 20) que humanizam densidade tipográfica. Saltos pequenos no início, exponenciais depois — ritmo natural.

**Tokens CSS:**

```css
--space-1:  0.25rem;  /*   4px */
--space-2:  0.5rem;   /*   8px */
--space-3:  0.75rem;  /*  12px */
--space-4:  1rem;     /*  16px */
--space-6:  1.5rem;   /*  24px */
--space-8:  2rem;     /*  32px */
--space-12: 3rem;     /*  48px */
--space-16: 4rem;     /*  64px */
--space-24: 6rem;     /*  96px */
--space-32: 8rem;     /* 128px */
```

### Container queries: componente, não viewport

Card que vira coluna em sidebar estreita, mas mantém grid em main wide:

```css
.card-list {
  container-type: inline-size;
}

@container (min-width: 480px) {
  .card-list { grid-template-columns: repeat(2, 1fr); }
}
```

Resolve o "componente reutilizado em contextos diferentes" sem viewport queries duplicadas.

## Componentes canônicos

### `<GridContainer>`

Wrapper que estabelece o grid 12-col. Todo `<section>` que precisa alinhar com o grid global usa este wrapper.

```tsx
<GridContainer>
  <GridCol span={6} spanMd={8} spanLg={12}>
    <h2>Título</h2>
  </GridCol>
</GridContainer>
```

### `<GridCol span={N}>`

Filho do container. `span` é a contagem de colunas no breakpoint base; `spanMd` e `spanLg` sobrescrevem. Default: full width.

### Subgrid (avançado)

Para alinhar conteúdo de cards com o grid pai:

```tsx
<GridContainer>
  <GridCol span={6} className="subgrid">
    {/* este card herda as 6 colunas do pai como subgrid próprio */}
  </GridCol>
</GridContainer>
```

## Quando NÃO usar o grid

Não force grid em tudo. Casos legítimos para flex ou block:

- **Listas inline curtas** (tags, breadcrumbs) — flex.
- **Stack vertical sem alinhamento horizontal** — block.
- **Componentes auto-contidos sem relação com o resto** (badge, pill) — block ou flex.

Grid é para **estrutura de página**. Não decoração.

## Antipadrões

1. **`max-width` arbitrário** — usa `--container-max` (1200px) ou justifique.
2. **Padding que não é múltiplo de 4** — quebra o ritmo.
3. **Grid dentro de grid sem subgrid** — desalinha. Use subgrid ou refatore para um único grid plano.
4. **Breakpoints inventados** — só os 3 canônicos (768, 1280). Mais que isso é cosmético.

## Referências

- [CSS Grid Subgrid (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- [Container Queries (web.dev)](https://web.dev/articles/cq-stable)
- [Material Design 3 — spacing 4-base](https://m3.material.io/foundations/layout/understanding-layout/spacing)
