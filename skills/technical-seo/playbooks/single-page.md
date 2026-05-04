
# SEO On-Page

Revisa uma página/post individual aplicando o checklist on-page consolidado.

## Quando rodar

- Antes de publicar um novo post.
- Ao revisar um post existente.
- Como gate manual antes de PR de conteúdo.

## Checklist

### URL
- Curta, amigável, contém keyword principal.
- Sem trackers indexáveis.

### H1 (Título)
- Atrai cliques (interessante, relevante para o público).
- Keyword principal mais à esquerda possível.
- Capitalização brasileira (apenas primeira maiúscula + nomes próprios).

### H2 (Subtítulo após H1)
- Resumo do conceito principal do conteúdo.

### Introdução
- Direta, valiosa desde a primeira linha.
- Parágrafos curtos, frases curtas (máx. 25 palavras).
- Primeira dobra retém o leitor.
- Keyword principal aparece naturalmente.

### Subtítulos (H2/H3)
- Escaneáveis.
- Cada um deixa claro o que será abordado.
- Para conteúdo informacional, formule como pergunta ("Como funciona X?", "Por que Y é importante?") — ajuda GEO.

### Recursos visuais
- Infográficos e ilustrações exclusivas (não bancos de imagens genéricos).
- Tabelas para organizar informação densa.
- Toda imagem com alt descritivo.

### Linkagem
- ≥3 internal links contextuais (consultar `content/posts/index.md` e `content/site/index.md`).
- Anchor descritivo (nunca "clique aqui", "saiba mais").
- Links externos para fontes confiáveis (especialmente em GEO).

### Frontmatter obrigatório
Verifique que o `.md` tem todos os campos de `content/posts/_template.md`:
`title`, `description`, `slug`, `date`, `status`, `canonical`, `schema_type`, `primary_keyword`, `search_intent`, `target_persona`, `proprietary_claims` (≥3), `author`, `tldr`.

## Output

Lista priorizada de ajustes, organizada por categoria. Aplica os ajustes triviais automaticamente; pede confirmação para mudanças de copy substantivas.
