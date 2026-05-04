# PROJECT_NAME

Projeto criado com [SEO Brain](https://github.com/diegoivo/seo-brain).

## Setup

```bash
npm run web:install     # instala deps do Next.js
```

## Comandos

```bash
npm run brain:lint      # valida o Brain (frontmatter, freshness, refs)
npm run seo:score <url> # SEO Score (10 categorias)
npm run perf:audit <url># Lighthouse via PageSpeed Insights
npm run web:dev         # Next.js dev server
npm run web:build       # build de produção
```

## Próximos passos

1. Rode `/onboard` no Claude Code para popular o Brain (identidade, voz, POVs).
2. Rode `/onboard-brandbook` para gerar `brain/DESIGN.md` + visual.
3. `/site-criar` constrói a estrutura padrão do site.
4. `/blogpost` para o primeiro artigo.

## Estrutura

```
.
├── brain/        ← LLM Wiki da marca (essência do framework)
├── content/      ← posts (.md) + páginas de site
├── web/          ← Next.js SSG
├── plans/        ← planos de execução por tarefa
└── package.json  ← delega scripts ao framework em ../../
```

> ⚠️ Framework experimental. Revise tudo antes de produção.
