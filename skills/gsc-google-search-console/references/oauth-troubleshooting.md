# OAuth troubleshooting — /gsc-google-search-console

Erros comuns no setup OAuth e como resolver.

## `access_denied` no consent

**Causa:** seu email Google não está na lista de Test Users do OAuth Consent Screen, e o app está em modo "Testing" (default pra apps não verificados).

**Solução:**
1. Abra https://console.cloud.google.com/apis/credentials/consent
2. Selecione o projeto correto (top-left)
3. Role até "Test users" → ADD USERS
4. Cole seu email Google → SAVE
5. Rode `node scripts/gsc-setup.mjs --force` de novo

## `invalid_grant` em chamadas de API

**Causa:** refresh_token foi revogado ou expirou (raro — refresh_tokens não expiram a menos que sejam revogados manualmente).

**Solução:**
1. Vá em https://myaccount.google.com/permissions
2. Encontre "SEO Brain" (ou nome que deu ao app)
3. Remove access
4. Rode `node scripts/gsc-setup.mjs --force` pra capturar novo refresh_token

## `0 properties encontradas`

**Causas possíveis:**

1. **Conta Google diferente da que tem acesso à property.** O Chrome pode ter selecionado outra conta no consent. Confira em https://myaccount.google.com qual conta está logada.
2. **Property não existe ou não foi verificada no GSC.** Vai em https://search.google.com/search-console — se não tem property cadastrada, adicione e verifique (DNS, HTML tag, ou Google Analytics).
3. **Acesso via Google Group / Workspace shared.** A API `sites.list` só lista properties com acesso direto/nominal. Se você tem acesso via grupo, peça pro owner adicionar você diretamente.

## Refresh_token vazio na resposta

**Causa:** Google só retorna refresh_token na primeira vez que você consente. Se já consentiu antes, retorna apenas access_token.

**Solução:** Já tratado pelo skill via `prompt: 'consent'` no buildConsentUrl. Se mesmo assim vier vazio:
1. Revogue acesso em https://myaccount.google.com/permissions
2. Rode `node scripts/gsc-setup.mjs --force` de novo

## "Google hasn't verified this app" (esperado)

Não é erro. É a tela que aparece quando seu app está em modo Testing (sem verification do Google). Pra prosseguir:

1. Clique **Advanced** (link pequeno embaixo)
2. Clique **Go to seo-brain (unsafe)**

É **seguro** — é seu próprio app, criado por você. "Unsafe" só significa que Google não verificou.

## Quota excedida (429)

GSC API limita 1.200 req/min/projeto. Se exceder:
- Aguarde 60s
- Reduza paralelismo se estiver fazendo múltiplas chamadas
- Cliente faz backoff exponencial automático em 429 (4 retries)

## Property formato inválido (400)

**Causa:** `GSC_PROPERTY` no `.env.local` não está no formato esperado.

**Formatos válidos:**
- URL-prefix: `https://exemplo.com.br/` (com barra final obrigatória)
- Domain property: `sc-domain:exemplo.com.br` (sem barra, sem https)

**Solução:** edite manualmente `.env.local` ou rode `node scripts/gsc-setup.mjs --force`.

## Permissão insuficiente (403)

**Causa:** sua conta tem `siteRestrictedUser` (apenas leitura de relatórios) ou foi removida da property.

**Solução:** peça ao owner pra te dar `siteFullUser` ou `siteOwner` em GSC → Settings → Users and permissions.

## Cookies do Chrome não importam pro OAuth

OAuth não usa cookies do navegador. Usa refresh_token salvo em `.env.local` (chmod 600, git-ignored). Se você compartilhar `.env.local` ou o repo for público, **rotacione** o secret em https://console.cloud.google.com/apis/credentials → Reset secret.
