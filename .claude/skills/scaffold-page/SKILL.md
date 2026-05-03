---
name: scaffold-page
description: Cria página(s) Next.js no /web aplicando DESIGN.md, tom de voz, brain e SEO/GEO. Pré-condição obrigatória - kit_state initialized em brain/index.md e brain/DESIGN.md. Sem isso, redireciona para /onboard. Use quando o usuário pedir "criar página", "criar site", "scaffold", "nova landing", "página de serviço".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# /scaffold-page

Cria uma ou mais páginas Next.js em `/web/src/app/` consumindo o Brain do projeto. Garante consistência de design system, tom de voz, SEO e primeiro viewport.

## Pré-condições obrigatórias (HARD GATE)

Antes de qualquer arquivo ser escrito, **verifique**:

1. `brain/index.md` tem `kit_state: initialized`?
2. `brain/DESIGN.md` tem `kit_state: initialized` e contém seções 1-9 preenchidas (não TEMPLATE)?
3. `brain/DESIGN.tokens.json` existe e tem valores (não placeholders)?
4. `brain/personas.md` tem `kit_state: initialized` e ≥1 persona preenchida?
5. `brain/principios-agentic-seo.md` tem ≥3 POVs proprietários preenchidos?

**Se qualquer um falhar:** abortar com mensagem:

> "Faltam pré-condições para scaffold seguro:
> - [lista do que está em template]
>
> Rode `/onboard` para preencher o Brain antes. Sem isso, vou recair em defaults Tailwind/shadcn e o resultado fica genérico."

**Não tente "fazer mesmo assim com defaults".** O hard gate existe para forçar onboarding.

## Quando rodar

- Após `/onboard` completo, primeira página de um projeto novo.
- Adicionar novas páginas a um projeto existente.
- Rebuild de uma página específica.

## Pipeline

### 1. Leia o Brain

- `brain/index.md` (posicionamento, domínio)
- `brain/DESIGN.md` + `DESIGN.tokens.json` (decisões visuais)
- `brain/tom-de-voz.md` (voz)
- `brain/personas.md` (target_persona)
- `brain/principios-agentic-seo.md` (3 POVs proprietários)

### 2. Confirme escopo com o usuário

Pergunte:
1. Que rota(s)? (ex.: `/`, `/sobre`, `/servicos/seo`, `/blog`).
2. Para cada rota, qual a intenção dominante? (chame `/intent-analyst` se houver dúvida).
3. Qual o objetivo principal de cada página? (CTA primário).
4. Há mídia (foto, vídeo, ícone) específica? Onde está?

### 3. Aplique restrições obrigatórias

#### Primeiro viewport
- Hero **deve caber** em `100dvh` mobile e `~80vh` desktop sem scroll.
- Headline usa `clamp()` ou tem variantes mobile/desktop separadas. **Nunca `text-[15vw]`** ou similar.
- Display font não passa de **6rem em mobile portrait**.
- Foto vertical 4:5 em hero ocupa **máx 50%** da viewport mobile (em grid lateral) ou **máx 30%** se acima do texto.

#### Capitalização brasileira
Todos os títulos, eyebrows, CTAs:
- Apenas a primeira letra maiúscula + nomes próprios.
- ✅ "Estratégia primeiro" / ❌ "Estratégia Primeiro"
- ✅ "Consultoria em SEO" / ❌ "Consultoria Em SEO"

#### Internal linking
- Cada página tem ≥3 links internos contextuais (não nav).
- Anchor descritivo (nunca "clique aqui", "saiba mais").

#### Tom de voz
- Frases ≤25 palavras.
- Voz ativa.
- Antivícios de IA banidos (lista em `brain/tom-de-voz.md`).
- 2ª pessoa ("você") em how-to; 1ª plural ("nós") em institucional.

#### SEO básico (frontmatter Next.js)
Cada `page.tsx` exporta `Metadata` com:
- `title` (30-60 chars, contém keyword primária)
- `description` (120-160 chars)
- `openGraph` completo (title, description, images, locale `pt_BR`)
- `twitter` (card, creator, images)

#### Schema (JSON-LD)
- Article/BlogPosting em posts
- Person/Organization no layout (uma vez)
- BreadcrumbList em páginas internas

### 4. Aplique tokens do DESIGN.tokens.json

- Cores via CSS variables consumindo `DESIGN.tokens.json`.
- Tipografia via `<link>` ou `next/font` conforme decidido em `DESIGN.md`.
- Escala tipográfica do `tokens.json` (não improvise).
- Espaçamento usando a escala do tokens.

### 5. Estrutura de cada página

Aplique padrão consistente:
- Hero (cabe em 100dvh mobile)
- Seções intermediárias (cada uma com `border-t hairline` ou separação consistente com DESIGN.md)
- CTA final apontando para a página de conversão (geralmente `/contato`)

### 6. Feedback granular ao final

Não pergunte "está bom?". Aponte 3 decisões específicas:

> "3 decisões que tomei e queria validar:
> 1. Hero: foto à direita ocupando 5/12 colunas em desktop, stack vertical no mobile com foto acima de 30vh. Concorda ou prefere foto integrada como bg do hero?
> 2. Eyebrow `01 — Serviço` (numeração editorial) ou só `Serviço` (mais limpo)?
> 3. CTA primário no hero: `Falar com [Nome]` (pessoal) ou `Solicitar proposta` (transacional). Coloquei o pessoal — alinha com o tom?"

### 7. Build check

Rode `npm run build` em `/web` ao final. Se falhar, fixa antes de entregar.

### 8. Atualize indices

- `content/site/index.md` adicionar entrada com slug, título e categoria.
- `brain/backlog.md` riscar se a página estava em "Próximos passos".

## O que NUNCA fazer

- ❌ Inferir cores/tipografia/spacing fora do `DESIGN.tokens.json`.
- ❌ Decidir paleta de acento sozinho.
- ❌ Criar página com headline `text-[15vw]` ou similar (estoura viewport).
- ❌ Capitalizar título estilo título-em-inglês ("Como Otimizar SEO").
- ❌ Hero centralizado se DESIGN.md proibir explicitamente.
- ❌ Usar Inter se DESIGN.md não escolheu Inter.
- ❌ Avançar se algum `kit_state` ainda for `template`.

## Output

- Arquivos novos em `/web/src/app/<rota>/page.tsx`
- Componentes auxiliares em `/web/src/components/`
- Atualização de `content/site/index.md`
- Resumo no final com 3 perguntas de feedback granular
