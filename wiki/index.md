---
title: Wiki — agentic-seo-kit
tags: [moc, index]
updated: 2026-05-02
---

# Wiki da marca

Esta wiki é a memória do projeto. Funciona como vault do Obsidian (use
`[[wikilinks]]` à vontade) e ao mesmo tempo como contexto que skills/agents
leem antes de gerar qualquer artefato.

> **Regra**: agents só **leem** desta pasta. Quem escreve aqui é você. As
> skills `wiki` e `onboarding` são as únicas exceções, e só atuam quando
> invocadas explicitamente.

---

## Sobre a empresa

> 🟡 **PREENCHA ANTES DE USAR O KIT.**
>
> Rode `/onboarding` para preencher esta seção interativamente, ou edite
> manualmente. Sem isso, o agente recusa executar `/conteudo`, `/design` e
> `/scaffold`.

- **Nome**: `<nome da empresa ou marca>`
- **Setor**: `<setor específico — ex: fintech para PMEs, edtech B2B, indústria de embalagens>`
- **ICP (cliente ideal)**: `<perfil em 1-2 frases>`
- **Oferta principal**: `<o que vende, em 1 frase>`
- **Diferencial competitivo**: `<o que faz diferente do concorrente médio, em 1 frase>`
- **URL principal**: `<https://...>`
- **Autor principal dos posts**: `<nome — credencial relevante>`
- **Tom de marca**: `<2-3 adjetivos — ex: sóbrio, técnico, humano>`

---

## Mapa

### Tecnologia
- [[tecnologia/stack]] — Next.js SSG vs Payload, Tailwind, MDX
- [[tecnologia/seo-tecnico]] — JSON-LD, sitemap, robots, Open Graph
- [[tecnologia/performance]] — como o kit garante PageSpeed 100
- [[tecnologia/deploy]] — Vercel preview, produção, domínio próprio
- [[tecnologia/spec-driven]] — protocolo SPEC → TESTS → EXECUTE → QA

### Conteúdo
- [[conteudo/principios]] — 10+ princípios proprietários do método
- [[conteudo/pov-da-marca]] — POVs proprietários (template para você preencher)
- [[conteudo/voz-pt-br]] — regras de voz brasileira (sem PT-PT, sem gerundismo)
- [[conteudo/jargao-banido]] — vocabulário de IA proibido
- [[conteudo/glossario]] — termos do método com definição curta

### Exemplos (referência, não copie)
- [[exemplos/generico-fintech-b2b]] — marca-modelo: fintech para PMEs
- [[exemplos/generico-saude-digital]] — marca-modelo: telemedicina B2C

---

## Como usar

1. Abra esta pasta no Obsidian (Open folder as vault → aponte para `wiki/`).
2. Rode `/onboarding` para preencher "Sobre a empresa" + 3 POVs iniciais.
3. Refine [[conteudo/pov-da-marca]] e [[conteudo/principios]] manualmente
   antes de pedir o primeiro post.
4. Quando uma decisão técnica for tomada, registre em `tecnologia/`. Os agents
   vão consultar antes de propor mudanças.

## Convenções

- Frontmatter mínimo: `title`, `tags`, `updated`.
- Slug do arquivo em kebab-case sem acento.
- Use `[[wikilinks]]` para conectar notas. Evite links absolutos.
- Mantenha cada nota curta e opinionada (≤300 linhas). Quebre em sub-notas se crescer.
