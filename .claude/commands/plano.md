---
description: Cria um plano de execução em plans/ antes de tarefa não-trivial (FE vs BE critérios + última etapa atualiza Brain)
---

Execute a skill `plano`.

Pré-checks:
1. Avalie se a tarefa é trivial (typo, ajuste pontual). Se for, recuse o plano e execute direto.
2. Senão, crie `plans/<slug>-<data>.md` com a estrutura padrão da skill.
3. Apresente para aprovação com 2-3 perguntas granulares específicas.
4. Aguarde aprovação antes de executar.

Última etapa do plano deve sempre ser **atualizar o Brain** (`config.md`, `tecnologia/index.md`, índices, etc. conforme aplicável).

Detalhes da tarefa: $ARGUMENTS
