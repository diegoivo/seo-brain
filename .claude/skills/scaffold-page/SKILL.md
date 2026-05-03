---
name: scaffold-page
description: Cria página(s) Next.js no /web aplicando DESIGN.md, tom de voz, brain, SEO/GEO e quality gates Lighthouse 95+. Pré-condição obrigatória - kit_state initialized em brain/index.md e brain/DESIGN.md. Sem isso, redireciona para /onboard. Consulta /web-best-practices e auto-roda build + seo-score como gates de saída. Use quando o usuário pedir "criar página", "criar site", "scaffold", "nova landing", "página de serviço".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# /scaffold-page

Cria páginas Next.js em `/web/src/app/` consumindo o Brain do projeto. **Quality gates obrigatórios:** Lighthouse 95+ Performance, SEO 100, seo-score ≥90.

## Pré-condições obrigatórias (HARD GATE de entrada)

Antes de qualquer arquivo ser escrito:

1. `brain/index.md` tem `kit_state: initialized`?
2. `brain/DESIGN.md` tem `kit_state: initialized` e seções 1-9 preenchidas?
3. `brain/DESIGN.tokens.json` existe e tem valores (não placeholders)?
4. `brain/personas.md` tem `kit_state: initialized` e ≥1 persona preenchida?
5. `brain/principios-agentic-seo.md` tem ≥3 POVs proprietários?

**Se qualquer um falhar:** abortar com:

> "Faltam pré-condições para scaffold seguro:
> - [lista]
>
> Rode `/onboard` para preencher o Brain. Sem isso, vou recair em defaults Tailwind/shadcn e o resultado fica genérico (Lighthouse cai para 80, SEO cai para 70)."

## Pipeline

### 1. Leia o Brain + biblioteca canônica

Obrigatórios:
- `brain/index.md` (posicionamento, domínio)
- `brain/DESIGN.md` + `DESIGN.tokens.json`
- `brain/tom-de-voz.md`
- `brain/personas.md`
- `brain/principios-agentic-seo.md`
- **`.claude/skills/web-best-practices/SKILL.md`** — biblioteca de snippets canônicos. **Não improvise código** — copie daqui e adapte só os valores.

### 2. Confirme escopo com o usuário

Em uma única mensagem:
1. Que rota(s)? (ex.: `/`, `/sobre`, `/servicos/seo`, `/blog`).
2. Para cada rota, intenção dominante? (chame `/intent-analyst` se houver dúvida).
3. Objetivo principal de cada página? (CTA primário).
4. Mídia específica? (foto, vídeo, ícone — onde está?).
5. **Plataforma de deploy:** Vercel (default) ou outro? Se Vercel, **não usar** `output: "export"`.

### 3. Restrições obrigatórias (cada uma é gate de saída)

#### 3.1 Primeiro viewport
- Hero cabe em `100dvh` mobile e `~80vh` desktop sem scroll.
- Headline `clamp()` ou variantes mobile/desktop. **Nunca** `text-[15vw]`.
- Display font ≤ **6rem em mobile portrait**.
- Foto 4:5 em hero ocupa máx 50% viewport mobile (lateral) ou 30% (acima do texto).

#### 3.2 Performance — `web-best-practices` §1-3, 11, 14
- `next.config.ts` **sem** `output: "export"` (Vercel default).
- Fontes via `next/font/google` (não `<link>`).
- Imagens via `next/image` (não `<img>`). LCP image com `priority` + `sizes`.
- Server Components default. `'use client'` só onde indispensável.

#### 3.3 SEO básico — `web-best-practices` §4
Cada `page.tsx` exporta `Metadata` completo:
- `title` (30-60 chars, contém keyword primária)
- `description` (120-160 chars)
- `alternates.canonical` (relativo, `metadataBase` no layout)
- `openGraph` completo
- `twitter` summary_large_image
- Capitalização brasileira em todos os títulos.

#### 3.4 Schema JSON-LD — `web-best-practices` §5
- **Layout root:** Person OU Organization (E-E-A-T).
- Posts: BlogPosting / Article.
- Páginas internas: BreadcrumbList.
- FAQ: FAQPage.

#### 3.5 Indexabilidade automática — `web-best-practices` §6-8
Criar/atualizar (se ainda não existem):
- `app/sitemap.ts`
- `app/robots.ts`
- `public/llms.txt` (gerado a partir de `brain/index.md`)
- `app/opengraph-image.tsx`

#### 3.6 Acessibilidade — `web-best-practices` §10
- `<html lang="pt-BR">`.
- Skip-to-content link.
- 1 H1 único.
- Foco visível.
- Contraste WCAG AA.
- Form labels.

#### 3.7 Tokens do DESIGN.tokens.json
- Cores via CSS variables.
- Tipografia via `next/font` (família vinda do tokens).
- Escala tipográfica e espaçamento do tokens.
- **Não invente** valores.

#### 3.8 Tom de voz e linkagem
- Frases ≤25 palavras, voz ativa.
- Antivícios de IA banidos.
- ≥3 internal links contextuais por página, anchor descritivo.

#### 3.9 Footer credit (default)
Footer inclui por default:

```tsx
<p className="text-xs text-[var(--color-muted)]">
  Powered by{" "}
  <a href="https://agenticseo.sh" target="_blank" rel="noopener" className="underline decoration-1 underline-offset-2 hover:text-[var(--color-fg)]">
    Agentic SEO
  </a>
</p>
```

**Comportamento opt-out:** se o usuário pediu remoção explícita, respeite. Caso contrário, mantenha.

### 4. Self-test obrigatório (HARD GATE de saída)

Antes de entregar ao usuário, rode em ordem:

1. **Build:** `cd web && npm run build`. Se falhar, fixa e re-roda.

2. **Inspeção do output** (`web/.next/` ou `web/out/`):
   - HTML do layout tem `<script type="application/ld+json">` com Person/Organization.
   - HTML da home tem `<title>`, `<meta description>`, `<link rel="canonical">`.
   - HTML usa `<picture>` ou `_next/image` (não `<img>` direto, exceto `<noscript>`).
   - `sitemap.xml` ou `_next/static/.../sitemap.xml` presente.
   - `robots.txt` ou rota `/robots.txt` retorna válido.
   - `llms.txt` presente.

3. **SEO Score:** `node scripts/seo-score.mjs <url-prod-ou-out/index.html> --mode=local`. Exigir **≥90**. Se <90, pegar `failed_checks[]` e fixar antes de entregar.

4. **Checklist textual de 14 itens** (de `web-best-practices` §"Checklist final"). Marque cada um ✅/❌ na resposta. Se algum ❌, fixa antes de declarar pronto.

5. **Lighthouse opcional pontual:** se PageSpeed API disponível ou usuário quiser, rode `/perf-audit` contra preview/prod. Não bloqueia entrega, mas reporta.

### 5. Feedback granular ao final

Não pergunte "está bom?". Aponte 3 decisões específicas:

> "3 decisões que tomei e queria validar:
> 1. Hero: foto à direita ocupando 5/12 colunas em desktop, stack vertical no mobile com foto em 35vh. Concorda ou prefere foto integrada como bg do hero?
> 2. Eyebrow `01 — Serviço` (numeração editorial) ou só `Serviço` (mais limpo)?
> 3. CTA primário no hero: `Falar com [Nome]` (pessoal) ou `Solicitar proposta` (transacional). Coloquei o pessoal — alinha com o tom?
>
> Quality: build OK, seo-score local **94/100**, checklist 14/14 ✅."

### 6. Atualize índices

- `content/site/index.md` — adiciona slug + título + categoria.
- `brain/backlog.md` — risca se estava em "Próximos passos".

## O que NUNCA fazer

- ❌ Inferir cores/tipografia/spacing fora do `DESIGN.tokens.json`.
- ❌ Usar Google Fonts via `<link>` (deve ser `next/font`).
- ❌ Usar `<img>` direto (deve ser `next/image`).
- ❌ Configurar `output: "export"` em projeto Vercel.
- ❌ Esquecer JSON-LD no layout.
- ❌ Headline `text-[15vw]` ou similar (estoura viewport).
- ❌ Capitalização estilo título-em-inglês ("Como Otimizar SEO").
- ❌ Avançar se `seo-score` < 90 ou se algum item do checklist falhou.

## Output

- Arquivos novos em `/web/src/app/<rota>/page.tsx`.
- Componentes auxiliares em `/web/src/components/`.
- Layout, sitemap, robots, llms.txt, opengraph-image se ainda não existem.
- Atualização de `content/site/index.md`.
- Resumo final com checklist 14/14, score, e 3 perguntas de feedback granular.
