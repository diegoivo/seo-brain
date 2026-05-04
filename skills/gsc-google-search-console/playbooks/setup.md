# /gsc-google-search-console — setup OAuth (BYO)

Conduz o usuário pelo Google Cloud Console pra criar suas próprias credenciais OAuth (BYO — Bring Your Own credentials) e autorizar acesso ao GSC. Sem app verification do Google, sem cap de usuários, credenciais isoladas por projeto.

## Pré-requisitos

1. **Estar dentro de um projeto SEO Brain** (`pwd` deve mostrar `projects/<nome>/`). Skill aborta se rodada na raiz do framework.
2. **Conta Google com acesso à property no GSC.** Property já adicionada e verificada em https://search.google.com/search-console.
3. **Chrome instalado** (`open -a "Google Chrome"` precisa funcionar). Funciona em qualquer macOS.

Sem credenciais? Skill cuida do setup do zero — cliente cria conta Google Cloud (gratuita) durante o fluxo se ainda não tiver.

## Inputs

- Sem flags: `node scripts/gsc-setup.mjs`
- Reconfigurar (sobrescreve credenciais existentes): `node scripts/gsc-setup.mjs --force`

## Pipeline

### 1. Verificações iniciais

- Confirma cwd = projeto ativo (`scripts/lib/project-root.mjs::requireProjectRoot`)
- Lê `.env.local` da raiz do framework (`<framework>/.env.local`)
- Se já tem `GSC_REFRESH_TOKEN` e sem `--force`: aborta com mensagem amigável.

### 2. Inicia callback server

- Importa `get-port` e aloca porta livre (8080-8999 preferida)
- Sobe servidor HTTP local em `localhost:<porta>` que aguarda `?code=...`

### 3. Conduz o usuário pelos 5 passos no Chrome

Cada passo: agente abre URL via `open -a "Google Chrome" <url>` + imprime instruções no terminal + pausa pra usuário digitar `ok` ou colar valor.

**Passo 1 — Criar projeto Google Cloud:** abre `https://console.cloud.google.com/projectcreate`. Usuário nomeia `seo-brain-<projeto>`, clica CREATE. Cola Project ID (opcional).

**Passo 2 — Habilitar Search Console API:** abre `https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=<id>`. Usuário clica ENABLE.

**Passo 3 — Configurar OAuth Consent Screen:** abre `https://console.cloud.google.com/apis/credentials/consent?project=<id>`. Usuário escolhe External, preenche app name + emails, salva. **Adiciona o próprio email como Test User** (sem isso, consent vai falhar com `access_denied`).

**Passo 4 — Criar OAuth Client ID:** abre `https://console.cloud.google.com/apis/credentials?project=<id>`. Usuário cria OAuth Client ID **Desktop app**, copia Client ID e Client Secret. Cola no terminal (validação de formato).

**Passo 5 — Autorizar acesso ao GSC:** agente gera consent URL com `redirect_uri=http://localhost:<porta>` + `access_type=offline` + `prompt=consent`. Abre no Chrome. Usuário clica Advanced → Continue (app não verificado, esperado). Servidor local captura `code` no callback.

### 4. Troca code por refresh_token

- `exchangeCodeForTokens(client, code)` → `{ refresh_token, access_token, ... }`
- Se refresh_token vazio: erro acionável (instruir revogar acesso em myaccount.google.com/permissions e tentar de novo)

### 5. Lista properties + escolha

- `listProperties(auth)` → array de properties acessíveis na conta Google
- Mostra ao usuário com permissionLevel (siteOwner, siteFullUser, siteRestrictedUser)
- Usuário digita o número correspondente
- Se 0 properties: erro acionável → "adicione property em search.google.com/search-console"

### 6. Persistência

**`.env.local` da raiz do framework:**
- Lê arquivo existente (cria se não existe)
- Atualiza/adiciona `GSC_CLIENT_ID`, `GSC_CLIENT_SECRET`, `GSC_REFRESH_TOKEN`, `GSC_PROPERTY`
- Preserva outras vars existentes
- Permissions: 0600 (owner read/write only)

**`brain/config.md` do projeto:**
- Adiciona/atualiza seção "## Google Search Console" com property, conta, permissão, data.

### 7. Sumário ao usuário

```
✅ Google Search Console configurado.

Property:           sc-domain:exemplo.com.br
Conta Google:       diego@conversion.com.br
Permissão:          siteOwner
.env.local:         <framework>/.env.local
Brain config:       brain/config.md

Próximos passos:
   /gsc-google-search-console performance       # top queries dos últimos 90 dias
   /gsc-google-search-console coverage          # status de sitemaps + erros de indexação

Custo: GRÁTIS (quota 1.200 req/min/projeto).
Token refresh é automático.
```

## Erros e edge cases

| Erro | Ação |
|---|---|
| Não está em projeto | Aborta, instrui `cd projects/<nome>` |
| Chrome não instalado | Aborta, sugere instalar ou copiar URLs manualmente |
| Porta 8080-8999 toda ocupada | get-port escolhe outra; loga porta usada |
| Usuário nunca clica autorizar (timeout 10min) | Mata server, instrui rodar de novo |
| Refresh_token vazio na resposta | Instrui revogar em myaccount.google.com/permissions |
| 0 properties acessíveis | "Adicione property em search.google.com/search-console e verifique" |
| Property formato inválido | Skill já valida via `validatePropertyFormat` |
| `access_denied` no consent | "Adicione seu email como Test User no Consent Screen" |

Detalhes em `references/oauth-troubleshooting.md`.

## Princípios

- **BYO credentials.** Cliente é dono. Sem dependência de app Google verificado.
- **Manual guiado.** Sem automação de browser. Confiável em qualquer harness.
- **Fail loud.** Erro no OAuth → mensagem acionável, nunca silencia.
- **Idempotente.** Re-rodar com `--force` regenera tudo do zero.

## Implementação

Script: `scripts/gsc-setup.mjs` (interativo) ou `scripts/gsc-auth-headless.mjs` (não-interativo, helper). Helpers: `scripts/gsc-client.mjs`.
