---
name: branding-brandbook
description: Interactive visual brandbook scaffold for Next.js — live brand identity preview at /brandbook routes (cores, tipografia, voz, componentes, motion, grid, marca). Brand consultancy as code. Mandatorily runs after /branding-init. Applies DESIGN.md and covers colors in real use, typography hierarchy, all component states, voice samples, logo lockup, do/dont visual. Bidirectional — editing brandbook updates Brain. Use when user asks "brandbook", "preview do design", "guia de marca", "brand book", "design system preview", "visual brand identity scaffold". Renamed from /brandbook (consolidated v0.1.0).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# /brandbook v2 — consultoria de branding

Brandbook **bloqueante após `/branding-init`** (não opcional, não adiado). Aplicação visual + guia de marca completo. Espelha o Brain (DESIGN, tom, personas, POVs).

## Pré-condições

- `brain/DESIGN.md` `kit_state: initialized`
- `brain/DESIGN.tokens.json` com valores reais
- `web/` configurado com Tailwind v4 (já vem pré-instalado)

## Rotas geradas

### `/brandbook` (índice)

Hub com links para todas as seções + identidade do projeto + 3 POVs proprietários da marca.

### `/brandbook/cores` (visual color picker)

- Swatches grandes para cada cor da paleta: nome evocativo + hex + papel
- **Color picker visual** (HSL slider) que edita tokens e atualiza preview ao vivo
- Combinações em uso: botão accent em fundo bg, texto fg em fundo bg, links, etc.
- Contraste WCAG AA verificado (badge ✓/✗ por par)
- Botão "Salvar no Brain" — escreve novos hex em `brain/DESIGN.tokens.json` e re-renderiza

### `/brandbook/tipografia`

- Pairings opinativos (apenas Google/Bunny — fontes pagas vetadas)
- Preview em uso real: h1-h4 + parágrafo longo + mono em código
- Escala modular ativa (1.125 / 1.25 / 1.333 / 1.5)
- Switcher de pairing — aplica e mostra ao vivo
- Botão "Salvar no Brain"

### `/brandbook/voz`

- Tom de voz aplicado em frases reais (extraídas de `brain/tom-de-voz.md` + 3 POVs)
- **Voice samples por persona**: bloco "Como falar com [persona]" vs "Como NÃO falar"
- Antivícios IA — comparativo visual: "❌ vale destacar" vs "✅ direto"

### `/brandbook/componentes`

Todos os estados em tela:
- **Botões**: default / hover / focus / disabled / loading / accent / ghost
- **Inputs**: empty / filled / focus / error / disabled
- **Cards**: estático / hoverável / clicável
- **Form**: completo simulando contato
- **Navigation**: header desktop + mobile menu

### `/brandbook/layout`

- Grid base com colunas visíveis
- Escala de espaçamento (visual de tokens)
- Border-radius em diferentes elementos
- Profundidade & elevação em uso

### `/brandbook/marca`

- **Logo lockup**: variações (horizontal, vertical, stacked, mark only)
- **Favicon**: 16x16, 32x32, 180x180 (apple-icon)
- **OG image variations**: home, post, página, autor
- **Do/Don't visual grid**: 4 antipadrões do `DESIGN.md` §8 lado a lado com versão correta

## Pipeline

### 1. Lê Brain inteiro
- `index.md`, `DESIGN.md`, `DESIGN.tokens.json`, `personas.md`, `principios-agentic-seo.md`, `tom-de-voz.md`

### 2. Cria layout `web/src/app/brandbook/layout.tsx`

```tsx
import "../globals.css"; // GARANTE CSS (resolve sessão Antigravity L200)

export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }) {
  return <>{children}</>;
}
```

### 3. Cria as 7 rotas

Cada rota em `web/src/app/brandbook/<seção>/page.tsx`. Componentes exemplares importam do `web/src/components/`. Tokens vêm de `brain/DESIGN.tokens.json` via CSS variables (resolve sem-CSS).

### 4. Roda dev server e abre browser

```bash
cd web && npm run dev
```

Apresenta:
> "Brandbook em `http://localhost:XXXX/brandbook`. Navegue pelas 7 seções:
>
> - /brandbook — índice
> - /brandbook/cores — color picker visual
> - /brandbook/tipografia — pairings em uso
> - /brandbook/voz — samples e antivícios
> - /brandbook/componentes — todos os estados
> - /brandbook/layout — grid, espaçamento, profundidade
> - /brandbook/marca — logo, favicon, OG, do/don't
>
> 3 perguntas pra validar:
> 1. **[pergunta visual A]**
> 2. **[pergunta visual B]**
> 3. **[pergunta visual C]**"

### 5. Bidirecional — edição reflete no Brain

Quando usuário ajusta cor/fonte via picker visual:
1. POST para route handler `/api/brandbook/save` → escreve em `DESIGN.tokens.json`
2. Atualiza `DESIGN.md` (prosa correspondente) via `update-brain`
3. Hot reload do Next.js renderiza com novos tokens

Quando usuário pede mudança via chat:
1. Edita Brain primeiro
2. Brandbook reflete automaticamente (CSS variables)

## Princípios

- **CSS sempre garantido** — `import "../globals.css"` no layout (resolve sem-CSS)
- **Color picker no navegador, não em texto** (resolve P12 — cores escolhidas em texto)
- **Tipografia switcher visual** — usuário vê em uso antes de aprovar
- **Brain é source-of-truth** — brandbook reflete, não substitui
- **Apenas fontes grátis** — whitelist enforced no picker
- **Componentes em contexto** — cada estado renderizado em uso real, não isolado
