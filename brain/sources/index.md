---
title: Sources — fontes brutas
tags: [brain, sources, moc]
kit_state: template
status: template
---

# Sources — fontes brutas imutáveis

> Camada de **fontes brutas** (Karpathy LLM Wiki §3 layers). Não editar — só anexar.
>
> Fontes que originaram o Brain: PDFs, transcripts de palestras, posts antigos, papers, screenshots, entrevistas.

## Fontes registradas

| Arquivo | Tipo | Tags | Data |
|---|---|---|---|
| (vazio) | | | |

## Como adicionar

1. Coloque o arquivo em `brain/sources/<categoria>/<nome>.<ext>`
2. Crie um arquivo `<nome>.md` ao lado com:
   ```yaml
   ---
   title: Título da fonte
   tags: [source, <tipo>]
   source_type: pdf | transcript | post | paper | screenshot | other
   url: (se aplicável)
   added: 2026-05-03
   ---
   ```
3. Em verbetes/POVs/personas que usaram essa fonte, adicione `sources: [[[sources/<nome>]]]` no frontmatter.
