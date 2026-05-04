# Color System — derivação de paleta completa a partir de seed

Como transformar 1 cor (seed) em sistema completo: core, accents, semânticos, surfaces, text scales. Usado em `discover` (Q4) e `import` (após extração).

## Tokens canônicos

A paleta gerada **deve preencher todos** os tokens abaixo. Cada um vai parar em `brain/DESIGN.tokens.json` e em `web/src/app/globals.css` como CSS variable.

### Core
- `--bg` — fundo principal (page).
- `--fg` — texto principal sobre `--bg`.
- `--accent` — CTAs, links, foco. **Único token saturado** em paletas neutras.
- `--accent-fg` — texto sobre fundo accent (contraste WCAG AA mínimo).

### Surfaces
- `--surface-elevated` — cards, modals, popovers (1 step "para cima" do `--bg`).
- `--surface-sunken` — inputs, code blocks (1 step "para baixo" do `--bg`).

### Text scales
- `--fg-strong` — h1, números, ênfase máxima.
- `--fg-muted` — secundário, captions, metadata.
- `--fg-subtle` — placeholders, disabled.

### Borders
- `--border` — divisores e bordas neutras.
- `--border-strong` — bordas de inputs em foco, separadores fortes.

### Semantic
- `--success` — verde sóbrio (não saturado padrão).
- `--warning` — âmbar.
- `--danger` — vermelho.
- `--info` — azul (pode coincidir com accent se accent for azul).

## Modos: light + dark

Cada token tem variante para `prefers-color-scheme: dark`. **Não** inverta cores brutamente — recomponha:

```css
:root {
  --bg: #FAFAF7;
  --fg: #181712;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0F0E0B;
    --fg: #F5F2EA;
  }
}
```

Accent geralmente preserva matiz mas escurece/clarifica em 5–10% para manter contraste.

## Estrutura de paleta (escolhido em Q4)

| Estrutura | Quando usar | Saturação |
|---|---|---|
| **Neutra** | Maioria das marcas. Escala neutra (grays/beges/off-whites) + 1 accent forte. | Accent saturado, neutros baixos. |
| **Bicromática** | 2 cores em tensão (uma fria + uma quente). | Ambas com saturação alta. |
| **Tricromática** | 3 cores em sistema (raro, exige skill). | Calibradas em luminosidade. |
| **Monocromática** | 1 matiz + variações tonais (ex.: tudo azul). | Variação de luminosidade/saturação. |

## Algoritmo: seed → paleta neutra (caso 90%)

Dada uma seed (hex), gerar:

1. **Accent**: a própria seed.
2. **Accent-fg**: `#FFFFFF` ou `#000000` — escolha o que tem ratio ≥ 4.5:1 com a seed.
3. **Bg / fg**:
   - Light mode: bg = off-white quente derivado do matiz (mover seed pra L=98%, S=4–8%); fg = preto não-puro (L=8%, S=2%).
   - Dark mode: bg = preto não-puro (L=6%, S=4%); fg = off-white quente (L=92%, S=4%).
4. **Surface-elevated**: bg + 4% luminosidade no light; bg + 6% no dark.
5. **Surface-sunken**: bg − 3% luminosidade no light; bg + 2% no dark (pouco mais escuro).
6. **Borders**: derivados de fg com alpha 12% (border) e 24% (border-strong).
7. **Text scales**:
   - fg-strong = fg.
   - fg-muted = fg com alpha 65%.
   - fg-subtle = fg com alpha 40%.
8. **Semânticos** (em paletas neutras): tons calibrados na luminosidade do bg, não a vontade.
   - success: verde-musgo se bg quente; verde-mar se bg frio.
   - danger: vermelho profundo (#B0001A) — não vermelho-stop.
   - warning: âmbar fosco (#C68A2A).
   - info: azul-tinta (#1E3A5F) ou seed se azul.

## WCAG AA — contrastes mínimos

| Par | Mínimo |
|---|---|
| `--fg` sobre `--bg` | 4.5:1 (texto normal) |
| `--fg-strong` sobre `--bg` | 7:1 (h1) |
| `--accent-fg` sobre `--accent` | 4.5:1 |
| `--fg-muted` sobre `--bg` | 4.5:1 (ainda é texto) |
| Bordas de input | 3:1 |
| Foco visível | 3:1 contra adjacent |

Use https://contrast-ratio.com/ ou função local para verificar antes de gravar tokens.

## Anti-padrões

- **Slate-500 / zinc-500 / gray-500 sem accent**: paleta default Tailwind genérica. Adicione accent forte ou rejeite a stack.
- **Gradientes purple→blue (`from-purple-500 to-blue-500`)**: AI-slop universal. Banido.
- **Cards brancos com `shadow-md` sobre `bg-gray-50`**: AI-slop universal. Banido.
- **Branco puro `#FFFFFF` + preto puro `#000000`**: contraste excessivo, parece interface de teste. Use off-white (`#FAFAF7`) e preto não-puro (`#181712`).
- **Cor "verde" automática para "sustentabilidade"**: tradução textual → visual é AI-slop. Cor é decisão estrutural ligada ao arquétipo.

## Output em `brain/DESIGN.md`

Cores devem aparecer com **3 elementos**:

- **Token** (ex.: `--accent`).
- **Nome evocativo** em prosa (ex.: "Vermelho Sangue Tipográfico").
- **Hex em parênteses** (ex.: `#B0001A`).
- **Papel funcional** (ex.: "CTAs primários, links, foco").

Exemplo:

> `--accent` — Vermelho Sangue Tipográfico (#B0001A) — CTAs primários, links de prosa, indicador de foco visível em formulários.

Nunca apenas `accent: #B0001A`. Sempre prosa + hex + papel.

## Output em `brain/DESIGN.tokens.json`

```json
{
  "color": {
    "bg": "#FAFAF7",
    "fg": "#181712",
    "fg-strong": "#0E0D08",
    "fg-muted": "rgba(24,23,18,0.65)",
    "fg-subtle": "rgba(24,23,18,0.40)",
    "accent": "#B0001A",
    "accent-fg": "#FAFAF7",
    "surface-elevated": "#FFFFFF",
    "surface-sunken": "#F2EFE6",
    "border": "rgba(24,23,18,0.12)",
    "border-strong": "rgba(24,23,18,0.24)",
    "success": "#3F6E45",
    "warning": "#C68A2A",
    "danger": "#B0001A",
    "info": "#1E3A5F"
  }
}
```

> **Não inclua `$schema`.** Não invente domínios (`schemas.agenticseo.sh` não existe). JSON é consumido localmente pelo `web/`.
