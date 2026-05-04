---
description: Create execution plan in plans/ before non-trivial task (FE vs BE criteria, last step updates LLM Wiki)
---

Execute a skill `plan`.

Pré-checks:
1. Avalie se a tarefa é trivial (typo, ajuste pontual). Se for, recuse o plano e execute direto.
2. Senão, crie `plans/<slug>-<data>.md` com a estrutura padrão da skill.
3. Apresente para aprovação com 2-3 perguntas granulares específicas.
4. Aguarde aprovação antes de executar.

Última etapa do plano deve sempre ser **atualizar o LLM Wiki** (`config.md`, `tecnologia/index.md`, índices, etc. conforme aplicável). Invocar via `/approved` ou skill `wiki` (playbook update).

Detalhes da tarefa: $ARGUMENTS
