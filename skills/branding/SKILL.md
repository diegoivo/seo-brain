---
name: branding
description: Skill consolidada de branding — design system, brandbook visual, identidade de marca, clone visual de URL, sistema de imagens e revisão visual. Modos via argumento — discover (10 perguntas anti-AI-slop produzindo DESIGN.md), import <url> (clone visual via agent-browser com perguntas de fidelidade), apply (popula web/src/app/brandbook/* e globals.css), export (gera brandbook.md/.html/.pdf), images (mood-board com Pexels/Unsplash/OpenAI), review (revisão visual P0/P1/P2), list (lista marcas do repo). Use when user asks design system, brandbook, brand identity, visual identity, clone site, importar URL, importar visual, mood board, banco de imagens, AI-slop, revisão visual, design QA, brand archetypes, paleta de cores, tipografia da marca, design tokens. Use quando o usuário pedir criar design system, iniciar branding, clonar visual, importar design de URL, configurar imagens, validar design, revisar visual, brand book, brandbook, ou começar projeto novo que precise de identidade visual. Triggers bilíngues PT/EN cobrindo brandbook, design system, visual identity, brand cloning.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - WebFetch
---

# /branding — skill única de identidade visual

Consolidação de 6 skills antigas em **uma skill com modos**. SKILL.md raiz é dispatcher fino — toda a lógica vive em `playbooks/<modo>.md`, carregados sob demanda.

## Quando rodar

Qualquer demanda de identidade visual, design system, brandbook, clone de site, imagens ou revisão visual. Detecta o modo pelo argumento; sem argumento, pergunta ao usuário.

## Sintaxe

```
/branding                       # pergunta qual modo
/branding discover              # 10 perguntas → brain/DESIGN.md + tokens.json
/branding import <url>          # clone visual via agent-browser
/branding apply                 # popula web/ a partir do Brain
/branding export                # gera brandbook.md/.html/.pdf
/branding images                # configura mood-board + provider
/branding review                # QA visual (chamado pelo /qa)
/branding list                  # lista marcas conhecidas
```

## Tabela de dispatch

| Modo | Playbook | Pré-condições | Output principal |
|---|---|---|---|
| (sem arg) | `SKILL.md` (este — pergunta) | nenhuma | escolha de modo |
| `discover` | `playbooks/discover.md` | `brain/index.md` initialized | `brain/DESIGN.md` + `brain/DESIGN.tokens.json` |
| `import <url>` | `playbooks/import-url.md` | `agent-browser` no PATH | `brain/DESIGN.md` + `tokens.json` + `web/public/logo.*` + `.cache/clone/` |
| `apply` | `playbooks/apply.md` | `brain/DESIGN.md` initialized | `web/src/app/globals.css` atualizado + 7 rotas em `web/src/app/brandbook/` |
| `export` | `playbooks/export.md` | `brain/DESIGN.md` initialized | `brand/<slug>/brandbook.{md,html,pdf}` |
| `images` | `playbooks/images.md` | nenhuma | seção "Imagens" em `brain/DESIGN.md` + `.env.local` |
| `review` | `playbooks/review.md` | nenhuma | `.cache/qa-runs/<task>-design.md` |
| `list` | `playbooks/list.md` | nenhuma | tabela de marcas |

## Sem argumento — diálogo de descoberta

Se o usuário disparou `/branding` sem modo, pergunte:

> O que você quer fazer?
>
> 1. **discover** — criar identidade do zero (10 perguntas anti-AI-slop).
> 2. **import &lt;url&gt;** — clonar visual de site existente (precisa agent-browser).
> 3. **apply** — aplicar tokens existentes ao site Next.js.
> 4. **export** — gerar brandbook.md/.html/.pdf.
> 5. **images** — configurar mood-board e provider de imagens.
> 6. **review** — QA visual.
> 7. **list** — listar marcas no repo.

Detecte intenção mesmo de respostas livres. "Quero clonar site X" → `import https://x.com`. "Vamos fazer brandbook do zero" → `discover`.

## Pré-condições e ordem recomendada

Para projeto novo:

```
/branding discover               (ou /branding import <url>)
   ↓ (gera brain/DESIGN.md)
/branding apply                  (popula web/)
   ↓
/branding images                 (configura provider)
   ↓
/branding export                 (entregáveis brandbook)
```

`review` é chamado pelo `/qa` em paralelo com outros revisores antes de cada PR.

## Princípios não-negociáveis

1. **Brain é source-of-truth.** Tokens vivem em `brain/DESIGN.md` (PT-BR prose) + `brain/DESIGN.tokens.json` (consumo técnico). `brandbook.md/.html/.pdf` são **derivados read-only** gerados sob demanda em `brand/<slug>/`.
2. **Apenas fontes grátis.** Google Fonts, Bunny Fonts, OFL/SIL/Apache. Pagas (GT America, Söhne, Editorial New) → mapear para equivalente grátis. Ver `references/typography-guide.md`.
3. **Anti-AI-slop é regra dura.** Banidos: gradiente purple→blue, `shadow-md`/`shadow-lg` direto, slate/zinc/gray sem accent, border-radius 8px universal, Inter sem justificativa. Ver `references/audit-checklist.md`.
4. **Primeiro viewport: hero cabe em 100dvh mobile / ~80vh desktop sem scroll.** Validar mentalmente em 375×812 antes de salvar.
5. **Nunca toque em escala/grid/spacing canônicos.** São do framework (`docs/typography.md`, `docs/grid-system.md`). `apply` modifica apenas cores e fontes em `globals.css`.
6. **Visual ≠ voz.** `import` clona visual; nunca toca em `brain/tom-de-voz.md`. Pergunta antes.
7. **Sem agent-browser, `import` aborta.** WebFetch puro entrega lixo (paleta inferida sobre class names, fontes chutadas). Sem fallback.

## References (carregadas sob demanda)

| Arquivo | Quando ler |
|---|---|
| `references/brand-archetypes.md` | `discover` (Q2 — arquétipo) |
| `references/color-system.md` | `discover` (Q4) e `import` (extração de paleta) |
| `references/typography-guide.md` | `discover` (Q5) e `import` (mapeamento de fontes) |
| `references/audit-checklist.md` | `review` (todos os checks) e `discover` (validação final) |
| `references/web-interface-guidelines.md` | `apply` (acessibilidade) e `export` (HTML do brandbook) |
| `references/brandbook-format.md` | `export` (estrutura do brandbook.md) |

## Assets

- `assets/design-companion.template.html` — preview ao vivo durante `discover`.
- `assets/pdf-generator.mjs` — converte `brandbook.html` em PDF A4 landscape via puppeteer-core + Chrome do sistema.
- `assets/page-templates/` — templates HTML para `export`: institutional, blog, dashboard.

## Outputs canônicos por modo

| Modo | Arquivos gravados |
|---|---|
| `discover` | `brain/DESIGN.md`, `brain/DESIGN.tokens.json` |
| `import <url>` | `brain/DESIGN.md`, `brain/DESIGN.tokens.json`, `web/public/logo.{svg,png}`, `web/public/favicon.*`, `.cache/clone/extract.json`, `.cache/clone/full.png`, `.cache/clone/decisions.md`, `.cache/clone/diff-report.md` |
| `apply` | `web/src/app/globals.css`, `web/src/app/brandbook/{cores,tipografia,voz,componentes,layout,marca}/page.tsx`, `web/src/app/brandbook/page.tsx` |
| `export` | `brand/<slug>/brandbook.md`, `brand/<slug>/brandbook.html`, `brand/<slug>/brandbook.pdf` (opt-in) |
| `images` | `brain/DESIGN.md` (seção "Imagens"), `.env.local` (vars opt-in) |
| `review` | `.cache/qa-runs/<task>-design.md` |
| `list` | stdout (tabela) |

## Histórico

Skill consolidada (v0.2.0). Substitui `branding-{init,onboard,brandbook,clone,images,review}` — todas removidas. Migração documentada em `MIGRATION.md`.
