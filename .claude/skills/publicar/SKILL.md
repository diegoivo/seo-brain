---
name: publicar
description: Build local + deploy preview Vercel + abre PageSpeed Insights. Triggers em "/publicar", "deploy", "publica preview", "subir para Vercel". Não promove para produção automaticamente.
---

# Skill `publicar`

> ⚠️ **Esta skill toca infraestrutura.** Quando faz mudanças em código (ex:
> ajuste de config para passar build), segue o protocolo spec-driven em
> [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md).
> Para QA pós-deploy, invoca `agent-browser` para validar a URL pública.

## Pré-condições

- Existe pelo menos 1 post em `content/*.mdx` (não `_*.mdx`).
- `npm install` já rodou.
- Scaffold aplicado.

## Passos

### 1. Build local

```bash
npm run build
```

Se falhar, reporte erro completo e **pare**. Causas comuns:

- Frontmatter incompleto em `content/*.mdx` (faltando title, description, ou date).
- TypeScript error.
- Tailwind class não existente (verificar tokens em `DESIGN.tokens.json`).
- MDX com componente JSX não definido.

Output esperado: pasta `out/` com HTML estático.

### 2. Tente delegar para skill Vercel

Se Skill tool disponível, tente:

1. `vercel:deploy` (preview por default)
2. `deploy-to-vercel`
3. `vercel-cli-with-tokens` (se tem `VERCEL_TOKEN` env)

Se nenhuma disponível, siga fallback (passo 3).

### 3. (Inline fallback) Deploy manual

Avise o usuário antes da primeira execução:

> "Se for sua primeira vez usando Vercel CLI neste projeto, vai abrir o
> navegador para login. Complete o login e volte para o terminal."

Execute:

```bash
npx vercel deploy --prebuilt --yes
```

Flags:
- `--prebuilt`: usa `out/` já gerado (não rebuilda no servidor).
- `--yes`: aceita defaults sem perguntar.

Capture a URL retornada. Formato: `https://<project>-<hash>-<user>.vercel.app`.

Se `vercel deploy` falhar:
- Sem login: instrua `npx vercel login`.
- Sem projeto vinculado: instrua `npx vercel link` antes.
- Outros: reporte stderr e pare.

### 4. Abra PageSpeed Insights

```bash
open "https://pagespeed.web.dev/analysis?url=<URL_DEPLOYED>"   # macOS
xdg-open "https://pagespeed.web.dev/analysis?url=<URL_DEPLOYED>" # Linux
```

Se o agent não consegue executar `open` (host sandboxed), reporte a URL completa
e instrua o usuário a colar no navegador.

### 5. Reporte ao usuário

```
DEPLOY OK

Site preview: <URL>
PageSpeed Insights: aberto no navegador

Métricas alvo:
- Performance: 100
- Accessibility: 100
- Best Practices: ≥95
- SEO: 100

Se PageSpeed mostrar <100:
- Espere 30 segundos e rode "Analyze" novamente (cold start).
- Se persistir <100, leia wiki/tecnologia/performance.md para diagnóstico.
```

### 6. Não promova para produção automaticamente

A flag `--prod` faz deploy direto para o domínio principal. **Nunca rode
automaticamente**. Se o usuário pedir para promover:

```bash
npx vercel deploy --prebuilt --prod
```

Pergunte antes: "Você confirma promover para produção? Isso publica para o
domínio principal."

## Anti-patterns proibidos

- NÃO rode `vercel deploy` sem `--prebuilt` (sobe sem build, falha em SSG export).
- NÃO rode `vercel --prod` automaticamente.
- NÃO suprima erros (`2>/dev/null`).

## Edge cases

- **Aluno sem conta Vercel**: instrua criar em https://vercel.com/signup (gratuita);
  rodar `npx vercel login` antes.
- **Internet instável durante deploy**: deploy parcial pode quebrar. Reporte e
  instrua tentar de novo.
- **Domínio próprio**: deploy preview ainda usa `*.vercel.app`. Para promover ao
  domínio: `npx vercel --prod` (manual). Ver `wiki/tecnologia/deploy.md`.
