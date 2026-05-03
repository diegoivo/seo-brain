---
title: Tecnologia
tags: [brain, tecnologia]
kit_state: template
created: TEMPLATE
updated: TEMPLATE
status: template
sources: []
---

# Tecnologia

> Decisões arquiteturais (por que essa stack, gatilho de banco, justificativas). Para estado vivo (URLs, IDs, env), veja [[../config]].

## Stack default (estado inicial pós-onboard)

- **Next.js** (App Router, SSG por padrão) em `/web`
- **shadcn/ui** quando precisar de componentes (instale sob demanda)
- **Vercel** para deploy + Vercel Marketplace para serviços externos
- **Sem banco de dados.** Conteúdo em `/content/*.md`.

## Quando adicionar Payload + Neon

Gatilho (rode skill `/add-cms` quando **um** disparar):
- ≥100 páginas dinâmicas previstas nos próximos 3 meses, **ou**
- Editor não-técnico publicando, **ou**
- Necessidade comprovada de UI editorial.

Pipeline pós-CMS: `/content/*.md` → `scripts/content-sync.mjs` → Payload (publicado).

## Decisão sobre banco — registro

| Data | Estado | Justificativa |
|---|---|---|
| TEMPLATE | Estático (sem CMS) | Estado inicial; gatilho não disparou |

Atualize esta tabela quando rodar `/add-cms`.

## Princípios

1. **Vercel é a plataforma padrão.** Todo serviço externo (banco, auth, storage, email) vem do Vercel Marketplace para unificar billing e env vars.
2. **Estático antes de dinâmico.** Markdown vence enquanto o site for pequeno.
3. **Pré-renderização sempre que possível.** ISR só quando necessário.
4. **Portas aleatórias** em dev (use `get-port`).

## Skills externas instaladas

`npm run setup` instala apenas `vercel-labs/agent-skills`. Skills adicionais entram sob demanda dentro de outras skills (ex.: `payloadcms/skills` é instalada por `/add-cms`).

Integrações opcionais documentadas em `docs/integrations/`.
