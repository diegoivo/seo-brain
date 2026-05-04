# Playbook: `/branding images`

Sistema de imagens em 3 partes: **estilo** (mood-board), **tipos** (hero, secondary, avatar, illustration), **provider** (Pexels default free).

Sem estilo definido, busca retorna AI-slop genérico (foto stock corporativa). Com estilo, queries ficam específicas e o resultado tem coerência visual entre páginas.

## Pré-condições

- `brain/DESIGN.md` initialized (mood é input para inferência de estilo).

## Pipeline em 3 etapas

### Etapa 1 — Estilo (mood-board canônico)

5 estilos opinativos, anti-genérico:

| Estilo | Quando usar | Queries default |
|---|---|---|
| **editorial** | Marcas com tom jornalístico, pensamento, ensaio | "documentary photography", "cinematic", "natural light" |
| **candid** | Marcas humanas, próximas, retratos reais | "candid portrait", "real moment", "off-guard" |
| **technical** | Hardware, engenharia, processo, dados | "macro detail", "industrial", "blueprint" |
| **archival** | Marcas com peso histórico, pesquisa, reflexão | "vintage", "archival photography", "museum" |
| **experimental** | Estúdios criativos, design-forward, vanguarda | "abstract", "experimental photography", "avant-garde" |

Pergunta:

> Qual estilo visual você quer pra esta marca?
>
> 1. **Editorial** — documentário, luz natural, sério
> 2. **Candid** — retratos reais, momentos genuínos
> 3. **Technical** — detalhe macro, processo, hardware
> 4. **Archival** — vintage, museu, peso histórico
> 5. **Experimental** — abstrato, vanguarda
>
> Sugiro [X] com base no mood do `brain/index.md`.

Salva em `brain/DESIGN.md` na seção "Imagens (estilo)".

### Etapa 2 — Tipos canônicos

Confirma os 4 tipos de uso (todos opt-in):

| Tipo | Uso | Proporção | Local |
|---|---|---|---|
| **hero** | Capa de post, hero de página | 16:9 | `web/public/images/heroes/` |
| **secondary** | Imagens dentro do post | 4:3 ou 1:1 | `web/public/images/secondary/` |
| **avatar** | Foto de pessoa (autoria, time, depoimento) | 1:1 | `web/public/images/avatars/` |
| **illustration** | Diagramas, ícones decorativos | livre, SVG > raster | `web/public/images/illustration/` |

Pergunta:

> Quais tipos vai usar? (hero é universal; outros opcionais)
>
> [x] hero · [x] secondary · [ ] avatar · [ ] illustration?

### Etapa 3 — Provider

| Provider | Free? | Setup | Quando usar |
|---|---|---|---|
| **Pexels** ⭐ | sim, 200 req/h | API key opcional | Default — fotos reais, qualidade boa |
| **Unsplash** | sim, 50 req/h | API key obrigatória | Secundário — variedade complementar |
| **OpenAI gpt-image-1** | não, ~$0.04/img | `OPENAI_API_KEY` obrigatória | Quando query não retorna nada apropriado |

Recomendação: comece com Pexels. Adicione Unsplash se busca não satisfaz. OpenAI sob demanda.

Pergunta:

> Quer configurar uma API key agora?
>
> 1. **Pexels** — abro https://www.pexels.com/api/ pra você criar (free, 30s).
> 2. **Pular** — funciona limitadamente sem key (rate limit menor).

Se sim, instrui usuário a colar key em `.env.local`:

```bash
PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...   # opcional
OPENAI_API_KEY=...        # opcional, pago
```

`.env.local` é git-ignored. `.env.example` na raiz documenta as vars.

## Estado salvo em `brain/DESIGN.md`

Seção "Imagens":

```md
## Imagens

### Estilo
**editorial** — documentário, luz natural, sério.

### Tipos em uso
- hero: 16:9, web/public/images/heroes/
- secondary: 4:3, web/public/images/secondary/

### Provider
Pexels (key configurada em .env.local).

### Queries default
- hero: "documentary photography natural light office workspace"
- secondary: "candid detail editorial cinematic"
```

## Uso operacional — script

Quando outra skill (ex: `/content-seo`) precisa de imagem:

```bash
npm run images:search "<query>" [--provider=pexels|unsplash|both] [--limit=8] [--orientation=landscape|portrait|square]
```

Output: lista numerada com URL, dimensões, autor, link de atribuição.

Para baixar:

```bash
npm run images:search "<query>" -- --download=N --slug=meu-post --category=heroes
```

Script (`scripts/image-search.mjs`):
1. Lê `.env.local` automaticamente.
2. Busca via Pexels API (ou Unsplash, ou ambos).
3. Salva em `web/public/images/<categoria>/<slug>.jpg`.
4. Imprime frontmatter sugerido (`cover`, `cover_alt`, `cover_credit`) pra colar no post.

## Cover image obrigatória em posts

Toda chamada de `/content-seo` que termina sem `cover` no frontmatter dispara `/branding images` automaticamente (etapa de busca, não reconfiguração).

## Atribuição

Pexels e Unsplash exigem atribuição (nome do autor + link). Script já imprime no formato:

```
Foto por <Autor> (Pexels) — <link>
```

Cole no `cover_credit` do frontmatter, renderiza no rodapé do post.

## Otimização (opcional)

Comprimir para WebP/AVIF + variantes responsivas é um TODO. Por ora, Next.js 16 `next/image` faz otimização on-demand no build/edge.

## Princípios

- **Estilo antes de tudo.** Sem mood-board, queries viram lixo.
- **Pexels primeiro.** Free, qualidade, attribution OK.
- **Anti-stock genérico.** Mostre antipadrões em `/brandbook/imagens` (rota do `apply`).
- **Cover obrigatório.** Post sem cover não publica.
- **Atribuição é regra**, não cortesia.

## Conclusão

1. Atualiza `brain/DESIGN.md` seção "Imagens".
2. Atualiza `brain/log.md`: `## YYYY-MM-DD — /branding images configurado`.
3. Sugere próximo passo: "Pronto. Quando rodar `/content-seo`, queries default já estão calibradas."
