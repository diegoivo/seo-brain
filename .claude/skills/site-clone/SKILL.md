---
name: site-clone
description: Clona aspecto visual de site existente via agent-browser. Extrai HTML + computed styles + paleta + fontes + logo + favicon + OG image. Propõe DESIGN.md baseado no extraído. Use quando o usuário tem domínio existente e quer importar visual ("clone diegoivo.com", "importa o site existente", "extrai o design"). Disparada pelo /onboard quando há domínio.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

<!-- WebFetch propositalmente AUSENTE: clone visual exige agent-browser.
     Para baixar assets pontuais já identificados pelo DOM extract
     (logo SVG, favicon, OG image), use `curl` via Bash. -->


# /site-clone

Clonagem **visual real** via browser headless. Não Fetch HTML puro (resolve "chutei Inter" da sessão 2 L1172).

## Pré-requisito — agent-browser

`agent-browser` (Vercel Labs) no PATH. **Sem ele, esta skill não roda.** Não há fallback — clonar visual sem browser real entrega dados imprecisos (paleta inferida sobre class names, fonte chuta "Inter", SPAs entregam shell vazio).

### Pré-check (SEMPRE a PRIMEIRA Bash call desta skill)

**Antes de qualquer outra ferramenta** (Read, Write, criar `.cache/`, ler brain, qualquer coisa) rode:

```bash
command -v agent-browser
```

Esta tem que ser a primeira ação. Se você já abriu arquivos antes de checar, voltou e errou — abandone tudo e checa primeiro.

Se **ausente**, ofereça install ao usuário e PARE — não tente WebFetch, não tente curl, não prepare nada, não leia brain:

> ❌ `/site-clone` exige `agent-browser` (binário Rust da Vercel Labs feito para agentes).
>
> Posso instalar agora pra você? (~30s, ~120MB Chromium baixado uma única vez)
>
> ```
> npm install -g agent-browser && agent-browser install
> ```
>
> Responda **"instalar"** para eu rodar, ou **"pular"** para abortar a clonagem.
>
> Se pular: `/onboard` segue para `/design-init` from-scratch, sem clone visual.

Se o usuário disser "instalar":
1. Roda `npm install -g agent-browser && agent-browser install` (Bash tool).
2. Re-checa `command -v agent-browser`. Se ainda falhar, mostra erro e aborta.
3. Continua o pipeline.

Se o usuário disser "pular" (ou silenciar): aborte com mensagem clara — devolva controle ao orquestrador (`/onboard`) que vai pra `/design-init`.

**Princípio inegociável:** `WebFetch` e `curl` **não são fallback** desta skill. São tools listadas em `allowed-tools` apenas para baixar arquivos pontuais (logo SVG já identificado, favicon, OG image). Nunca para extrair tokens visuais ou paleta.

## Pipeline

### 1. Captura — 3 fases (acima da dobra + scroll incremental + multi-viewport)

Captura em 1 momento perde conteúdo lazy (IntersectionObserver), hover states e densidade real do site. Pipeline atualizado:

```bash
# Fase 1.1 — abre e espera fonts/imagens above-the-fold
agent-browser open <url>
sleep 1.5

# Fase 1.2 — screenshot do hero (above-the-fold)
agent-browser screenshot .cache/clone/above-fold.png

# Fase 1.3 — scroll incremental para disparar lazy loaders
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

# Fase 1.4 — screenshot full-page após scroll completo
agent-browser screenshot .cache/clone/full.png --full-page

# Fase 1.5 — HTML após DOM ter hidratado tudo
agent-browser get html "html" > .cache/clone/raw.html

# Fase 1.6 — multi-viewport (mobile + tablet + desktop)
for vp in 375x812 768x1024 1280x800; do
  agent-browser eval --stdin <<EOF
  // Não dá pra resize nativo via CDP simples; emule através de @viewport no print
  // Estratégia alternativa: agent-browser navigate com query --viewport (se disponível)
  EOF
done
```

> Nota implementação: agent-browser hoje não tem flag de viewport nativa. Para multi-viewport, o caminho atual é abrir 3 sessões com `agent-browser open <url> --viewport=375x812` se a versão suportar; caso não, capture só desktop e marque viewport limit em `cache/clone/extract.json`.

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

// === NOVO: densidade composicional ===
// Captura a estrutura de seções para que o scaffold respeite layout do real,
// não só tokens. Sem isso, o clone tem cores certas mas estrutura genérica.
result.composition = {
  sections: [...document.querySelectorAll('main > section, body > section, [class*="section"]')]
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
        layoutType: cs.display.includes('grid')
          ? 'grid'
          : cs.display.includes('flex')
            ? 'flex'
            : 'stack',
      };
    }),
  totalSections: document.querySelectorAll('main > section, body > section').length,
  totalImages: document.querySelectorAll('img').length,
  totalCards: document.querySelectorAll('[class*="card"], article').length,
  hasHero: !!document.querySelector('[class*="hero"]'),
  hasMotion: [...document.styleSheets].some((s) => {
    try {
      return [...s.cssRules].some((r) => r.cssText?.includes('@keyframes'));
    } catch {
      return false;
    }
  }),
};

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
- **Densidade composicional** — número de sections, layout dominante, presença de hero/cards/media
- **Antipadrões inferidos** (se site é flat → "sem shadow"; se tem 3D → "evitar")

### 3.5 Perguntas granulares pré-aplicação (BLOQUEANTE)

Antes de gravar `brain/DESIGN.md`, gera `.cache/clone/decisions.md` com 5 perguntas comparando real vs canônico do framework. **Bloqueia até o usuário responder**:

```markdown
# Decisões de fidelidade — clone de <url>

Compare o que foi extraído (real) com os canônicos do framework. Marque a sua escolha em cada par.

## 1. Border-radius
- [ ] Real: `38px` (pílulas em CTAs)
- [ ] Canônico: `6px` (radius default do kit)
- [ ] Híbrido: pílulas só em CTAs, 6px no resto

## 2. Type scale tracking
- [ ] Real: h1 `letter-spacing: 0.3px` (tracking positivo, clean)
- [ ] Canônico: h1 `letter-spacing: -0.025em` (tight, display moderno)

## 3. Densidade do hero
- [ ] Real: hero + prova social numérica abaixo (15 anos / +120 / +100)
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

Quando o usuário responde, agente lê o markdown editado e aplica decisões. Se respostas conflitam com canônicos, mostra warning antes de aplicar.

### 3.6 Flag `--respect-clone-scale` (opt-in, default false)

Por padrão, o clone preserva paleta + fontes + radius do real, mas mantém **escala tipográfica canônica** (perfect fourth 1.333) e **grid 12-col**. Para clones de fidelidade máxima:

```
agent invoca /site-clone <url> --respect-clone-scale
```

Quando ativa: o `globals.css` do scaffold sobrescreve `--text-*` e `--leading-*` com valores extraídos (clampeados em 0.8x–1.4x do canônico para não quebrar layout). Trade-off documentado em `brain/log.md`: "clone com scale do real vs DNA do framework".

Sem flag: aplica radius/cores/fontes mas NÃO mexe na escala — clone fica reconhecível mas com "DNA do kit". Decisão padrão preserva consistência cross-projeto.

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

### 6. Push para o brandbook ao vivo

Atualizar `web/src/app/globals.css` (apenas tokens — escala/grid/spacing são canônicos):

- `:root` cores (`--bg`, `--fg`, `--accent` etc) com hex extraídos.
- `:root` fontes (`--font-display`, `--font-body`, `--font-mono`) com Google Fonts equivalentes.
- Adicionar `next/font` import em `web/src/app/layout.tsx` (consultar `/web-best-practices`).

Atualizar `web/src/app/brandbook/wordmark/page.tsx`: trocar "seobrain" pelo nome real da marca.

Rodar `cd web && npm run build` — se passar, abrir `/brandbook` mentalmente em viewport 375×812 e 1280×800. Cores e tipografia devem refletir o site clonado.

Auto-commit:

```bash
git add brain/DESIGN.md brain/DESIGN.tokens.json web/src/app/globals.css web/src/app/brandbook/ web/src/app/layout.tsx web/public/logo.* web/public/og.*
git commit -m "chore(site-clone): tokens + assets de <domain> aplicados"
```

Apresentar URL local: `npm run dev` → `/brandbook` para o usuário ver clone ao vivo.

### 7. Sugestão de hero

Baseado no que foi extraído, sugira um modelo de hero da lista canônica em [`docs/hero-backgrounds.md`](../../../docs/hero-backgrounds.md):

| Site clonado | Modelo sugerido |
|---|---|
| Tem foto real do produto | 2 (split: texto+foto) |
| Mood corporativo sóbrio | 1 (cor sólida + tipografia) |
| Estúdio/portfólio | 3 (asymmetric editorial) |
| Blog/manifesto | 4 (lista vertical) |

Antipadrões banidos (mesmo se o site original usar): gradiente purple→blue, blob SVG, malha de pontos, foto de stock corporativa.

## Princípios

- **Sem agent-browser, aborta.** Não tenta fallback que entrega lixo.
- **Logo é prioridade SVG** > PNG > og:image.
- **Paleta é computed**, não inferida do CSS source (resolve sites que usam classes utility).
- **Fontes pagas → equivalente Google**. GT America → Geist; Söhne → Inter ou Mona Sans.
- **Tom de voz ≠ visual.** Pergunta antes de extrair.
