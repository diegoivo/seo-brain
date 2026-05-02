# Design System: agentic-seo-kit (default — Editorial Bege)

> Este é o DESIGN.md **default** que vem com o kit. Rode `/design <vibe>` para regenerá-lo
> com base no seu projeto. A skill `design-taste` reescreve este arquivo + `DESIGN.tokens.json`.

## 1. Visual Theme & Atmosphere

Editorial impresso encontra construção minimalista. Bege quente como papel de
revista de longa data, ink tingido como tinta de imprensa antiga, accent
terracotta saturado para anchors visuais (CTAs, links). A tensão da marca é
**autoridade × calor humano**: tipografia serif moderna no display sustenta
gravitas, sans-serif geométrica no corpo entrega legibilidade densa. Energia é
contemplativa, não inquieta — espaços generosos, hierarquia clara, zero ruído
decorativo.

Materialidade: papel não-branco, tinta não-preta, sem brilho, sem gradiente.

## 2. Color Palette & Roles

- **Background warm `#F8F5EF`** — superfície primária de papel; nunca `#FFFFFF` puro.
- **Texto ink `#1A1A18`** — neutro tingido; nunca `#000000` puro.
- **Accent terracotta `#A6391A`** — CTAs, links, highlights tipográficos. Nunca para body text.
- **Border `#E5DFD3`** — divisores, contornos sutis (1px solid).
- **Muted `#EDE8DD`** — backgrounds de cards/seções secundárias.
- **Muted-foreground `#5C5852`** — captions, metadata (data, autor, tempo de leitura).

Contraste mínimo verificado: foreground sobre background = 14.5:1 (AAA).

## 3. Typography Rules

- **Display (hero, H1, H2)**: Fraunces, peso 600-700, tracking -0.02em, line-height 1.05–1.15.
- **Body (parágrafos, UI)**: Inter Tight, peso 400-500, line-height 1.6–1.75.
- **Mono (código)**: Geist Mono, peso 400.
- **Escala fluida** com `clamp()`:
  - hero: `clamp(2.5rem, 5vw + 1rem, 4.5rem)`
  - h2: `clamp(1.75rem, 3vw + 0.5rem, 2.5rem)`
  - body: `1rem` (16px) mobile, `1.125rem` (18px) desktop
- **Banido**: Inter (sem Tight), Roboto, Arial, system-ui como display.

## 4. Component Stylings

- **Border-radius**: `0.5rem` (md) padrão. Nunca >12px (não-bubbly).
- **Sombras**: nenhuma. Substitui por `border 1px solid` cor `border`.
- **Hover states**: links → underline accent; cards → border ligeiramente mais escura.
- **Cards**: 1px border, padding 32–48px, **alturas variando entre cards** (sem grid uniforme).
- **CTAs**: link de texto com seta unicode `→` por padrão. Botão sólido só para CTA primária do hero.
- **Anti-patterns proibidos**: ícones em círculos coloridos, border-left colorido, drop-shadow
  grande, gradient backgrounds, wavy SVG dividers, decorative blobs.

## 5. Layout Principles

- **Hierarquia tipográfica** clara — escala ≥1.25 entre níveis.
- **Whitespace generoso** — ≥80px vertical entre seções principais.
- **Um anchor visual** forte por viewport (não três).
- **Container max-width**: 1200px.
- **Coluna editorial** (manifesto, posts): max-width 640px.
- **Touch targets**: ≥44px em mobile.
- **Alinhamento padrão**: à esquerda (não `text-align: center` como default).
