# Audit Checklist — anti-AI-slop + acessibilidade + técnica + PDF

Lista de verificação completa usada por `playbooks/review.md` (QA visual) e `playbooks/discover.md` (validação final antes de gravar).

Cada item tem **ID citável** (A1.1, B2.3...) que vira `[id]` no relatório de QA. Severidade: **P0** (bloqueia) / **P1** (atenção) / **P2** (polimento).

---

## Parte A — Anti-AI-slop

### A1. Cores

- **A1.1 (P0)** Nenhum gradiente `purple→blue`, `blue→pink`, `cyan→purple` (default Tailwind/shadcn). Padrão de IA universal.
- **A1.2 (P1)** Paleta não é exclusivamente `slate-*`, `zinc-*`, `gray-*` sem accent saturado.
- **A1.3 (P1)** Branco puro `#FFFFFF` ou preto puro `#000000` apenas se justificado (default é off-white quente + preto não-puro).
- **A1.4 (P0)** Cores em código sempre via `var(--token)`; **nenhum hex hardcoded** em `.tsx` (exceto `globals.css` raiz).
- **A1.5 (P2)** Semânticos calibrados em luminosidade do bg (não vermelho-stop puro, não verde-floresta saturado).

### A2. Tipografia

- **A2.1 (P0)** Inter como única fonte só com justificativa explícita. Default automático = AI-slop.
- **A2.2 (P0)** Apenas fontes grátis (Google/Bunny/OFL). Pagas (GT America, Söhne) → mapeadas para grátis.
- **A2.3 (P1)** Headings ≥ 2rem usam tracking negativo (`-0.025em` ou menor). Body usa tracking 0.
- **A2.4 (P1)** `text-wrap: balance` em headings; `text-wrap: pretty` em body — ambos presentes.
- **A2.5 (P1)** Body com `line-height` ≥ 1.5 (1.6–1.7 ideal).
- **A2.6 (P0)** `.prose` tem `max-width` definido (65ch canônico). Sem `max-width`, parágrafos viram murais.
- **A2.7 (P2)** `font-variant-numeric: tabular-nums` em conteúdo numérico (preço, métricas, datas).
- **A2.8 (P2)** Eyebrow usa `letter-spacing: 0.08em a 0.12em` em uppercase + small-caps quando suportado.

### A3. Logo / marca

- **A3.1 (P0)** Imagotipo + ícone simples + wordmark presentes; não inventou logo abstrato gerado por IA.
- **A3.2 (P1)** Favicon SVG presente (`web/src/app/icon.svg` ou `web/public/favicon.svg`).
- **A3.3 (P2)** OG image gerada (não usar default Next.js).

### A4. Layout

- **A4.1 (P0) PRIMEIRO VIEWPORT** — hero cabe em 100dvh mobile (375×812) e ~80vh desktop (1280×800) **sem scroll**.
- **A4.2 (P1)** Headline mobile não usa `text-[15vw]` ou `font-size: 7rem+` (rebenta a primeira dobra).
- **A4.3 (P1)** Hero mobile não tem 4+ blocos verticais (eyebrow + h1 + sub + 2 CTAs + foto + proof). Limite: 3 blocos sólidos.
- **A4.4 (P1)** Border-radius **não é 8px universal**. Diferenciar: pílulas em CTAs (`9999px`), suaves em cards (`6px`–`12px`), hard em utility (`0`–`2px`).
- **A4.5 (P1)** Spacing usa scale 4-base (`4, 8, 12, 16, 24, 32, 48, 64, 96`). Sem `p-7`, `gap-5` (fora da scale).
- **A4.6 (P2)** Grid 12-col canônico em páginas principais (não flexbox ad-hoc onde grid se aplica).

### A5. Componentes

- **A5.1 (P1)** Cards brancos com `shadow-md` sobre `bg-gray-50` — banido (AI-slop universal). Substitua por: borda fina + bg igual + tipografia diferenciada.
- **A5.2 (P1)** `shadow-md`, `shadow-lg` direto do Tailwind sem custom var — banido. Use `shadow-elevation-1`, `shadow-whisper`, etc.
- **A5.3 (P2)** Botões: estado `:hover`, `:focus-visible`, `:active`, `:disabled`, `[aria-busy]` cobertos.
- **A5.4 (P2)** Inputs: `:focus-visible`, `[aria-invalid]`, `:disabled` cobertos.

---

## Parte B — Acessibilidade / Web Interface Guidelines

### B1. Estrutura semântica

- **B1.1 (P0)** Skip link como **primeiro filho** de `<body>` (com classe `visually-hidden` que aparece em `:focus`).
- **B1.2 (P0)** `<header>`, `<main>`, `<nav>`, `<footer>` semânticos, não `<div>` com classe.
- **B1.3 (P1)** `<h1>` único por página; hierarquia heading sem pulos (h1 → h3 sem h2 = falha).
- **B1.4 (P1)** Imagens com `alt` descritivo (não `alt="image"` ou alt vazio em conteúdo).

### B2. Foco

- **B2.1 (P0)** `:focus-visible` outline em **todos** os interativos. 2px sólido, 2px offset mínimo.
- **B2.2 (P0)** Outline removido (`outline: none`) só se substituído por estilo equivalente.
- **B2.3 (P1)** Foco visível tem contraste ≥ 3:1 contra fundo adjacente.

### B3. Contraste WCAG AA

- **B3.1 (P0)** Texto normal: ≥ 4.5:1 contra bg.
- **B3.2 (P0)** Texto large (≥ 18pt ou 14pt bold): ≥ 3:1.
- **B3.3 (P1)** Bordas de input: ≥ 3:1 contra bg.

### B4. Preferências do usuário

- **B4.1 (P0)** `@media (prefers-reduced-motion: reduce)` desativa todas as animations + transitions globais.
- **B4.2 (P1)** `@media (prefers-color-scheme: dark)` auto-aplica dark mode (não exige toggle).
- **B4.3 (P2)** `@media (prefers-contrast: more)` força bordas + outlines.

### B5. Cor

- **B5.1 (P0)** Informação **não veiculada apenas por cor** (ex.: erro indicado por cor + ícone + texto).

---

## Parte C — Técnica

### C1. Meta + theme

- **C1.1 (P0)** `<meta name="color-scheme" content="light dark">`.
- **C1.2 (P1)** `<meta name="theme-color" content="...">` (cor da barra mobile).
- **C1.3 (P1)** Favicon SVG declarado em `<link rel="icon" type="image/svg+xml">`.

### C2. CSS

- **C2.1 (P0)** Todos os tokens de cor/font/spacing como CSS custom properties. Nada hardcoded.
- **C2.2 (P1)** Subtle noise/grain texture via SVG data URI quando o mood pede — opcional.
- **C2.3 (P2)** Preconnect para Google/Bunny Fonts no `<head>`.

### C3. Fontes

- **C3.1 (P0)** `font-display: swap` em todas as fontes carregadas.
- **C3.2 (P0)** Apenas fontes grátis (cf. A2.2).
- **C3.3 (P1)** `next/font` no Next.js (não `<link>` direto).

### C4. Performance

- **C4.1 (P1)** Hero LCP < 2.5s em conexão 4G.
- **C4.2 (P2)** CSS inline no head para tokens críticos do hero.

---

## Parte D — PDF / Slides (`export` mode)

Aplicado quando `playbooks/export.md` gera `brandbook.pdf`.

### D1. Estrutura

- **D1.1 (P0)** Cada `<section>` do `brandbook.html` tem classe `.slide` com `page-break-before: always`.
- **D1.2 (P0)** `@page { size: A4 landscape }` no CSS.
- **D1.3 (P1)** Sidebar/nav escondidos via `@media print { .nav { display: none } }`.

### D2. Conteúdo

- **D2.1 (P0)** Slides obrigatórios: cover, archetype, logo, favicon, palette-core, palette-system, type-families, type-scale, components-light, components-dark, dont, ai-instructions.
- **D2.2 (P1)** Cover tem nome + tagline + data + versão.
- **D2.3 (P2)** Botão "Download PDF" no HTML com `display: none` em print (D2.3 cobre o botão; o PDF é gerado e o link aponta para `./brandbook.pdf`).

---

## Veredicto

QA agrega contagens:

- **Qualquer P0** → veredicto: **BLOQUEADO**.
- **Zero P0, ≥1 P1** → veredicto: **APROVADO COM RESSALVAS**.
- **Zero P0, zero P1** → veredicto: **APROVADO**.

Sub-agente cita IDs no relatório (`A1.1`, `B2.3` etc.). Orquestrador-pai (ex.: `/qa`) decide ação.

## Métricas observadas (resumo do report)

```markdown
- Hero mobile: [cabe / não cabe em 100dvh]
- Grid canônico: [usado / não usado / parcial]
- AI-slop ocorrências: [N por categoria]
- Contraste WCAG: [PASS / FAIL count]
- Fontes: [grátis / paga detectada — qual]
```
