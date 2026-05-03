---
name: onboard
description: Onboarding interativo do Agentic SEO Kit. 3 modos (Express default / Guiado / Auto) com pergunta aberta inicial. Sub-agent pesquisador via agent-browser quando há domínio existente. Sub-agent consultor de branding quando marca nova. Lint anti-vícios IA. POVs bloqueante. Auto-commit por fase. Roda na primeira clonagem ou quando o usuário pedir "iniciar projeto", "começar do zero", "configurar o kit", "fazer onboarding".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - WebSearch
  - WebFetch
---

# /onboard — v4

Transforma o kit em estado **template** em **initialized**, preenchendo o Brain. Trabalho braçal vai para sub-agents. O usuário decide o que **só ele sabe** e aprova.

## Pré-checks

1. Leia `.cache/onboard-state.json` se existir → modo `--resume`.
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
> - Tem logo / fotos / material visual?
> - Pretende deploy onde (Vercel default)?
>
> Pode escrever em formato livre. Quanto mais info, mais **modo Auto** consegue rodar sem perguntas. Mínimo: 1-2 linhas.

Espere a resposta do usuário. Se vier muito curta, ainda assim use o que tem.

---

## Pergunta 2 — Modo

Após a resposta inicial, **proponha um modo recomendado** baseado no que veio:

- **Auto** se: tem domínio existente OU resposta cobre maioria dos itens (posicionamento, persona, POVs, mood, deploy).
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

## Sub-agent pesquisador (todos os modos quando há domínio)

Se a resposta inicial tem domínio:
1. Tente `agent-browser` (se disponível): screenshot + extração de paleta/fontes/logo via JS eval. Ver skill `/site-clone`.
2. Fallback: `WebSearch` + `WebFetch`. Mínimo **3 buscas paralelas**:
   - Perfil profissional / sobre
   - Conteúdo publicado (blog, posts)
   - Posicionamento (concorrentes, "o que diferencia X")

Resultado vai para a proposta consolidada de cada fase.

## Sub-agent consultor de branding (marca nova)

Quando não há referência online forte:
1. Pesquisa **benchmarks do nicho** (3-5 concorrentes) — extrai paleta dominante, mood, voz comum
2. Propõe posicionamento **diferenciado** desse mainstream
3. Sugere persona provável + 3 POVs candidatos com perguntas curtas que extraem opinião do usuário se ele estiver em branco

---

## Modo Auto

Pipeline:

1. Sub-agents pesquisam tudo (paralelo).
2. **Mostra plano antes de gravar** (`plans/onboard-<data>.md`):
   ```
   ## Vou gravar
   - brain/index.md: posicionamento, domínio
   - brain/personas.md: persona principal
   - brain/principios-agentic-seo.md: 3 POVs
   - brain/DESIGN.md + tokens: paleta, fontes, mood
   - brain/tom-de-voz.md: customizações
   - brain/tecnologia/index.md + brain/config.md: deploy, escopo
   ```
3. Aguarda **"go"** para escrever.
4. Escreve tudo, faz auto-commit por fase: `chore(onboard): fase X — [resumo]`.
5. Apresenta diff final + 3 perguntas granulares específicas (não "tá bom?").
6. Se usuário ajustar, edita e re-commita.
7. Pergunta: "Posso já gerar o site? `/site-criar`."

## Modo Express (default)

Pipeline:

1. Sub-agents pesquisam.
2. **Para cada fase**, mostra proposta consolidada e pergunta apenas **o que ainda falta**:
   - **Fase 1** (identidade): se domínio veio na resposta inicial, pula. Senão pergunta.
   - **Fase 2** (posicionamento): se 3 POVs vieram, pula. Se faltam, **bloqueia e pergunta**: "Quais 3 opiniões fortes que mainstream contesta? Não responda genérico — preciso de algo que seu concorrente não diria publicamente."
   - **Fase 3** (design): se cores/mood vieram, propõe direto. Senão pergunta 3 escolhas-chave (mood em 3 adjetivos, paleta neutra/bicromática, density).
   - **Fase 4** (tom): geralmente skip (default Estadão + capitalização BR).
   - **Fase 5** (escopo): pergunta tipo de projeto + confirma Vercel.
3. Auto-commit por fase.
4. Apresenta resumo final + oferta `/site-criar`.

## Modo Guiado

Pipeline manual com batches por fase. Cada fase mostra recomendado, usuário aprova ou ajusta. Equivale ao modo Intermediário antigo.

---

## Lint de antivícios de IA (todos os modos)

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

Se algum match, reescreva com voz ativa antes de mostrar.

## POVs proprietários — bloqueante

Se 3 POVs estão ausentes ou são consenso de mercado ("SEO técnico importa", "conteúdo de qualidade vence"), **NÃO escreva**. Pergunte:

> Os 3 POVs que tenho são consenso. Preciso de algo proprietário. Pense:
>
> - Qual posição você defende que **seus pares discordam publicamente**?
> - O que mainstream do seu mercado diz que está errado, mas você sustenta?
> - Onde sua experiência prova um padrão que dados públicos contradizem?

Não auto-resolva.

## Auto-commit por fase

Após cada fase concluída e usuário aprovar:

```bash
git add brain/
git commit -m "chore(onboard): fase X — <resumo>"
```

## Retomada

`.cache/onboard-state.json`:
```json
{
  "started_at": "...",
  "mode": "express",
  "current_phase": 3,
  "completed_phases": [1, 2],
  "answers": { ... }
}
```

`/onboard --resume` carrega e segue.

## Conclusão

1. Mostra Brain populado.
2. Oferta `/site-criar` (Express auto / Guiado / não).
3. Apaga `.cache/onboard-state.json`.

## Princípios

- **Pergunta aberta primeiro.** Captura tudo de uma vez, reduz fricção.
- **Modo é decisão explícita.** Não assume.
- **Recomendado singular.** Não "Auto OU Express".
- **Trabalho braçal pra sub-agents.** Pesquisa proativa via agent-browser quando há domínio.
- **POVs bloqueia.** Não auto-resolve.
- **Antivícios IA limpos.** Lint antes de mostrar.
- **Auto-commit por fase.** Histórico granular.
- **Não improvise design existente.** Ignore DESIGN.md em outros diretórios.
