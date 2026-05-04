
# GEO — Generative Engine Optimization

Otimiza conteúdo para mecanismos generativos (ChatGPT, Perplexity, Gemini, AI Overviews do Google).

## Contexto

- 54% da população brasileira já usa IA para buscas.
- Cliques orgânicos caíram 35% em resultados com AI Overview, mas os cliques restantes têm mais qualificação.
- A jornada migra para **menos cliques, mais menções**.
- IAs valorizam **clareza, autoridade, facilidade de extração**.
- **Menções importam mais que backlinks** para LLMs.

GEO **não substitui** SEO tradicional — complementa. SEO técnico continua sendo o piso.

## Checklist (20 itens)

### Indexabilidade e estrutura
1. Site 100% indexável (sem paywall, robots.txt correto, HTML bem estruturado).
2. H2 e H3 formulados como **perguntas específicas** ("Como funciona X?", "Por que Y é importante?").
3. Schema markup implementado (Article, FAQPage, Person para autoria).

### Autoridade e citações
4. Citações de fontes confiáveis com **links diretos** para as referências originais.
5. Pelo menos **3 estatísticas** por artigo, com contexto e fonte mencionada.
6. Quotes de **especialistas reconhecidos**, com credenciais explícitas.

### Forma e legibilidade
7. Linguagem **conversacional e natural**, como se estivesse explicando para um colega.
8. Parágrafos com no máximo **3-4 frases**.
9. Estrutura para escaneamento rápido.
10. Listas numeradas e bullets para facilitar extração — **sem abuso**.

### Conteúdo proprietário
11. Conteúdo baseado em **dados exclusivos** e insights proprietários (operacionalizado por `proprietary_claims[]` no frontmatter).
12. Responde perguntas específicas do público-alvo.

### Estratégia de marca
13. Topic clusters estabelecendo **autoridade tópica** no nicho.
14. Monitorar **menções** em contextos positivos (mais importante que backlinks).
15. Mensurar **Share of Search** vs concorrentes.
16. Autoatribuição (entender como IAs impactam jornada de compra).
17. Data-Driven PR para gerar menções qualificadas.
18. Associações semânticas claras entre marca e conceitos relevantes.

### Monitoramento e antivícios
19. Monitorar presença em ChatGPT, Perplexity e outras IAs.
20. **Evitar keyword stuffing.** Continua sendo penalidade.

## Verificações automáticas

- `llms.txt` presente na raiz do site.
- FAQPage schema em conteúdo informacional.
- Person schema com `sameAs` (LinkedIn, etc.) para E-E-A-T.
- TL;DR no início (frontmatter `tldr`).
- Blocos de definição autocontidos (1ª frase responde a pergunta).
- Tabelas comparativas com `<caption>`.

## Output

Score GEO (0-100, peso 10 dentro do seo-score) + recomendações priorizadas. Sugere FAQ items quando ausentes (com base no conteúdo do post).

> "GEO não mata SEO, evolui ele. Quem não começar agora vai perder o timing de ser o protagonista de seu mercado."
