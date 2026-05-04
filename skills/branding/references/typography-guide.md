# Typography Guide — pairings, escala, fontes grátis

Apenas **fontes grátis** (Google Fonts, Bunny Fonts, OFL/SIL/Apache). Fontes pagas são **vetadas como solução final** — sempre mapeadas para equivalente grátis.

Usado em `discover` (Q5), `import` (mapeamento de fonte detectada → equivalente grátis), `apply` (next/font import).

## Whitelist (Google + Bunny)

### Sans neutras
- **Inter** — clean, neutra, multi-uso. Use só com justificativa (a default automática vira AI-slop).
- **Inter Tight** — versão condensada, melhor para display.
- **Geist Sans** — moderna, técnica, contraste sutil. Excelente para mood "tech sério".
- **Manrope** — humanist com leve calor.
- **Mona Sans** — open-source da GitHub, alternativa premium ao Söhne.
- **Space Grotesk** — geométrica com personalidade, ótima para mood criativo.

### Sans humanas / rounded
- **Mulish** — rounded, acolhedora.
- **Quicksand** — rounded, simples.
- **Nunito** — rounded com calor.
- **Open Sans** — humanist clássica.
- **Source Sans 3** — humanist tradicional.

### Sans condensadas / display
- **Bebas Neue** — display condensada, peso único.
- **Oswald** — display condensada, várias weights.
- **Anton** — display heavy condensada.
- **Archivo Black** — display heavy.
- **Phantom Sans** (Velvetyne, OFL) — display autoral.

### Serifs editoriais
- **Fraunces** — variable serif moderna, alta personalidade. Substitui Editorial New / GT Super.
- **Frank Ruhl Libre** — serif editorial limpa.
- **Crimson Pro / Crimson Text** — serif clássica de leitura.
- **EB Garamond** — serif tradicional.
- **Cormorant Garamond** — serif elegante, alto contraste.
- **Spectral** — serif para tela com leve quebra.
- **Playfair Display** — serif Didone-style alto contraste.
- **Italiana** — Didone-style moderna.

### Mono / técnica
- **JetBrains Mono** — mono técnica multi-weight.
- **Geist Mono** — mono moderna, par com Geist Sans.
- **IBM Plex Mono** — mono institucional.
- **Space Mono** — mono geométrica.
- **Fira Code** — mono com ligaduras.

### Display autoral / experimental
- **Reckless** (Bunny Fonts) — display de personalidade.
- **Bricolage Grotesque** — variable, mood pós-moderno.
- **Recursive** — variable mono+sans, técnica.
- **Vollkorn** — serif robusta.

## Banidas (sem exceção)

Fontes pagas que aparecem em referências mas **não podem** entrar como solução final:

| Paga | Mood | Equivalente grátis |
|---|---|---|
| GT America | Sans neutra moderna | Geist Sans / Inter Tight |
| GT Sectra | Serif autoral | Fraunces |
| GT Super | Display editorial | Fraunces (mode display) |
| Söhne | Sans Helvetica-revival | Inter / Mona Sans |
| Söhne Mono | Mono moderna | JetBrains Mono / Geist Mono |
| Editorial New | Display editorial | Fraunces / Frank Ruhl Libre |
| Reckless Neue | Display autoral | Reckless (Bunny Fonts) |
| Tiempos | Serif para tela | Spectral / Crimson Pro |
| Untitled Sans | Sans humanist | Manrope / Mulish |
| Suisse Int'l | Sans neutra | Inter Tight / Geist |
| Pangea | Sans humanist condensada | Mona Sans + tracking ajustado |
| Inter (paga) | — | Inter (open-source via Google) |

> **Regra**: se uma referência usa fonte paga, o `import-url` deve detectar a `font-family` e o agente substitui pelo equivalente da tabela acima antes de gravar `brain/DESIGN.tokens.json`.

## Pairings opinativos (Q5)

Apresente 4 direções durante `discover`:

### 1. Editorial / sério
- **Display**: Fraunces (variable, weight 600+, opt-szn=144).
- **Body**: Inter Tight ou Geist Sans (weight 400-500).
- **Mono**: JetBrains Mono.
- **Mood**: pensamento, ensaio, autoridade.

### 2. Moderno / geométrico
- **Display**: Space Grotesk (weight 600) ou Bricolage Grotesque.
- **Body**: Inter (weight 400) ou Manrope.
- **Mono**: Geist Mono.
- **Mood**: tech atual, startup técnica.

### 3. Técnico / preciso
- **Display**: Geist Sans (weight 700) com tracking negativo.
- **Body**: Geist Sans (weight 400) ou IBM Plex Sans.
- **Mono**: Geist Mono ou IBM Plex Mono (uso pesado).
- **Mood**: hardware, SaaS de devs, dashboards.

### 4. Caloroso / humano
- **Display**: Fraunces (weight 500, italic permitido) ou Recoleta.
- **Body**: Manrope ou Mulish (weight 400).
- **Mono**: Recursive Mono.
- **Mood**: pessoas, saúde, educação, hospitalidade.

## Escala modular

Calibrar em Q5. Razões válidas (todas matemáticas, não chute):

| Razão | Sensação | Quando usar |
|---|---|---|
| **1.125 — Major Second** | discreta, denso | dashboards, ferramentas |
| **1.200 — Minor Third** | ritmo claro | conteúdo padrão |
| **1.250 — Major Third** | leitura confortável | blogs, marketing |
| **1.333 — Perfect Fourth** | dramático, editorial | landing pages, marca |
| **1.500 — Perfect Fifth** | extremo, display | hero-driven sites |

Implementação em CSS via `clamp()`:

```css
:root {
  --text-base: 1rem;
  --text-ratio: 1.250;
  --text-sm: calc(var(--text-base) / var(--text-ratio));
  --text-lg: calc(var(--text-base) * var(--text-ratio));
  --text-xl: calc(var(--text-lg) * var(--text-ratio));
  /* etc */
}
```

## Regras técnicas

### Loading
- **Use `next/font` no Next.js** — auto-host, swap, latency-optimized. Nunca `<link>` direto.
- Alternativa: Bunny Fonts (CDN GDPR-friendly) com `<link rel="preconnect">` + `display=swap`.
- Limite: **2 famílias** + 1 mono. Mais que isso = AI-slop "experimentação tipográfica".

### Tracking
- Headings ≥ 2rem: tracking negativo (`-0.025em` a `-0.04em`) para display tight.
- Body: tracking 0 (default da fonte).
- Eyebrow / labels uppercase: tracking positivo (`0.08em` a `0.12em`).
- Mono: tracking 0 ou levemente negativo.

### Line-height
- Body: 1.6–1.7 (nunca menor).
- Headings: 1.0–1.2 (display tight) ou 1.3 (humanist).
- Mono: 1.5.

### Measure (largura de linha)
- Body: 60–75 caracteres (`max-width: 65ch` é o canônico do framework).
- Headings: livres, mas raramente > 20 palavras por linha.

### Variable fonts
Prefira **variable** quando disponível (Fraunces, Bricolage, Recursive, Inter). Permite weight + slant + opt-sz em 1 arquivo.

## Anti-padrões

- **Inter por default sem justificativa** — vira AI-slop. Justifique ou troque.
- **3+ famílias** — perde-se identidade.
- **Headings com `letter-spacing: 0`** em display tight — falha em parecer "designed".
- **Body com `letter-spacing` positivo** — torna texto cansativo.
- **Tipografia sem `font-feature-settings`** — perde-se OpenType (figuras tabulares, ligaduras, ss alternativos).
- **Comic Sans / Papyrus / Brush Script** — banidos universais (PR rejeitado).
