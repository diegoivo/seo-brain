# ADR-001 — Arquitetura multi-projeto

**Data:** 2026-05-03
**Status:** aceito
**Branch:** `diegoivo/multi-projeto-arch`

## Contexto

Versão 0.1.0 do framework misturava artefatos do framework (`scripts/`, `.claude/skills/`, `docs/`, `AGENTS.md`) com artefatos de projeto (`brain/`, `content/`, `web/`, `plans/`) na raiz do mesmo repo. Consequências:

- Quem desenvolvia o framework via `brain/` template virar "seu" Brain por descuido.
- Quem usava o kit para um cliente recebia lixo de template.
- Bootstrap clonava o repo inteiro e cortava o cordão umbilical (`git clone && rm -rf .git && git init`) — projetos não recebiam atualização de skills depois.
- Não havia suporte a múltiplos projetos simultâneos.

## Decisão

Separar o repo em **3 zonas explícitas**:

1. **Framework** (versionado, raiz do repo): `scripts/`, `.claude/`, `docs/`, `templates/`, `AGENTS.md`, `README.md`.
2. **Projetos** (git-ignored): `projects/<nome>/`. Cada subpasta é autocontida — próprio `brain/`, `content/`, `web/`, `plans/`. Pode virar repo próprio do cliente (`git init` dentro da pasta).
3. **Rascunhos** (git-ignored): `scratch/` para planos do desenvolvimento do framework, notas WIP, anotações.

**"Projeto ativo" = cwd.** Sem variável de ambiente nem flag. O agente faz `cd projects/<nome>` antes de operar. Skills continuam usando paths relativos (`brain/`, `web/`) que resolvem dentro do projeto. Helper `scripts/lib/project-root.mjs` resolve para scripts CLI que precisam saber onde estão.

**`package.json` do projeto** tem campo `"seo-brain-project": true` como marcador. Scripts delegam ao framework via `node ../../scripts/*.mjs`.

**Bootstrap antigo removido.** Substituído por `npm run new <nome>` (cria projeto interno). Bootstrap standalone (init em pasta arbitrária) fica fora do v1 — adicionado quando outro dev pedir.

## Alternativas consideradas

- **A: Framework como pacote npm puro** — descartada. Skills precisam estar em `.claude/skills/` físico (Claude Code não resolve `node_modules` para skills). Dogfooding sofreria.
- **C: Git submodules** — adicionada complexidade desnecessária para o caso de uso atual (1-3 clientes simultâneos do mesmo dev).

## Consequências

**Positivas:**
- Brain do projeto é sempre o do cliente, nunca confunde com template.
- Multi-projeto trivial: `npm run new outro-cliente`.
- Cada projeto pode virar repo do cliente sem cerimônia.
- Hook `session-start` distingue 3 contextos (framework, projeto template, projeto inicializado).
- Refactor mínimo nas skills (preservadas as 211 referências a `brain/` etc, porque continuam relativas a cwd).

**Negativas / a monitorar:**
- Bootstrap externo (`init` standalone) deixa de existir até v2. Hoje só `git clone` do framework.
- Skills DataForSEO (`keywords-volume`, `competitor-pages`, `competitor-keywords`) escrevem em `brain/seo/data/` — precisam rodar com cwd dentro do projeto. Documentado em AGENTS.md.
- Wikilinks `[[../docs/...]]` no template do brain quebravam no novo layout. Substituídos por menção textual ao path canônico no repo do framework.

## Referências

- Plano de execução: `scratch/plans/multi-projeto-arch-2026-05-03.md`
- Helper de resolução: `scripts/lib/project-root.mjs`
- Comando: `scripts/new-project.mjs` (`npm run new <nome>`)
