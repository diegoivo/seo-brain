# agentic-seo-kit

Template open-source para criar sites **Next.js SSG com PageSpeed 100** e
conteúdo PT-BR otimizado para **SEO Agêntico**, orquestrado por um agente de
**Organic Growth** com skills self-contained.

> **Template neutro.** Nenhum arquivo cita marca específica. Você roda
> `/onboarding` para preencher os dados da sua marca antes de começar.

## Quickstart

```bash
git clone <repo> meu-site
cd meu-site
npm install
```

Depois, abra o repo no seu agent (Claude Code, Codex, Cursor, Antigravity) e
rode em sequência:

```
/onboarding              → preenche wiki + site-config (1ª vez, interativo)
/design   <vibe>         → identidade visual
/scaffold                → aplica design no app
/conteudo <tema>         → escreve o primeiro post
/publicar                → build + deploy preview Vercel
```

Cada comando aciona uma skill em `.claude/skills/`. Hosts sem suporte a slash
commands podem invocar pelo nome ("siga `.claude/skills/conteudo/SKILL.md`
para escrever um artigo sobre X").

## Estrutura

| Pasta | Para quê |
|---|---|
| `app/` | Next.js 15 App Router, SSG via `output: 'export'` |
| `lib/` | Helpers (`content`, `seo`, `site-config`) |
| `components/` | `SiteHeader`, `SiteFooter` |
| `content/` | Posts MDX (1 post de exemplo incluído — apague depois) |
| `wiki/` | **Memória do projeto** — vault Obsidian-friendly |
| `docs/specs/` | Specs verificáveis para tarefas técnicas (spec-driven) |
| `tests/` | Playwright/agent-browser specs |
| `.claude/skills/` | Skills do kit + skills importadas (self-contained) |
| `.claude/commands/` | Slash commands shim para Claude Code |
| `DESIGN.md` + `DESIGN.tokens.json` | Design system (regenerável por `/design`) |
| `AGENTS.md` | Orquestrador "Organic Growth Agent" — leitura obrigatória |

## Skills disponíveis

### Skills do kit
- `onboarding` — preenche wiki + site-config + POVs iniciais (1ª vez)
- `design-taste` — gera DESIGN.md + tokens (10 paletas, 10 font pairs curados)
- `scaffold-ssg` — caminho default Next.js SSG
- `scaffold-payload` — caminho não-default Payload CMS (>50 posts ou >3 autores)
- `conteudo` — redator PT-BR com hard-checks anti-AI-slop
- `publicar` — build + deploy preview + PageSpeed
- `wiki` — curadoria de memória (única skill autorizada a escrever em `wiki/`)

### Skills importadas (cópia local — self-contained)
- `design-md` — gerador semântico de DESIGN.md (do skill global)
- `vercel-deploy` — guia oficial deployment + CI/CD
- `vercel-cli` — comandos do Vercel CLI
- `vercel-nextjs` — best practices Next.js App Router
- `agent-browser` — wrapper para gstack/browse daemon (QA spec-driven)

Política de fork e re-sync em `.claude/skills/_imported/README.md`.

## Wiki como memória

`wiki/` é vault Obsidian-friendly. Abra a pasta no Obsidian (Open folder as
vault) e edite as notas:

- **Empresa**: `wiki/index.md` → seção "Sobre a empresa" (preencha 1º com `/onboarding`)
- **Princípios editoriais**: `wiki/conteudo/principios.md`
- **POVs proprietários**: `wiki/conteudo/pov-da-marca.md`
- **Voz brasileira**: `wiki/conteudo/voz-pt-br.md`
- **Vocabulário banido**: `wiki/conteudo/jargao-banido.md`
- **Stack técnico**: `wiki/tecnologia/stack.md`
- **Spec-driven**: `wiki/tecnologia/spec-driven.md`
- **Exemplos genéricos**: `wiki/exemplos/`

Skills só **leem** a wiki. As skills `wiki` e `onboarding` são as únicas
exceções e só atuam quando invocadas.

## Spec-driven (toda mudança em código)

Skills técnicas seguem o protocolo em `wiki/tecnologia/spec-driven.md`:

```
[1] SPEC      → docs/specs/<task>.md (critérios verificáveis)
[2] TESTS     → tests/<task>.spec.ts (1 teste por critério, RED antes)
[3] EXECUTE   → workers paralelos via Agent tool
[4] QA        → sub-agent independente valida no browser e reporta
```

## Stack (default = SSG)

- Next.js 15 App Router + TypeScript estrito + React 19
- Tailwind 3.4 com tokens via `DESIGN.tokens.json`
- MDX via `next-mdx-remote/rsc` + `gray-matter`
- `next/font/google` (zero `<link>`)
- Output: `export` estático → qualquer CDN serve

Para sites grandes (>50 posts ou >3 autores), use `scaffold-payload` (caminho
não-default, exige confirmação).

## Scripts

```bash
npm run dev              # dev server
npm run build            # build estático para out/
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run test:browser     # Playwright (requer setup)
npm run test:browser:ui  # Playwright UI mode
```

Setup do browser (uma vez):

```bash
npx playwright install chromium
```

## Licença

MIT. Use, fork, adapte. Se evoluir o método, considere abrir PR.
