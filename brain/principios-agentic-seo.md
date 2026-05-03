# Princípios do Método Agentic SEO

> Asset proprietário. Cada artigo gerado por `/conteudo` deve aderir a estes princípios.
> Se um princípio é violado, o artigo deve ser revisado.
>
> Este arquivo é a fonte de verdade do POV da marca. Pequena, opinionada,
> defensável. Não é "tudo sobre SEO" — é o que esta marca sustenta de diferente
> sobre SEO Agêntico.

## Princípio 1 — Wiki primeiro, web depois

Antes de qualquer pesquisa externa, leia o que a Wiki da marca já estabeleceu sobre o tema. A Wiki registra o julgamento humano único; web só serve para validar e expandir.

**Como aplicar**: para cada subtópico do post, primeiro pergunte "o que a Wiki/marca já tem sobre isso?" antes de buscar na web.

## Princípio 2 — Skyscraper por padrão, intenção manda na forma

Todo post deve superar o melhor concorrente da SERP em ~20% de extensão e profundidade. Mas a intenção dominante (informacional / navegacional / comercial / transacional) define o formato. Skyscraper não justifica padding em busca transacional.

**Como aplicar**: identifique intenção em 1 frase antes de escrever; ajuste extensão para ela; só então busque profundidade.

## Princípio 3 — POV proprietário > consenso

Cada artigo carrega 3-5 posições que só esta marca sustenta, extraídas da Wiki. Reproduzir consenso de mercado é AI Slop e dilui a marca.

**Como aplicar**: liste explicitamente 3-5 POVs antes de escrever. Se não tiver, pare e pesquise mais na Wiki ou pergunte ao autor.

## Princípio 4 — Domínio próprio: linkagem interna primeiro

Antes de citar concorrente, cite outro post da própria marca. Use `site:<dominio>` para descobrir o que já existe.

**Como aplicar**: rode busca `site:` no início; planeje 3-5 links internos antes de externos.

## Princípio 5 — Anti-jargão de IA

Lista de banidas: delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant.

**Como aplicar**: pós-edição, busque essas palavras e substitua por sinônimos concretos PT-BR.

## Princípio 6 — Citações verificáveis ou nada

Estatísticas, números, datas, citações: cada uma com link de fonte que abre. Sem fonte, não escreva o número.

**Como aplicar**: no frontmatter `fontes:`, registre cada URL citada. Antes de salvar o post, verifique que cada estatística tem link inline.

## Princípio 7 — PT-BR sempre, jargão técnico em inglês quando consagrado

"SEO", "SERP", "crawler", "backlink" mantêm em inglês. Tudo mais em PT-BR. Nunca PT-PT (não é "ecrã", é "tela"; não é "ficheiro", é "arquivo"; não é "telemóvel", é "celular").

## Princípio 8 — H2/H3 respondem perguntas longtail reais

Use Answer The Public, Google PAA, busca por "como", "porque", "qual", "quando" no tema. Cada H2 é uma pergunta que aluno real digita.

**Como aplicar**: liste 5-10 perguntas reais antes de escrever; selecione 4-8 como H2; subordine perguntas relacionadas como H3.

## Princípio 9 — Frontmatter SEO sempre completo

`title` (max 60 chars), `description` (max 155 chars), `date`, `author`, `keywords` (3-5), `ogImage`. Sem frontmatter completo, post não publica.

## Princípio 10 — JSON-LD Article + Organization

Toda página gera JSON-LD via `lib/seo.ts`. Article para posts, Organization para home. Sem JSON-LD, perde rich snippet.

<!-- Diego: adicione 5-10 princípios aqui antes da masterclass.
     Sugestões de tópicos para próximos princípios:
     - AEO (Answer Engine Optimization) e SGE / AI Overviews
     - E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
     - Featured snippet: como estruturar parágrafo zero
     - Navegação semântica e schema.org
     - Performance core web vitals como ranking factor
     - Open Graph e share-to-social
     - Sitemap dinâmico e priority
     - robots.txt e crawl budget
     - Internacionalização hreflang
     - Atribuição de tráfego: GA4 vs server-side
-->
