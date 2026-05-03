---
name: onboard
description: Onboarding orquestrador do SEO Brain — duas fases explícitas (brain + brandbook). Pergunta aberta inicial, decide modo (Express default / Guiado / Auto), chama /onboard-brain (identidade + POVs + voz + escopo) e /onboard-brandbook (visual + DESIGN.md via /design-init + tokens + scaffold). State persistido em .cache/onboard.md (markdown, retomável). Roda na primeira clonagem ou quando o usuário pedir "iniciar projeto", "começar do zero", "configurar o kit", "fazer onboarding".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - WebSearch
  - WebFetch
---

# /onboard — v5 (orquestrador de duas fases)

Transforma o kit em estado **template** em **initialized**. Estrutura explícita: **fase brain** (identidade, dados) + **fase brandbook** (visual). Cada fase é uma skill independente e re-rodável.

## Duas fases

| Fase | Skill chamada | O que faz |
|---|---|---|
| 1. Brain | [`/onboard-brain`](../onboard-brain/SKILL.md) | Identidade, posicionamento, personas, POVs, voz, escopo, deploy |
| 2. Brandbook | [`/onboard-brandbook`](../onboard-brandbook/SKILL.md) | Atmosfera, paleta, tipografia, mood; chama `/design-init`; popula scaffold em `web/src/app/brandbook/` |

Ordem importa: brandbook lê `brain/index.md` para puxar mood/posicionamento da fase 1.

## Pré-checks

1. Leia `.cache/onboard.md` se existir → modo `--resume` (continuar de onde parou).
2. Se algum `kit_state` for `initialized`, avise: "Brain já inicializado. Refazer sobrescreve. Confirma?"

---

## Pergunta inicial (sempre, antes de decidir modo)

Diga ao usuário:

> Antes de começar, me conte sobre o seu projeto **com o máximo de informações que você tiver**. Misture o que importa:
>
> - Tipo de marca (pessoal / empresa / ONG / não-comercial / outro)
> - Já existe ou está criando agora? Se existe: **passe o domínio** (vou pesquisar)
> - Sobre o que é o negócio / de que vive / quem atende
> - Como sua marca se diferencia (concorrentes, posição, opinião contrária ao mainstream)
> - Quais 3 opiniões fortes você sustenta sobre o tema central
> - Personas-alvo (cargos, contextos, dores)
> - Tom desejado (formal/informal, humor, 1ª pessoa…) — se tiver preferência
> - Cores, fontes, mood que **não suporta** ou **adora**
> - Tem material visual?
> - Pretende deploy onde (Vercel default)?
>
> Pode escrever em formato livre. Quanto mais info, mais **modo Auto** consegue rodar sem perguntas. Mínimo: 1-2 linhas.

Espere a resposta. Se vier curta, ainda assim use o que tem.

---

## Pergunta 2 — Modo

Após a resposta inicial, **proponha um modo recomendado**:

- **Auto** se: tem domínio existente OU resposta cobre maioria dos itens.
- **Express** (default) se: resposta tem 30-60% das info, sub-agent pesquisa o resto.
- **Guiado** se: resposta muito curta ou usuário pediu controle explícito.

Pergunte:

> Com base no que você descreveu, recomendo modo **[X]**.
>
> 1. **Auto** — eu decido tudo, mostro um diff final pra você aprovar/ajustar
> 2. **Express** ⭐ — perguntas mínimas só onde faltam dados-chave
> 3. **Guiado** — perguntas em batch por fase, você valida cada uma
>
> Qual?

**Não prossiga sem resposta explícita.**

---

## Inicialização do controle

Crie `.cache/onboard.md` com:

```markdown
---
mode: <auto|express|guiado>
started_at: <ISO date>
domain_existing: <url|null>
input_raw: |
  <copy literal da resposta inicial do usuário>
---

# Onboard — controle

## Fase 1 — Brain
Status: pending

## Fase 2 — Brandbook
Status: pending

## Próximo passo
Iniciar /onboard-brain
```

Atualize este arquivo a cada checkpoint (uma fase concluída → status: completed; próxima fase → in_progress).

---

## Fluxo

### 1. Sub-agent pesquisador (quando há domínio)

Se a resposta inicial trouxe domínio:

1. Tente `/site-clone` (agent-browser): screenshot + paleta + fontes + logo.
2. Fallback: `WebSearch` + `WebFetch`. Mínimo **3 buscas paralelas**:
   - Perfil profissional / sobre
   - Conteúdo publicado (blog, posts)
   - Posicionamento (concorrentes, "o que diferencia X")

Resultado salva em `.cache/onboard-research.md` para as duas fases consumirem.

### 2. Sub-agent consultor (marca nova, sem referência online)

1. Pesquisa benchmarks do nicho (3-5 concorrentes).
2. Propõe posicionamento diferenciado.
3. Sugere persona + 3 POVs candidatos.

### 3. Chamar Fase 1 — Brain

Invoque `/onboard-brain` passando o modo, a resposta inicial e (se houver) `.cache/onboard-research.md`.

A fase 1 retorna controle quando:
- Brain populado: `brain/index.md`, `brain/personas/<slug>.md`, `brain/povs/<slug>.md` (mínimo 3), `brain/tom-de-voz.md`, `brain/tecnologia/index.md`, `brain/config.md`.
- `kit_state: initialized` em todos os arquivos do brain.
- Auto-commit por sub-fase (`chore(onboard-brain): <slug>`).

Atualize `.cache/onboard.md`: Fase 1 → completed.

### 4. Chamar Fase 2 — Brandbook

Invoque `/onboard-brandbook`. Esta skill:
- Lê `brain/index.md` (mood, posicionamento, antipadrões herdados).
- Chama `/design-init` (10 perguntas) com defaults inferidos do brain.
- Gera `brain/DESIGN.md` + `brain/DESIGN.tokens.json`.
- Atualiza `web/src/app/globals.css` (somente fontes — escala/grid/spacing são canônicos).
- Popula scaffold em `web/src/app/brandbook/` com tokens vivos (rotas já existem; preencher textos/exemplos com mood do projeto).

A fase 2 retorna controle quando:
- `brain/DESIGN.md` `kit_state: initialized`.
- Build do site passa com novos tokens.
- Brandbook ao vivo renderiza paleta/tipo do projeto.

Atualize `.cache/onboard.md`: Fase 2 → completed.

---

## Lint de antivícios de IA (todos os modos, ambas as fases)

Antes de escrever **qualquer copy proposto** no Brain, passe pelo lint:

```js
const ANTIVICIOS = [
  /vale destacar/i, /é importante ressaltar/i,
  /em síntese|em suma/i, /no cenário atual/i,
  /no mundo cada vez mais/i, /uma jornada de/i,
  /elevando ao próximo nível/i, /desbloqueando/i,
  /navegando pelas águas/i,
  /\bdelve\b|\bcrucial\b|\brobust\b|\bcomprehensive\b/i,
  /\bnuanced\b|\bmultifaceted\b|\bpivotal\b|\btapestry\b/i,
];
```

Match → reescreva com voz ativa antes de mostrar.

## POVs proprietários — bloqueante (delegado para `/onboard-brain`)

Esta regra vive na skill `/onboard-brain`. O orquestrador apenas observa: se a fase 1 não conseguir 3 POVs proprietários, o fluxo **pausa** ali — não avança para brandbook.

## Auto-commit por sub-fase

Cada sub-fase (dentro de brain ou brandbook) faz auto-commit:

```bash
git add brain/ web/src/app/
git commit -m "chore(onboard-<fase>): <slug>"
```

## Conclusão

1. Mostra Brain + Brandbook populados.
2. Apaga `.cache/onboard.md` e `.cache/onboard-research.md`.
3. Oferta `/site-criar` (Express auto / Guiado / não).
4. Oferta `/blogpost` (primeiro artigo).

## Princípios

- **Duas fases explícitas**, não pipeline opaco. Brain antes de brandbook.
- **Cada fase é re-rodável**: `/onboard-brain --redo` ou `/onboard-brandbook --redo` funcionam isoladas.
- **State em markdown**, não JSON. `.cache/onboard.md` é human-readable.
- **Pergunta aberta primeiro.** Captura tudo de uma vez, reduz fricção.
- **Modo é decisão explícita.** Não assume.
- **Trabalho braçal pra sub-agents.** Pesquisa proativa via `/site-clone` quando há domínio.
- **POVs bloqueia.** Não auto-resolve. Bloqueio vive em `/onboard-brain`.
- **Auto-commit por sub-fase.** Histórico granular.
- **Não improvise design existente.** Ignore DESIGN.md em outros diretórios.
