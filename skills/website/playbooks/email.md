# Playbook: website email

Configura email transacional para o projeto. **Default: Resend** (free tier 3.000 emails/mês). Substitui o `mailto:` improvisado por algo profissional.

## Pré-condições

- `web/` configurado (Next.js)
- Form de contato existente em `web/src/app/contato/page.tsx` (ou usuário pediu antes de criar)

## Pipeline

### 1. Plano (skill `/plan`)

Cria `plans/website-email-<data>.md`. Exemplo de critérios:
- **FE:** form envia + usuário recebe email de teste no inbox
- **BE:** `npm run web:build` passa, types OK, env var documentada em `brain/config.md`

### 2. Pergunta sobre Resend

> "Vou configurar **Resend** (default — 3.000 emails/mês grátis, melhor DX para Next.js).
>
> Você já tem conta?
>
> 1. **Sim, tenho a API key** — me passa a chave (vou guardar em `.env.local` gitignored).
> 2. **Não, vou criar** — abro a aba pra você. Pode levar 2 min, te aviso depois para retomar.
> 3. **Quero usar outro provedor** — sugiro Postmark (paga mas melhor entregabilidade) ou SendGrid. Me diga qual."

#### Caso 2 — usuário não tem conta

```bash
open https://resend.com/signup
```

Mensagem:
> "Aba aberta. Crie a conta (grátis, sem cartão).
>
> Quando criar:
> 1. Vá em https://resend.com/api-keys
> 2. Clique em **Create API key**
> 3. Cole aqui (começa com `re_`)
>
> Pode levar 30s. Te espero."

#### Caso 1 ou após 2

Pega a key. Persiste em `.env.local` (gitignored):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev   # default Resend; trocar quando domínio estiver verificado
RESEND_TO_EMAIL=seu-email@dominio.com     # destino dos forms
```

> "⚠️ **Domínio próprio:** o `onboarding@resend.dev` funciona pra testes mas mensagens podem cair em spam. Quando seu domínio estiver registrado e verificado em https://resend.com/domains, troca `RESEND_FROM_EMAIL` para `contato@seudominio.com.br`. Vou registrar isso no `brain/config.md`."

### 3. Instala SDK

```bash
cd web && npm install resend
```

### 4. Cria route handler

`web/src/app/api/contact/route.ts`:

```ts
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const TO = process.env.RESEND_TO_EMAIL!;

export async function POST(req: Request) {
  try {
    const { nome, email, mensagem, tipo } = await req.json();

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Site] Contato de ${nome}${tipo ? ` — ${tipo}` : ""}`,
      text: `De: ${nome} <${email}>\nTipo: ${tipo ?? "(não informado)"}\n\n${mensagem}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Falha no envio" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
```

### 5. Atualiza form de contato

Substitui `mailto:` por `fetch('/api/contact', { method: 'POST', body: JSON.stringify({...}) })`. Adiciona estados de loading/sucesso/erro com `'use client'`.

### 6. `.env.example` (gitado)

Cria/atualiza `.env.example`:
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=
```

### 7. Atualiza `brain/config.md`

Atualiza tabela de Integrações:

```md
| Resend (email transacional) | configurado | from: onboarding@resend.dev (trocar quando domínio verificado), to: seu-email@dominio.com |
```

Adiciona em Env vars necessárias:
```md
- `RESEND_API_KEY` — gerada em https://resend.com/api-keys
- `RESEND_FROM_EMAIL` — remetente (default `onboarding@resend.dev`)
- `RESEND_TO_EMAIL` — destinatário das mensagens do form
```

### 8. Documenta no Vercel (instrução)

> "Para deploy no Vercel, adicione as 3 env vars no dashboard:
>
> ```
> vercel env add RESEND_API_KEY
> vercel env add RESEND_FROM_EMAIL
> vercel env add RESEND_TO_EMAIL
> ```
>
> Ou pelo dashboard → Settings → Environment Variables."

### 9. Self-test

1. `cd web && npm run build` — passa
2. `cd web && npm run dev`
3. Abre `http://localhost:XXXX/contato`, envia mensagem de teste com email real
4. Confirma com usuário: "Recebeu o email? Em qual inbox? (Resend `from` default pode cair em spam — normal sem domínio verificado)."

## Princípios

- **Default opinativo** — Resend. Outros providers ficam para pedido explícito.
- **Domínio próprio depois.** No início, `onboarding@resend.dev` está OK; o usuário troca quando o domínio estiver pronto e verificado.
- **Brain sempre atualizado.** `config.md` reflete status (configurado vs pendente).
- **Plano antes.** Setup-email passa por `/plan` (mexe em deps + env + route handler — não-trivial).
