---
title: Configurações operacionais
tags: [brain, config]
kit_state: template
created: TEMPLATE
updated: TEMPLATE
status: template
sources: []
---

# Configurações operacionais

> Estado vivo: domínios, contas, integrações, env vars (nomes apenas).
>
> Para decisões arquiteturais (por que essa stack), veja [[tecnologia/index]].

> [!warning] Estado: template
> Rode `/onboard` para preencher.

## Domínio

- **Definitivo:** TEMPLATE — ex.: `meusite.com.br`
- **Temporário (Vercel):** será preenchido após primeiro deploy → ex.: `meu-projeto.vercel.app`
- **Status do registro:** TEMPLATE

## Deploy

- **Plataforma:** Vercel (default)
- **Project ID:** TEMPLATE
- **Branch produção:** `main`
- **Último deploy:** TEMPLATE

## Repositório

- **GitHub:** TEMPLATE — `usuario/repo`

## Integrações

| Serviço | Status | Notas |
|---|---|---|
| Resend | não configurado | rodar `/setup-email` |
| Vercel | a configurar | `vercel link` |
| Imagens (Unsplash/Pexels/OpenAI) | não configurado | rodar `/setup-images` |
| Payload CMS + Neon | não disparado | gatilho ≥100 páginas/3 meses |

## Env vars necessárias

(adicione conforme configurar — apenas nomes, não valores)

- `RESEND_API_KEY` (após `/setup-email`)
- `OPENAI_API_KEY` (após `/setup-images` opção OpenAI)
- `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY` (após `/setup-images` opção free)

## Diretórios e portas

- **Porta dev:** aleatória via `get-port`
- **Diretório do app:** `/web` (Next.js SSG)
