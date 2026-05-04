# Playbook: `/branding import <url>`

Clone visual real via `agent-browser` (Vercel Labs, headless Chromium). **Não WebFetch puro** — clone visual sem browser entrega lixo (paleta inferida sobre class names, fontes chutadas, SPAs entregam shell vazio).

## Pré-check obrigatório (PRIMEIRA ação)

**Antes de qualquer outra ferramenta** (Read, Write, criar `.cache/`, ler brain) rode:

```bash
command -v agent-browser
```

Esta tem que ser a primeira ação. Se você abriu arquivos antes, voltou e errou — abandone tudo e checa primeiro.

Se **ausente**, ofereça install ao usuário e PARE — não tente WebFetch, não tente curl, não prepare nada:

> ❌ `/branding import` exige `agent-browser` (binário Rust feito para agentes).
>
> Posso instalar agora? (~30s, ~120MB Chromium baixado uma vez)
>
> ```
> npm install -g agent-browser && agent-browser install
> ```
>
> Responda **"instalar"** para eu rodar, ou **"pular"** para abortar.
>
> Se pular: redirecione para `/branding discover` (from-scratch).

Se "instalar":
1. Roda `npm install -g agent-browser && agent-browser install` (Bash).
2. Re-checa `command -v agent-browser`. Se ainda falhar, mostra erro e aborta.
3. Continua o pipeline.

Se "pular" ou silêncio: aborta com mensagem clara.

**WebFetch e curl não são fallback.** São tools listadas em `allowed-tools` apenas para baixar arquivos pontuais (logo SVG já identificado, favicon, OG image). Nunca para extrair tokens visuais ou paleta.

## Pipeline (7 etapas)

### 1. Captura multi-fase

Captura em 1 momento perde lazy content + hover states + densidade real. Pipeline:

```bash
mkdir -p .cache/clone

# 1.1 — abre e espera fonts/imagens above-the-fold
agent-browser open "$URL"
sleep 1.5

# 1.2 — screenshot above-the-fold
agent-browser screenshot .cache/clone/above-fold.png

# 1.3 — scroll incremental para disparar lazy loaders
agent-browser eval --stdin <<'EOF'
window.scrollTo(0, document.body.scrollHeight * 0.33);
EOF
sleep 0.8
agent-browser eval --stdin <<'EOF'
window.scrollTo(0, document.body.scrollHeight * 0.66);
EOF
sleep 0.8
agent-browser eval --stdin <<'EOF'
window.scrollTo(0, document.body.scrollHeight);
EOF
sleep 0.8

# 1.4 — screenshot full-page após scroll completo
agent-browser screenshot .cache/clone/full.png --full-page

# 1.5 — HTML após DOM hidratado
agent-browser get html "html" > .cache/clone/raw.html
```

> **Multi-viewport**: agent-browser hoje não tem flag de viewport nativa universal. Se a versão suportar `--viewport=375x812`, capture mobile separadamente. Caso não, capture só desktop e marque limite em `.cache/clone/extract.json.viewport`.

### 2. Extração via `eval --stdin`

Rode em script JS único:

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
  // Prioridade SVG > PNG > og:image
  const svg = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (svg) return { type: 'svg', url: svg.href };
  const img = document.querySelector('header img[alt*="logo" i], header img[src*="logo" i], a[href="/"] img');
  if (img) return { type: 'img', url: img.src, alt: img.alt };
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

// Densidade composicional — captura estrutura para o scaffold respeitar.
// Seletor inclusivo: <section> em qualquer profundidade (HTML semântico),
// classes de layout comuns (section/block/wp-block/container/hero/banner)
// E filhos diretos do body com altura significativa (sites WordPress/Elementor
// frequentemente usam <div> aninhada).
const SECTION_SELECTOR = [
  'section',
  '[class*="section"]', '[class*="hero"]', '[class*="banner"]',
  '[class*="wp-block-group"]', '[class*="elementor-section"]',
  'main > div', 'body > main > div',
].join(', ');

result.composition = {
  sections: [...document.querySelectorAll(SECTION_SELECTOR)]
    .filter((el) => el.getBoundingClientRect().height >= 100) // descarta widgets <100px
    .slice(0, 12)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        height: Math.round(r.height),
        childCount: el.children.length,
        hasMedia: !!el.querySelector('img, video, picture, svg'),
        imageCount: el.querySelectorAll('img').length,
        bgColor: cs.backgroundColor,
        layoutType: cs.display.includes('grid') ? 'grid'
          : cs.display.includes('flex') ? 'flex' : 'stack',
      };
    }),
  totalSections: [...document.querySelectorAll(SECTION_SELECTOR)].filter((el) => el.getBoundingClientRect().height >= 100).length,
  totalImages: document.querySelectorAll('img').length,
  totalCards: document.querySelectorAll('[class*="card"], article').length,
  hasHero: !!document.querySelector('[class*="hero"], [class*="banner"]'),
  hasMotion: [...document.styleSheets].some((s) => {
    try { return [...s.cssRules].some((r) => r.cssText?.includes('@keyframes')); }
    catch { return false; }
  }),
};

JSON.stringify(result);
```

Salva em `.cache/clone/extract.json`.

### 3. Análise + proposta

Sub-agent lê extração + screenshot e propõe:

- **Atmosfera (mood)** — escuro/claro, quente/frio, contraste, baseado em paleta dominante.
- **Cores** com nomes evocativos + hex + papel funcional (ver `references/color-system.md`).
- **Tipografia** — mapeie fontes detectadas para Google equivalente (ver `references/typography-guide.md`). Ex: GT America → Geist; Söhne → Inter; Editorial New → Fraunces.
- **Type scale** apropriada (1.250 default; 1.333 se site é editorial; 1.125 se denso).
- **Border-radius sistema** (não universal).
- **Densidade composicional** — número de sections, layout dominante, presença de hero/cards/media.
- **Antipadrões inferidos** — se site é flat, "sem shadow"; se tem 3D, "evitar".

### 4. Perguntas granulares de fidelidade (BLOQUEANTE)

Antes de gravar `brain/DESIGN.md`, gera `.cache/clone/decisions.md` com 5 perguntas comparando real vs canônico do framework. **Bloqueia até o usuário responder**:

```markdown
# Decisões de fidelidade — clone de <url>

Compare o extraído (real) com os canônicos do framework. Marque a sua escolha em cada par.

## 1. Border-radius
- [ ] Real: `38px` (pílulas em CTAs)
- [ ] Canônico: `6px` (radius default do kit)
- [ ] Híbrido: pílulas em CTAs, 6px no resto

## 2. Type scale tracking
- [ ] Real: h1 `letter-spacing: 0.3px` (tracking positivo, clean)
- [ ] Canônico: h1 `letter-spacing: -0.025em` (tight, display moderno)

## 3. Densidade do hero
- [ ] Real: hero + prova social numérica (15 anos / +120 / +100)
- [ ] Canônico: hero limpo, sem prova social

## 4. Sections estruturais
- [ ] Real: ${composition.totalSections} sections com ${composition.totalCards} cards e ${composition.totalImages} imagens
- [ ] Canônico do scaffold: home + 1 serviço + blog + sobre + contato (5 sections)
- [ ] Manter estrutura do real, popular com conteúdo do brain

## 5. Mood capturado
- Mood inferido pelo agent: "<auto>"
- [ ] Confirmo
- [ ] Ajustar para: "_____"
```

Quando o usuário responde (edita o markdown), agente lê e aplica decisões. Se respostas conflitam com canônicos, mostra warning antes de aplicar.

**Modo não-interativo (fixture)**: se ENV `BRANDING_FIXTURE_MODE=1`, gera `decisions.md` com defaults (canônico em todas as 5 perguntas) sem bloquear. Útil para QA automatizado e validação contra fixtures.

### 5. Importar assets

```bash
# Logo
curl -L -o web/public/logo.svg "<logo.url>"   # ou .png
# Favicon
curl -L -o web/public/favicon.png "<favicon.url>"
# OG image (se houver)
curl -L -o web/public/og.png "<og.url>"
```

Se logo é SVG, otimize com `npx svgo web/public/logo.svg` (opcional — exige svgo instalado).

### 6. Preencher Brain

- `brain/DESIGN.md` (com `kit_state: initialized`).
- `brain/DESIGN.tokens.json`.
- `brain/config.md`: status do clone, screenshot path.
- `brain/index.md`: meta extraído (title, description) — usuário valida.

**Não escreva** `brain/tom-de-voz.md` ou `brain/principios-agentic-seo.md`. Visual ≠ voz. Pergunte:

> "Visual extraído. Quer também importar tom de voz analisando o copy do site? (Sub-agente lê posts/sobre/home e propõe.)"

### 7. Diff report — fidelity QA (real vs local)

Após aplicar tokens, **valida** comparando real vs scaffold local. Loop não-negociável.

Pré-condição: `npm run dev` rodando (porta cacheada em `.cache/dev-port`).

```bash
LOCAL_URL="http://localhost:$(cat .cache/dev-port)"
agent-browser open "$LOCAL_URL"
sleep 2
agent-browser eval --stdin <<'EOF'
window.scrollTo(0, document.body.scrollHeight);
EOF
sleep 1
agent-browser screenshot .cache/clone/local-full.png --full-page
agent-browser eval --stdin < <(cat <<'EOF'
/* mesmo extractor da etapa 2 */
EOF
) > .cache/clone/local-extract.json
```

Compara `extract.json` (real) vs `local-extract.json` (clone) e gera `.cache/clone/diff-report.md`:

```markdown
# Diff report — clone de <url>

## Veredicto: APROVADO / RESSALVAS / BLOQUEADO

## Deltas P0 (estruturais — bloqueiam)
- 🚨 [exemplo] Radius perdido: real 38px, local 6px.
- 🚨 [exemplo] Densidade: real 6 sections com cases, local 9 genéricas.

## Deltas P1 (visuais — atenção)
- ⚠️ [exemplo] Tracking h1 invertido: real +0.3px, local -1.89px.

## Deltas P2 (cosméticos)
- ℹ️ [exemplo] Imagens 155 vs 12.

## Próximos passos
1. ...
```

Veredicto:
- **APROVADO** (0 P0): segue fluxo.
- **RESSALVAS** (P1 mas zero P0): mostra report, pergunta "prosseguir mesmo assim ou ajustar?".
- **BLOQUEADO** (1+ P0): pausa e pede ajuste manual ou re-clone.

## Flag `--respect-clone-scale` (opt-in)

Default: clone preserva paleta + fontes + radius do real, mas mantém **escala tipográfica canônica** (1.333) e **grid 12-col**. Para fidelidade máxima:

```
/branding import <url> --respect-clone-scale
```

Quando ativa: `globals.css` do scaffold sobrescreve `--text-*` e `--leading-*` com valores extraídos (clampeados em 0.8x–1.4x do canônico para não quebrar layout). Trade-off documentado em `brain/log.md`: "clone com scale do real vs DNA do framework".

Sem flag: aplica radius/cores/fontes mas NÃO mexe na escala — clone fica reconhecível com "DNA do kit".

## Sugestão de hero

Baseado no extraído, sugira modelo da lista canônica em `docs/hero-backgrounds.md`:

| Site clonado | Modelo sugerido |
|---|---|
| Foto real do produto | 2 (split: texto+foto) |
| Mood corporativo sóbrio | 1 (cor sólida + tipografia) |
| Estúdio/portfólio | 3 (asymmetric editorial) |
| Blog/manifesto | 4 (lista vertical) |

Antipadrões banidos (mesmo se site original usar): gradiente purple→blue, blob SVG, malha de pontos, foto stock corporativa.

## Auto-commit

```bash
git add brain/DESIGN.md brain/DESIGN.tokens.json web/src/app/globals.css web/public/logo.* web/public/favicon.* web/public/og.*
git commit -m "chore(branding-import): tokens + assets de <domain>"
```

## Princípios

- **Sem agent-browser, aborta.** Sem fallback que entrega lixo.
- **Logo prioridade SVG > PNG > og:image.**
- **Paleta é computed**, não inferida de class names.
- **Fontes pagas → equivalente Google.**
- **Tom de voz ≠ visual.** Pergunta antes.
- **Fidelity report é citável.** "Está parecido" não é resposta — aponte os 3 P0 do report.
- **APROVADO / RESSALVAS / BLOQUEADO** são os 3 veredictos possíveis.
