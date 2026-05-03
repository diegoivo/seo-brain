---
name: site-clone
description: Clona aspecto visual de site existente via agent-browser. Extrai HTML + computed styles + paleta + fontes + logo + favicon + OG image. Propõe DESIGN.md baseado no extraído. Use quando o usuário tem domínio existente e quer importar visual ("clone diegoivo.com", "importa o site existente", "extrai o design"). Disparada pelo /onboard quando há domínio.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebFetch
---

# /site-clone

Clonagem **visual real** via browser headless. Não Fetch HTML puro (resolve "chutei Inter" da sessão 2 L1172).

## Pré-requisito

`agent-browser` no PATH. Detectar com:

```bash
command -v agent-browser
```

Se ausente, abortar com:

> "❌ Clonagem visual exige `agent-browser` (Vercel Labs). Sem ele, posso só fazer Fetch HTML — paleta e fontes ficam imprecisas.
>
> Instalar (uma vez):
>
> ```
> npm install -g agent-browser
> agent-browser install
> ```
>
> ~30s. Depois rode `/site-clone <url>` de novo."

**Não tente fallback curl** — perde computed styles e JS-rendered content. Falhar é melhor que entregar dados imprecisos.

## Pipeline

### 1. Captura

```bash
agent-browser open <url>
agent-browser screenshot .cache/clone/full.png --full-page
agent-browser get html "html" > .cache/clone/raw.html
```

### 2. Extração via `eval --stdin`

Rode em um único script JS:

```js
const result = {
  meta: {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    ogDescription: document.querySelector('meta[property="og:description"]')?.content,
    lang: document.documentElement.lang,
  },
  logo: detectLogo(),
  favicon: document.querySelector('link[rel*="icon"]')?.href,
  fonts: [...new Set([...document.querySelectorAll('h1, h2, h3, p, body')]
    .map(el => getComputedStyle(el).fontFamily))].slice(0, 5),
  palette: extractPalette(),
  typeScale: ['h1','h2','h3','h4','p','small'].map(tag => ({
    tag,
    fontSize: getComputedStyle(document.querySelector(tag) || document.body).fontSize,
    lineHeight: getComputedStyle(document.querySelector(tag) || document.body).lineHeight,
    fontWeight: getComputedStyle(document.querySelector(tag) || document.body).fontWeight,
  })),
  radius: extractRadius(),
};

function detectLogo() {
  // 1. SVG icon mais específico
  const svg = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (svg) return { type: 'svg', url: svg.href };
  // 2. Heuristic: img com "logo" no alt/src dentro de header
  const img = document.querySelector('header img[alt*="logo" i], header img[src*="logo" i], a[href="/"] img');
  if (img) return { type: 'img', url: img.src, alt: img.alt };
  // 3. OG image fallback
  const og = document.querySelector('meta[property="og:image"]');
  if (og) return { type: 'og', url: og.content };
  return null;
}

function extractPalette() {
  const counts = new Map();
  for (const el of document.querySelectorAll('body, header, footer, button, a, h1, h2, h3, p, [class*="btn"], [class*="hero"]')) {
    const cs = getComputedStyle(el);
    for (const prop of ['color', 'backgroundColor', 'borderColor']) {
      const v = cs[prop];
      if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') {
        counts.set(v, (counts.get(v) || 0) + 1);
      }
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([color]) => color);
}

function extractRadius() {
  const counts = new Map();
  for (const el of document.querySelectorAll('button, [class*="btn"], [class*="card"], img, input')) {
    const r = getComputedStyle(el).borderRadius;
    if (r) counts.set(r, (counts.get(r) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r]) => r);
}

JSON.stringify(result);
```

Salva em `.cache/clone/extract.json`.

### 3. Análise + proposta

Sub-agent lê extração + screenshot e propõe:

- **Atmosfera** (mood) baseada na paleta (escuro/claro, quente/frio, contraste)
- **Cores** com nomes evocativos + hex + papel funcional
- **Tipografia** mapeada para fontes Google equivalentes (se site usa fonte custom paga, sugerir Google equivalente)
- **Type scale** com clamp() apropriado
- **Border-radius** sistema
- **Antipadrões inferidos** (se site é flat → "sem shadow"; se tem 3D → "evitar")

Apresenta com **3 perguntas granulares específicas**:

> "Detectei azul `#0A66C2` como primária e Inter como sans. Manter ou propor variante mais distinta? E mood — capturei 'corporativo sóbrio'; alinha?"

### 4. Importar assets

```bash
# Logo
curl -o web/public/logo.svg "<logo.url>"  # ou .png

# Favicon
curl -o web/src/app/icon.png "<favicon.url>"

# OG image (se houver)
curl -o web/public/og.png "<og.url>"
```

### 5. Preencher Brain

- `brain/DESIGN.md` (com `kit_state: initialized`)
- `brain/DESIGN.tokens.json`
- `brain/config.md`: status do clone, screenshot path
- `brain/index.md`: meta extraído (title, description) — pra usuário validar/ajustar

**Não escreva** `brain/tom-de-voz.md` ou `brain/principios-agentic-seo.md` — clone visual ≠ clone de voz. Pergunta:

> "Visual extraído. Quer também importar tom de voz analisando o copy do site? (Sub-agent lê posts/sobre/home e propõe.)"

## Princípios

- **Sem agent-browser, aborta.** Não tenta fallback que entrega lixo.
- **Logo é prioridade SVG** > PNG > og:image.
- **Paleta é computed**, não inferida do CSS source (resolve sites que usam classes utility).
- **Fontes pagas → equivalente Google**. GT America → Geist; Söhne → Inter ou Mona Sans.
- **Tom de voz ≠ visual.** Pergunta antes de extrair.
