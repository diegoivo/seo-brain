# /publicar — build + deploy preview Vercel + abre PageSpeed Insights

## Pré-condições

- Existe pelo menos 1 post em `content/` (não `_principios.md`, posts reais).
- `npm install` já rodou.
- Scaffold aplicado (`app/page.tsx` não é mais o placeholder default).

## Passos

### 1. Build local

```bash
npm run build
```

Se falhar, reporte erro completo ao usuário e PARE. Causas comuns:
- Frontmatter incompleto em `content/*.mdx` (falta `title`, `description`, `date`)
- Import quebrado em `lib/seo.ts` ou `lib/content.ts`
- TypeScript error
- Tailwind class não existente (verificar tokens em DESIGN.tokens.json)

Output esperado: pasta `out/` gerada com HTML estático.

### 2. Deploy preview Vercel

Primeira vez: o Vercel CLI vai pedir login no navegador. Avise o usuário antes:

> "Se for sua primeira vez usando Vercel CLI neste projeto, vai abrir o navegador para login. Complete o login e volte para o terminal."

Execute:

```bash
npx vercel deploy --prebuilt --yes
```

Flags:
- `--prebuilt`: usa `out/` já gerado (não rebuilda no servidor)
- `--yes`: aceita defaults sem perguntar

Capture a URL retornada. Formato esperado: `https://<project>-<hash>-<user>.vercel.app`.

Se `vercel deploy` falhar:
- Sem login: instrua `npx vercel login`
- Sem projeto vinculado: instrua `npx vercel link` antes
- Outros: reporte stderr e PARE

### 3. Abra PageSpeed Insights

Concatene a URL com `https://pagespeed.web.dev/analysis?url=` e abra:

```bash
# macOS
open "https://pagespeed.web.dev/analysis?url=<URL_DEPLOYED>"

# Linux
xdg-open "https://pagespeed.web.dev/analysis?url=<URL_DEPLOYED>"

# Windows
start "" "https://pagespeed.web.dev/analysis?url=<URL_DEPLOYED>"
```

Se o agente não consegue executar `open` (host sandboxed), reporte a URL completa e instrua o usuário a colar no navegador.

### 4. Reporte ao usuário

```
DEPLOY OK

Site preview: <URL>
PageSpeed Insights: aberto no navegador

Métricas alvo:
- Performance: 100
- Accessibility: 100
- Best Practices: ≥95
- SEO: 100

Se PageSpeed Insights mostrar <100:
- Espere 30 segundos e rode "Analyze" novamente (cold start)
- Se persistir <100, peça ajuda na comunidade (compartilhe print do relatório)

Compartilhe sua URL na comunidade pós-masterclass.
```

## Anti-patterns proibidos

- NÃO rode `vercel deploy` sem `--prebuilt` (sobe sem build, falha em SSG export)
- NÃO rode `vercel --prod` no v0 (default é preview; aluno com domínio próprio decide promover)
- NÃO suprima erros (`2>/dev/null`) — usuário precisa ver o que quebrou
- NÃO rode `vercel deploy --prod` automaticamente

## Edge cases

- **Aluno sem conta Vercel**: instrua criar em https://vercel.com/signup (gratuita); rodar `npx vercel login` antes de tentar de novo
- **Aluno sem internet estável durante deploy**: deploy parcial pode quebrar. Reporte e instrua tentar de novo
- **Domínio próprio do aluno**: deploy preview ainda usa `*.vercel.app`. Para promover ao domínio: `npx vercel --prod` (manual)
