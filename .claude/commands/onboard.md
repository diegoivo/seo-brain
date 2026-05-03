---
description: Inicia o onboarding interativo do Agentic SEO Kit (5 fases, 18 perguntas, ~10 min)
---

Execute a skill `onboard` agora.

Pré-checks:
1. Leia `.cache/onboard-state.json` se existir (modo retomada).
2. Para cada arquivo do brain, leia o frontmatter `kit_state`. Se já está `initialized`, avise antes de sobrescrever.

Fases:
1. **Identidade** (nome do projeto, sobre você, domínio)
2. **Posicionamento** (USP em uma frase, persona principal, 3 POVs proprietários)
3. **Design system** (chama `/design-init` — 10 perguntas)
4. **Tom de voz** (calibração)
5. **Escopo** (tipo do projeto, gatilho de banco)

A cada fase: persiste arquivos, mostra diff, pede feedback **granular** (2-3 perguntas específicas), salva estado em `.cache/onboard-state.json`, **só então** segue.

Comentário do usuário (se houver): $ARGUMENTS
