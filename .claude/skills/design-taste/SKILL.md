---
name: design-taste
description: Gera DESIGN.md + DESIGN.tokens.json a partir de uma vibe descrita em PT-BR. Triggers em "/design <vibe>", "novo design", "regenera design system". Recusa input vago e pede setor/tensão/referência.
---

# Skill `design-taste`

**Argumento**: descrição da vibe da marca em PT-BR (1 parágrafo).

Exemplo: `/design Marca de fintech para PMEs, sóbria mas humana, paleta sugerida tons quentes terrosos, tipografia geométrica, alta densidade.`

## Pré-condições

- Você está na raiz de um repo agentic-seo-kit (existe `AGENTS.md` + `wiki/`).
- Leu `AGENTS.md` e `wiki/tecnologia/stack.md`.

## Recusa de input vago

Se o argumento for genérico ("moderno e clean", "profissional", "bonito", vazio,
ou <50 chars), **não gere ainda**. Peça ao usuário 3 dimensões:

1. **SETOR** específico (fintech, saúde digital, e-commerce de moda, agência criativa,
   edtech, indústria) — não "tecnologia".
2. **TENSÃO** da marca (escolha 2-3 entre: humano vs tech, sóbrio vs lúdico, denso vs
   aerado, retro vs futurista, artesanal vs industrial).
3. **REFERÊNCIA visual** concreta — 1-3 sites/marcas que admira esteticamente
   (URLs ou nomes).

Volte com esse input antes de prosseguir.

## Passos

### 1. Tente delegar para skill de design existente

Se Skill tool disponível, tente nesta ordem:

1. `stitch-design-taste` (mais consistente)
2. `frontend-design`
3. `high-end-visual-design`
4. `brandbook`

Passe a vibe + restrições do kit (ver passo 2). A skill retorna DESIGN.md.

Se nenhuma estiver disponível, siga o fallback inline (passo 2).

### 2. (Inline fallback) Gere DESIGN.md você mesmo

Estrutura obrigatória de 5 seções:

```markdown
# Design System: <nome do projeto>

## 1. Visual Theme & Atmosphere
<2-4 parágrafos descrevendo mood, materialidade, energia. Use linguagem
evocativa que outro agente entenda em prompt futuro. Cite a TENSÃO da marca
explicitamente.>

## 2. Color Palette & Roles
- Background warm (#XXXXXX) — superfície primária; nunca #FFFFFF puro
- Texto ink (#XXXXXX) — neutro tingido; nunca #000000 puro
- Accent saturado (#XXXXXX) — CTAs, links, highlights; nunca para body text
- Border (#XXXXXX) — divisores
- Muted (#XXXXXX) — backgrounds secundários
- Muted-foreground (#XXXXXX) — captions, metadata

## 3. Typography Rules
- Display (hero, H1): <fonte serif ou sans display>, peso 600-700, tracking -0.02em
- Body: <fonte sans>, peso 400-500, line-height 1.6-1.75
- Mono: <fonte mono>
- Escala fluida com clamp()
- Banido: Inter (sem Tight), Roboto, Arial, system-ui como display

## 4. Component Stylings
- Border-radius padrão (≤12px)
- Sombras (preferir border 1px)
- Hover states
- Cards (1px border, padding 32-48px, alturas variando)
- CTAs (link com seta → preferido; botão sólido só hero)
- Anti-patterns proibidos: ícones em círculos coloridos, border-left colorido,
  drop-shadow grande, gradient backgrounds

## 5. Layout Principles
- Hierarquia tipográfica (escala ≥1.25)
- Whitespace ≥80px entre seções
- 1 anchor visual por viewport
- Container max-width
- Coluna editorial max-width 640px
- Touch targets ≥44px
```

### 3. Defaults seguros (quando vibe permite)

Se a vibe não exclui, selecione **randomicamente** UMA paleta e UM font pair.
Documente a escolha no DESIGN.md.

#### 10 paletas curadas (warm-white bg, ink-tingido txt, accent saturado)

| # | Nome | Background | Texto | Accent | Vibe |
|---|------|------------|-------|--------|------|
| 1 | Editorial Bege | `#F8F5EF` | `#1A1A18` | `#A6391A` (terracotta) | revista, autoridade |
| 2 | Linho Frio | `#F5F5F2` | `#0F1115` | `#114B5F` (deep teal) | sério, B2B |
| 3 | Pedra | `#EDEAE3` | `#1C1916` | `#7C2D12` (oxblood) | premium, sóbrio |
| 4 | Manhã | `#FAFAF7` | `#1F1F1B` | `#365314` (sage) | humano, calmo |
| 5 | Indigo Klein | `#F5F4F0` | `#0F0F12` | `#2440D1` (klein blue) | arte, intelectual |
| 6 | Carvão | `#F2F0EC` | `#1B1A19` | `#B45309` (ocre) | grounded, artesanal |
| 7 | Tofu | `#F1EFE9` | `#191917` | `#C2410C` (burnt orange) | quente, confiável |
| 8 | Branco Cru | `#F4F4F1` | `#0F172A` | `#334155` (slate) | minimalista, frio |
| 9 | Pó de Café | `#F0EBE3` | `#1C1917` | `#881337` (burgundy) | sofisticado, serif-friendly |
| 10 | Areia | `#F5F1E8` | `#1A1F18` | `#047857` (emerald) | natural, estável |

#### 10 font pairs curados (todos `next/font/google`, zero Inter)

| # | Display (hero/H1) | Body | Vibe |
|---|---|---|---|
| 1 | Fraunces | Inter Tight | editorial moderna |
| 2 | Playfair Display | Geist Sans | revista clássica |
| 3 | Newsreader | General Sans | jornalismo |
| 4 | Lora | Manrope | humanista |
| 5 | DM Serif Display | DM Sans | clean serif |
| 6 | Source Serif 4 | Geist Sans | pragmático |
| 7 | Bricolage Grotesque | IBM Plex Sans | técnico expressivo |
| 8 | Spectral | Public Sans | governo + literário |
| 9 | Crimson Pro | Outfit | acadêmico moderno |
| 10 | Geist Mono (display) | Geist Sans | dev/tech serious |

### 4. Salve dois arquivos

**DESIGN.md** na raiz (sobrescreve o atual).

**DESIGN.tokens.json** na raiz:

```json
{
  "$schema": "https://design.md/spec/v1/tokens.json",
  "name": "<nome do projeto>",
  "colors": {
    "background": "#XXXXXX",
    "foreground": "#XXXXXX",
    "accent": "#XXXXXX",
    "accent-foreground": "#XXXXXX",
    "border": "#XXXXXX",
    "muted": "#XXXXXX",
    "muted-foreground": "#XXXXXX"
  },
  "fonts": {
    "display": { "family": "<Nome>", "googleFont": true, "weights": [600, 700] },
    "body": { "family": "<Nome>", "googleFont": true, "weights": [400, 500] },
    "mono": { "family": "<Nome>", "googleFont": true, "weights": [400] }
  },
  "radii": { "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem" },
  "spacing": { "section": "5rem", "container": "1200px", "editorial": "640px" }
}
```

### 5. Após salvar, instrua executar `/scaffold`

```
DESIGN.md e DESIGN.tokens.json criados.

Paleta selecionada: <nome>
Font pair: <display> + <body>

Próximo passo: /scaffold para aplicar o design no Next.js.
```

## Anti-patterns proibidos (recusar gerar)

- Inter (sem Tight), Roboto, Arial, system-ui como font primária
- Gradient roxo/violeta/indigo
- `#000000` puro como texto
- `#FFFFFF` puro como background
- Cor primária centralizada em "purple"/"indigo"/"violet"
- Border-radius >12px
- Mais de 2 famílias tipográficas
- 5+ cores no sistema
