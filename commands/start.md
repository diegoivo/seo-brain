---
description: SEO Brain framework entry — load principles, list/create projects, orchestrate brain + branding onboarding
---

Execute a skill `seo-brain` agora.

Pré-checks:
1. Detectar contexto via `pwd`:
   - Framework root (sem projeto): listar `projects/*` ou sugerir criar novo.
   - Projeto template (kit_state: template em brain/*.md): popular brain + branding.
   - Projeto inicializado: carregar contexto, listar próximos passos.
2. Ler `skills/seo-brain/SKILL.md` para princípios e modelo multi-projeto.

Modos:
- `/seo-brain:start` — load context, list projects.
- `/seo-brain:start create-project <nome>` — criar projeto novo (kebab-case).
- Dentro de projeto template — orquestrar `wiki` (init playbook) + `/branding apply` (modo Express default).

Argumentos (se houver): $ARGUMENTS
