---
title: Hero backgrounds — modelos canônicos não-AI-slop
tags: [docs, design-system, hero, anti-ai-slop]
created: 2026-05-03
updated: 2026-05-03
status: initialized
---

# Hero backgrounds — 5 modelos canônicos

> Hero é a primeira impressão. Default-Tailwind + IA produz **gradiente purple→blue**, blob abstrato em SVG, malhas com pontinhos brilhantes. Tudo isso é AI-slop reconhecível à distância. Esta doc lista 5 modelos canônicos que **não caem nesse padrão** e podem ser remixados por marca.

## Antipadrões banidos (regra absoluta)

1. **Gradiente diagonal purple→blue** ou rosa→roxo. Default Tailwind.
2. **Blob SVG colorido** com transformação CSS. Default Heroicons-era.
3. **Malha de pontos com glow** ("constellation"). Default tela de loading.
4. **Foto de stock genérica** de "equipe sorrindo em escritório com glass walls".
5. **Vídeo de drone** sobrevoando cidade não-relacionada à marca.
6. **Render 3D abstrato** de objetos flutuantes. AI-slop puro.

Se um destes aparece, **regenere**.

---

## Modelo 1 — Cor sólida + tipografia gigantesca

**Quando:** marcas editoriais, jurídicas, financeiras, B2B sério.

**Construção:**
- Background: cor sólida da paleta (`--color-bg` ou `--color-fg` invertido).
- Foreground: headline em `var(--text-4xl)` (clamp escalonado).
- Eyebrow opcional acima da headline.
- Sem imagem. Sem ícone. Tipografia carrega tudo.

**Por quê funciona:** confiança, autoridade, foco em mensagem. Sites como Stripe (early), New York Times opinion, Linear (parcial) usam variações disso.

**Anti-slop:** tipografia precisa estar **certa** (ver `docs/typography.md`). H1 com letter-spacing -0.025em e `text-wrap: balance`.

---

## Modelo 2 — Hero split (texto à esquerda, foto à direita)

**Quando:** marca tem foto de produto/pessoa/lugar real e bem feita.

**Construção:**
- Grid 12 colunas: span 6 texto, span 6 foto.
- Foto é **real** (não stock). Recorte editorial (não centralizada como "thumbnail").
- Foto vai até a borda do viewport no desktop (full-bleed do lado direito).
- Mobile: foto **abaixo** do texto, ratio 4:3 ou 16:9 (não 4:5 que empurra texto para fora).

**Por quê funciona:** humaniza, prova autenticidade. Sites como Honest Burgers, Patagonia, agências boutique.

**Anti-slop:** foto **não pode** ser stock genérica. Se a marca não tem foto, **não use este modelo** — caia para Modelo 1.

---

## Modelo 3 — Asymmetric editorial (mix de blocos)

**Quando:** marcas criativas, estúdios, portfólios.

**Construção:**
- Hero ocupa 100dvh mobile / ~80vh desktop.
- Layout assimétrico: H1 em uma coluna, sub-texto em outra (deslocada), CTA isolada.
- Pode incluir um marker tipográfico grande (ex.: `01`, `\`, `→`) como elemento visual.
- Sem foto. Tipografia + whitespace.

**Por quê funciona:** sinaliza intenção editorial. Sites como Pentagram, Wieden+Kennedy, estúdios Tokyo.

**Anti-slop:** nada de "creative" que vira "caos". Deslocamento intencional, baseado no grid 12-col (`<GridCol start={3} span={8}>` etc.). Cada peça **alinhada** ao grid.

---

## Modelo 4 — Lista vertical (manifesto / homepage editorial)

**Quando:** marcas de opinião, blogs, mídia editorial, agências focadas.

**Construção:**
- 3-7 frases em sequência, cada uma em `var(--text-2xl)` ou `--text-3xl`.
- Cada linha é uma afirmação curta (5-12 palavras).
- Spacing vertical generoso (`var(--space-12)` entre linhas).
- Última linha é o CTA implícito ("Comece aqui →").

**Por quê funciona:** é "lista de POVs proprietários" como hero. Cada linha sustenta posição. Reading down funciona como elevator pitch.

**Anti-slop:** as frases têm que ser **opinativas**, não descritivas. ❌ "Soluções inovadoras para sua empresa". ✅ "Branding por consenso é o atalho mais caro que você pode tomar."

---

## Modelo 5 — Tipografia massiva + small print (Brutalist editorial)

**Quando:** marcas que querem postura forte, anti-corporate.

**Construção:**
- H1 ocupa ~50% da viewport vertical (mobile e desktop). Single word ou 2-3 palavras.
- Tipografia display escolhida para impacto (serif heavy, mono experimental, etc).
- Abaixo: small print (`var(--text-sm)`) em uma coluna estreita à esquerda. 2-3 frases que contextualizam.
- CTA discreto (link sublinhado, não botão).

**Por quê funciona:** comunica confiança através de não-precisar-vender. Sites como Are.na, Public-Library, brutalismo editorial.

**Anti-slop:** "small print" tem que ser **boa copy**. Não pode ser "Lorem ipsum descrição genérica do que fazemos".

---

## Como `/onboard-brandbook` escolhe

A skill `/onboard-brandbook` propõe um modelo baseado em sinais do brain:

| Sinal | Modelo sugerido |
|---|---|
| Marca jurídica/financeira/B2B sério | 1 (sólido) |
| Foto real do produto/pessoa | 2 (split) |
| Estúdio criativo / portfólio | 3 (asymmetric) |
| Blog/manifesto/POV-heavy | 4 (lista vertical) |
| Marca anti-corporate / postura forte | 5 (brutalist editorial) |

O usuário pode pedir outro modelo. Mas a recomendação é singular.

---

## Variações com gradiente (permitidas, com regras)

Gradiente **pode** ser usado se:

1. Direção sutil (15° max em vez de 45°/diagonal).
2. Cores **ambas da paleta da marca** (não purple→blue arbitrário).
3. Diferença de luminosidade pequena (não high-contrast neon).
4. Uso pontual (background de uma seção, não do hero inteiro).

Exemplo aceitável: `linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-fg) 4%, var(--color-bg)))`.

## Imagens de fundo (raramente)

Se for usar imagem de fundo:

1. **Fonte verificada** (foto da marca, não Unsplash random).
2. **Overlay sólido** (não gradient overlay sutil — vira bandeira slop).
3. **Texto legível** (contrast ratio ≥ 4.5:1 sobre a parte mais clara da imagem).
4. **Crop intencional** que sirva a composição do hero, não preenchimento.

Skill que ajuda: `/setup-images` (Unsplash/Pexels com queries específicas) e `/seo-imagens` (otimização pós-escolha).

---

## Inspiração canônica (para o agente referenciar)

- Stripe (homepage, ~2018-2022)
- Linear (current)
- Are.na (block editorial)
- New York Times opinion (hero typography)
- Pentagram studio cases
- Public-Library.net
- Honest Burgers

Não copie. **Estude o que torna cada um não-genérico** e aplique a regra, não o pixel.
