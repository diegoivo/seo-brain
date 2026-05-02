---
name: scaffold-ssg
description: Aplica DESIGN.tokens.json no scaffold Next.js SSG (home, serviços, blog) com restrições anti-AI-slop. Caminho default do kit. Triggers em "/scaffold", "aplicar design", "rebuild scaffold". Use scaffold-payload em vez deste se >50 posts ou >3 autores.
---

# Skill `scaffold-ssg` — caminho default do kit

> ⚠️ **Esta skill toca código.** Segue o protocolo spec-driven em
> [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md):
> escreve `docs/specs/scaffold-ssg.md`, gera `tests/scaffold-ssg.spec.ts`,
> roda RED, executa via workers paralelos, e invoca QA sub-agent independente
> antes de declarar GREEN.

## Quando NÃO usar esta skill

Se ao menos uma destas for verdadeira, use `scaffold-payload`:

- Mais de 3 autores escrevendo no site.
- Mais de 50 posts previstos no ano 1.
- Cliente exige CMS visual (não-dev edita conteúdo).
- Catálogo dinâmico com >100 itens.

Para os outros 80% dos casos, **continue com esta skill**.

## Pré-condições

- `DESIGN.md` e `DESIGN.tokens.json` existem na raiz (rode `/design` antes).
- `npm install` já rodou.
- Next.js 15 + Tailwind 3 instalados.

Se `DESIGN.tokens.json` não existir, **pare** e instrua: "Rode `/design <vibe>` primeiro."

## Passos

### 1. Valide `DESIGN.tokens.json`

- JSON parseável.
- Contém keys: `colors`, `fonts`, `radii`, `spacing`.
- `fonts.display.family` não é Inter (sem Tight), Roboto, Arial, system-ui.
- Cada cor é hex válido.

Se inválido, reporte erro e pare.

### 2. Atualize `app/layout.tsx` para usar os fonts do tokens

Mapeie `fonts.display.family`, `fonts.body.family`, `fonts.mono.family` para
imports `next/font/google`. Ex: `Fraunces`, `Inter_Tight`, `Geist_Mono` (com
underscore para fontes com espaço no nome).

```tsx
import { <Display>, <Body>, <Mono> } from "next/font/google";

const fontDisplay = <Display>({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});
// ... e idem para body e mono
```

### 3. Verifique `tailwind.config.ts`

O `tailwind.config.ts` já consome `DESIGN.tokens.json` via import. Se foi
modificado manualmente, garanta que mantém o import.

### 4. Estrutura de páginas (anti-slop compliant)

Verifique que estas páginas existem e seguem as restrições:

- **`app/page.tsx`** (home):
  - Header minimalista (já no layout)
  - Hero typography-led full-bleed
  - Manifesto coluna estreita ~640px
  - 3 cards de serviço seguindo restrições do passo 5
  - Últimos posts em layout editorial (NÃO cards)
  - Footer (já no layout)

- **`app/servicos/page.tsx`**: lista numerada (01., 02., 03.) ou cards seguindo
  restrições do passo 5.

- **`app/blog/page.tsx`**: layout editorial. `<article>` com `<time>`, `<h2>`
  grande, `<p>` lead, separados por `divide-y divide-border`. NÃO cards.

- **`app/blog/[slug]/page.tsx`**: post individual com `MDXRemote`, frontmatter,
  JSON-LD Article, lista de fontes ao final.

### 5. Restrições para cards de serviço

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

### 6. Garanta arquivos de SEO

- `app/sitemap.ts` com `export const dynamic = "force-static"`
- `app/robots.ts` com `export const dynamic = "force-static"`
- `app/not-found.tsx`
- `lib/seo.ts` com `buildOrganizationJsonLd` e `buildArticleJsonLd`

### 7. Validação

```bash
npm run build
```

Deve passar sem erros, gerar `out/`. Verifique:

- `out/index.html` existe
- `out/blog/index.html` existe
- `out/sitemap.xml` existe
- `out/robots.txt` existe

### 8. Reporte ao usuário

```
Scaffold aplicado com tokens de DESIGN.tokens.json.

Páginas geradas:
- / (home)
- /servicos/
- /blog/
- /blog/<slug>/ (1 post)

Edite os placeholders em app/page.tsx e lib/site-config.ts antes de publicar.

Próximo passo: /conteudo <tema do post>
```

## Não modifique

- `wiki/` (fonte de verdade da marca)
- `content/_*.mdx` (templates)
- Posts existentes em `content/`
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `LICENSE`
