---
name: scaffold-page
description: Cria UMA página Next.js específica em /web/src/app/<rota> consumindo o Brain. Pré-condição - kit_state initialized. Aplica /web-best-practices (next/font, next/image, JSON-LD, sitemap), capitalização BR, primeiro viewport, profile SEO correto. Para gerar a estrutura completa de site (home + serviço + blog + sobre + contato), use /site-criar. Use quando o usuário pedir "criar uma página", "adicionar página de X", "scaffold de [rota específica]".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# /scaffold-page

Cria **uma** página Next.js. Para estrutura completa, use `/site-criar`.

## Pré-condições (HARD GATE)

1. `brain/index.md` `kit_state: initialized`
2. `brain/DESIGN.md` + `DESIGN.tokens.json` preenchidos
3. `brain/personas.md` ≥1 persona
4. `brain/principios-agentic-seo.md` ≥3 POVs

Se faltar: redireciona para `/onboard`.

## Pipeline curto

### 1. Lê Brain + `/web-best-practices` (snippets canônicos)

### 2. Confirma escopo (1 mensagem)
- Rota? (ex.: `/sobre`, `/servicos/seo`, `/blog/post-x`)
- Profile SEO? (auto-detectado via path: home/page/post/landing — confirma)
- Objetivo principal / CTA?
- Mídia específica?

### 3. Restrições obrigatórias

Tudo de `/web-best-practices`:
- next/font (sem `<link>`)
- next/image com `priority`+`sizes` no LCP
- `Metadata` completa com `alternates.canonical`
- JSON-LD apropriado pelo profile
- Capitalização BR
- ≥3 internal links
- Footer credit (default, opt-out)

### 4. Self-test
1. `npm run build`
2. `seo-score.mjs <output> --profile=auto` ≥90
3. Checklist 14 itens de `/web-best-practices`

### 5. URL final
Roda `npm run dev` se não está rodando. Apresenta:
> "Página em http://localhost:XXXX/<rota>"

### 6. Atualiza
- `content/site/index.md` ou `content/posts/index.md`
- `brain/backlog.md` (riscar se estava lá)

## Modo plano

Para tarefa não-trivial (página nova, especialmente com mídia ou form), passe por `/plano` antes. Página simples (só copy + tokens) pode ir direto.

## Princípios

- **Não improvise.** Copia de `/web-best-practices` e adapta valores.
- **Profile correto.** TL;DR só em post. FAQ só onde aplicar.
- **URL no fim.** Sempre.
- **Feedback granular.** 2-3 decisões específicas, não "tá bom?".
