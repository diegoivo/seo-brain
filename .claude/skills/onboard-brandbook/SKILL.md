---
name: onboard-brandbook
description: Fase 2 do onboarding — gera o brandbook visual (DESIGN.md + tokens + scaffold ao vivo). Lê brain/index.md (mood, posicionamento) e chama /design-init com defaults inferidos. Atualiza somente fontes em globals.css (escala/grid/spacing são canônicos do framework — não mexer). Popula textos do scaffold em web/src/app/brandbook/. Re-rodável isoladamente. Roda quando /onboard chamar ou usuário pedir "rodar fase brandbook", "gerar brandbook", "refazer design".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
---

# /onboard-brandbook — fase 2 do onboarding

Materializa o **brandbook visual** sobre a fundação canônica do framework (grid 12-col + perfect fourth + spacing 4-base). **Não toca em escala, grid ou spacing** — apenas em fontes, paleta e mood.

## Pré-condição

- `brain/index.md` precisa estar `kit_state: initialized`. Se não estiver, peça ao usuário: "Brain ainda em estado template. Rode `/onboard-brain` antes."

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
- `.cache/onboard-research.md` → paleta/fontes do site existente, se houver.

Produz **defaults inferidos** para passar ao `/design-init` — não para gravar direto. O usuário ainda confirma cada decisão.

### 2.2 Chamar `/design-init`

Invoque a skill `/design-init` (10 perguntas anti-AI-slop) **com os defaults inferidos pré-preenchidos**. O `/design-init`:
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
- (Opcional) Adicione `next/font` import no `layout.tsx` se as fontes vieram do Google/Bunny Fonts. Cheque whitelist em [`/web-best-practices`](../web-best-practices/SKILL.md).

### 2.4 Popular o scaffold em `web/src/app/brandbook/`

O scaffold já existe pré-commitado (`/brandbook`, `/brandbook/typography`, `/brandbook/grid`, `/brandbook/colors`, `/brandbook/components`, `/brandbook/wordmark`). Rotas leem tokens vivos — só atualize **textos exemplo** que precisam refletir a marca:

- `/brandbook/page.tsx` — sumário do design system (mood + posicionamento em 1 parágrafo).
- `/brandbook/typography/page.tsx` — sample paragraph com voz da marca (não placeholder genérico).
- `/brandbook/wordmark/page.tsx` — wordmark com nome real da marca (substituir "seobrain").

Demais rotas herdam tokens automaticamente.

### 2.5 Imagens — estilo + provider

Chama `/setup-images` para perguntar:

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
git commit -m "chore(onboard-brandbook): tokens aplicados — <mood-slug>"
```

---

## Regras críticas

1. **Não inclua `$schema`** apontando para URL externo em `DESIGN.tokens.json`. Não invente domínios (`schemas.agenticseo.sh` é alucinação — não existe).
2. **Apenas fontes gratuitas** (Google Fonts, Bunny Fonts, OFL/SIL). Whitelist em `/web-best-practices`.
3. **Não criar logo/ícone.** Apenas wordmark estilizado (typography only). A skill `/wordmark` (interna ao brandbook scaffold) gera variações.
4. **Não toque na escala/grid/spacing canônicos.** Se o usuário pedir mudança nestes, redirecione: "Escala e grid são canônicos do framework (docs/typography.md, docs/grid-system.md). Mudança aqui afeta todos os projetos. Você quer mesmo desviar?"

---

## Atualização do controle

Ao fim, edite `.cache/onboard.md`:

```markdown
## Fase 2 — Brandbook
Status: completed
- [x] 2.1 Defaults inferidos
- [x] 2.2 /design-init concluído
- [x] 2.3 globals.css atualizado (fontes + cores)
- [x] 2.4 Scaffold do brandbook populado
- [x] 2.5 Smoke test (build passa)
- [x] 2.6 Auto-commit
```

## Conclusão

1. Atualiza `brain/log.md`: `## <data> — onboard-brandbook concluído`.
2. Mostra URL local: `npm run dev` → `/brandbook`.
3. Devolve controle ao orquestrador `/onboard` (que conclui o fluxo) ou ao usuário (se rodando standalone).
4. Sugestão: "Brandbook ao vivo. Quer gerar a estrutura do site agora? Rode `/site-criar`."
