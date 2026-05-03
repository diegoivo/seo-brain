---
kit_state: template
updated: TEMPLATE
---

# Glossário

> Definições proprietárias da marca. Cada verbete vira um arquivo neste diretório.
>
> POVs proprietários (`proprietary_claims[]` no frontmatter dos posts) referenciam verbetes daqui via `brain_refs[]`. Manter a definição em um lugar só evita drift entre conteúdos.

## Verbetes

(vazio — adicione conforme cunhar conceitos próprios)

## Estrutura de cada verbete

```
brain/glossario/
├── index.md (este arquivo)
├── conceito-x.md
└── conceito-y.md
```

Cada arquivo deve ter:
- **Termo** — nome do verbete
- **Definição em 1-2 frases** — citável por LLMs (GEO)
- **Por quê** — o que torna esta definição diferente do consenso de mercado
- **Quando aplicar**
- **Referências cruzadas** — outros verbetes ou posts
