---
name: website-domain
description: Configura domínio temporário Vercel após primeiro deploy. Lê URL *.vercel.app, atualiza brain/config.md (campo Domínio temporário), atualiza metadataBase em web/src/app/layout.tsx, confirma com usuário. Evita SEO ruim de domínio fantasma. Roda automaticamente ao final do primeiro /ship em projeto novo. Use quando o usuário disser "configurar domínio", "setup domain", "primeiro deploy", "atualizar metadataBase", "canonical", "vercel.app", "domain temporário".
allowed-tools:
  - Read
  - Edit
  - Bash
  - Grep
---

# /website-domain — configura domínio temporário Vercel

Pre-deploy o usuário não tem domínio próprio apontado. `brain/config.md` mantém `Domínio definitivo: TEMPLATE` e `Domínio temporário: pendente`. Esta skill resolve o "pendente" lendo a URL Vercel e atualizando metadataBase + canonicals.

## Quando rodar

- **Primeiro deploy** em projeto novo (chamada por `/ship` automaticamente).
- Quando usuário troca de projeto Vercel (URL muda).
- Quando `brain/config.md` mostra `Domínio temporário: pendente` mas há deploy ativo.

## Detecção da URL Vercel (3 fontes em ordem)

1. **Argumento explícito:** `/website-domain https://meu-app-abc123.vercel.app`
2. **Vercel CLI:** `vercel ls --prod 2>&1 | head -10` — extrai URL da última deploy prod
3. **Prompt ao usuário:** "Não detectei deploy ativo. Cole a URL Vercel da home da home (ex: `https://meu-app.vercel.app`):"

Se nenhuma fonte resolve: para com mensagem clara — "rode `/ship` primeiro ou faça deploy manual antes".

## Pipeline

### 1. Validar URL
- Match `/^https:\/\/[a-z0-9-]+\.vercel\.app$/`
- Se não match: pede correção. Aceita também subdomain (`meu-app-git-feature.vercel.app`) mas avisa que canonical de prod deve ser sem hash de branch.
- `curl -sI <url>` espera 200. Se 404/5xx: avisa mas continua (pode ser permissão).

### 2. Atualizar `brain/config.md`
Lê arquivo. Encontra linha:
```
Domínio temporário: pendente
```
Substitui por:
```
Domínio temporário: <url-detectada>
```
Mantém formatação. Adiciona linha de timestamp em comentário:
```
<!-- Atualizado por /website-domain em 2026-05-03 -->
```

### 3. Atualizar `metadataBase` em `web/src/app/layout.tsx`
Lê arquivo. Procura padrão:
```ts
metadataBase: new URL("...")
```
Substitui valor por URL detectada. Edit cirúrgico (não toca outros campos).

Se padrão não encontrado: avisa usuário — "layout.tsx não tem `metadataBase` no formato esperado. Adicione manualmente ou aceite default Next.js."

### 4. Atualizar `next.config.mjs` (se aplicável)
Se config tem `assetPrefix` ou `images.domains` referenciando domínio antigo, atualiza.

### 5. Validar canonicals
Roda `node scripts/seo-score.mjs --check-canonical` se script suporta. Reporta páginas com canonical fora do domínio novo.

### 6. Confirmação ao usuário

Mensagem:
> "✅ Domínio temporário configurado.
> - URL: <url>
> - `brain/config.md` atualizado
> - `metadataBase` em `layout.tsx`: `new URL("<url>")`
>
> Acesse [<url>](<url>) e valide:
> 1. Home carrega
> 2. View source: `<link rel=\"canonical\" href=\"<url>/\">` presente
> 3. `/llms.txt` e `/sitemap.xml` retornam 200
>
> Quando o domínio definitivo apontar (ex: `meusite.com.br`):
> - Avise: 'configure o domínio definitivo'
> - Vou atualizar `Domínio definitivo` em `brain/config.md` e refazer canonicals/metadataBase."

## Edge cases

| Caso | Ação |
|---|---|
| Vercel deploy múltiplos projetos | Pergunta qual escolher (lista os 5 mais recentes) |
| URL é preview (`*-git-*.vercel.app`) | Avisa: "Esta é URL de branch preview. Para canonical de prod, use a URL `*.vercel.app` sem hash de branch." |
| `metadataBase` ausente em layout.tsx | Insere bloco `metadataBase: new URL("...")` em `export const metadata`. |
| URL com path (`vercel.app/foo`) | Rejeita. Domínio canonical não tem path. |
| Domínio definitivo já configurado | Pergunta: "Já existe `Domínio definitivo: meusite.com`. Sobrescrever com temporário ou manter definitivo?" |

## Output

`brain/config.md` antes:
```
Domínio definitivo: TEMPLATE
Domínio temporário: pendente
```

Depois:
```
Domínio definitivo: TEMPLATE
Domínio temporário: https://meu-app-abc123.vercel.app
<!-- Atualizado por /website-domain em 2026-05-03 -->
```

`web/src/app/layout.tsx` antes:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  ...
}
```

Depois:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://meu-app-abc123.vercel.app"),
  ...
}
```

## Princípios

- **Idempotente.** Rodar 2× com mesma URL = no-op.
- **Edit cirúrgico.** Não toca campos vizinhos.
- **Falha cedo.** URL inválida = aborta antes de mexer em arquivos.
- **Brain primeiro.** `brain/config.md` é a fonte de verdade; layout.tsx reflete.
