---
name: onboard
description: Onboarding interativo do Agentic SEO Kit. 18 perguntas em 5 fases (identidade, posicionamento, design, tom, escopo). Transforma o kit-template em projeto-inicializado preenchendo o Brain. Roda na primeira clonagem do kit ou quando o usuário pedir "iniciar projeto", "começar do zero", "configurar o kit".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
---

# /onboard — Onboarding interativo

Transforma o kit em estado **template** em um projeto **initialized**, preenchendo o Brain com as decisões reais do usuário.

## Quando rodar

- **Primeira clonagem** do kit (hook `SessionStart` sugere automaticamente).
- Quando o usuário disser "iniciar projeto", "começar do zero", "configurar o kit", "preencher o brain".
- Para retomar onboarding parcial (estado salvo em `.cache/onboard-state.json`).

## Pré-checks

Antes de começar:

1. Leia `.cache/onboard-state.json` se existir (retomada).
2. Para cada arquivo do brain, leia o frontmatter `kit_state`. Se já está `initialized`, **avise**: "Brain já inicializado. Tem certeza que quer rodar onboard novamente? Isso vai sobrescrever decisões anteriores."
3. Mostre ao usuário as 5 fases que virão (overview de ~30s).

## Filosofia

- **Uma fase por vez.** Termine fase, mostre diff, confirme, **só então** passe à próxima.
- **Perguntas concretas, não genéricas.** "Em uma frase, o que torna sua marca diferente do segundo concorrente?" > "Qual o posicionamento?"
- **Sub-perguntas quando vago.** Se a resposta vier "moderno", "clean", "profissional" — **insista** com forçante: "Cite 2 marcas que têm essa vibe — me ajude a calibrar."
- **Persistência incremental.** A cada fase, escreva no arquivo correspondente E salve estado em `.cache/onboard-state.json` com a fase concluída.

---

## Fase 1 — Identidade (3 perguntas)

**Atualiza:** `brain/index.md`

1. **Nome do projeto** — como você chama? (ex.: "diegoivo.com.br", "Conversion Academy", "Newsletter de SEO Agêntico").

2. **Sobre você** — em uma frase: quem é você e qual seu papel neste projeto? (ex.: "Diego Ivo, fundador da Conversion, criador deste kit. Este projeto é meu site pessoal.").

3. **Domínio** — qual o domínio? Se ainda não tem, responda "ainda não sei" — coloco placeholder.

→ Atualiza `brain/index.md`: troca `kit_state: template` por `initialized`, preenche posicionamento e domínio.

→ **Mostra diff. Pergunta:** "Diff acima. Algo a ajustar antes de seguirmos para Posicionamento?"

→ **Salva** em `.cache/onboard-state.json`: `{ phase: 1, completed: true }`.

---

## Fase 2 — Posicionamento (3 perguntas)

**Atualiza:** `brain/index.md` (campo Posicionamento), `brain/personas.md`, `brain/principios-agentic-seo.md`

4. **O que torna esta marca única em uma frase.** Seja específico — "fazer SEO bem" não basta.
   - Bom: "ajudamos founders B2B a crescer no orgânico sem depender de mídia paga"
   - Ruim: "consultoria de marketing digital de alta qualidade"

   Se a resposta for vaga, pergunte: "Qual o problema concreto que seu melhor cliente tem que você resolve melhor que os outros?"

5. **Persona principal** — descreva 1 persona-alvo (mín.) em ~5 linhas:
   - Quem é (cargo / contexto)
   - Objetivo dela
   - Maior dor
   - Onde busca informação
   - O que precisa de você

   Se quiser, pergunte por uma 2ª persona (opcional, máx. 3).

6. **3 POVs proprietários sobre o tema central** — quais 3 opiniões fortes você sustenta que **não são consenso**? Sem isso, seu conteúdo é AI slop.
   - Para cada POV, anote: a posição em uma frase + o porquê.
   - Se o usuário ficar travado, pergunte: "O que seus pares discordam de você? Onde você defende uma posição que mercado mainstream contesta?"

→ Atualiza:
- `brain/index.md` (Posicionamento)
- `brain/personas.md` (preenche Persona 1, troca `kit_state` para `initialized`)
- `brain/principios-agentic-seo.md` (preenche os 3 POVs, troca `kit_state` para `initialized`)

→ Mostra diff. Confirma. Salva estado fase 2.

---

## Fase 3 — Design system

**Chama a skill `/design-init`** (10 perguntas). Ela gera `brain/DESIGN.md` + `brain/DESIGN.tokens.json` opinativos, anti-AI-slop.

→ Quando `/design-init` retornar, troca `kit_state: template` para `initialized` em `brain/DESIGN.md`.

→ Salva estado fase 3.

---

## Fase 4 — Tom de voz (1 pergunta de calibração)

**Atualiza:** `brain/tom-de-voz.md` (seção "Customizações deste projeto")

7. **Calibração do tom** — o default já é PT-BR + voz ativa + frases curtas + capitalização brasileira + antivícios de IA banidos. Quer **ajustar** algo?
   - Mais informal? (ex: pode usar "tu", contrações)
   - Pode usar humor / ironia?
   - 1ª pessoa do singular permitida?
   - Algum termo da marca que sempre aparece (jargão proprietário)?
   - Algum termo que **nunca** pode aparecer?

   Se a resposta for "está bom o default", apenas anote isso e siga.

→ Atualiza `brain/tom-de-voz.md` na seção "Customizações deste projeto" + troca `kit_state` para `initialized`.

→ Salva estado fase 4.

---

## Fase 5 — Escopo & tecnologia (1 pergunta)

**Atualiza:** `brain/tecnologia/index.md`

8. **Tipo do projeto** — qual mais se aproxima?
   - **Institucional** (apresenta marca/pessoa, 5-15 páginas estáticas)
   - **Blog editorial** (foco em conteúdo, dezenas de posts ao longo do tempo)
   - **Produto** (landing + páginas de funcionalidade)
   - **Mistura** (institucional + blog)
   - **Outro** (descreva)

   Subpergunta automática: "Vai ter ≥100 páginas dinâmicas em 3 meses?" Se sim, sinaliza que o gatilho de Payload+Neon dispara — sugere rodar `/add-cms` depois.

→ Atualiza `brain/tecnologia/index.md`:
- Tabela de decisão sobre banco com data de hoje
- Notas sobre escopo previsto
- Troca `kit_state` para `initialized`

→ Salva estado fase 5.

→ Atualiza `brain/glossario/index.md` e `brain/backlog.md` apenas com `kit_state: initialized` (não preenche conteúdo, fica para uso natural).

---

## Conclusão

1. Mostra resumo: "Onboard completo. Brain inicializado. Próximos passos:"
   - Para criar primeira página: `/scaffold-page`
   - Para escrever primeiro artigo: `/artigo`
   - Para auditar SEO técnico: `/seo-tecnico` (após primeiro deploy)
   - Para registrar mudanças no Brain: `/aprovado`

2. Apaga `.cache/onboard-state.json` (estado consumido).

3. Faz git commit sugerido (com confirmação): `chore: onboarding inicial — kit_state initialized`.

## Princípio: feedback granular durante o onboard

Em **cada fase**, ao mostrar diff, **não pergunte** "está bom?". Pergunte 2-3 coisas específicas:

- "Esse posicionamento está específico o suficiente, ou ainda soa genérico para o seu mercado?"
- "Persona 1 está descrita de forma que um vendedor da sua equipe reconheceria? Ou está abstrato?"
- "Os 3 POVs realmente conflitam com o consenso, ou são posições que qualquer player do mercado também defenderia?"

Isso enriquece — usuário pode topar "tudo ok", mas tem oportunidade de refinar onde importa.

## Princípio: retomada graceful

Se o usuário interromper no meio (sai do Claude Code, troca de conversa), o `.cache/onboard-state.json` permite que `/onboard` retome de onde parou:

```json
{
  "started_at": "2026-05-02T23:30:00Z",
  "current_phase": 3,
  "completed_phases": [1, 2],
  "answers": {
    "project_name": "diegoivo.com.br",
    "user_role": "...",
    "domain": "...",
    "positioning": "...",
    "...": "..."
  }
}
```

Ao retomar, mostra o que já foi respondido e pergunta se quer continuar ou refazer.
