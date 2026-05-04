---
title: Brain — Map of Content
tags: [brain, moc]
kit_state: template
created: TEMPLATE
updated: TEMPLATE
status: template
---

# Brain — Map of Content

> Wiki proprietária da marca seguindo metodologia [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). 1 entidade = 1 arquivo. Frontmatter rico (tags, sources, entities). Append-only `log.md`.
>
> ⚠️ **Estado: template.** Rode `/onboard` para preencher. Skills substantivas abortam enquanto `kit_state: template`.

## Como editar

- **No Obsidian:** abra a pasta `brain/` como vault. Wikilinks `[[arquivo]]`, callouts `> [!warning]`, tags `#brand` funcionam nativamente.
- **No terminal/IDE:** markdown puro. Frontmatter YAML padrão.
- **Pelo agente:** disparado por `/aprovado` → skill `update-brain`.

---

## Núcleo (sempre atualize estes)

| Path | Conteúdo | Tags |
|---|---|---|
| [[index]] | este arquivo (MoC) | `#brain/moc` |
| [[log]] | append-only — operações no Brain | `#brain/log` |
| [[config]] | estado operacional vivo (domínios, deploy, integrações) | `#brain/config` |
| [[tom-de-voz]] | tom de voz da marca + antivícios IA | `#brain/voz` |
| [[DESIGN]] | design system narrativo (visual aplicado em `/web/src/app/brandbook`) | `#brain/design` |
| [[backlog]] | ideias, pendências, próximos passos | `#brain/backlog` |

## Entidades (1 por arquivo)

| Tipo | Path | Descrição |
|---|---|---|
| Personas | [[personas/_template\|personas/]] | público-alvo do projeto. 1 arquivo por persona. |
| POVs proprietários | [[povs/_template\|povs/]] | opiniões fortes da marca que não são consenso (mín. 3). |
| Glossário | [[glossario/index\|glossario/]] | definições proprietárias. 1 arquivo por verbete. |

## Tecnologia & operação

| Path | Conteúdo |
|---|---|
| [[tecnologia/index]] | stack, gatilho de banco, decisões arquiteturais |
| [[seo/reports/index\|seo/reports/]] | outputs do SEO Score e Lighthouse |

## Fontes brutas

| Path | Conteúdo |
|---|---|
| [[sources/index\|sources/]] | fontes imutáveis (PDFs, transcripts, posts, papers) que originaram o Brain. Não editar — só anexar. |

---

## Posicionamento

> [!warning] Preencher via `/onboard`
> TEMPLATE — uma frase que descreve o que torna sua marca única. Ex.: "ajudamos founders B2B a crescer no orgânico sem depender de mídia paga".

## Domínio do projeto

Ver [[config#Domínio]].

## Como atualizar este MoC

A skill `update-brain` mantém. Manualmente: edite, troque `updated`, mantenha tabelas concisas.
