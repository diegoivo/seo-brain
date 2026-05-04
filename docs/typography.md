---
title: Tipografia — sistema canônico
tags: [docs, typography, design-system]
created: 2026-05-03
updated: 2026-05-03
status: initialized
---

# Tipografia — sistema canônico do SEO Brain

> Tipografia é o ingrediente que mais distingue site sério de site genérico. Como o usuário não tem briefing de tipografia para cada projeto, o framework já vem com um sistema **opinativo, calibrado para leitura longa, anti-AI-slop**. Quando `/seo-brain:start` definir as fontes específicas, só os tokens de `font-family` mudam — escala, ritmo e regras permanecem.

## Decisões fechadas

### Escala — perfect fourth (ratio 1.333)

Modular scale a partir de `body = 1.125rem (18px)`:

| Token | Multiplicador | Tamanho | Uso |
|---|---|---|---|
| `--text-xs`  | 0.75   | 0.75rem (12px)   | eyebrows, microcopy |
| `--text-sm`  | 0.844  | 0.844rem (13.5px) | meta, badges |
| `--text-base`| 1      | 1rem (16px)      | reservado para componentes não-editoriais |
| `--text-md`  | 1.125  | 1.125rem (18px)  | **body default** |
| `--text-lg`  | 1.5    | 1.5rem (24px)    | h5 / lead paragraph |
| `--text-xl`  | 2      | 2rem (32px)      | h4 |
| `--text-2xl` | 2.667  | 2.667rem (~43px) | h3 |
| `--text-3xl` | 3.553  | 3.553rem (~57px) | h2 |
| `--text-4xl` | 4.736  | 4.736rem (~76px) | h1 |

**Por quê 1.333 (perfect fourth)?** Razão suficientemente grande para hierarquia clara, suficientemente pequena para conviver. 1.5+ vira tipografia de cartaz; 1.2- vira tipografia de dashboard. Perfect fourth é o ponto de equilíbrio para sites editoriais.

**Por quê body 1.125rem?** 18px é o sweet spot moderno para leitura em telas: legível em mobile sem zoom, confortável em desktop sem parecer infantil. 16px é herança de browser default — não obrigação.

### Line-height

| Contexto | Line-height | Por quê |
|---|---|---|
| Body / parágrafo | **1.7** | Texto longo precisa de respiro. 1.5 é o mínimo aceitável; 1.7 é leitura de revista. |
| Headings (h1, h2) | 1.05–1.1 | Headlines respiram pelo whitespace ao redor, não pela line-height. |
| Headings (h3, h4) | 1.2 | Médio termo. |
| UI dense (botões, badges) | 1 ou 1.2 | Sem flow vertical. |

### Max-width — 65ch

Parágrafos limitam-se a **65 caracteres por linha**. Por quê:

- < 45ch: leitura "saltada", olho retorna muito (fadiga).
- > 75ch: olho perde o início da próxima linha.
- 50–75ch é faixa ótima documentada (Bringhurst, Butterick). 65ch é o centro.

Aplicação: `max-width: 65ch` no `.prose` e em qualquer parágrafo de leitura. **Não** em UI, hero, ou cards.

### Anchor-down spacing

Headings ficam **mais próximos do conteúdo abaixo** do que do conteúdo acima — visualmente, o heading "ancora" o que ele introduz. Implementação:

```css
h2 { margin-block-start: 2em; margin-block-end: 0.5em; }
h3 { margin-block-start: 1.5em; margin-block-end: 0.4em; }
```

Razão > 3 entre top/bottom margin é o que faz o heading parecer "preso" no parágrafo seguinte. AI-slop comum: `margin: 1em 0` em headings (espaçamento simétrico), que faz o heading flutuar.

### `text-wrap: balance` / `pretty`

```css
h1, h2, h3, .balance { text-wrap: balance; }
p, li { text-wrap: pretty; }
```

- `balance` — distribui caracteres entre linhas (headings ficam "centrados" sem rios). Ideal até ~6 linhas; após isso, o browser fallback para `wrap`.
- `pretty` — evita órfãs (última palavra do parágrafo numa linha sozinha) e melhora hifenização. Mais leve que `balance` — pode aplicar em todo body.

Suporte (2026): `pretty` em Chrome 117+, Safari 17.4+, Firefox 121+. Cobertura > 92%. Sem fallback necessário (degrada para wrap normal).

### Letter-spacing

Headings grandes (≥ 2rem) ganham `letter-spacing: -0.02em` (-0.025em em h1) — fontes display ganham densidade visual quando levemente comprimidas em tamanhos grandes.

Body **nunca** ganha letter-spacing alterado. Eyebrows / labels uppercase ganham `0.1em` — tracking faz uppercase parecer menos "gritando".

### Hyphenation

```css
.prose p { hyphens: auto; -webkit-hyphens: auto; }
```

Em PT-BR, hyphens auto funciona em Chrome/Edge/Safari. Em Firefox depende do `lang="pt-BR"` no `<html>` (já existe).

## Antipadrões

1. **Body em 16px** sem justificativa. Default do browser não é regra.
2. **Headings com margin simétrico**. Não criam ancoragem visual.
3. **Line-height 1.5 em parágrafo longo**. Cansa a vista em > 80 linhas.
4. **Max-width 100% em parágrafo**. Linhas de 120ch são um problema de leitura.
5. **Letter-spacing em body**. Não há melhoria de leitura — só "estilo".
6. **Caps em headings inteiros**. `Como Otimizar SEO` é antivício específico (ver brain/tom-de-voz.md). Capitalização brasileira: só primeira letra + nomes próprios.

## Aplicação no SEO Brain

Tokens vivem em `web/src/app/globals.css`. As fontes (`--font-display`, `--font-body`, `--font-mono`) são preenchidas pelo `/branding discover` — escala e ritmo são herdados sem mudança.

Pré-onboard, o site usa system fonts (não AI-slop, não dependente de Google Fonts). Pós-onboard, `/branding discover` escolhe da whitelist em `/website-bestpractices` (Google Fonts / Bunny Fonts / OFL — todas gratuitas).
