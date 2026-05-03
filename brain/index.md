# Brain — Agentic SEO Kit

> Última atualização: 2026-05-02
> Domínio do projeto: (definir em cada projeto derivado deste kit)
> Porta dev preferida: aleatória via `get-port`

## O que é este projeto

Este é o **Agentic SEO Kit** — um repositório template + plugin Claude Code que entrega um agente orquestrador especializado em SEO/GEO, com sub-agents especialistas, skyscraper-by-default e GEO embutido como princípio editorial.

Funciona prioritariamente em Claude Code, com portabilidade para Codex, Cursor e Antigravity (via `AGENTS.md` como source-of-truth + stubs nativos).

## Posicionamento

- **O que faz:** automatiza o ciclo Think → Plan → Build → Test → Ship → Document para projetos de SEO técnico, on-page, estratégia, imagens e GEO.
- **O que torna único:**
  1. Brain (wiki) como fonte canônica do julgamento humano da marca.
  2. SEO Score script (10 categorias, Flesch PT-BR Martins/Ghiraldelo, GEO peso 10).
  3. Skyscraper como filosofia, mas com `intent-analyst` arbitrando a forma.
  4. Estático por padrão; banco só sob gatilho (≥100 páginas/3 meses).
  5. Vercel Marketplace como caminho default para serviços externos.

## Resumo da Wiki

- `principios-agentic-seo.md` — 10 princípios proprietários do método (POV defensável da marca).
- `tom-de-voz.md` — voz ativa, frases curtas, antivícios de IA banidos, capitalização brasileira.
- `personas.md` — personas-alvo do projeto.
- `glossario/index.md` — definições proprietárias (cada conceito = 1 arquivo).
- `tecnologia/index.md` — stack atual + decisão sobre banco.
- `DESIGN.md` — gerado por `/design-init` (10 perguntas) com decisões opinativas anti-AI-slop.
- `backlog.md` — ideias, pendências, estado.
- `seo/reports/` — outputs do SEO Score.

## Como atualizar este arquivo

Disparado pela skill `update-brain` após `/aprovado`. Manualmente: edite, atualize a data, mantenha o resumo curto.
