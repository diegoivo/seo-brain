---
kit_state: template
updated: TEMPLATE
---

# Princípios do método

> Asset proprietário. Cada conteúdo gerado pela skill `artigo` (ou produzido manualmente) deve aderir a estes princípios. Se um princípio é violado, o conteúdo é revisado.
>
> **POVs proprietários (mín. 3)** registrados aqui viram referência cruzada via `proprietary_claims[]` no frontmatter dos posts.
>
> Rode `/onboard` (fase 2) para extrair seus 3 POVs proprietários sobre o tema central da marca.

## POVs proprietários

### POV 1 — TEMPLATE

TEMPLATE — uma posição que só esta marca sustenta sobre o tema.

**Por quê:** TEMPLATE — a justificativa.

**Como aplicar:** TEMPLATE — quando este POV deve aparecer no conteúdo.

### POV 2 — TEMPLATE

(idem)

### POV 3 — TEMPLATE

(idem)

## Princípios operacionais (default — pode customizar)

### Princípio 1 — Brain primeiro, web depois

Antes de qualquer pesquisa externa, leia o que o Brain já estabeleceu. Web só serve para validar e expandir.

### Princípio 2 — Skyscraper por padrão, intenção manda na forma

Conteúdo informacional supera o melhor concorrente em ~20% de extensão e profundidade. Para transacional/navegacional, intenção vence — CTA acima da dobra, profundidade abaixo se não prejudicar fluxo.

### Princípio 3 — POV proprietário > consenso

Cada artigo carrega 3-5 posições que só esta marca sustenta. Reproduzir consenso é AI slop.

### Princípio 4 — Linkagem interna primeiro

Antes de citar concorrente, cite outro post da própria marca. Use `content/posts/index.md` para descobrir o que já existe.

### Princípio 5 — Antivícios de IA banidos

Lista em `tom-de-voz.md`. Pós-edição, busque essas palavras e substitua.

### Princípio 6 — Citações verificáveis ou nada

Estatísticas, números, datas, citações: cada uma com link de fonte.

### Princípio 7 — PT-BR, jargão técnico em inglês quando consagrado

"SEO", "SERP", "crawler", "backlink" mantêm em inglês. Tudo mais em PT-BR. Nunca PT-PT.

### Princípio 8 — H2/H3 respondem perguntas reais

Use Google PAA, busca por "como", "por que", "qual", "quando". Cada H2 é uma pergunta que o usuário digita.

### Princípio 9 — Frontmatter completo sempre

Validado por `brain-lint`. Sem frontmatter completo, post não publica.

### Princípio 10 — JSON-LD sempre

Article para posts, Organization/Person para autoria. Sem JSON-LD, perde rich snippet e citabilidade GEO.
