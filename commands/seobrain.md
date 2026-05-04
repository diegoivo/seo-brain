---
description: SEO Brain framework entry — load principles, list/create projects, orchestrate brain + branding onboarding
---

Execute a skill `seobrain` agora.

Pré-checks:
1. Detectar contexto via `pwd`:
   - Framework root (sem projeto): listar `projects/*` ou sugerir criar novo.
   - Projeto template (kit_state: template em brain/*.md): popular brain + branding.
   - Projeto inicializado: carregar contexto, listar próximos passos.
2. Ler `skills/seobrain/SKILL.md` para princípios e modelo multi-projeto.

Modos:
- `/seobrain:start` — load context, list projects.
- `/seobrain:start create-project <nome>` — criar projeto novo (kebab-case).
- Dentro de projeto template — orquestrar `wiki-init` + `branding-onboard` (modo Express default).

Argumentos (se houver): $ARGUMENTS
