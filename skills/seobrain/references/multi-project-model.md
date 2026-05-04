# Modelo multi-projeto (CRÍTICO)

O repo do framework **não contém** `brain/`, `content/`, `web/` na raiz. Esses artefatos vivem em `projects/<nome>/` (git-ignored). Cada projeto é autocontido e pode virar repo próprio do cliente.

## Antes de qualquer trabalho substantivo

1. **Identifique o projeto ativo.** Você deve estar dentro de `projects/<nome>/` (cwd). Confira com `pwd`.
2. **Sem projeto ativo?** Liste os existentes em `projects/` ou pergunte ao usuário se quer criar um novo. Para criar: `npm run new <nome>` na raiz do framework.
3. **Múltiplos projetos?** Pergunte qual antes de mexer em arquivos.

Caminhos `brain/`, `content/`, `web/`, `plans/` em todas as skills são **relativos ao projeto ativo** (cwd dentro de `projects/<nome>/`), não à raiz do framework.

## A raiz do framework hospeda só

- `templates/project/` — esqueleto base do projeto (nunca edite quando estiver mexendo num projeto).
- `scripts/` — CLI tools compartilhadas, invocadas pelos `package.json` de cada projeto via `node ../../scripts/*.mjs` (modo dev) ou via `${CLAUDE_PLUGIN_ROOT}/scripts/` (modo plugin instalado).
- `docs/` — referências canônicas do framework (typography, grid-system, hero-backgrounds, obsidian-setup).
- `scratch/` — git-ignored. Rascunhos do desenvolvimento do framework (planos, notas).
- `skills/` + `commands/` + `hooks/` — código do plugin Claude Code.

## Quando NÃO criar projeto

- Se já existir `projects/<nome>` com mesmo nome, avise e pergunte se quer outro nome ou apagar o existente.
- Se o usuário está pedindo para **mexer** num projeto que já existe, faça apenas `cd projects/<nome>` e prossiga.

## Distribuição como plugin

Quando instalado via `/plugin install seobrain`, o framework vive em `~/.claude/plugins/cache/seobrain/`. Skills resolvem paths via `${CLAUDE_PLUGIN_ROOT}` env var. Templates copiados pra `process.cwd()` do usuário (não pra plugin cache).

Em dev local (cd no repo), `process.cwd()` resolve dentro do framework, então `projects/` é criado relativo ao framework root.
