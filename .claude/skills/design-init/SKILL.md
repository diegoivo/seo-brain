---
name: design-init
description: Bootstrap de DESIGN.md via 10 perguntas que geram um design system único, anti-AI-slop. Roda quando brain/DESIGN.md não existe. Output - brain/DESIGN.md + brain/DESIGN.tokens.json. Use no início de um projeto novo, ou quando o usuário pedir "criar design system", "iniciar design".
allowed-tools:
  - Read
  - Write
---

# Design Init

Faz 10 perguntas que produzem um design system único para o projeto. **Anti-genérico, anti-default-Tailwind, anti-AI-slop.**

## Quando rodar

- `brain/DESIGN.md` não existe ou está como placeholder.
- Início de projeto novo.
- Redesign autorizado.

## Anti-AI-slop — o que NUNCA fazer no DESIGN.md gerado

Antes das perguntas, internalize estes antipadrões. O resultado **não pode** cair em nenhum deles:

- Gradientes purple→blue (default Tailwind/shadcn).
- Sombras genéricas (`shadow-md`, `shadow-lg` direto do Tailwind).
- Ícones do Heroicons em todas as posições óbvias.
- Border-radius universal de 8px em tudo.
- Paleta neutra "slate/zinc/gray" sem accent forte.
- Cards brancos com sombra sutil em fundo cinza claro.
- Stack de UI mais comum: Inter + Tailwind padrão + shadcn default + lucide-react.

Cada decisão do DESIGN.md precisa ter justificativa explícita. Se a justificativa for "padrão do mercado" ou "fica bonito", **rejeite e pergunte de novo**.

## Hard rule: primeiro viewport

A primeira dobra (hero) **deve caber em** `100dvh` mobile e `~80vh` desktop **sem scroll**, sempre. É a restrição mais importante e a mais ignorada por agentes.

**Antipadrões automáticos do hero (banidos no DESIGN.md gerado):**

- Headline com `text-[15vw]` ou maior em mobile.
- Display font > 6rem em mobile portrait.
- Padding vertical do hero > 50% da viewport em qualquer breakpoint.
- Hero com 4+ elementos verticais em mobile (eyebrow + headline + sub + 2 CTAs + foto + …).
- Foto vertical 4:5 ocupando 70%+ da viewport mobile (empurra texto para fora).

**Regra de orçamento de altura** (mobile portrait, dvh = 100):

| Bloco | Máx % da viewport |
|---|---|
| Header | 8% |
| Eyebrow + headline + sub | 50% |
| Mídia (foto/vídeo) | 30% |
| CTAs | 12% |
| **Total** | **100% sem scroll** |

Se o usuário pedir hero gigantesco, **ofereça alternativa**: headline grande + foto à direita em desktop, **stack vertical compacto** em mobile com escala reduzida (ex.: `clamp(2.5rem, 8vw, 5rem)`).

**Validação obrigatória ao final**: simule mentalmente o hero em viewport 375×812 (iPhone 14). Se não cabe, refaça.

## As 10 perguntas

Faça **uma de cada vez**, aguardando resposta antes da próxima. Sem batch. Se a resposta for vaga ("moderno", "clean", "profissional"), **insista** com sub-pergunta concreta.

1. **Público-alvo principal** — quem é, o que faz, idade, contexto de uso (mobile/desktop), nível de literacia digital.
2. **Arquétipo de marca** (Mark & Pearson) — escolha 1 dos 12: Inocente, Sábio, Herói, Fora-da-Lei, Mago, Pessoa Comum, Amante, Bobo da Corte, Cuidador, Criador, Governante, Explorador. Justifique.
3. **Mood em 3 adjetivos** — concretos. ❌ "moderno, clean, profissional". ✅ "rigoroso, técnico, enxuto" ou "vibrante, ousado, irreverente" ou "pesado, tátil, analógico".
4. **3 sites de referência** — para cada um:
   - URL
   - **O que copiar** (1 elemento específico: tipografia, layout, cor, motion, voz)
   - **O que NÃO copiar** (1 elemento que está fora do projeto)
5. **Família cromática** — escolha estrutura:
   - Neutra (escala de cinzas + 1 accent forte)
   - Bicromática (2 cores fortes em tensão)
   - Tricromática (3 cores em sistema)
   - Monocromática (1 cor + variações tonais)

   Tons quentes, frios ou neutros? Defina o **accent principal** com hex.
6. **Tipografia** — pareamento de 2 famílias.
   - **Não use Inter** a menos que justifique por que ela é a escolha certa para este projeto específico.
   - Sugira pairings opinativos: Söhne + Tiempos, Mona Sans + Editorial New, IBM Plex Sans + IBM Plex Serif, Söhne Mono + Söhne, Suisse Int'l + Suisse Works, Pangea + Reckless, JetBrains Mono only (mono-only é decisão), GT America + GT Super.
   - Defina escala (modular ratio, ex.: 1.25 perfect fourth, 1.333 perfect fourth, 1.5 perfect fifth).
7. **Densidade** — denso (dashboards, ferramentas técnicas) / arejado (editorial, marketing) / médio. Define line-height, padding e ritmo vertical.
8. **Contraste** — alto (Brutalist, dark mode forte, preto puro vs branco puro) / médio (clássico, dark/light com tons de cinza) / baixo (suave, pastel, off-white). Influencia a definição de cores semânticas.
9. **Motion** — estático (zero transições) / sutil (150-250ms ease-out em hover/focus apenas) / expressivo (page transitions, parallax, scroll-driven). Define timing functions e durações.
10. **3 antipadrões a evitar** — coisas que o usuário **não quer** ver. Concretas. Ex.:
    - "Nada de gradientes coloridos."
    - "Sem ícones de outline genéricos do Heroicons."
    - "Sem cards brancos com shadow-md em fundo gray-50."
    - "Sem purple/blue."
    - "Sem hero centralizado."

**Antipadrões automáticos** (sempre adicionados, mesmo que o usuário não cite):
- Hero estoura primeiro viewport.
- Headline > 12vw em mobile.
- Display font > 6rem em mobile portrait.

## Outputs obrigatórios

### Convenção e compatibilidade

A estrutura abaixo é **superset compatível** com o padrão `design-md` do Google (https://github.com/google-labs-code/stitch-skills). As seções 1-5 mapeiam 1:1 ao formato canônico do Google; as seções 6-9 (Espaçamento, Profundidade, Motion, Antipadrões, Referências) são extras deste kit.

Regras de redação que vêm do Google e devem ser respeitadas:

- **Linguagem descritiva natural antes de tabelas.** Traduza valores técnicos para prosa: `rounded-full` vira "cantos pill-shaped", `shadow-lg` vira "sombras pesadas com queda alta de contraste", `border-radius: 6px` vira "cantos sutilmente arredondados".
- **Cores com nome evocativo + hex + papel funcional.** Não use só token. Exemplo: `accent — Vermelho Sangue Tipográfico (#B0001A) — CTAs primários, links, foco`.
- **Hex em parênteses para precisão**, sempre que descrever uma cor.

### `brain/DESIGN.md`

Estrutura (PT-BR; mapeamento para o padrão Google em parênteses):

```markdown
# Design System: [Nome do projeto]

> Compatível com Google Stitch design-md. Seções 1-5 seguem o formato canônico; 6-9 são extras deste kit.

## 1. Atmosfera & Tema Visual  (Visual Theme & Atmosphere)

[Prosa de 2-3 parágrafos descrevendo o mood, o arquétipo aplicado e a sensação que o usuário deve ter ao primeiro contato. Use os adjetivos da pergunta 3 e amarre ao arquétipo da pergunta 2.]

## 2. Cores & Papéis  (Color Palette & Roles)

[Parágrafo introdutório com a justificativa da paleta — por que estas cores e não outras.]

- **`bg` — [Nome Evocativo] (#......)** — Fundo principal. [Quando usar.]
- **`fg` — [Nome Evocativo] (#......)** — Texto principal. [Quando usar.]
- **`accent` — [Nome Evocativo] (#......)** — CTAs, links, foco. [Quando usar.]
- **`muted` — [Nome Evocativo] (#......)** — Texto secundário, divisores. [Quando usar.]
- **`border` — [Nome Evocativo] (#......)** — Bordas e separadores. [Quando usar.]

## 3. Tipografia  (Typography Rules)

[Parágrafo descrevendo o pareamento e a sensação que produz.]

- **Display** (h1, h2): [família, weight, escala em rem]
- **Body**: [família, weight, line-height]
- **Mono**: [família, uso]
- **Escala modular**: [ratio — ex.: 1.25 perfect fourth — com valores em rem]

## 4. Estilos de Componentes  (Component Stylings)

[Parágrafo descrevendo a personalidade dos componentes em conjunto.]

- **Botões**: [forma em prosa — ex.: "pill-shaped, peso visual médio, fundo accent sólido"; estados]
- **Cards**: [presença/ausência — ex.: "sem cards-padrão; separação por espaço e tipografia"]
- **Inputs**: [estilo, foco, validação]
- **Navegação**: [estrutura, comportamento mobile]

## 5. Princípios de Layout  (Layout Principles)

[Parágrafo descrevendo a postura geral do layout — denso/arejado, simétrico/assimétrico, baseado em grid ou em ritmo tipográfico.]

- **Geometria & Forma**: [border-radius traduzido em prosa — "cantos pill-shaped em CTAs, sutilmente arredondados em cards"; bordas; shapes assimétricas se houver]
- **Espaçamento**: escala [4, 8, 12, 16, 24, 32, 48, 64, 96] — [ou outra justificada]
- **Densidade**: [da pergunta 7, em prosa]
- **Ritmo vertical**: [baseline grid, line-height]

---

## 6. Profundidade & Elevação

[Em prosa — ex.: "interface flat sem sombras; camadas se diferenciam por cor de fundo e borda" ou "sombras whisper-soft em cards interativos, sem elevação em estado de descanso".]

## 7. Motion

[Parágrafo descrevendo a postura de motion — estático, sutil ou expressivo — e onde aparece.]

- **Durações**: fast (Xms), base (Yms), slow (Zms)
- **Easings**: [funções específicas — não use `ease-in-out` genérico]
- **O que se move**: [hover, focus, page transition, scroll, etc.]

## 8. Antipadrões — banidos neste projeto

[Lista da pergunta 10, com justificativa de cada um. Esta seção é **diferencial deste kit**: garante que o agente nunca recaia em defaults Tailwind/shadcn.]

## 9. Referências

- **[Site 1]** — copiar [X específico]; não copiar [Y específico].
- **[Site 2]** — copiar [X]; não copiar [Y].
- **[Site 3]** — copiar [X]; não copiar [Y].
```

### `brain/DESIGN.tokens.json`

Complemento técnico do MD acima. **O `DESIGN.md` é a fonte primária** (compatível com a skill `design-md` do Google, que lê só MD). Este JSON existe para consumo direto no `/web` (Tailwind config, CSS variables) sem precisar parsear markdown:

```json
{
  "color": {
    "bg": "#...",
    "fg": "#...",
    "accent": "#...",
    "muted": "#...",
    "border": "#..."
  },
  "font": {
    "display": "...",
    "body": "...",
    "mono": "..."
  },
  "scale": [0.75, 0.875, 1, 1.125, 1.25, 1.5, 2, 2.5, 3, 4],
  "space": [4, 8, 12, 16, 24, 32, 48, 64, 96],
  "radius": { "sm": 0, "md": 0, "lg": 0, "full": 9999 },
  "motion": {
    "fast": "120ms",
    "base": "200ms",
    "slow": "400ms",
    "ease": "cubic-bezier(0.2, 0.0, 0.0, 1.0)"
  }
}
```

> Os valores acima são placeholders. **Substitua todos** com base nas respostas das 10 perguntas. Nenhum default sobrevive.

## Validação ao final

Antes de salvar, confira:

**Anti-AI-slop:**
- [ ] Nenhum `shadow-md`, `shadow-lg` direto do Tailwind no DESIGN.md.
- [ ] Border-radius **não é** 8px universal.
- [ ] Paleta **não é** purple/blue genérica.
- [ ] Tipografia **não é** Inter (a menos que justificada explicitamente).
- [ ] Antipadrões da pergunta 10 estão **explicitamente listados** na seção 8.
- [ ] Antipadrões automáticos de viewport adicionados (hero estoura, headline > 12vw mobile, display > 6rem mobile).

**Primeiro viewport:**
- [ ] Simulação mental do hero em 375×812 cabe sem scroll.
- [ ] Orçamento de altura por bloco respeitado (header 8%, headline 50%, mídia 30%, CTAs 12%).
- [ ] Display font usa `clamp()` ou tem variante mobile reduzida (não tamanho fixo).

**Compatibilidade Google Stitch:**
- [ ] Cores têm **nome evocativo + hex em parênteses + papel funcional** (não só token).
- [ ] Cada seção começa com **prosa descritiva** antes de qualquer lista/tabela.
- [ ] Valores técnicos (radius, shadows) são **traduzidos para linguagem natural** ("pill-shaped", "whisper-soft") antes de aparecerem como número.
- [ ] Seções 1-5 usam os títulos canônicos (Atmosfera & Tema Visual, Cores & Papéis, Tipografia, Estilos de Componentes, Princípios de Layout).

**Geral:**
- [ ] Cada decisão tem **justificativa em prosa**, não só valor.
- [ ] `DESIGN.tokens.json` reflete os valores do MD, sem divergência.

Se algum item falhar, refaça aquela seção antes de salvar.
