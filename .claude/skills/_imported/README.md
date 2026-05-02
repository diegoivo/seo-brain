# Skills importadas (cópia local — fork policy)

Esta pasta documenta as **cópias locais** de skills externas que o kit usa.
Diferente da fase anterior (que apenas referenciava), agora o kit é
**self-contained**: cada skill importada vive em `.claude/skills/` com cópia
completa do arquivo `SKILL.md`.

## Por que copiar localmente

- O aluno faz `git clone` e tudo funciona, mesmo sem o plugin Vercel ou gstack
  daemon instalados.
- O kit pode ser usado offline.
- Versões ficam estáveis para a masterclass — a origem pode evoluir e quebrar a
  experiência.

## Tradeoff: viram fork

Quando a origem evolui, a cópia local fica desatualizada. Política de re-sync:

1. **Trimestralmente**, rode `scripts/check-imports.sh` (a criar) para diff
   contra origem.
2. Ao detectar mudança relevante, abra PR de re-sync com nota no CHANGELOG.
3. Não modifique skills importadas — se precisar customizar, crie wrapper
   próprio (ex: `agent-browser` é wrapper, não cópia bruta).

## Mapa de origens (snapshot)

| Skill local | Origem | Data da cópia | Tipo |
|---|---|---|---|
| `design-md/` | `~/.claude/skills/design-md/` (global) | 2026-05-02 | cópia bruta |
| `vercel-deploy/` | plugin oficial `vercel/0.40.1/skills/deployments-cicd/SKILL.md` | 2026-05-02 | cópia do SKILL.md |
| `vercel-cli/` | plugin oficial `vercel/0.40.1/skills/vercel-cli/SKILL.md` | 2026-05-02 | cópia do SKILL.md |
| `vercel-nextjs/` | plugin oficial `vercel/0.40.1/skills/nextjs/SKILL.md` | 2026-05-02 | cópia do SKILL.md |
| `agent-browser/` | wrapper que invoca `gstack`/`browse` global | 2026-05-02 | wrapper (não cópia) |

## Skills NÃO importadas (ainda invocadas via Skill tool quando disponíveis)

| Skill | Por que não importada | Quando usar |
|---|---|---|
| `gstack` (vault completo) | ~5MB, atualização frequente | quando o host tem o daemon instalado, agent-browser delega |
| `vercel:vercel-payload` | scaffold-payload é caminho não-default | só quando explicitamente confirmado |
| `stitch-design-taste` | requer Stitch MCP server | quando disponível, design-taste delega |
| `frontend-design`, `brandbook` | overlap com design-taste | opcionais |

## Política de manutenção

- **Não** edite arquivos em `_imported/` ou em pastas de skills importadas.
- **Sim** edite skills do kit (`conteudo`, `design-taste`, `scaffold-ssg`, etc.).
- Wrappers (como `agent-browser`) podem ser editados — eles existem
  exatamente para customizar comportamento sem tocar a origem.

## Skills do kit (não importadas)

Estas são proprietárias do kit:

- `onboarding` — preenche wiki + site-config interativamente
- `design-taste` — gera DESIGN.md + tokens
- `scaffold-ssg` — caminho default Next.js SSG
- `scaffold-payload` — caminho não-default Payload CMS
- `conteudo` — redator PT-BR (a estrela)
- `publicar` — build + deploy + PageSpeed
- `wiki` — curadoria de memória
- `agent-browser` — wrapper de QA browser (importada como wrapper)
