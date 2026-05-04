---
name: gsc-google-search-console-setup
description: Configura Google Search Console OAuth via fluxo guiado interativo. Abre URLs no Chrome real do usuário (que já está logado no Google) e instrui passo a passo no Google Cloud Console pra criar projeto, habilitar API, criar OAuth client (Desktop app), e capturar refresh_token via callback localhost. Salva GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN, GSC_PROPERTY no .env.local + atualiza brain/config.md. Use quando o usuário pedir "configurar GSC", "Google Search Console", "conectar GSC", "setup search console", ou antes de rodar /gsc-google-search-console-performance ou /gsc-google-search-console-coverage. Pilar Dados. Custo GRÁTIS, ~5min de setup na primeira vez.
allowed-tools:
  - Read
  - Write
  - Bash
---

# /gsc-google-search-console-setup — Google Search Console OAuth (BYO)

Conduz o usuário pelo Google Cloud Console pra ele criar suas próprias credenciais OAuth (BYO — Bring Your Own credentials) e autorizar acesso ao GSC. Sem app verification do Google, sem cap de usuários, credenciais isoladas por projeto.

## Pré-requisitos

1. **Estar dentro de um projeto SEO Brain** (`pwd` deve mostrar `projects/<nome>/`). Skill aborta se rodada na raiz do framework.
2. **Conta Google com acesso à property no GSC.** Property já adicionada e verificada em https://search.google.com/search-console.
3. **Chrome instalado** (`open -a "Google Chrome"` precisa funcionar). Funciona em qualquer macOS.

Sem credenciais? Skill cuida do setup do zero — cliente cria conta Google Cloud (gratuita) durante o fluxo se ainda não tiver.

## Inputs

- Sem flags: `/gsc-google-search-console-setup`
- Reconfigurar (sobrescreve credenciais existentes): `/gsc-google-search-console-setup --force`

## Pipeline

### 1. Verificações iniciais

- Confirma cwd = projeto ativo (`scripts/lib/project-root.mjs::requireProjectRoot`)
- Lê `.env.local` da raiz do framework (`<framework>/.env.local`)
- Se já tem `GSC_REFRESH_TOKEN` e sem `--force`:
  ```
  GSC já configurado neste framework.
  Property atual: <GSC_PROPERTY>

  Reconfigurar? Use /gsc-google-search-console-setup --force
  Ou rode /gsc-google-search-console-performance / /gsc-google-search-console-coverage diretamente.
  ```
  Aborta.

### 2. Inicia callback server

- Importa `get-port` e aloca porta livre (8080-8999 preferida)
- Sobe servidor HTTP local em `localhost:<porta>` que aguarda `?code=...`
- Loga: `[gsc-setup] callback server em http://localhost:<porta>`

### 3. Conduz o usuário pelos passos no Chrome

Cada passo: agente abre URL via `open -a "Google Chrome" <url>` + imprime instruções no terminal + pausa pra usuário digitar `ok` ou colar valor.

**Passo 1 — Criar projeto Google Cloud:**
```
Vou abrir o Google Cloud Console no seu Chrome.
[abre https://console.cloud.google.com/projectcreate]

No formulário:
  • Project name: seobrain-<slug-do-projeto>
  • Location: deixe "No organization" (default)
  • Clique CREATE
  • Aguarde ~30s até aparecer notificação "Project created"

Cole aqui o Project ID (mostrado em "Project info" no dashboard, formato:
seobrain-<slug>-123456) ou pressione Enter pra continuar sem ele:
```

Project ID é opcional — se usuário colar, próximas URLs vão pré-selecionar o projeto via `?project=<id>`. Senão, GCP mostra seletor.

**Passo 2 — Habilitar Search Console API:**
```
[abre https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=<id>]

Clique no botão azul ENABLE.
Aguarde aparecer "API enabled" (~10s).

Digite "ok" quando concluir:
```

**Passo 3 — Configurar OAuth Consent Screen:**
```
[abre https://console.cloud.google.com/apis/credentials/consent?project=<id>]

1. User Type: escolha External → CREATE
2. Preencha:
   • App name: SEO Brain (<nome-projeto>)
   • User support email: <seu email>
   • Developer contact email: <seu email>
3. SAVE AND CONTINUE (3x — pula Scopes e Test users)
4. BACK TO DASHBOARD

Digite "ok" quando concluir:
```

**Passo 4 — Adicionar você como Test User:**
```
Como o app está em modo Testing, só usuários adicionados podem autorizar.
Na tela de consent, clique:

  Test users → ADD USERS → cole seu email Google → SAVE

Digite "ok" quando concluir:
```

**Passo 5 — Criar OAuth Client ID:**
```
[abre https://console.cloud.google.com/apis/credentials?project=<id>]

1. Clique CREATE CREDENTIALS → OAuth client ID
2. Application type: Desktop app
3. Name: seobrain-cli
4. Clique CREATE

Vai aparecer modal com Client ID e Client secret.

Cole aqui o Client ID (formato: 123456-abc.apps.googleusercontent.com):
```

[lê input]

```
Cole aqui o Client secret (formato: GOCSPX-...):
```

[lê input]

### 4. Fluxo de consent OAuth

- Cria OAuthClient com `client_id`, `client_secret`, `redirect_uri=http://localhost:<porta>`
- Gera consent URL via `buildConsentUrl(client)` (scope `webmasters.readonly`, prompt=consent, access_type=offline)
- Abre URL no Chrome:
  ```
  Última etapa: vou abrir a tela de consent do Google.

  Você vai ver:
  • "Google hasn't verified this app" → clique "Advanced" → "Go to seobrain (unsafe)"
    (é seu próprio app, é seguro — só não foi verificado pelo Google)
  • Tela de permissões → clique "Continue"
  • Vai redirecionar pra http://localhost:<porta> (página em branco — tudo certo)

  [abre URL]

  Aguardando callback...
  ```

- Servidor local recebe `?code=...` no callback, responde com HTML "✅ Autenticado, pode fechar essa aba"
- Mata servidor

### 5. Troca code por refresh_token

- `exchangeCodeForTokens(client, code)` → `{ refresh_token, access_token, ... }`
- Se refresh_token vazio: erro acionável (instruir revogar acesso em myaccount.google.com/permissions e tentar de novo)

### 6. Lista properties + escolha

- `listProperties(auth)` → array de properties acessíveis
- Mostra ao usuário:
  ```
  Properties acessíveis na sua conta Google:

  1. https://exemplo.com.br/        (siteOwner)
  2. sc-domain:exemplo.com.br       (siteOwner)
  3. https://outro-site.com/        (siteFullUser)

  Qual usar pra este projeto? Digite o número:
  ```
- Se 0 properties: erro acionável → "adicione property em search.google.com/search-console"

### 7. Persistência

**`.env.local` da raiz do framework:**
- Lê arquivo existente (cria se não existe)
- Atualiza/adiciona linhas:
  ```
  GSC_CLIENT_ID=<value>
  GSC_CLIENT_SECRET=<value>
  GSC_REFRESH_TOKEN=<value>
  GSC_PROPERTY=<chosen>
  ```
- Preserva outras vars existentes
- Permissions: 0600 (owner read/write only)

**`brain/config.md` do projeto:**
- Lê arquivo
- Adiciona/atualiza seção:
  ```markdown
  ## Google Search Console

  - **Property:** <chosen>
  - **Conta Google:** <email-extraído-do-token-info>
  - **Configurado em:** <data>

  Skills disponíveis: `/gsc-google-search-console-performance`, `/gsc-google-search-console-coverage`
  ```
- Email da conta vem de `auth.userinfo()` (chamada extra grátis)

### 8. Sumário

```
✅ Google Search Console configurado.

Property: https://exemplo.com.br/
Credenciais salvas em: <framework>/.env.local
Brain atualizado: brain/config.md

Próximos passos:
  /gsc-google-search-console-performance       # top queries dos últimos 90 dias
  /gsc-google-search-console-coverage          # status de sitemaps + erros de indexação

Custo: GRÁTIS (quota 1.200 req/min/projeto).
Token refresh é automático (refresh_token nunca expira a menos que você revogue).
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

## Princípios

- **BYO credentials.** Cliente é dono. Sem dependência de app Google verificado.
- **Manual guiado.** Sem automação de browser. Confiável em qualquer harness.
- **Fail loud.** Erro no OAuth → mensagem acionável, nunca silencia.
- **Idempotente.** Re-rodar com `--force` regenera tudo do zero.

## Implementação

Script: `scripts/gsc-setup.mjs`. Helpers: `scripts/gsc-client.mjs`.
