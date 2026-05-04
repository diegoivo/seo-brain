
# /branding-clone — QA visual pós-clone

Sub-agent que **fecha o loop de validação** que o `/branding-clone` original perdia. Sem ele, o clone aplica tokens cegamente e o usuário descobre divergência só depois de navegar.

## Quando rodar

- **Automaticamente** ao final de `/branding-clone` (etapa 6 da skill principal).
- **Manualmente** quando usuário pedir "validar clone", "comparar com original", "diff de clone".

## Pré-condições

1. `/branding-clone` já rodou e gerou:
   - `.cache/clone/full.png` (screenshot do site real)
   - `.cache/clone/extract.json` (tokens extraídos)
   - `brain/DESIGN.md` populado
2. Web local rodando: `npm run web:dev` (porta aleatória via `get-port`)
3. `agent-browser` no PATH (mesmo pré-check da `/branding-clone`)

Se algo faltar, abortar com mensagem específica: "Rode /branding-clone primeiro" ou "Suba o dev server: npm run web:dev".

## Pipeline

### 1. Captura do clone local

```bash
# Pega URL do dev server (lê de logs ou de cache)
LOCAL_URL="http://localhost:$(cat .cache/dev-port)"

agent-browser open "$LOCAL_URL"
sleep 2
agent-browser eval --stdin <<'EOF'
window.scrollTo(0, document.body.scrollHeight);
EOF
sleep 1
agent-browser screenshot .cache/clone/local-full.png --full-page
agent-browser eval --stdin < scripts/clone-extract.js > .cache/clone/local-extract.json
```

Reusa o mesmo extractor da `/branding-clone`. Output: `local-full.png` + `local-extract.json`.

### 2. Diff de tokens (real vs local)

Sub-agent compara `extract.json` (real) com `local-extract.json` (clone):

| Dimensão | Real | Local | Delta | Veredicto |
|---|---|---|---|---|
| Paleta dominante | `#1649FF`, `#23292E` | `#1649FF`, `#0a0a0a` | accent ✅ · fg divergente | ⚠️ |
| Radius dominante | 38px | 6px | -32px | 🚨 (pílulas perdidas) |
| Type scale h1 | 60px / 800 / +0.3px | 75px / 800 / -1.89px | tracking invertido | 🚨 |
| Hero color | azul sobre branco | mesmo | OK | ✅ |
| Sections | 6 | 9 | +3 (genéricas) | ⚠️ |
| Imagens | 155 | 12 | -143 | 🚨 |
| Layout dominante | grid (4 sections) + flex | grid (9) | sem flex | ⚠️ |

### 3. Diff de pixels (heurística)

Como `pixelmatch` não está instalado por default no kit, usa heurística via `agent-browser eval`:

```js
// Calcula histograma de cores dos 2 screenshots, compara distribuição
// Hue + saturação dominantes em cada quadrante (top-left, top-right, etc).
```

Saída: percentual de divergência por quadrante. Quadrantes >30% divergentes são marcados.

### 4. Output — `.cache/clone/diff-report.md`

```markdown
# Diff report — clone de <url>

Gerado em <data>. Comparação entre real e local pós-/branding-clone.

## Veredicto: APROVADO / RESSALVAS / BLOQUEADO

## Deltas P0 (estruturais)
- 🚨 **Radius perdido**: real usa 38px (pílulas em CTAs), local usa 6px default. Considere `/branding-clone --respect-clone-scale` ou ajuste manual em `--radius-pill: 38px` no globals.css.
- 🚨 **Densidade composicional**: real tem 6 sections com cases coloridos + cards de posts; local tem 9 sections genéricas do scaffold. Estrutura precisa ser refeita após onboard.

## Deltas P1 (visuais)
- ⚠️ **Tracking h1 invertido**: real `+0.3px` (clean), local `-1.89px` (display tight). Decisão de mood — confirmar se a marca quer "sério/clean" (real) ou "moderno/punchy" (canônico).
- ⚠️ **Sections 6 vs 9**: scaffold do kit gera 9 sections genéricas. /website-create precisa receber composition.sections do clone para respeitar estrutura real.

## Deltas P2 (cosmético)
- ℹ️ **Imagens 155 vs 12**: real é rico em mídia (cases, posts, capas). Local sem imagens reais — esperado pré-conteúdo. Refaz após /seobrain:start popular.

## Próximos passos
1. Abrir `.cache/clone/decisions.md` e revisar respostas. Se 'híbrido' em radius, criar token `--radius-pill` no globals.css.
2. Ajustar manualmente o que QA marcou como 🚨 antes de prosseguir.
3. Re-rodar `/branding-clone` para confirmar deltas resolvidos.
```

### 5. Devolve veredicto ao orquestrador

- **APROVADO** (0 P0): segue fluxo normal do `/seobrain:start` — passa pra `/wiki-init` ou `/website-create`.
- **RESSALVAS** (P1 mas zero P0): mostra report, pergunta "prosseguir mesmo assim ou ajustar?".
- **BLOQUEADO** (1+ P0): pausa e pede ajuste manual ou re-clone.

## Limites assumidos

- `pixelmatch` real (npm) não é dep — heurística via histograma é menos precisa, mas zero peso.
- Hover/focus states ainda não validados (limite do agent-browser).
- Motion/animações: só detectamos presença (`hasMotion: true`), não fidelidade.
- Mobile/tablet: dependem de `agent-browser --viewport` (versão do binário).

Aceitar limites é parte do framework. Não tente clone 100%; tente clone reconhecível com diff explícito.

## Princípios

- **Nunca apresentar clone sem diff report.** Loop de validação é não-negociável após `/branding-clone`.
- **P0 bloqueia.** Radius perdido em marca com pílulas é 🚨, não warning.
- **Diff é citável.** Se o usuário disser "está parecido", aponte para os 3 P0 do report.
- **Reuso da skill /qa.** Pode ser invocado pelo `/branding-review` em loop maior antes de PR.
