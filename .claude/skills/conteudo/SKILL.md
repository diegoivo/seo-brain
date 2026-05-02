---
name: conteudo
description: Escreve 1 artigo MDX em PT-BR otimizado para SEO Agêntico, seguindo os princípios proprietários da wiki da marca. Triggers em "escreve um post sobre X", "novo artigo X", "/conteudo X". Recusa escrever sem POVs claros na wiki.
---

# Skill `conteudo` — redator de artigos PT-BR

**Argumento**: tema do post (livre, em PT-BR).

Exemplo: `/conteudo Como escolher uma agência de SEO Agêntico para B2B`

## Iron Laws (não-negociáveis)

1. **Sem busca web disponível, pare**. Sem fonte verificável, não escreva.
2. **Sem 3 POVs claros na wiki, pare**. Refine `wiki/conteudo/pov-da-marca.md`
   antes de tentar de novo.
3. **PT-BR sempre**, nunca PT-PT. Verificação automática no passo 7.
4. **Vocabulário banido é hard-fail**, não soft-warning. Verificação no passo 7.
5. **Não modifique** `wiki/`, `prompts/` (deprecated), outros posts em `content/`,
   nem configs (`tailwind.config.ts`, `next.config.ts`, etc.).

## Pré-condições

- `wiki/conteudo/principios.md` existe e tem ≥10 princípios.
- `wiki/conteudo/pov-da-marca.md` tem ≥3 POVs preenchidos (não os "exemplo").
- `app/blog/[slug]/page.tsx` existe.
- Diretório `content/` existe.

## Passos

### 1. Leia a wiki INTEGRALMENTE (em ordem)

```
wiki/conteudo/principios.md       # princípios proprietários
wiki/conteudo/pov-da-marca.md     # POVs da marca para o tema
wiki/conteudo/voz-pt-br.md        # regras de voz brasileira
wiki/conteudo/jargao-banido.md    # vocabulário proibido
wiki/conteudo/glossario.md        # termos com definição do método
wiki/index.md                     # mapa geral
```

Se algum não existe, **pare** e instrua o usuário a executar `/scaffold` ou
restaurar a wiki.

### 2. Identifique 3-5 POVs aplicáveis ao tema

Da `wiki/conteudo/pov-da-marca.md`, extraia 3-5 POVs que se aplicam a este
tema específico. Liste-os em texto antes de escrever.

**Se não encontrar 3 POVs aplicáveis**: pare. Retorne:

> "O método ainda não tem POV claro sobre `<tema>`. Refine
> `wiki/conteudo/pov-da-marca.md` com 3-5 posições proprietárias sobre este
> tema, ou escolha outro tema que já tenha POV mapeado."

### 3. Use a busca web disponível

- **Claude Code**: WebSearch tool
- **Codex / GPT**: web_search_cached
- **Cursor**: ferramenta web nativa
- **Antigravity / Gemini**: busca nativa

Buscas obrigatórias (ajuste a query ao tema):

```
<tema> site:google.com.br        # top 10 SERP PT-BR — concorrência e intenção
<tema> "people also ask"         # PAA — perguntas reais
<tema> dados estatísticas 2026   # números verificáveis
<tema> caso estudo brasil        # exemplos PT-BR
```

**Se WebSearch não disponível**: pare. Peça ao usuário 3-5 URLs concretas
como input. Sem fonte verificável, não escreva.

### 4. Identifique a intenção dominante

Em 1 frase, classifique:

- **Informacional** — aluno quer aprender. Formato 1500-3500 palavras, H2/H3 por sub-pergunta.
- **Navegacional** — aluno quer chegar à marca/serviço. Landing curta 600-1200 palavras.
- **Comercial** — aluno comparando opções. Formato comparativo, tabela de critérios.
- **Transacional** — aluno quer comprar/contratar. Direto, prova social, CTA forte.

Estruture o post para essa intenção. Skyscraper (~20% mais profundo que top SERP)
só faz sentido em informacional.

### 5. Liste 5-10 perguntas reais como base de H2/H3

De PAA, Answer The Public, busca por "como X", "porque X", "qual X". Selecione
4-8 como H2. Subordine perguntas relacionadas como H3.

### 6. Escreva `content/<slug>.mdx`

**Slug**: kebab-case PT-BR sem acento, sem espaços, ≤60 chars.

**Frontmatter obrigatório**:

```yaml
---
title: "<máx 60 chars, keyword principal no início>"
description: "<máx 155 chars, ação implícita>"
date: "YYYY-MM-DD"
author: "<nome do autor>"
keywords: ["<3-5 keywords>"]
ogImage: "/og-default.png"
intencao: "informacional|navegacional|comercial|transacional"
povs:
  - "<POV 1 em 1 linha>"
  - "<POV 2>"
  - "<POV 3>"
fontes:
  - { titulo: "<título da fonte>", url: "https://...", acessado: "YYYY-MM-DD" }
---
```

**Estrutura do corpo**:

1. **Lead em 2-3 frases** que respondem a pergunta principal direto (princípio AEO).
2. **4-8 H2** que respondem perguntas longtail reais.
3. **H3** quando o H2 é amplo.
4. Cada **POV proprietário citado explicitamente** ("Daí o primeiro POV: ...",
   "Por isso defendemos que...", etc.).
5. **3-5 links internos** para outros posts em `/blog/<slug>/` ou wiki notes
   `[[wiki/...]]`.
6. **Citações externas** via Markdown inline — cada estatística, número, citação
   tem link.
7. **Conclusão** 2-3 frases + CTA contextual (não genérico tipo "fale conosco").

### 7. Validação anti-AI-slop (HARD checks)

Antes de salvar, **grep no body** pelas listas abaixo. Se encontrar match,
substitua e re-leia.

**Vocabulário banido** (de `wiki/conteudo/jargao-banido.md`):

```
delve|aprofundar-se em|crucial|robust|comprehensive|nuanced|multifaceted|
furthermore|moreover|additionally|pivotal|landscape|tapestry|underscore|
foster|showcase|intricate|vibrant|significant|seamless|empower|leverage|
streamline|cutting-edge|state-of-the-art|game-changer|paradigm shift
```

**Frases banidas**:

```
"É importante notar que"
"No mundo de hoje"
"Em uma era em que"
"Vivemos em tempos onde"
"Em conclusão"
"Em suma"
"Para concluir"
"Espero que este artigo tenha sido útil"
"É válido ressaltar"
"Vale lembrar que"
```

**PT-PT (de `wiki/conteudo/voz-pt-br.md`)**:

```
ecrã|ficheiro|telemóvel|equipa|autocarro|pequeno-almoço|utilizador|
comboio|sítio (web)|facto|acção|director
```

**Gerundismo**:

```
vou estar (verbo)ndo|vamos estar (verbo)ndo|estarei (verbo)ndo
```

**Voz passiva burocrática**:

```
foi feito por nós|recomenda-se que|pode ser observado
```

### 8. Validação estrutural

Verifique:

- [ ] Frontmatter completo (title, description, date, author, keywords, ogImage, intencao, povs, fontes)
- [ ] `title` ≤60 chars
- [ ] `description` ≤155 chars
- [ ] Cada estatística tem link inline para fonte
- [ ] Cada item em `fontes:` tem `titulo`, `url`, `acessado`
- [ ] Slug kebab-case sem acento
- [ ] Sem placeholder não preenchido (`<...>`, `[...]`, `TODO`)
- [ ] Sem texto em inglês fora dos jargões consagrados (SEO, SERP, etc.)

### 9. Validação de build

Rode `npm run build` (ou peça ao usuário para rodar). Se falhar, leia o erro,
corrija e tente de novo. Causas comuns:

- Frontmatter YAML inválido (aspas não fechadas, indentação)
- MDX com componente JSX não definido
- Caractere especial não escapado em texto

### 10. Reporte ao usuário

```
Post criado: content/<slug>.mdx

Título: <título>
Intenção: <classificação>
Palavras: <contagem>
POVs proprietários citados: <3-5>
Fontes externas: <N>
Links internos: <N>

Próximo passo: /publicar para deploy preview na Vercel.
```

## Exemplo de saída

Ver `content/o-que-e-seo-agentico.mdx` no kit — é um post que passa todos os
checks acima. Use como referência de tom e estrutura, não copie.

## Fallback inline (host sem suporte a skills)

Se o host não invoca skills, o usuário pode pedir em linguagem natural:

> "Siga `.claude/skills/conteudo/SKILL.md` para escrever um artigo sobre `<tema>`."

E o agent executa os 10 passos acima manualmente.
