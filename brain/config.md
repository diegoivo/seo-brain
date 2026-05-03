---
kit_state: template
updated: TEMPLATE
---

# Configurações operacionais

> Estado vivo do projeto: domínios, contas, integrações, env vars. Atualize sempre que algo mudar (skill `update-brain` cuida disso após `/aprovado`).
>
> **Para decisões arquiteturais** (por que escolhi essa stack, gatilho de banco, etc.), veja `brain/tecnologia/index.md`.

## Domínio

- **Definitivo:** TEMPLATE — ex.: `meusite.com.br` (preencha quando registrar)
- **Temporário (Vercel):** será preenchido após o primeiro deploy → ex.: `meu-projeto-abc.vercel.app`
- **Status do registro:** TEMPLATE — não registrado / registrado mas sem DNS apontado / registrado e ativo

> Enquanto não houver domínio definitivo registrado, todos os `canonical` apontam para o vercel.app temporário.

## Deploy

- **Plataforma:** Vercel (default)
- **Project ID:** TEMPLATE — preenchido após `vercel link`
- **Org / Team:** TEMPLATE
- **Branch de produção:** `main`
- **Branch de preview:** qualquer outra
- **Último deploy:** TEMPLATE — preenchido após primeiro deploy

## Repositório

- **GitHub repo:** TEMPLATE — ex.: `seu-usuario/seu-repo`
- **Branch de trabalho:** `dev`
- **Branch de produção:** `main`

## Integrações

| Serviço | Status | Notas |
|---|---|---|
| Resend (email transacional) | não configurado | rodar `/setup-email` quando precisar de form de contato |
| Vercel | a configurar | rodar `/vercel:bootstrap` ou `vercel link` |
| Vercel Marketplace | nenhuma adicionada | use para Neon, Upstash, Sanity, Clerk, etc. |
| Stitch (Google Labs) | não usado | opcional — `docs/integrations/stitch.md` |
| Payload CMS + Neon | não disparado | gatilho ≥100 páginas/3 meses → rodar `/add-cms` |

## Env vars necessárias

> Apenas os **nomes** das chaves usadas pelo projeto. Valores ficam em `.env.local` (gitignored) ou no Vercel Dashboard.

- (vazio — adicione quando configurar Resend, PageSpeed API, etc.)

Exemplo de adições típicas conforme o projeto evolui:
- `RESEND_API_KEY` — após `/setup-email`
- `PAGESPEED_API_KEY` — após adicionar key do Google (opcional para `/perf-audit`)
- `POSTGRES_URL` — após `/add-cms` (auto-provisionado pelo Vercel Marketplace + Neon)

## Diretórios e portas

- **Porta dev:** aleatória via `get-port`
- **Diretório do app web:** `/web` (Next.js SSG)

## Como atualizar este arquivo

- Manualmente: edite, troque `updated`, mantenha conciso.
- Via skill `update-brain`: dispara automaticamente após `/aprovado`.
- Mudanças que **devem** atualizar este arquivo:
  - Registro/troca de domínio
  - Primeiro deploy (preenche domínio temporário e Project ID)
  - Adicionar integração (Resend, Stitch, Payload, Marketplace)
  - Mudar branch padrão ou plataforma de deploy
  - Adicionar env var nova
