# Web Interface Guidelines — acessibilidade e interação

Diretrizes para HTML/CSS dos artefatos `apply` (rotas vivas em `web/src/app/brandbook/*`) e `export` (`brandbook.html`).

Complementa `audit-checklist.md` com **como fazer**, não apenas **o que verificar**.

## Princípios

1. **Semântica primeiro.** HTML correto é a base; ARIA é bandagem para casos onde semântica nativa não basta.
2. **Operável por teclado.** Tudo que clique faz, tab + enter/space também faz.
3. **Respeite preferências do sistema.** Reduced motion, dark mode, contrast — todos auto-aplicados.
4. **Foco é citação visual.** Indicador claro, não default browser invisível.
5. **Sem traps.** Modal abre → modal fecha (esc + clique fora + botão).

## Estrutura mínima

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#181712">
  <title>Brandbook — Marca</title>
  <link rel="icon" type="image/svg+xml" href="/icon.svg">
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=fraunces:400,600|inter-tight:400,500&display=swap" rel="stylesheet">
</head>
<body>
  <a href="#main" class="skip-link">Pular para conteúdo</a>
  <header><nav>...</nav></header>
  <main id="main">...</main>
  <footer>...</footer>
</body>
</html>
```

## Skip link

```css
.skip-link {
  position: absolute;
  left: -10000px;
  top: 0;
  background: var(--accent);
  color: var(--accent-fg);
  padding: 0.75rem 1rem;
  text-decoration: none;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
  z-index: 100;
}
```

## Foco visível

Default agressivo (sempre presente, mesmo em mouse):

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Para botões com bg accent:

```css
.btn-primary:focus-visible {
  outline: 2px solid var(--fg);
  outline-offset: 2px;
}
```

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Dark mode

Use `prefers-color-scheme` por default. Toggle manual é opcional (não obrigatório).

```css
:root {
  --bg: #FAFAF7;
  --fg: #181712;
  /* … */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0F0E0B;
    --fg: #F5F2EA;
    /* … */
  }
}
```

## Contraste

Calcule antes de salvar. Função simples:

```js
function contrast(hex1, hex2) {
  const lum = (h) => {
    const rgb = h.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(hex1.replace("#", ""));
  const l2 = lum(hex2.replace("#", ""));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
```

Mínimos: 4.5:1 (texto normal) / 3:1 (large) / 3:1 (foco).

## Heading hierarchy

- 1 `<h1>` por página.
- Não pular níveis (h1 → h2 → h3, nunca h1 → h3).
- Headings têm conteúdo significativo (não "Section 1").

## Imagens

- `alt` descritivo: descreve o que importa do conteúdo, não "imagem de…".
- Decorativas: `alt=""` (vazio explícito) + `role="presentation"` se for em contexto que pode confundir.
- `loading="lazy"` em imagens abaixo da dobra.
- `width`/`height` sempre — evita CLS.

## Formulários

- `<label>` associado a cada input (via `for=id` ou wrap).
- `aria-describedby` para mensagens de erro.
- `aria-invalid="true"` em campo com erro.
- Erros: cor + ícone + texto (nunca só cor).

## Botões

```html
<!-- Botão de ação -->
<button type="button" class="btn-primary">Salvar</button>

<!-- Link estilizado como botão -->
<a href="/path" class="btn-primary" role="button">Ir</a>
```

Estados visuais cobertos:
- default
- :hover (cursor pointer + leve mudança)
- :focus-visible (outline 2px)
- :active (pressed, ex.: scale 0.98)
- :disabled (opacity 0.5, cursor not-allowed, bg dimmed)
- [aria-busy="true"] (spinner inline)

## Navigation

- `<nav aria-label="Principal">` para a nav principal.
- Links ativos com `aria-current="page"`.
- Menu mobile com `<button aria-expanded>` + foco gerenciado.

## Modals / dialogs

```html
<dialog id="modal">
  <h2>Título</h2>
  <p>Conteúdo</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>
```

Use `<dialog>` nativo. Tem foco gerenciado, esc-to-close, e suporte a `showModal()` para overlay com backdrop.

## Tabular numbers

Use `font-variant-numeric: tabular-nums` em qualquer conteúdo numérico que se compara visualmente:

```css
.metric, .price, time, .date {
  font-variant-numeric: tabular-nums;
}
```

## Print styles

Para `brandbook.html` que vira PDF:

```css
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  body { background: #FFFFFF; color: #000000; }
  .nav, .download-pdf, .skip-link { display: none; }
  .slide { page-break-before: always; }
  .slide:first-child { page-break-before: auto; }
}
```

## Antipadrões frequentes

- `<div onclick>` em vez de `<button>` — quebra teclado.
- `outline: none` sem substituição — quebra foco visível.
- `aria-label` em elemento que já tem texto visível — duplicação que confunde leitor.
- `tabindex="1"`, `tabindex="2"` — quebra ordem natural. Use só `tabindex="0"` (entra na ordem) ou `tabindex="-1"` (programatic only).
- Cor única para indicar erro — falha A11Y.
- Animações sem `prefers-reduced-motion: reduce` fallback.
- Modal sem `dialog` nativo, sem foco gerenciado, sem esc-close.
