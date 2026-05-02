---
title: Deploy
tags: [tecnologia, deploy]
updated: 2026-05-02
---

# Deploy

## Vercel (recomendado)

Por que Vercel:
- Detecta Next.js automaticamente.
- CDN global na free tier.
- Preview por commit, prod por merge.
- Zero config para `output: 'export'`.

### Primeira vez (one-shot)

```bash
npm run build
npx vercel deploy --prebuilt --yes
```

- `--prebuilt` usa `out/` já gerado (não rebuilda no servidor).
- `--yes` aceita defaults sem perguntar.
- Na primeira execução abre o navegador para login.

### Promover para produção

```bash
npx vercel deploy --prebuilt --prod
```

A skill `publicar` deixa essa decisão para você (manual). Não promove
automaticamente.

## Domínio próprio

1. Compre o domínio (Registro.br, Cloudflare, Namecheap).
2. Em Vercel → Project Settings → Domains → adicionar.
3. Aponte os DNS (A record `76.76.21.21` ou CNAME `cname.vercel-dns.com`).
4. Atualize `siteConfig.url` em `lib/site-config.ts` para o domínio próprio.
5. Refaça o deploy.

## Outros hosts

O kit gera `out/` 100% estático, então qualquer CDN serve:
- Cloudflare Pages: `wrangler pages deploy out/`
- Netlify: `netlify deploy --prod --dir=out`
- GitHub Pages: copie `out/` para a branch `gh-pages`
- S3 + CloudFront: `aws s3 sync out/ s3://bucket/ --delete`

Para Payload (caminho não-default), ver skill `scaffold-payload`.
