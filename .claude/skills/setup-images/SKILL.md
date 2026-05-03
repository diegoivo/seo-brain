---
name: setup-images
description: Configura sistema de imagens para o projeto. 2 caminhos - (a) Unsplash/Pexels (free, default) ou (b) OpenAI Image API (gpt-image-1 / DALL-E 3, paga, exige OPENAI_API_KEY). Pergunta na primeira execução qual usar, salva em brain/config.md. Use quando criar post/página que precisa de imagem, ou quando o usuário pedir "configurar imagens", "gerar imagens", "banco de imagens".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebFetch
---

# /setup-images

Sistema de imagens do projeto. Default: Unsplash/Pexels free. Fallback: OpenAI gpt-image-1.

## Primeira execução — pergunta caminho

Se `brain/config.md` não tem `images.provider`, pergunta:

> Como você quer gerar/escolher imagens neste projeto?
>
> 1. **Unsplash + Pexels** ⭐ (free, recomendado) — busco por keyword, você escolhe da galeria. Sem API key obrigatória, mas key gratuita melhora rate limit.
> 2. **OpenAI gpt-image-1 / DALL-E 3** (paga, ~$0.04/imagem) — gero on-demand a partir de prompt. Exige `OPENAI_API_KEY`.
> 3. **Ambos** — galeria primeiro, gera só se nada serve.
>
> Recomendo opção 1 ou 3.

Salva em `brain/config.md`:

```md
## Imagens
- Provider: [unsplash-pexels | openai | both]
- Unsplash API key: configurada / não configurada
- Pexels API key: configurada / não configurada
- OpenAI API key: configurada / não configurada
```

## Caminho A — Unsplash + Pexels

### Setup
1. Pergunta se usuário já tem keys:
   - Unsplash: https://unsplash.com/developers (free, 50 reqs/h)
   - Pexels: https://www.pexels.com/api/ (free, 200 reqs/h)
2. Se sim, salva em `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=...
   PEXELS_API_KEY=...
   ```
3. Se não, oferece sem key (rate limit menor) ou abrir aba pra criar.

### Uso
Quando outra skill (ex: `/artigo`) pede imagem:

```bash
node scripts/image-search.mjs "<keyword>" --limit=6
```

Script retorna 6 fotos (3 Unsplash + 3 Pexels), apresenta como galeria visual no terminal/markdown:

```
1. https://images.unsplash.com/photo-... (1920x1280, autor: João Silva)
2. ...
```

Usuário escolhe número. Script baixa para `web/public/images/posts/<slug>.jpg`, otimiza com sharp, gera `cover_image_alt` automático via metadata da foto.

## Caminho B — OpenAI gpt-image-1

### Setup
1. Pergunta se já tem `OPENAI_API_KEY`. Se não, abre https://platform.openai.com/api-keys.
2. Salva em `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Avisa custo: ~$0.04 por imagem 1024x1024 (gpt-image-1).

### Uso
Quando outra skill pede imagem:

```bash
node scripts/image-generate.mjs "<prompt>" --aspect=16:9 --size=1024
```

Script:
1. Lê DESIGN.tokens.json para incorporar paleta no prompt
2. Adiciona estilo do brandbook ("photo, editorial, [paleta], [mood do DESIGN]")
3. Chama OpenAI Image API
4. Salva em `web/public/images/<slug>.png`
5. Retorna alt sugerido

## Caminho C — Ambos

Sequência:
1. Tenta Unsplash/Pexels primeiro (search por keyword)
2. Apresenta galeria
3. Se nenhuma serve, oferece gerar via OpenAI: "Quer gerar uma com IA? (~$0.04)"

## Cover image obrigatória em posts

Toda chamada de `/artigo` que termina sem `cover_image` no frontmatter dispara `/setup-images` automaticamente. Sem cover, post não publica.

## Otimização

Todas as imagens importadas/geradas passam por:
1. Compressão sharp para WebP + AVIF
2. Variantes responsivas (srcset 640w, 1024w, 1920w)
3. Metadata stripped (privacy)
4. Salva em `web/public/images/<categoria>/`

## Atualiza Brain

`brain/config.md`:
```md
## Imagens
- Provider: [escolhido]
- Sharp: instalado
- Diretório: web/public/images/
- Status: configurado em <data>
```

## Princípios

- **Unsplash/Pexels primeiro.** Free, fotos reais.
- **OpenAI só sob demanda.** Paga, mas útil quando keyword não retorna nada.
- **Sempre alt text descritivo.** Não keyword stuffing.
- **AVIF + WebP automático** via sharp.
- **Sem imagem = não publica.** Post sem cover é incompleto.
