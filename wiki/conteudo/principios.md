---
title: Princípios do método Agentic SEO
tags: [conteudo, principios, fonte-de-verdade]
updated: 2026-05-02
---

# Princípios

> Asset proprietário. Cada artigo gerado pela skill `conteudo` deve aderir.
> Se um princípio é violado, o artigo deve ser revisado.
>
> Esta nota é a fonte de verdade do POV editorial. Pequena, opinionada,
> defensável. Não é "tudo sobre SEO" — é o que **esta marca** sustenta de
> diferente sobre SEO Agêntico.

## 1. Wiki primeiro, web depois

Antes de qualquer pesquisa externa, leia o que esta wiki já estabeleceu sobre o
tema. A wiki registra julgamento humano único; web só serve para validar e
expandir.

**Como aplicar**: para cada subtópico do post, primeiro pergunte "o que a wiki
já tem sobre isso?" antes de buscar na web.

## 2. Skyscraper por padrão, intenção manda na forma

Todo post deve superar o melhor concorrente da SERP em ~20% de extensão e
profundidade. Mas a intenção dominante (informacional / navegacional / comercial /
transacional) define o formato. Skyscraper não justifica padding em busca
transacional.

## 3. POV proprietário > consenso

Cada artigo carrega 3-5 posições que só esta marca sustenta, extraídas de
[[pov-da-marca]]. Reproduzir consenso é AI Slop e dilui a marca.

## 4. Domínio próprio: linkagem interna primeiro

Antes de citar concorrente, cite outro post da própria marca. Use `site:<dominio>`
para descobrir o que já existe.

## 5. Anti-jargão de IA

Substitua o vocabulário banido em [[jargao-banido]] por sinônimos concretos PT-BR.

## 6. Citações verificáveis ou nada

Estatísticas, números, datas, citações: cada uma com link de fonte que abre.
Sem fonte, não escreva o número.

## 7. PT-BR sempre, jargão técnico em inglês quando consagrado

"SEO", "SERP", "crawler", "backlink" mantêm em inglês. Tudo mais em PT-BR. Nunca
PT-PT — ver [[voz-pt-br]] para a lista completa.

## 8. H2/H3 respondem perguntas longtail reais

Use Answer The Public, Google PAA, busca por "como", "porque", "qual", "quando"
no tema. Cada H2 é uma pergunta que aluno real digita.

## 9. Frontmatter SEO sempre completo

`title` (max 60 chars), `description` (max 155 chars), `date`, `author`, `keywords`
(3-5), `ogImage`. Sem frontmatter completo, post não publica.

## 10. JSON-LD Article + Organization

Toda página gera JSON-LD via `lib/seo.ts`. Article para posts, Organization para
home. Sem JSON-LD, perde rich snippet e citação por LLM.

## 11. AEO: parágrafo zero responde direto

Em posts informacionais, o lead (1ª frase ou parágrafo após o H1) responde a
pergunta principal **antes** de contextualizar. LLMs e featured snippets pegam
essa frase.

## 12. E-E-A-T explícito

Experience: cite caso real ou observação direta. Expertise: nome do autor com
credencial. Authoritativeness: link para outro post da marca. Trust: data
visível, fontes externas linkadas.

## 13. Schema além de Article

Onde aplicável, adicione `FAQPage` (perguntas reais), `HowTo` (tutoriais),
`BreadcrumbList`. Aumenta superfície de citação por LLMs.

## 14. Não reescreva o consenso, contextualize

Se for citar fato consensual, agregue valor: "X é Y [fonte]. Na nossa experiência
com Z, isso se manifesta como W". POV em cima do fato.

<!-- TODO: adicione 5-10 princípios próprios da sua marca aqui antes do primeiro post.
     Sugestões: AEO, GEO, internacionalização, atribuição, linkagem, copy. -->
