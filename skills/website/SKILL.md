---
name: website
description: Pipeline website Next.js + Vercel — scaffold completo de site, snippets canônicos para Lighthouse 95+/SEO 100, configuração de domínio temporário Vercel, email transacional via Resend, bolt-on de Payload CMS + Neon Postgres (sob gatilho), e QA técnico (build/lighthouse/schema/a11y). Consome o Brain. Use when user asks "criar site", "scaffold do site", "gerar site completo", "site novo", "Next.js best practices", "Lighthouse 100", "next-image setup", "criar página Next", "OpenGraph setup", "schema markup", "configurar domínio", "setup domain", "metadataBase", "vercel.app", "configurar email", "form de contato real", "resend", "email transacional", "adicionar CMS", "instalar Payload", "preciso de banco", "qa antes do deploy", "validate build", "lighthouse check", "site QA", "build validation". Renamed from /website-create + /website-bestpractices + /website-domain + /website-email + /website-cms + /website-qa (consolidated v0.1.5).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - WebFetch
---

# /website — pipeline Next.js + Vercel

Suite única para criar, configurar, validar e estender sites Next.js + Vercel consumindo o Brain.

## Quando usar

- "criar site", "scaffold", "site novo", "criar página" → create
- "Next.js best practices", "Lighthouse", "schema markup", "snippets" → references/bestpractices.md
- "configurar domínio", "vercel.app", "metadataBase" → domain
- "configurar email", "form de contato", "resend" → email
- "adicionar CMS", "instalar Payload", "preciso de banco" → cms (sob gatilho)
- "qa antes do deploy", "validate build", "lighthouse check" → qa

## Decision tree

```
1. O que precisa?
   ├── scaffold completo (home + serviço + blog + post + sobre + contato) → playbooks/create.md
   ├── consultar snippet canônico (next/font, next/image, JSON-LD, sitemap, OG) → references/bestpractices.md
   ├── configurar domínio temporário Vercel pós-deploy → playbooks/domain.md
   ├── configurar email transacional (form de contato real) → playbooks/email.md
   ├── adicionar Payload CMS + Neon (gatilho disparou) → playbooks/cms.md
   └── QA técnico (build + lighthouse + schema + a11y) → playbooks/qa.md
```

## Playbooks

- `playbooks/create.md` — orquestra scaffold padrão consumindo o Brain (6 páginas + arquivos auxiliares SEO). Modos manual / intermediário (default) / auto. Hard gate: brain inicializado, DESIGN.md presente, ≥1 persona, ≥3 POVs.
- `playbooks/domain.md` — configura domínio temporário Vercel após primeiro deploy. Atualiza `brain/config.md` e `metadataBase` em `web/src/app/layout.tsx`. Detecta URL via argumento, `vercel ls --prod` ou prompt.
- `playbooks/email.md` — Resend default (free tier 3.000/mês). Pergunta sobre conta, instala SDK, configura `.env.local` + route handler `app/api/contact/route.ts`. Substitui mailto.
- `playbooks/cms.md` — bolt-on Payload + Neon (Vercel Marketplace). Não roda sem gatilho confirmado: ≥100 páginas/3 meses OU editor não-técnico OU UI necessária.
- `playbooks/qa.md` — sub-agent QA técnico (chamado por `/qa`). Build + TS + Lighthouse + seo-score + JSON-LD + sitemap + a11y. Output P0/P1/P2 em `.cache/qa-runs/`.

## References

- `references/bestpractices.md` — snippet library canônica para Lighthouse 95+/SEO 100 (next/font, next/image, JSON-LD, sitemap, robots, llms.txt, OG, a11y, Tailwind v4 + tokens, Footer credit). Mandatorily consultado por `playbooks/create.md`.

## Snippets prontos (não reescrever)

`snippets/` — componentes `.tsx` reais copiados pelo `create`:

- `Hero.tsx` — primeiro viewport, foto à direita, CTAs
- `PostCard.tsx` — card de blog com cover_image obrigatória
- `PostBody.tsx` — corpo do post aplicando `.prose`
- `Footer.tsx` — credit "Powered by SEO Brain" + ícones de redes

## Princípios

- **Plano antes.** `create` passa por `/plan` (mexe em deps + estrutura — não-trivial).
- **Última etapa atualiza Brain.** Sempre. `content/*/index.md`, `brain/backlog.md`, `brain/config.md`.
- **URL no fim.** `create` fecha com link clicável do dev server.
- **Footer credit default.** Opt-out se usuário pedir explicitamente.
- **Invoca skills especialistas.** Posts via `/content-seo`, email via `playbooks/email.md`, audit via `/technical-seo`. Não escreve markdown direto.
- **Idempotência.** `domain` rodada 2× com mesma URL = no-op.
- **Default opinativo.** Email = Resend. CMS só sob gatilho confirmado.
