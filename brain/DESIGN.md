---
title: DESIGN — design system narrativo
tags: [brain, design]
kit_state: template
created: TEMPLATE
updated: TEMPLATE
status: template
sources: []
---

# DESIGN — design system narrativo

> **Filosofia:** decisões visuais documentadas em prosa. Aplicação visual fica em `/web/src/app/brandbook/` (rotas Next.js que renderizam ao vivo).
>
> Metodologia: superset compatível com [Google Stitch design-md](https://github.com/google-labs-code/stitch-skills) — seções 1-5 mapeiam ao formato canônico; 6-9 são extras anti-AI-slop.

> [!warning] Estado: template
> Rode `/onboard` (fase brandbook) para gerar este arquivo + `DESIGN.tokens.json` + scaffold de `/web/src/app/brandbook/`. Skill `site-criar` recomenda fortemente este arquivo preenchido (mas não é bloqueante — `/blogpost` funciona sem).

## Conteúdo após `/design-init`

(será gerado: 1. Atmosfera & Tema · 2. Cores & Papéis · 3. Tipografia · 4. Estilos de Componentes · 5. Princípios de Layout · 6. Profundidade & Elevação · 7. Motion · 8. Antipadrões · 9. Referências)

## Tipografia (canônica do framework)

A escala e o ritmo são fixos; só `font-family` muda no `/onboard`. Filosofia documentada em [[../docs/typography]]. Resumo:

- **Escala**: perfect fourth (1.333) sobre body 1.125rem (18px). Tokens `--text-xs` → `--text-4xl`.
- **Line-height**: 1.7 em body, 1.05–1.2 em headings.
- **Measure**: parágrafos em 65ch (faixa Bringhurst/Butterick).
- **Anchor-down spacing**: heading "ancora" o conteúdo abaixo (top >> bottom margin).
- **`text-wrap`**: `balance` em headings, `pretty` em parágrafos.
- **Hyphens**: `auto` em `.prose`, com `lang="pt-BR"` no `<html>`.

Whitelist de fontes (gratuitas, OFL/SIL): em `/web-best-practices`. Pré-onboard, system fonts (anti-slop).

## Sistema de grid (canônico do framework)

Todo site SEO Brain usa **CSS Grid 12 colunas + Subgrid + Container Queries**. Filosofia documentada em [[../docs/grid-system]]. Resumo:

- **12 colunas** padrão (responsivo: 4 mobile, 8 tablet, 12 desktop)
- **Subgrid** para alinhar cards/sidebar com o grid pai (Safari 16+, Chrome 117+, Firefox 71+)
- **Container queries** para componentes que se adaptam ao container, não viewport
- **Spacing scale 4-base**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (px)

Componentes: `<GridContainer>` e `<GridCol span={N}>` em `web/src/components/grid.tsx`.

## Tokens

`brain/DESIGN.tokens.json` — JSON consumível pelo `/web` (Tailwind `@theme`, CSS variables).

### Regras críticas

- **Não inclua `$schema`** apontando para URL externo. Não invente domínios.
- **Apenas fontes gratuitas** (Google Fonts, Bunny Fonts, OFL/SIL). Whitelist em `/web-best-practices`.
- **Não criar logo/ícone.** Apenas wordmark estilizado (typography only). Logo é decisão do usuário.
