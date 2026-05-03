# /scaffold — aplica DESIGN.md no scaffold Next.js

## Pré-condições

- DESIGN.md e DESIGN.tokens.json existem na raiz (rode `/design` antes).
- `npm install` já rodou.

Se DESIGN.tokens.json não existir, **pare** e instrua: "Rode `/design <vibe>` primeiro."

## Passos

### 1. Leia DESIGN.tokens.json e valide

- JSON parseável
- Contém keys: colors, fonts, radii, spacing
- `fonts.display.family` não é Inter, Roboto, Arial, system-ui

Se inválido, reporte erro e pare.

### 2. Atualize `tailwind.config.ts`

Mapeie tokens em `theme.extend`:

```ts
import type { Config } from "tailwindcss";
import tokens from "./DESIGN.tokens.json";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        background: tokens.colors.background,
        foreground: tokens.colors.foreground,
        accent: tokens.colors.accent,
        "accent-foreground": tokens.colors["accent-foreground"],
        border: tokens.colors.border,
        muted: tokens.colors.muted,
        "muted-foreground": tokens.colors["muted-foreground"],
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: tokens.radii,
      maxWidth: {
        editorial: tokens.spacing.editorial,
        container: tokens.spacing.container,
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3. Atualize `app/layout.tsx`

Importe fonts via `next/font/google` (NÃO `<link>`):

```tsx
import { /* Display */, /* Body */ } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// EXEMPLO — substituir pelos fonts do DESIGN.tokens.json
const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = InterTight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

### 4. Reescreva `app/page.tsx` (home) seguindo estrutura híbrida

```
HEADER (SiteHeader, já no layout)
HERO typography-led full-bleed
MANIFESTO coluna estreita ~640px
SERVIÇOS (3 cards COM restrições anti-slop — ver passo 5)
ÚLTIMOS POSTS layout editorial (NÃO cards)
FOOTER (SiteFooter, já no layout)
```

Use placeholders `{{HERO_TITLE}}` e `{{HERO_LEAD}}` para o usuário editar manualmente. Manifesto pode ter `{{MANIFESTO}}` ou texto inicial baseado em `content/_principios.md`.

### 5. Restrições para `components/ui/service-card.tsx`

**Proibido**:
- Ícone em círculo colorido no topo
- Border-left colorido
- Background em gradient
- Drop-shadow grande
- Centralização forçada
- Altura uniforme forçada
- CTA-button dentro do card (use link de texto com seta `→`)

**Obrigatório**:
- Border 1px sólida cor `border` do token, OU sem border + padding generoso
- Border-radius do token `radii.md` (≤8px)
- Tipografia: título font-display, body font-sans
- Hover sutil
- Texto alinhado à esquerda
- Comprimento de descrição varia entre cards

### 6. Reescreva `app/servicos/page.tsx` e `app/blog/page.tsx`

- `/servicos`: lista de cards seguindo restrições do passo 5, OU lista numerada (01., 02., 03.)
- `/blog`: layout editorial — `<article>` com `<time>`, `<h2>` grande, `<p>` lead 2 linhas, separados por `<hr className="border-border" />`. NÃO use cards.

### 7. Garanta `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`

- `sitemap.ts`: usa `lib/seo.ts` para listar todas URLs estáticas
- `robots.ts`: User-agent: *, Allow: /, Sitemap: <URL>/sitemap.xml
- `not-found.tsx`: mesmo layout do placeholder default editorial-raw

### 8. Validação

```bash
npm run build
```

Deve passar sem erros. Se falhar, reporte e PARE.

### 9. Reporte ao usuário

```
Scaffold aplicado. Edite os placeholders {{HERO_TITLE}}, {{HERO_LEAD}}, {{MANIFESTO}}
em app/page.tsx, ou rode /conteudo <tema> para escrever o primeiro post.

Próximo passo: /conteudo <tema do post>
```

## Não modifique

- `content/_principios.md` (asset proprietário)
- `prompts/*.md` (fonte dos comandos)
- `.claude/commands/*.md` (shims)
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `LICENSE`
