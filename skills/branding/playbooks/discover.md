# Playbook: `/branding discover`

10 perguntas opinativas que produzem identidade visual única — anti-AI-slop, anti-default-Tailwind, ancorada em arquétipo + decisões justificadas.

Output: `brain/DESIGN.md` (PT-BR prose) + `brain/DESIGN.tokens.json` (técnico).

## Pré-condições

- `brain/index.md` existe com `kit_state: initialized`. Caso contrário, peça ao usuário rodar `/wiki-init` primeiro.
- Sem clone visual prévio (caso contrário, use `/branding import <url>` em vez deste).

## Anti-AI-slop — internalize antes de perguntar

O DESIGN.md gerado **não pode** cair em nenhum destes:

- Gradientes purple→blue (default Tailwind/shadcn).
- Sombras genéricas (`shadow-md`, `shadow-lg` direto).
- Border-radius universal de 8px.
- Paleta exclusivamente "slate/zinc/gray" sem accent forte.
- Cards brancos com sombra sutil em fundo cinza claro.
- Stack default: Inter + shadcn + lucide-react.

Cada decisão precisa de **justificativa estrutural**. "Padrão do mercado" ou "fica bonito" → rejeite e re-pergunte.

## Hard rule: primeiro viewport

A primeira dobra (hero) **deve caber em** `100dvh` mobile e `~80vh` desktop **sem scroll**. Restrição mais ignorada por agentes.

**Antipadrões automáticos do hero (banidos no DESIGN.md gerado):**

- Headline com `text-[15vw]+` em mobile.
- Display font > 6rem em mobile portrait.
- Padding vertical do hero > 50% da viewport.
- Hero com 4+ blocos verticais em mobile.
- Foto vertical 4:5 ocupando 70%+ da viewport mobile.

**Orçamento de altura** (mobile portrait, dvh = 100):

| Bloco | Máx % |
|---|---|
| Header | 8% |
| Eyebrow + headline + sub | 50% |
| Mídia | 30% |
| CTAs | 12% |

**Validação obrigatória**: simule mentalmente em 375×812 antes de salvar. Se não cabe, refaça.

## Design Companion ao vivo (D5)

Antes da Q1, ofereça preview visual ao vivo:

```bash
mkdir -p .cache/branding
cp skills/branding/assets/design-companion.template.html .cache/branding/companion.html
open .cache/branding/companion.html
```

Após cada resposta, atualize `.cache/branding/companion.html` (substitua placeholders nos `data-*` ou em CSS variables) e peça ao usuário recarregar. Recarregamento manual é OK — sem MCP browser neste workspace.

Se usuário pedir "sem preview", pule e faça brainstorming texto-only.

## As 10 perguntas

**Uma de cada vez**, aguardando resposta antes da próxima. **Sem batch**. Resposta vaga ("moderno", "clean", "profissional") → insistir com sub-pergunta concreta.

### Q1 — Público-alvo principal
Quem é, o que faz, idade, contexto de uso (mobile/desktop), nível de literacia digital.

### Q2 — Arquétipo de marca (Mark & Pearson)
Apresente os 12 arquétipos com 1 frase cada. Leia `references/brand-archetypes.md` para a lista completa + traços + paleta sugerida + tipografia sugerida. Usuário escolhe 1 (ou descreve blend, mas blend de até 2). Justifique a escolha.

### Q3 — Mood em 3 adjetivos concretos
❌ "moderno, clean, profissional".
✅ "rigoroso, técnico, enxuto" / "vibrante, ousado, irreverente" / "pesado, tátil, analógico".

### Q4 — Família cromática
Estrutura:
- Neutra (escala neutra + 1 accent forte) — 90% dos casos.
- Bicromática (2 cores em tensão).
- Tricromática (3 cores em sistema).
- Monocromática (1 cor + variações tonais).

Tons quentes, frios ou neutros? Defina **accent principal com hex**.

Leia `references/color-system.md` para derivar paleta completa a partir da seed.

### Q5 — Tipografia
Apresente 4 pairings opinativos (leia `references/typography-guide.md`):

1. Editorial / sério — Fraunces + Inter Tight + JetBrains Mono.
2. Moderno / geométrico — Space Grotesk + Inter + Geist Mono.
3. Técnico / preciso — Geist Sans + Geist Sans + Geist Mono.
4. Caloroso / humano — Fraunces + Manrope + Recursive Mono.

**Inter sozinha só com justificativa explícita.** Define escala (1.125, 1.200, 1.250, 1.333, 1.500).

### Q6 — Logo & símbolo (D4)
Todo projeto recebe **wordmark estilizado** (texto + identity element) como logo primário.

Para ícone simples opcional, 3 opções:
- **A) Geometric monogram** — abstrato derivado de iniciais.
- **B) Symbolic icon** — design brief para designer (não tentamos gerar com IA).
- **C) Typographic monogram** — letra única estilizada.

Sugira a opção alinhada com o arquétipo.

### Q7 — Identity element
Caractere distintivo no nome que pode virar parte da identidade. Exemplos:
- Underscore em `Rankbase_`.
- Ponto em `Layer.ai`.
- Slash em `Next/js`.
- Brackets em `[dev]`.
- Sublinha em `_seo`.

Encontra o "hook" memorável do imagotipo.

### Q8 — Densidade
Denso (dashboards, ferramentas técnicas) / arejado (editorial, marketing) / médio. Define line-height, padding, ritmo vertical.

### Q9 — Motion
Estático / sutil (150–250ms ease-out em hover/focus apenas) / expressivo (page transitions, parallax, scroll-driven). Define timing functions e durações.

### Q10 — 3 antipadrões a evitar
Coisas que o usuário **não quer ver**. Concretas:
- "Nada de gradientes coloridos."
- "Sem ícones outline genéricos do Heroicons."
- "Sem cards brancos com shadow-md em fundo gray-50."
- "Sem purple/blue."
- "Sem hero centralizado."

**Antipadrões automáticos** (sempre adicionados):
- Hero estoura primeiro viewport.
- Headline > 12vw em mobile.
- Display font > 6rem em mobile portrait.
- Gradiente purple→blue.
- Slate sem accent.

## Outputs obrigatórios

### `brain/DESIGN.md`

Estrutura PT-BR (mapeamento Google Stitch design-md em parênteses):

```markdown
# Design System: [Nome]

> kit_state: initialized
> Compatível com Google Stitch design-md (seções 1-5 canônicas; 6-9 extras do kit).

## 1. Atmosfera & Tema Visual  (Visual Theme & Atmosphere)

[2-3 parágrafos descrevendo mood, arquétipo aplicado, sensação ao primeiro contato.]

## 2. Cores & Papéis  (Color Palette & Roles)

[Parágrafo introdutório com justificativa.]

- **`bg` — [Nome Evocativo] (#......)** — [Quando usar]
- **`fg` — [Nome] (#......)** — Texto principal.
- **`accent` — [Nome] (#......)** — CTAs, links, foco.
- **`muted` — [Nome] (#......)** — Texto secundário.
- **`border` — [Nome] (#......)** — Bordas e separadores.

## 3. Tipografia  (Typography Rules)

[Parágrafo descrevendo pareamento.]

- **Display** (h1, h2): [família, weight, escala em rem]
- **Body**: [família, weight, line-height]
- **Mono**: [família, uso]
- **Escala modular**: [ratio com valores em rem]

## 4. Estilos de Componentes  (Component Stylings)

[Parágrafo descrevendo personalidade.]

- **Botões**: [forma em prosa — "pill-shaped, peso médio, fundo accent sólido"]
- **Cards**: [presença/ausência]
- **Inputs**: [estilo, foco, validação]
- **Navegação**: [estrutura, mobile]

## 5. Princípios de Layout  (Layout Principles)

[Parágrafo descrevendo postura geral.]

- **Geometria & Forma**: [border-radius traduzido em prosa]
- **Espaçamento**: scale [4, 8, 12, 16, 24, 32, 48, 64, 96]
- **Densidade**: [da Q8 em prosa]
- **Ritmo vertical**: [baseline grid, line-height]

## 6. Profundidade & Elevação

[Em prosa — ex.: "interface flat sem sombras; camadas se diferenciam por bg+border".]

## 7. Motion

[Postura de motion em prosa.]

- **Durações**: fast (Xms), base (Yms), slow (Zms)
- **Easings**: [funções específicas — não `ease-in-out` genérico]
- **O que se move**: [hover, focus, page transition]

## 8. Antipadrões — banidos neste projeto

[Q10 + automáticos, com justificativa de cada um.]

## 9. Referências

- **[Site 1]** — copiar [X específico]; não copiar [Y].
- **[Site 2]** — copiar [X]; não copiar [Y].
- **[Site 3]** — copiar [X]; não copiar [Y].
```

### `brain/DESIGN.tokens.json`

```json
{
  "color": {
    "bg": "#...",
    "fg": "#...",
    "accent": "#...",
    "accent-fg": "#...",
    "fg-strong": "#...",
    "fg-muted": "...",
    "fg-subtle": "...",
    "surface-elevated": "#...",
    "surface-sunken": "#...",
    "border": "...",
    "border-strong": "...",
    "success": "#...",
    "warning": "#...",
    "danger": "#...",
    "info": "#..."
  },
  "font": {
    "display": "Fraunces",
    "body": "Inter Tight",
    "mono": "JetBrains Mono"
  },
  "scale": {
    "ratio": 1.250,
    "base": 1
  },
  "space": [4, 8, 12, 16, 24, 32, 48, 64, 96],
  "radius": { "sm": 2, "md": 6, "lg": 12, "pill": 9999 },
  "motion": {
    "fast": "120ms",
    "base": "200ms",
    "slow": "400ms",
    "ease": "cubic-bezier(0.2, 0.0, 0.0, 1.0)"
  }
}
```

### Regras críticas para `DESIGN.tokens.json`

- **Não inclua `$schema`** apontando para URL externa. Não invente domínios.
- **Apenas fontes grátis** (`references/typography-guide.md`).

## Validação ao final (referencia `audit-checklist.md`)

Antes de salvar:

**Anti-AI-slop:**
- [ ] Nenhum `shadow-md`/`shadow-lg` direto no DESIGN.md (A5.2).
- [ ] Border-radius **não é** 8px universal (A4.4).
- [ ] Paleta **não é** purple/blue genérica (A1.1).
- [ ] Tipografia **não é** Inter sem justificativa (A2.1).
- [ ] Antipadrões da Q10 explícitos na seção 8.
- [ ] Antipadrões automáticos de viewport adicionados.

**Primeiro viewport:**
- [ ] Hero em 375×812 cabe sem scroll (A4.1).
- [ ] Orçamento de altura respeitado (header 8%, headline 50%, mídia 30%, CTAs 12%).
- [ ] Display font usa `clamp()` ou variante mobile reduzida.

**Compatibilidade Google Stitch:**
- [ ] Cores têm **nome evocativo + hex em parênteses + papel funcional**.
- [ ] Cada seção começa com **prosa descritiva** antes de listas.
- [ ] Valores técnicos traduzidos para linguagem natural.
- [ ] Seções 1-5 com títulos canônicos.

**Geral:**
- [ ] Cada decisão tem **justificativa em prosa**.
- [ ] `DESIGN.tokens.json` reflete valores do MD sem divergência.

Se algum item falhar, refaça aquela seção antes de salvar.

## Conclusão

1. Grava `brain/DESIGN.md` + `brain/DESIGN.tokens.json`.
2. Atualiza `brain/log.md` com `## YYYY-MM-DD — /branding discover concluído`.
3. Sugere próximo passo: "Tokens prontos. Quer aplicar ao site? Rode `/branding apply`."
