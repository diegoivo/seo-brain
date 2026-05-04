# Playbook: `/branding export`

Gera os 3 entregáveis do brandbook em `brand/<slug>/`:

- `brandbook.md` — formato exportável derivado do Brain (PT-BR).
- `brandbook.html` — versão visual em slides (A4 landscape).
- `brandbook.pdf` — opt-in, gerado via puppeteer-core + Chrome do sistema.

## Pré-condições

- `brain/DESIGN.md` com `kit_state: initialized`.
- `brain/DESIGN.tokens.json` com valores reais.
- (Para PDF) Chrome instalado em `/Applications/Google Chrome.app` (macOS) ou `/usr/bin/google-chrome` (linux).

## Inputs

- `slug` (opcional): nome curto da marca em kebab-case. Default: deriva de `brain/index.md` `name` campo.

## Pipeline

### 1. Determina slug + cria diretório

```bash
SLUG="${1:-$(grep '^name:' brain/index.md | cut -d: -f2 | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | xargs)}"
mkdir -p "brand/$SLUG"
```

### 2. Gera `brand/<slug>/brandbook.md`

Lê `brain/DESIGN.md` + `brain/DESIGN.tokens.json` e produz markdown formatado segundo `references/brandbook-format.md`.

Frontmatter YAML + 7 sections:

```yaml
---
brand: <nome>
slug: <slug>
version: 1.0.0
generated_at: <YYYY-MM-DD>
language: pt-BR

archetype: <do brain/DESIGN.md §1>
positioning:
  premium: <0.0-1.0>
  technical: <0.0-1.0>
  bold: <0.0-1.0>
  serious: <0.0-1.0>

logo:
  type: <imagotipo | symbol-only | wordmark | monogram>
  primary_lockup: <horizontal | vertical | stacked>

colors: <do tokens.json>
typography: <do tokens.json>
spacing_base: 4
radius: <do tokens.json>
---
```

Sections:

1. **Arquétipo de marca** — narrativa em 2-3 parágrafos.
2. **Logo & Imagotipo** — construção, variantes, clear space, do/don't.
3. **Paleta** — cada token com nome evocativo + hex + papel funcional + exemplo de uso.
4. **Tipografia** — specimens, type scale com tabela, regras (tracking, line-height, measure), hierarquia.
5. **Componentes** — botões, cards, inputs, badges, nav (forma + estados + variantes + light/dark).
6. **Antipadrões — banidos neste projeto** — Q10 do discover + automáticos com rationale.
7. **For AI Assistants** — CSS custom properties + Tailwind mappings + font loading + dark mode pattern + DO NOT list.

Versionamento: bump semver no frontmatter:
- **patch** — ajuste pontual.
- **minor** — novo componente, mudança de tipografia.
- **major** — mudança de arquétipo ou paleta core.

### 3. Gera `brand/<slug>/brandbook.html`

Standalone HTML — todo CSS inline ou em `<style>` no head. Únicas externals: Google/Bunny Fonts via `<link>`.

Estrutura:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="<accent>">
  <title>Brandbook — <Marca></title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=..." rel="stylesheet">
  <style>
    :root { /* todos os tokens do tokens.json */ }
    @media (prefers-color-scheme: dark) { :root { /* dark variants */ } }
    @media (prefers-reduced-motion: reduce) { /* desativa animations */ }
    @page { size: A4 landscape; margin: 0; }
    .slide { page-break-before: always; width: 297mm; min-height: 210mm; padding: 16mm 20mm; }
    .slide:first-child { page-break-before: auto; }
    @media print { nav, .download-pdf, .skip-link { display: none; } }
    /* … */
  </style>
</head>
<body>
  <a href="#main" class="skip-link">Pular para conteúdo</a>
  <a href="./brandbook.pdf" download class="download-pdf">Download PDF</a>
  <nav>...</nav>
  <main id="main">
    <section class="slide cover">...</section>
    <section class="slide archetype">...</section>
    <section class="slide logo">...</section>
    <section class="slide logo-rules">...</section>
    <section class="slide favicon">...</section>
    <section class="slide palette-core">...</section>
    <section class="slide palette-system">...</section>
    <section class="slide type-families">...</section>
    <section class="slide type-scale">...</section>
    <section class="slide components-light">...</section>
    <section class="slide components-dark">...</section>
    <section class="slide dont">...</section>
    <section class="slide ai-instructions">...</section>
  </main>
  <script>
    // IntersectionObserver para nav highlight
  </script>
</body>
</html>
```

Slides obrigatórios (13):

| # | Slide | Conteúdo |
|---|---|---|
| 1 | cover | Brand name + tagline + data + versão |
| 2 | archetype | Personalidade + traços + voice tone |
| 3 | logo | Imagotipo primário + ícone alone + wordmark |
| 4 | logo-rules | Do / Don't com visuais |
| 5 | favicon | Ícone em 16/32/180/512 + tab mockup |
| 6 | palette-core | bg/fg/accent + accents secundários |
| 7 | palette-system | Surfaces + text scales + semantics |
| 8 | type-families | Specimens das 3+ famílias |
| 9 | type-scale | Tabela de tamanhos + exemplos |
| 10 | components-light | Buttons + cards + inputs + badges (light) |
| 11 | components-dark | Mesmos componentes (dark) |
| 12 | dont | Antipadrões com demos |
| 13 | ai-instructions | Bloco "For AI Assistants" |

Requisitos técnicos:

- Skip link primeiro filho de `<body>`.
- `:focus-visible` outline 2px solid 2px offset.
- `prefers-reduced-motion: reduce` desativa animations.
- `prefers-color-scheme` auto-aplica dark.
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`.
- `font-variant-numeric: tabular-nums` em conteúdo numérico.
- WCAG AA contrast em todo texto.
- Google/Bunny Fonts com `display=swap` + `preconnect`.
- CSS custom properties para todos os tokens.

### 4. Gera `brand/<slug>/brandbook.pdf` (opt-in)

Detecta Chrome:

```bash
CHROME=""
for p in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/usr/bin/google-chrome-stable" \
         "/usr/bin/google-chrome" \
         "/usr/bin/chromium-browser" \
         "/usr/bin/chromium"; do
  [ -x "$p" ] && CHROME="$p" && break
done
```

Se Chrome ausente:

> ⚠️ Chrome não detectado. PDF não gerado.
>
> Para gerar manualmente: abra `brand/<slug>/brandbook.html` no Chrome → Cmd+P → Save as PDF (A4 Landscape, Background graphics ON).

Se Chrome presente, executa o gerador:

```bash
node skills/branding/assets/pdf-generator.mjs "brand/$SLUG"
```

O gerador:
1. Garante `puppeteer-core` instalado (`npm install puppeteer-core` se necessário, sem `puppeteer` que baixa Chromium próprio).
2. Lança Chrome em headless.
3. Carrega `brandbook.html` via `file://`.
4. Gera PDF A4 landscape com `printBackground: true`, `margin: 0`.
5. Salva em `brand/<slug>/brandbook.pdf`.

### 5. Validação dos 3 artefatos

Após geração:

```bash
test -f "brand/$SLUG/brandbook.md" || echo "FAIL: brandbook.md ausente"
test -f "brand/$SLUG/brandbook.html" || echo "FAIL: brandbook.html ausente"
test -f "brand/$SLUG/brandbook.pdf" || echo "PDF ausente (Chrome ausente ou falha)"
```

Se HTML existe, validar estrutura mínima (passa em `audit-checklist.md` Parte D):

- Tem `<!DOCTYPE html>`.
- Tem `<meta name="color-scheme" content="light dark">`.
- Tem ≥ 13 elementos `<section class="slide ...">`.
- Tem `@page { size: A4 landscape }` no CSS.
- Tem botão `.download-pdf` apontando para `./brandbook.pdf` com `display: none` em print.

### 6. Auto-commit

```bash
git add "brand/$SLUG/"
git commit -m "docs(brandbook): export $SLUG v$(grep '^version:' brand/$SLUG/brandbook.md | cut -d: -f2 | xargs)"
```

PDF é binário — pode ficar fora do git se preferir (`.gitignore` em `brand/*/brandbook.pdf`). Decisão por projeto.

## Princípios

- **Brain é source-of-truth.** Editar `brandbook.md` exportado **não atualiza** o Brain. Volte a `brain/DESIGN.md` para mudanças.
- **PDF é opt-in.** HTML sempre gerado; PDF só se Chrome disponível.
- **Versionamento semver.** Bump a cada export onde o Brain mudou.
- **Standalone HTML.** Apenas Google/Bunny Fonts como external. Tudo mais inline.

## Conclusão

1. Atualiza `brain/log.md`: `## YYYY-MM-DD — /branding export <slug> v<version>`.
2. Lista os artefatos gerados:

```
✓ brand/<slug>/brandbook.md    (XX KB)
✓ brand/<slug>/brandbook.html  (XX KB)
✓ brand/<slug>/brandbook.pdf   (XX KB)   [ou ⚠️ se Chrome ausente]
```

3. Sugere abrir o HTML: `open brand/<slug>/brandbook.html`.
