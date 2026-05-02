---
description: Gera DESIGN.md + DESIGN.tokens.json a partir de uma vibe descrita em PT-BR
---

Invoque a skill `design-taste` (em `.claude/skills/design-taste/SKILL.md`) com
o argumento abaixo como vibe da marca.

Argumento: $ARGUMENTS

Se argumento estiver vazio ou for genérico (<50 chars, ou "moderno", "clean",
"profissional", "bonito"), siga a recusa de input vago da skill.
