# /conteudo — escreve 1 artigo PT-BR otimizado para SEO Agêntico

**Argumento**: tema do post.

Exemplo: `/conteudo Como escolher uma agência de SEO Agêntico para empresa B2B`

## Pré-condições

- `content/_principios.md` existe.
- Scaffold aplicado (existe `app/blog/[slug]/page.tsx`).

## Passos

### 1. Leia `content/_principios.md` INTEGRALMENTE

Esses são os 10-20 princípios proprietários. Cada um se aplica. Cite princípios por número quando justificar decisões.

### 2. Use a busca web disponível neste host

- **Antigravity / Gemini**: busca nativa
- **Claude Code**: WebSearch tool
- **Codex**: web_search_cached
- **Outros**: ferramenta equivalente

Buscas obrigatórias:
- `<tema> site:google.com.br` (top 10 SERP PT-BR — entender concorrência e intenção)
- `<tema> melhores práticas 2026`
- `<tema> dados estatísticas`
- `<tema> exemplos casos`

**Se WebSearch não disponível**: PARE. Peça ao usuário 3-5 URLs como input. Sem fonte verificável, não escreva.

### 3. Identifique a intenção dominante

Em 1 frase, classifique a busca em:
- **Informacional** (aluno quer aprender / entender): formato 1500-3500 palavras, headers H2/H3 por sub-pergunta
- **Navegacional** (aluno quer chegar a marca/serviço): formato landing curta com 600-1200 palavras
- **Comercial** (aluno está comparando opções): formato comparativo, tabela de critérios, casos
- **Transacional** (aluno quer comprar/contratar): formato direto, prova social, CTA forte

Estruture o post para essa intenção. Skyscraper (~20% mais profundo que top SERP) só faz sentido em informacional.

### 4. Liste 3-5 POVs proprietários ANTES de escrever

Da Wiki/`_principios.md`, extraia 3-5 posições que esta marca sustenta sobre o tema, distintas do consenso de mercado.

Se não encontrar 3 POVs, PARE e diga ao usuário: "O método ainda não tem POV claro sobre `<tema>`. Refine `content/_principios.md` ou escolha outro tema."

### 5. Escreva `content/<slug>.mdx`

Slug em kebab-case PT-BR (sem acentos, sem espaços).

Frontmatter obrigatório:

```yaml
---
title: "<título — máx 60 chars, idealmente com keyword principal no início>"
description: "<descrição — máx 155 chars, instigante, ação implícita>"
date: "YYYY-MM-DD"
author: "<nome>"
keywords: ["<3-5 keywords>"]
ogImage: "/og-default.png"
intencao: "informacional|navegacional|comercial|transacional"
povs: ["<POV 1 em 1 linha>", "<POV 2>", "<POV 3>"]
fontes:
  - { titulo: "<título da fonte>", url: "https://...", acessado: "YYYY-MM-DD" }
---
```

Conteúdo:
- Lead em 2-3 frases que respondem a pergunta principal direto
- 4-8 H2 que respondem perguntas longtail reais (pesquise PAA do Google se possível)
- H3 quando o H2 é amplo
- Cite cada POV proprietário explicitamente: "Na Conversion, defendemos que..." ou similar
- 3-5 links internos para outros posts em `/blog/<slug>` (use `site:agenticseo.sh` ou liste posts em `content/`)
- Citação de fontes externas via links inline Markdown — cada estatística, número, citação tem link
- Conclusão: 2-3 frases + CTA contextual (não genérico tipo "fale conosco")

### 6. Validação anti-AI-slop

Antes de salvar, verifique e corrija:

**Vocabulário banido** (busca-substitui):
- delve → aprofundar, examinar, explorar
- crucial → importante, fundamental no sentido factual, essencial
- robust → sólido, completo, resiliente
- comprehensive → completo, abrangente
- nuanced → matizado, com camadas
- multifaceted → com múltiplas dimensões
- furthermore, moreover, additionally → além disso, também, ainda
- pivotal → decisivo, determinante
- landscape → cenário, panorama
- tapestry → tecido, conjunto
- underscore → reforçar, sublinhar
- foster → cultivar, promover
- showcase → mostrar, exibir
- intricate → detalhado, complexo
- vibrant → vivo, intenso
- fundamental → básico, essencial
- significant → relevante, expressivo

**Aviso explicitamente**:
- "É importante notar que..." → corte, escreva direto
- "No mundo de hoje..." → corte
- "Em conclusão..." → conclua sem anunciar

**Verifique**:
- PT-BR (não PT-PT): "tela" não "ecrã", "arquivo" não "ficheiro", "celular" não "telemóvel"
- Cada estatística tem fonte linkada
- Sem placeholder não preenchido (`<...>`, `[...]`)
- Frontmatter completo

### 7. Reporte ao usuário

```
Post criado: content/<slug>.mdx

Título: <título>
Intenção: <classificação>
Palavras: <contagem>
POVs proprietários: <3-5>
Fontes citadas: <N>

Próximo passo: /publicar
```

## Não modifique

- `content/_principios.md`
- Outros posts em `content/`
- Configs (`tailwind.config.ts`, `next.config.ts`, etc.)
