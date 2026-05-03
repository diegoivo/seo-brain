---
title: Tom de voz
tags: [brain, voz]
kit_state: template
created: TEMPLATE
updated: TEMPLATE
status: template
sources: []
---

# Tom de voz

> [!info] Default Estadão + capitalização BR
> Default já é utilizável. Customize via `/onboard` fase 4 se a marca pedir voz distinta.

## Princípios

### Voz e pessoa
- **Voz ativa** sempre que possível.
- **1ª pessoa do plural** ("nós") em institucional.
- **2ª pessoa** ("você") em how-to/tutorial.
- **Nunca** 1ª pessoa do singular em conteúdo da marca, salvo seção explícita de autoria.

### Frase
- Máximo **25 palavras** por frase.
- Parágrafos com **3-4 frases** em conteúdo digital.

### Léxico
- PT-BR padrão (nunca PT-PT: "tela" não "ecrã").
- Anglicismo só se não houver equivalente claro.
- Explique siglas na primeira ocorrência.

### Números e datas
- **ISO 8601** em metadados (`2026-05-03`).
- **Formato BR** em corpo ("3 de maio de 2026").
- Por extenso até nove; algarismos a partir de 10.
- "35%" colado, não "35 %".

## Capitalização brasileira (regra rigorosa)

Em títulos, headings, meta titles e qualquer texto da marca:
- Apenas **primeira letra** maiúscula + nomes próprios.
- Siglas: caixa-alta (SEO, GEO, CMS, API).
- Marcas: grafia oficial (iPhone, GitHub, WhatsApp).

✅ "Como otimizar SEO para Google em 2026"
❌ "Como Otimizar SEO Para Google Em 2026"

## Antivícios de IA — banidos

> [!danger] Lint automático bloqueia esses termos
> A skill `blogpost` e `update-brain` rodam regex contra essa lista antes de gravar.

- "no mundo cada vez mais [X]"
- "é importante ressaltar"
- "vale destacar"
- "em síntese", "em suma"
- "navegando pelas águas"
- "desbloqueando o potencial"
- "elevando ao próximo nível"
- "no cenário atual"
- "uma jornada de"
- emojis decorativos em corpo de texto
- listas de exatamente 3 itens redundantes (cosplay de IA)
- "delve", "crucial", "robust", "comprehensive", "nuanced", "multifaceted", "pivotal", "tapestry", "underscore", "foster", "showcase", "intricate", "vibrant"

## Acessibilidade textual

- Anchor descritivo (nunca "clique aqui", "saiba mais").
- Frases curtas reduzem barreira.

## Customizações deste projeto

(preenchido pela fase 4 do `/onboard`. Se vazio, vale o default.)
