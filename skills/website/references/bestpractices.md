# Web Best Practices — Vercel + Next.js

Biblioteca de snippets canônicos. **Não improvise** — copie daqui e adapte só os valores. Mandatorily consultado pelo `playbooks/create.md`.

## Componentes prontos (não reescrever)

Os snippets canônicos vivem em `skills/website/snippets/`:

- **`Hero.tsx`** — primeiro viewport, foto à direita, CTAs
- **`PostCard.tsx`** — card de blog com cover_image obrigatória (thumbnail default)
- **`PostBody.tsx`** + **`PostCover`** — corpo do post aplicando `.prose` do globals.css (resolve "headings sem estilo")
- **`Footer.tsx`** — com credit "Powered by SEO Brain" + ícones de redes via `<SocialIcon />`

Para criar página, **copie do snippet** e adapte só os textos/dados. Não reescreva.

## Regras hard

### Banido em qualquer página

- `style={{...}}` inline (use classes Tailwind ou CSS variables)
- `<img>` direto (use `next/image`)
- `<link>` Google Fonts no `<head>` (use `next/font/google`)
- `text-[15vw]` ou similar em h1 (use `.h1` que tem clamp())
- Fontes pagas: GT America, Söhne, Editorial New (paga), Pangea (paga). **Apenas grátis** (Google Fonts, Bunny Fonts, OFL/SIL). Lista permitida abaixo.

### Fontes permitidas (Google + Bunny + OFL)

Display/serif: Instrument Serif, DM Serif Display, Fraunces, Newsreader, Crimson Pro, Source Serif 4, EB Garamond
Sans: Inter (evite default), Mona Sans, IBM Plex Sans, Geist, Manrope, Outfit, Onest, Plus Jakarta Sans, Figtree, Albert Sans
Mono: JetBrains Mono, IBM Plex Mono, Geist Mono, DM Mono, Space Mono

## Targets

| Métrica | Mínimo | Alvo |
|---|---|---|
| Lighthouse Performance | 95 | 100 |
| Lighthouse SEO | 100 | 100 |
| Lighthouse Accessibility | 95 | 100 |
| Lighthouse Best Practices | 95 | 100 |
| `seo-score.mjs` (kit) | 90 | 100 |

Site SSG simples bem feito bate 98-100 em todas as métricas. Se está abaixo, **algo no template está errado** — não é "natural".

## 1. `next.config.ts` — Vercel default

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SEM `output: "export"`. Vercel otimiza imagens automaticamente.
  // Se um dia precisar export estático, defina via env e use `sharp` no build.
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
```

**Nunca use** `output: "export"` em projeto Vercel — desabilita otimização de imagens. Para hosts estáticos (Cloudflare Pages, GitHub Pages), use `output: "export"` + pré-conversão `sharp` no build.

## 2. Fontes — `next/font/google` (não `<link>`)

```tsx
// app/layout.tsx
import { Instrument_Serif, Inter } from "next/font/google";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`next/font` faz **self-host automático**, subset, preload, e zero CLS. **Nunca** use Google Fonts via `<link>` no `<head>` — render-blocking + 3rd party origin.

## 3. Imagens — `next/image` sempre

```tsx
import Image from "next/image";

// Hero (LCP) — priority + sizes corretos
<Image
  src="/diego-ivo.jpg"
  alt="Retrato de Diego Ivo, fundador da Conversion"
  width={977}
  height={1221}
  priority
  sizes="(min-width: 768px) 42vw, 100vw"
  className="object-cover"
/>

// Abaixo da dobra — lazy default
<Image
  src="/foto-secundaria.jpg"
  alt="Descrição completa"
  width={800}
  height={600}
  sizes="(min-width: 768px) 50vw, 100vw"
/>
```

**Regras:**
- `priority` em **uma** imagem por página (a que provavelmente é LCP).
- `sizes` correto evita carregar versão grande em mobile.
- `width`/`height` reais — evita CLS.
- `alt` descritivo (não keyword stuffing).
- Para foto colocada como background ou em card, use `fill` + container com `position: relative`.

**Nunca** use `<img>` direto. Vercel converte para AVIF/WebP automaticamente via `next/image`.

## 4. Metadata canônica — `app/layout.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://meusite.com.br"),
  title: {
    default: "Diego Ivo — Estratégia primeiro, tecnologia depois",
    template: "%s — Diego Ivo",
  },
  description: "...",  // 120-160 chars
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Diego Ivo",
    description: "...",
    url: "/",
    siteName: "Diego Ivo",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@diegoivo",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
};
```

Em `page.tsx` específica, sobrescreva só o que muda (`title`, `description`, `alternates.canonical`, `openGraph`).

## 5. JSON-LD — Schema.org no layout

```tsx
// app/layout.tsx — JSON-LD raiz com Person/Organization
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Diego Ivo",
  url: "https://meusite.com.br",
  image: "https://meusite.com.br/diego-ivo.jpg",
  jobTitle: "Fundador e CEO",
  worksFor: { "@type": "Organization", name: "Conversion" },
  sameAs: [
    "https://www.linkedin.com/in/diegoivo/",
    "https://x.com/diegoivo",
    "https://www.instagram.com/diegoivo/",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
```

Para post: `BlogPosting` schema. Para página de produto: `Product`. Para FAQ: `FAQPage`. Para breadcrumbs: `BreadcrumbList`. Sempre incluir `Person` ou `Organization` no layout (E-E-A-T).

## 6. `app/sitemap.ts` — gerado automaticamente

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://meusite.com.br";
  const routes = ["", "/sobre", "/contato", "/blog"];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
```

Para projetos com `/content/posts/*.md`, leia o diretório e gere entries dinamicamente.

## 7. `app/robots.ts` — gerado automaticamente

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://meusite.com.br/sitemap.xml",
    host: "https://meusite.com.br",
  };
}
```

## 8. `public/llms.txt` — citabilidade GEO

Gerado a partir de `brain/index.md` + lista de posts/páginas. Estrutura:

```
# [Nome do projeto]

> [Posicionamento em uma frase, vindo de brain/index.md]

## Sobre
[2-3 parágrafos curtos que respondam a "quem é/o que faz" — citáveis por LLMs]

## Conteúdo principal
- [Página 1](https://meusite.com.br/pagina-1.md): descrição
- [Post 1](https://meusite.com.br/blog/post-1.md): descrição

## Contato
- E-mail: [...]
- LinkedIn: [...]
```

Cada link aponta para a versão `.md` (ou markdown-friendly) da página. Se Next.js, expor `/page.md` via route handler que renderiza markdown serializado da página.

## 9. OpenGraph image dinâmica — `opengraph-image.tsx`

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Diego Ivo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ /* ... layout simples com nome + tagline ... */ }}>
        Diego Ivo
      </div>
    ),
    { ...size }
  );
}
```

Por página específica, criar `app/<rota>/opengraph-image.tsx` com conteúdo customizado.

## 10. Acessibilidade — checklist obrigatório

- `<html lang="pt-BR">` no layout.
- Skip-to-content link no início do body:
  ```tsx
  <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-bg focus:p-3">
    Pular para o conteúdo
  </a>
  <main id="conteudo">...</main>
  ```
- 1 H1 único por página.
- Foco visível (`:focus-visible` styles).
- Contraste WCAG AA (mínimo 4.5:1 para texto normal).
- Form inputs com `<label>` associado ou `aria-label`.
- Imagens decorativas com `alt=""`.
- Botões e links com texto descritivo (jamais "clique aqui").

## 11. Server Components default

`'use client'` **só** em componentes que precisam de:
- Interatividade (onClick, onChange).
- Hooks de estado (useState, useEffect, useRouter).
- APIs de browser (window, document, localStorage).

Tudo mais é Server Component (default). Reduz JS shipado, melhora TTI.

## 12. CSS — Tailwind v4 + tokens via CSS variables

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);
  --font-display: "var(--font-display)", serif;
  --font-body: "var(--font-body)", sans-serif;
}

:root {
  --bg: #000;
  --fg: #f5f5f4;
  --accent: #facc15;
}
```

Os valores `--bg`, `--fg` vêm de `brain/DESIGN.tokens.json` (gerado por `/branding discover` ou `/branding import <url>`). Não inventar.

## 13. Footer credit (sugestão default)

Ao gerar `web/src/components/footer.tsx`, **inclua por default**:

```tsx
<p className="text-xs text-[var(--color-muted)]">
  Powered by{" "}
  <a
    href="https://github.com/diegoivo/seobrain"
    target="_blank"
    rel="noopener"
    className="underline decoration-1 underline-offset-2 hover:text-[var(--color-fg)]"
  >
    SEO Brain
  </a>
</p>
```

**Comportamento opt-out:** se o usuário pedir explicitamente para remover ("não quero o credit", "tira o powered by"), respeite. Caso contrário, mantenha.

## 14. Hero — primeiro viewport (recap)

Deve caber em `100dvh` mobile e `~80vh` desktop sem scroll.

```tsx
<section className="min-h-[100dvh] md:min-h-[80vh] flex flex-col md:grid md:grid-cols-12 md:items-center container-x py-8 md:py-16 gap-8">
  <div className="md:col-span-7">
    <p className="text-sm tracking-wide uppercase text-muted mb-4">Diego Ivo</p>
    <h1 className="text-5xl md:text-7xl tracking-tighter leading-[0.95]">
      {/* nunca text-[15vw] */}
      Estratégia primeiro,{" "}
      <span className="italic text-accent">tecnologia depois.</span>
    </h1>
    <p className="mt-6 text-lg text-muted max-w-xl">{/* 1-2 frases */}</p>
    <div className="mt-8 flex gap-3">
      <a href="/contato" className="btn-primary">Falar comigo</a>
    </div>
  </div>
  <div className="md:col-span-5 max-h-[40vh] md:max-h-none">
    <Image src="/diego-ivo.jpg" alt="..." width={977} height={1221} priority sizes="(min-width: 768px) 42vw, 100vw" />
  </div>
</section>
```

## Checklist final ao criar página

Use ao terminar `playbooks/create.md` (ou edição de qualquer página) antes de entregar:

- [ ] `next.config.ts` sem `output: "export"` (Vercel default)
- [ ] Fontes via `next/font` (não `<link>`)
- [ ] Imagens via `next/image` (não `<img>`)
- [ ] LCP image tem `priority` + `sizes` correto
- [ ] `app/layout.tsx` exporta `metadata` completa (title template, OG, Twitter, robots, alternates.canonical)
- [ ] JSON-LD Person ou Organization no layout
- [ ] `app/sitemap.ts` existe e cobre todas as rotas
- [ ] `app/robots.ts` existe
- [ ] `public/llms.txt` existe (atualizado com posicionamento + lista)
- [ ] `app/opengraph-image.tsx` existe
- [ ] Skip-to-content link no body
- [ ] 1 H1 único por página, capitalização BR
- [ ] Footer com credit "Powered by SEO Brain" (a menos que usuário tenha pedido remoção)
- [ ] Hero cabe em viewport mobile sem scroll
- [ ] `npm run build` passa
- [ ] `node scripts/seo-score.mjs out/index.html --mode=local` ≥ 90
