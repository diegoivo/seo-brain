# Brandbook Format — estrutura do `brandbook.md` e `brandbook.html`

Especificação dos 3 artefatos gerados por `playbooks/export.md`:

- `brand/<slug>/brandbook.md` — fonte secundária (gerada do Brain), formato exportável.
- `brand/<slug>/brandbook.html` — versão visual em slides.
- `brand/<slug>/brandbook.pdf` — A4 landscape derivado do HTML (opt-in).

> **Lembrete**: a fonte primária é `brain/DESIGN.md` (PT-BR). O `brandbook.md` é uma reformatação visual amigável a apresentação, não uma duplicação editável.

## Estrutura de `brandbook.md`

YAML frontmatter + 7 sections em prosa.

### Frontmatter

```yaml
---
brand: nome-da-marca
slug: nome-da-marca
version: 1.0.0
generated_at: 2026-05-04
language: pt-BR

archetype: Sábio
positioning:
  premium: 0.7
  technical: 0.6
  bold: 0.4
  serious: 0.7

identity_element: "_"   # opcional — caractere distintivo do nome
logo:
  type: imagotipo        # imagotipo | symbol-only | wordmark | monogram
  primary_lockup: horizontal

colors:
  bg: "#FAFAF7"
  fg: "#181712"
  accent: "#B0001A"
  # ... outros tokens

typography:
  display: Fraunces
  body: Inter Tight
  mono: JetBrains Mono
  scale: 1.250

spacing_base: 4
radius:
  sm: 2
  md: 6
  lg: 12
  pill: 9999
---
```

### Body — 7 sections

#### 1. Arquétipo de marca

Narrativa em 2–3 parágrafos: arquétipo escolhido, traços, voz, estilo de comunicação. Liga a Q2 + Q3 do `discover`.

#### 2. Logo & Imagotipo

- Construção (proporções, malha de construção em prosa).
- Variantes: on-light, on-dark, on-brand (sobre accent), monocromática.
- Clear space (em múltiplos da altura da letra).
- Tamanhos mínimos.
- Do / Don't visual.

#### 3. Paleta

Para cada token: nome evocativo + hex em parênteses + papel funcional + exemplo de uso real (1 frase).

```markdown
- **`accent` — Vermelho Sangue Tipográfico (#B0001A)** — CTAs primários, links em prosa, estado de foco.
  Aplique em ≥ 1 elemento por dobra. Nunca como bg de container grande.
```

#### 4. Tipografia

- Specimens das 3+ famílias.
- Type scale com tabela tamanho × uso × exemplo.
- Regras: tracking, line-height, measure.
- Hierarquia (h1 → h6 + body + small + caption).

#### 5. Componentes

Para cada componente principal (botão, card, input, badge, nav):

- Forma em prosa (pílula, suave, square).
- Estados (default, hover, focus, active, disabled, busy).
- Variantes (primary, secondary, ghost).
- Em light + dark mode.

#### 6. Antipadrões — banidos neste projeto

Lista da Q10 do `discover` + antipadrões automáticos do framework (gradiente purple→blue, shadow-md, slate sem accent, hero estoura primeiro viewport).

Cada item com **rationale curto**: por que é banido.

#### 7. For AI Assistants

Bloco específico para futuros agentes (Claude, Copilot) lerem antes de gerar UI:

````markdown
## For AI Assistants

CSS custom properties:

```css
:root {
  --bg: #FAFAF7;
  --fg: #181712;
  --accent: #B0001A;
  /* … */
}
```

Tailwind mappings:

```js
{ "bg": "var(--bg)", "fg": "var(--fg)", "accent": "var(--accent)" }
```

Font loading (next/font):

```ts
import { Fraunces, Inter_Tight } from "next/font/google";
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
export const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-body" });
```

Dark mode pattern: `@media (prefers-color-scheme: dark)`.

DO NOT:
- Adicione `bg-gradient-to-r from-purple-500 to-blue-500`.
- Use `shadow-md` direto do Tailwind.
- Mude scale tipográfica (canônico: 1.250).
````

## Estrutura de `brandbook.html`

Standalone — todo CSS inline ou em `<style>` no head. Únicas externals: Google/Bunny Fonts via `<link>`.

### Slide structure (cada `<section>` = 1 slide A4 landscape)

| # | Section | Conteúdo |
|---|---|---|
| 1 | `.slide.cover` | Brand name + tagline + data + versão |
| 2 | `.slide.archetype` | Arquétipo + traços + voice tone |
| 3 | `.slide.logo` | Imagotipo primário + ícone alone + wordmark |
| 4 | `.slide.logo-rules` | Do / Don't visual |
| 5 | `.slide.favicon` | Ícone em 16/32/180/512 + browser tab mockup |
| 6 | `.slide.palette-core` | bg/fg/accent + accents secundários |
| 7 | `.slide.palette-system` | Surfaces + text scales + semantics |
| 8 | `.slide.type-families` | Specimens das 3+ famílias |
| 9 | `.slide.type-scale` | Tabela de tamanhos + exemplos |
| 10 | `.slide.components-light` | Botões + cards + inputs + badges (light) |
| 11 | `.slide.components-dark` | Mesmos componentes (dark) |
| 12 | `.slide.dont` | Antipadrões com demos visuais |
| 13 | `.slide.ai-instructions` | Bloco "For AI Assistants" formatado |

### CSS para slide → PDF

```css
@page {
  size: A4 landscape;
  margin: 0;
}

.slide {
  width: 297mm;
  min-height: 210mm;
  padding: 16mm 20mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  page-break-before: always;
}

.slide:first-child {
  page-break-before: auto;
}

@media print {
  body { background: #FFFFFF; color: #000000; }
  nav, .download-pdf, .skip-link { display: none; }
}
```

### Botão Download PDF (no HTML)

```html
<a href="./brandbook.pdf" download class="download-pdf">Download PDF</a>

<style>
  .download-pdf {
    position: fixed;
    top: 1rem;
    right: 1rem;
    /* … */
  }
  @media print {
    .download-pdf { display: none; }
  }
</style>
```

## Geração de PDF

Via `assets/pdf-generator.mjs` (puppeteer-core + Chrome do sistema):

```bash
node skills/branding/assets/pdf-generator.mjs brand/<slug>
```

Lê `brand/<slug>/brandbook.html`, gera `brand/<slug>/brandbook.pdf` em A4 landscape.

Fallback: se Chrome ausente, instrui usuário a abrir HTML em browser → Cmd+P → Save as PDF (A4 Landscape, Background graphics ON).

## Naming conventions

- Slug: `kebab-case`, ASCII only, sem espaço.
- Diretório: `brand/<slug>/`.
- Arquivos: `brandbook.md`, `brandbook.html`, `brandbook.pdf` (sempre estes nomes).

> **Não confundir**: `brand/` é a pasta do exportável (deck). `brain/` é o source-of-truth Markdown.

## Idioma

PT-BR em todos os 3 artefatos. Identifiers (CSS vars, JSON keys, YAML keys) em EN.

## Versionamento

Bump `version` no frontmatter a cada `export` em que o Brain mudou desde o último export. Use semver:

- **patch** — ajuste de cor pontual, atualização de exemplo.
- **minor** — novo componente, mudança de tipografia.
- **major** — mudança de arquétipo ou paleta core.
