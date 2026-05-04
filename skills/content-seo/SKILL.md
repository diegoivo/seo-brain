---
name: content-seo
description: Brazilian Portuguese SEO + GEO content pipeline. Generates AI-Overviews-optimized blogposts and articles with intent analysis, skyscraper baseline, proprietary POVs, structured FAQs, schema markup, E-E-A-T signals. Renamed from /artigo + /blogpost + /intent-analyst + /geo-checklist (consolidated v0.1.0). Use when user asks "write SEO article", "create blog post", "blogpost", "content brief", "AI Overviews content", "GEO optimization", "ChatGPT citation", "Perplexity ranking", "featured snippet", "escrever artigo SEO", "criar post", "blog SEO", "novo conteúdo", "otimizar para IA". Routes to playbooks/article.md (simple) or playbooks/blogpost.md (6-step editorial pipeline) based on complexity. References playbooks/intent-analysis.md (mandatory first step) and references/geo-checklist.md (20-item checklist).
allowed-tools:
  - Read
  - Write
  - Bash
  - WebSearch
  - WebFetch
  - Grep
---

# /content-seo — pipeline editorial PT-BR para SEO + GEO

Pipeline para gerar conteúdo Brazilian Portuguese **otimizado simultaneamente para SEO tradicional e Generative Engine Optimization** (AI Overviews, ChatGPT, Perplexity).

## Quando usar

- "escrever artigo", "criar post", "blogpost", "novo conteúdo".
- "content brief", "AI Overviews content", "otimizar para IA".
- "Featured snippet", "GEO", "ChatGPT search".

## Decision tree

```
1. Recebe tópico/keyword
   ↓
2. SEMPRE: playbooks/intent-analysis.md  (HARD STOP — não pula)
   ↓
3. Avalia complexidade + contagem de POVs proprietários
   ├── Simples (~800-1200 palavras, sem 6 etapas) → playbooks/article.md
   └── Complexo (skyscraper, 1500+ palavras, 6 etapas auditáveis) → playbooks/blogpost.md
   ↓
4. SEMPRE consulta references/geo-checklist.md (20 itens) antes de publicar
   ↓
5. Pra validação editorial pós-fato → invocar /content-seo-review
```

## Pré-condições não-negociáveis

1. **Intent analysis primeiro.** `playbooks/intent-analysis.md` SEMPRE roda antes de escrever. Sem isso, o orquestrador para — Skyscraper aplicado em transacional vira padding.
2. **POVs proprietários.** Cada artigo carrega 3-5 POVs em `proprietary_claims[]` no frontmatter, referenciando `brain/glossario/`. Sem 3 POVs, perguntar: "Quais 3 opiniões fortes você tem sobre este tema?"
3. **GEO embutido.** TL;DR (2-3 frases citáveis), FAQs estruturadas (gera FAQPage schema), Person schema em autoria, `llms.txt` na raiz. Não opcional.
4. **Voz BR.** Capitalização brasileira (apenas primeira letra maiúscula), antivícios IA banidos (`brain/tom-de-voz.md`), frases ≤25 palavras, voz ativa.
5. **Linkagem interna.** Antes de publicar, consulta `content/posts/index.md` e `content/site/index.md`. Web search complementar permitida.

## Playbooks

- `playbooks/intent-analysis.md` — análise de intenção (informacional/navegacional/comercial/transacional). Forma deriva da intenção.
- `playbooks/article.md` — versão simples (1 etapa, 800-1200 palavras, frontmatter completo).
- `playbooks/blogpost.md` — pipeline 6 etapas auditáveis (mapa de termos → análise concorrentes → consenso vs POV → headings/meta/slug → briefing → escrita).

## References

- `references/geo-checklist.md` — checklist 20 itens GEO (indexabilidade, autoridade/citações, forma/legibilidade, conteúdo proprietário, estratégia de marca, antivícios).

## Outputs

- `content/posts/<slug>.md` (frontmatter completo + body)
- `content/posts/index.md` atualizado
- Schema FAQPage embutido (JSON-LD)
- Person schema na autoria

## Princípios

- **Skyscraper default**, mas intenção define a forma.
- **POV proprietário > consenso** sempre. Quem só repete consenso é commodity.
- **GEO não substitui SEO** — complementa. SEO técnico é piso, GEO é diferencial.
- **Menções > backlinks** para LLMs.
- **Capitalização BR canônica.** Apenas primeira letra maiúscula em headings ("Como otimizar SEO" não "Como Otimizar SEO").

## Pós-publicação

Validar editorialmente via `/content-seo-review` (voz, capitalização, antivícios, POVs, GEO score). Validar tecnicamente via `/website-qa` (build + lighthouse) e `/technical-seo` (SEO score 10 categorias).
