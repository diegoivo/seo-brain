---
name: wiki
description: Atualiza notas em wiki/ a partir de aprendizados do usuário. Triggers em "/wiki", "atualiza a wiki", "registra na wiki", "salvar isso na wiki". Única skill autorizada a escrever em wiki/. Outras skills só leem.
---

# Skill `wiki` — curadoria de memória do projeto

> Esta é a **única** skill autorizada a escrever em `wiki/`. Outras skills
> (`conteudo`, `scaffold-ssg`, `design-taste`, `publicar`) só leem.

## Quando usar

Triggers naturais:
- "Salva isso na wiki"
- "Registra essa decisão"
- "Atualiza wiki sobre X"
- "Adicionei um POV novo, atualiza"
- "/wiki"

## Princípios

1. **Curadoria humana**. Pergunte antes de criar nota nova. Confirme antes de
   sobrescrever existente.
2. **Notas pequenas e opinionadas**. ≤300 linhas. Quebre em sub-notas se crescer.
3. **Frontmatter mínimo obrigatório**: `title`, `tags`, `updated` (data ISO de hoje).
4. **Slug em kebab-case sem acento**.
5. **`[[wikilinks]]`** para conectar notas. Evite links absolutos para fora.
6. **`updated:`** sempre vai para hoje quando a nota é tocada.

## Passos

### 1. Identifique a categoria

A wiki tem dois domínios:

- **`wiki/tecnologia/`** — decisões de stack, deploy, performance, SEO técnico.
- **`wiki/conteudo/`** — princípios editoriais, POVs, voz, glossário.

Se o aprendizado é técnico, vai para `tecnologia/`. Se é editorial, para `conteudo/`.

Se não cabe em nenhum, pergunte ao usuário se quer criar nova categoria.

### 2. Escolha entre criar ou atualizar

Liste notas existentes na categoria. Se existe nota relacionada, **atualize-a**.
Crie nota nova só se o tópico é genuinamente novo.

### 3. Escreva a nota

Frontmatter mínimo:

```yaml
---
title: <Título da nota>
tags: [<categoria>, <subtema>]
updated: <YYYY-MM-DD de hoje>
---
```

Corpo:
- H1 com mesmo título do frontmatter.
- Parágrafo de abertura responde "o que é esta nota e por quê existe".
- Seções H2 curtas.
- `[[wikilinks]]` para notas relacionadas.

### 4. Atualize `wiki/index.md` se criou nota nova

Adicione bullet na seção certa:

```markdown
- [[<categoria>/<slug>]] — <descrição em 1 linha>
```

### 5. Não duplique princípios

Se o aprendizado é um princípio editorial novo, ele vai em
`wiki/conteudo/principios.md` (numerado, sequencial), **não** em nota separada.

Princípios são a fonte de verdade — nota separada para princípio dilui o
arquivo central.

### 6. Reporte

```
Wiki atualizada:

<arquivo>: <criada|atualizada>
- Resumo da mudança em 1-2 linhas

Próximo passo (opcional): rode /conteudo <tema> aproveitando a wiki refinada.
```

## Não faça

- Não escreva em `content/` (isso é skill `conteudo`).
- Não escreva em `app/`, `lib/`, `components/` (isso é `scaffold`).
- Não modifique `wiki/conteudo/jargao-banido.md` ou `voz-pt-br.md` sem
  confirmação explícita — são fonte de verdade dos hard-checks da skill `conteudo`.
- Não delete notas. Se uma nota está obsoleta, mova conteúdo para nota nova
  e deixe ponteiro `> Esta nota foi consolidada em [[nova-nota]]`.
