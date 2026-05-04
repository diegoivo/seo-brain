---
name: branding-onboard
description: Brand onboarding orchestrator — generates visual brandbook (DESIGN.md + DESIGN.tokens.json + live Next.js scaffold). Reads brain/index.md (mood, posicionamento) and invokes /branding-init with inferred defaults. Updates only fonts in globals.css (scale/grid/spacing are framework canonical — never touched). Populates scaffold copy in web/src/app/brandbook/. Re-runnable in isolation. Use when user asks "rodar fase brandbook", "gerar brandbook", "brand onboarding", "refazer design", "redo brand setup", or invoked by /seobrain:start. Renamed from /onboard-brandbook (v0.1.0).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
---

# /branding-onboard — fase 2 do onboarding

Materializa o **brandbook visual** sobre a fundação canônica do framework (grid 12-col + perfect fourth + spacing 4-base). **Não toca em escala, grid ou spacing** — apenas em fontes, paleta e mood.

## Pré-condição

- `brain/index.md` precisa estar `kit_state: initialized`. Se não estiver, peça ao usuário: "Brain ainda em estado template. Rode `/wiki-init` antes."

## Inputs

Quando chamada pelo `/onboard`:
- `mode`: `auto` | `express` | `guiado`
- `research`: caminho opcional para `.cache/onboard-research.md`

Quando standalone:
- Lê `brain/index.md` para puxar mood/posicionamento.
- Pergunta o modo se não vier.

## Sub-fases

### 2.1 Inferência de defaults

Lê:
- `brain/index.md` → mood verbal, antipadrões herdados, posicionamento.
- `brain/personas/index.md` → contexto de uso (B2B sério vs. consumidor jovial).
- `.cache/onboard-research.md` → posicionamento textual extraído pelo `/onboard` (nunca paleta — pesquisa textual não captura visual).
- `.cache/branding-clone/extract.json` → paleta, fontes, logo (apenas se `/branding-clone` rodou com sucesso e usuário tinha domínio existente).

Produz **defaults inferidos** para passar ao `/branding-init` — não para gravar direto. O usuário ainda confirma cada decisão.

**Sem clone visual**: vai direto para `/branding-init` from-scratch. As 10 perguntas anti-AI-slop garantem o resultado, mesmo sem inspiração de site existente.

#### Regras de inferência (críticas)

- **Paleta, fontes, logo, mood visual**: vêm **só** de `.cache/branding-clone/extract.json`. Se ausente → defaults from-scratch via `/branding-init`.
- **Nunca infira cor a partir de descrição textual.** Não traduza "eles falam em sustentabilidade" para "verde", "premium" para "preto + dourado", "tech" para "azul + roxo". Isso é AI-slop.
- **Nunca invente fonte plausível.** "Inter como fallback comum" é exatamente o que a regra do framework proíbe.
- **Posicionamento textual** (do `.cache/onboard-research.md`) entra no prompt do `/branding-init` como contexto editorial — nunca como fonte direta de tokens visuais.

### 2.2 Chamar `/branding-init`

Invoque a skill `/branding-init` (10 perguntas anti-AI-slop) **com os defaults inferidos pré-preenchidos**. O `/branding-init`:
- Pergunta atmosfera, paleta, tipografia, mood, antipadrões.
- Grava `brain/DESIGN.md` (narrativa) + `brain/DESIGN.tokens.json` (tokens).
- Aplica regra do primeiro viewport (hero cabe em 100dvh mobile sem scroll).
- Aplica regras anti-AI-slop (nada de gradiente purple→blue, shadow-md genérico, etc).

Resultado: `kit_state: template` → `initialized` em `brain/DESIGN.md`.

### 2.3 Atualizar `web/src/app/globals.css` (somente fontes + cores)

**Não toque em**:
- Escala tipográfica (`--text-*`) — canônica.
- Grid (`.grid-12`, `.grid-col`, `--grid-gap`, `--grid-margin`) — canônico.
- Spacing scale (`--space-N`) — canônico.
- Anchor-down spacing em `.prose` — canônico.

**Atualize**:
- `--font-display`, `--font-body`, `--font-mono` em `:root` (CSS vars internas).
- `:root` color tokens: `--bg`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-fg`.
- (Opcional) Adicione `next/font` import no `layout.tsx` se as fontes vieram do Google/Bunny Fonts. Cheque whitelist em [`/website-bestpractices`](../website-bestpractices/SKILL.md).

### 2.4 Popular o scaffold em `web/src/app/brandbook/`

O scaffold já existe pré-commitado (`/brandbook`, `/brandbook/typography`, `/brandbook/grid`, `/brandbook/colors`, `/brandbook/components`, `/brandbook/wordmark`). Rotas leem tokens vivos — só atualize **textos exemplo** que precisam refletir a marca:

- `/brandbook/page.tsx` — sumário do design system (mood + posicionamento em 1 parágrafo).
- `/brandbook/typography/page.tsx` — sample paragraph com voz da marca (não placeholder genérico).
- `/brandbook/wordmark/page.tsx` — wordmark com nome real da marca (substituir "seobrain").

Demais rotas herdam tokens automaticamente.

### 2.5 Imagens — estilo + provider

Chama `/branding-images` para perguntar:

- **Estilo** (5 opções: editorial / candid / technical / archival / experimental)
- **Tipos** em uso (hero universal; secondary, avatar, illustration opt-in)
- **Provider** (Pexels default, Unsplash secundário, OpenAI opcional pago)

Resultado salvo em `brain/DESIGN.md` na seção "Imagens" + queries default
geradas a partir do estilo escolhido. Skill `/blogpost` consome essas
queries quando precisa de imagem.

Pula esta sub-fase se o usuário pedir &quot;sem imagens&quot; (raro — só sites
com tom muito tipográfico).

### 2.6 Smoke test

```bash
cd web && npm run build
```

Build deve passar. Se quebrar (provável: import de fonte falhando), corrija antes de prosseguir.

Abra mentalmente `/brandbook` em viewport 375×812 e 1280×800. Verifique:
- Hero cabe sem scroll.
- Tipografia respeitando measure 65ch.
- Grid alinhado.
- Paleta aplicada em `:root` propaga para todo `.brandbook-shell`.

### 2.7 Auto-commit

```bash
git add brain/DESIGN.md brain/DESIGN.tokens.json web/src/app/globals.css web/src/app/brandbook/ web/src/app/layout.tsx
git commit -m "chore(branding-onboard): tokens aplicados — <mood-slug>"
```

---

## Regras críticas

1. **Não inclua `$schema`** apontando para URL externo em `DESIGN.tokens.json`. Não invente domínios (`schemas.agenticseo.sh` é alucinação — não existe).
2. **Apenas fontes gratuitas** (Google Fonts, Bunny Fonts, OFL/SIL). Whitelist em `/website-bestpractices`.
3. **Não criar logo/ícone.** Apenas wordmark estilizado (typography only). A skill `/wordmark` (interna ao brandbook scaffold) gera variações.
4. **Não toque na escala/grid/spacing canônicos.** Se o usuário pedir mudança nestes, redirecione: "Escala e grid são canônicos do framework (docs/typography.md, docs/grid-system.md). Mudança aqui afeta todos os projetos. Você quer mesmo desviar?"

---

## Atualização do controle

Ao fim, edite `.cache/onboard.md`:

```markdown
## Fase 2 — Brandbook
Status: completed
- [x] 2.1 Defaults inferidos
- [x] 2.2 /branding-init concluído
- [x] 2.3 globals.css atualizado (fontes + cores)
- [x] 2.4 Scaffold do brandbook populado
- [x] 2.5 Smoke test (build passa)
- [x] 2.6 Auto-commit
```

## Conclusão

1. Atualiza `brain/log.md`: `## <data> — branding-onboard concluído`.
2. Mostra URL local: `npm run dev` → `/brandbook`.
3. Devolve controle ao orquestrador `/onboard` (que conclui o fluxo) ou ao usuário (se rodando standalone).
4. Sugestão: "Brandbook ao vivo. Quer gerar a estrutura do site agora? Rode `/website-create`."
