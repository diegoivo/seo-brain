---
kit_state: template
updated: TEMPLATE
---

# DESIGN.md

> ⚠️ **Placeholder.** Rode `/design-init` (10 perguntas) para gerar um design system único antes de mexer em UI.
>
> A skill `scaffold-page` aborta enquanto este arquivo estiver com `kit_state: template`.

## Por que este arquivo é importante

DESIGN.md é a fonte canônica das decisões visuais do projeto. Sem ele, qualquer agente vai recair no default do Tailwind/shadcn — gradientes purple→blue, ícones do Heroicons, shadows pesadas, cards arredondados de 8px, hero gigante centralizado — e o resultado vira AI slop genérico.

`/design-init` força decisões **opinativas**: arquétipo de marca, mood em adjetivos, paleta com hex, antipadrões explícitos do que **não** fazer.

## Conteúdo após `/design-init`

(será gerado nas seções 1-9 — Atmosfera & Tema Visual, Cores & Papéis, Tipografia, Estilos de Componentes, Princípios de Layout, Profundidade & Elevação, Motion, Antipadrões, Referências)

## Tokens

`brain/DESIGN.tokens.json` é gerado em paralelo, consumível pelo `/web`.
