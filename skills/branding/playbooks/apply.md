# Playbook: `/branding apply`

Aplica os tokens do Brain ao site Next.js: atualiza `web/src/app/globals.css` (apenas cores e fontes — **nunca** escala/grid/spacing) e popula 7 rotas vivas em `web/src/app/brandbook/*`.

Modo orquestrador — depois de `discover` ou `import`.

## Pré-condições

- `brain/DESIGN.md` com `kit_state: initialized`.
- `brain/DESIGN.tokens.json` com valores reais (não placeholders).
- `web/` configurado com Tailwind v4 (já vem pré-instalado).

Se algum falhar, redirecione: "Brain ainda em estado template — rode `/branding discover` ou `/branding import <url>` antes."

## Inputs

Quando chamada por orquestrador (`/seo-brain start`):
- `mode`: `auto` | `express` | `guiado` (default `auto`).
- `research`: caminho opcional para `.cache/onboard-research.md`.

Standalone:
- Lê `brain/index.md` para puxar mood/posicionamento.

## Sub-fases

### 1. Lê Brain inteiro

- `brain/index.md`, `brain/DESIGN.md`, `brain/DESIGN.tokens.json`, `brain/personas.md`, `brain/principios-agentic-seo.md`, `brain/tom-de-voz.md`.

### 2. Atualiza `web/src/app/globals.css` — cores + fontes apenas

**Não toque em** (canônicos do framework):
- Escala tipográfica (`--text-*`).
- Grid (`.grid-12`, `.grid-col`, `--grid-gap`, `--grid-margin`).
- Spacing scale (`--space-N`).
- Anchor-down spacing em `.prose`.

**Atualize**:
- `--font-display`, `--font-body`, `--font-mono` em `:root`.
- `:root` color tokens: `--bg`, `--fg`, `--accent`, `--accent-fg`, `--fg-strong`, `--fg-muted`, `--fg-subtle`, `--surface-elevated`, `--surface-sunken`, `--border`, `--border-strong`, `--success`, `--warning`, `--danger`, `--info`.
- Variantes dark mode (`@media (prefers-color-scheme: dark)`) com tokens recompostos (não invertidos).
- (Opcional) `next/font` import em `web/src/app/layout.tsx` se fontes vieram do Google/Bunny. Cheque whitelist em `references/typography-guide.md`.

### 3. Popula scaffold em `web/src/app/brandbook/*`

Layout `web/src/app/brandbook/layout.tsx`:

```tsx
import "../globals.css";

export const metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

> **Garante CSS** — sem `import "../globals.css"` o brandbook renderiza sem estilos (resolve incidente conhecido).

7 rotas obrigatórias em `web/src/app/brandbook/<seção>/page.tsx`:

#### `/brandbook` (índice)

Hub com links para todas as seções + identidade do projeto + 3 POVs proprietários da marca.

#### `/brandbook/cores` (visual color picker)

- Swatches grandes para cada cor da paleta: nome evocativo + hex + papel.
- Color picker visual (HSL slider) que edita tokens e atualiza preview ao vivo.
- Combinações em uso: botão accent em fundo bg, texto fg em fundo bg, links.
- Contraste WCAG AA verificado (badge ✓/✗ por par).
- Botão "Salvar no Brain" — escreve novos hex em `brain/DESIGN.tokens.json` e re-renderiza.

#### `/brandbook/tipografia`

- Pairings opinativos (apenas Google/Bunny).
- Preview em uso real: h1-h4 + parágrafo longo + mono em código.
- Escala modular ativa (1.125 / 1.250 / 1.333 / 1.500).
- Switcher de pairing — aplica e mostra ao vivo.
- Botão "Salvar no Brain".

#### `/brandbook/voz`

- Tom de voz aplicado em frases reais (extraídas de `brain/tom-de-voz.md` + 3 POVs).
- Voice samples por persona: bloco "Como falar com [persona]" vs "Como NÃO falar".
- Antivícios IA — comparativo visual: "❌ vale destacar" vs "✅ direto".

#### `/brandbook/componentes`

Todos os estados em tela:
- **Botões**: default / hover / focus / disabled / loading / accent / ghost.
- **Inputs**: empty / filled / focus / error / disabled.
- **Cards**: estático / hoverável / clicável.
- **Form**: completo simulando contato.
- **Navigation**: header desktop + mobile menu.

#### `/brandbook/layout`

- Grid base com colunas visíveis.
- Escala de espaçamento (visual de tokens).
- Border-radius em diferentes elementos.
- Profundidade & elevação em uso.

#### `/brandbook/marca`

- Logo lockup: variações (horizontal, vertical, stacked, mark only).
- Favicon: 16x16, 32x32, 180x180 (apple-icon).
- OG image variations: home, post, página, autor.
- Do/Don't visual grid: 4 antipadrões do `DESIGN.md` §8 lado a lado com versão correta.

### 4. Bidirecional — edição reflete no Brain

Quando usuário ajusta cor/fonte via picker visual:

1. POST para route handler `/api/brandbook/save` → escreve em `DESIGN.tokens.json`.
2. Atualiza `DESIGN.md` (prosa correspondente) via `update-brain`.
3. Hot reload do Next.js renderiza com novos tokens.

Quando usuário pede mudança via chat:

1. Edita Brain primeiro.
2. Brandbook reflete automaticamente (via CSS variables).

### 5. Smoke test

```bash
cd web && npm run build
```

Build deve passar. Se quebrar (provável: import de fonte falhando), corrija antes de prosseguir.

Abra mentalmente `/brandbook` em viewport 375×812 e 1280×800. Verifique:
- Hero cabe sem scroll.
- Tipografia respeitando measure 65ch.
- Grid alinhado.
- Paleta aplicada em `:root` propaga para todo `.brandbook-shell`.

### 6. Roda dev server e abre browser

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

### 7. Auto-commit

```bash
git add brain/DESIGN.md brain/DESIGN.tokens.json web/src/app/globals.css web/src/app/brandbook/ web/src/app/layout.tsx
git commit -m "chore(branding-apply): tokens aplicados — <mood-slug>"
```

## Princípios

- **CSS sempre garantido** — `import "../globals.css"` no layout.
- **Color picker no navegador, não em texto** — usuário vê em uso antes de aprovar.
- **Tipografia switcher visual** — preview real antes de gravar.
- **Brain é source-of-truth** — brandbook reflete, não substitui.
- **Apenas fontes grátis** — whitelist enforced no picker.
- **Componentes em contexto** — cada estado renderizado em uso real, não isolado.
- **Não toque em escala/grid/spacing canônicos.** Se usuário pedir mudança, redirecione: "Escala e grid são canônicos do framework (`docs/typography.md`, `docs/grid-system.md`). Mudança aqui afeta todos os projetos."

## Atualização do controle

Ao fim, edite `.cache/onboard.md` (se rodando dentro de orquestrador):

```markdown
## Fase — Branding apply
Status: completed
- [x] globals.css atualizado (fontes + cores)
- [x] Scaffold das 7 rotas populado
- [x] Smoke test (build passa)
- [x] Auto-commit
```

## Conclusão

1. Atualiza `brain/log.md`: `## YYYY-MM-DD — /branding apply concluído`.
2. Mostra URL local: `npm run dev` → `/brandbook`.
3. Sugere próximo passo: "Quer gerar o brandbook em PDF/HTML? Rode `/branding export`."
