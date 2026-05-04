---
description: Approve current task — triggers wiki-update to document changes in the LLM Wiki
---

A tarefa anterior foi aprovada pelo usuário.

Execute a skill `wiki-update` agora:

1. Levante o diff de git da sessão atual.
2. Atualize `brain/index.md` com data + resumo executivo.
3. Atualize arquivos específicos (`brain/tecnologia/`, `brain/glossario/`, `brain/backlog.md`, `content/*/index.md`) conforme necessário.
4. Identifique se a tarefa foi repetível e sugira transformá-la em skill.
5. Mostre o diff do Brain ao final e pergunte: "Algo mais a registrar?"

Comentário adicional do usuário (se houver): $ARGUMENTS
