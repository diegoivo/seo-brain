---
title: Brain no Obsidian — setup recomendado
tags: [docs, obsidian, brain, workflow]
created: 2026-05-03
updated: 2026-05-03
status: initialized
---

# Brain no Obsidian — setup recomendado

> O **Brain** (`brain/`) deste kit foi desenhado para ser **diretamente compatível com o Obsidian**. Não há `/brain` viewer no Next porque seria duplicação ruim — Obsidian já é a melhor ferramenta para navegar wiki estruturada com wikilinks, tags e graph view.

## Por quê não um viewer customizado

A primeira tentação foi fazer `/brain` no Next (rota dev-only). Razões para descartar:

1. **Reinventaria a roda.** Obsidian já resolve graph view, wikilinks, search, tags, frontmatter, callouts, dataview.
2. **Brain é privado.** Misturar viewer com app público vira faca de dois gumes — risco de vazar via build error.
3. **Plugin ecosystem.** Obsidian tem dataview, templater, charts — qualquer "feature" do viewer custom já existe.
4. **Sync grátis** via iCloud/Dropbox/git — Obsidian abre direto.

## Setup em 5 minutos

### 1. Instalar Obsidian

Download em <https://obsidian.md>. Free para uso pessoal.

### 2. Abrir o brain como vault

`File → Open Vault → Open folder as vault → <projeto>/brain/`

Importante: aponte para `brain/`, não para a raiz do projeto. Obsidian indexa a pasta toda — apontar pra raiz pega `web/`, `node_modules/`, etc.

### 3. Habilitar plugins core (Settings → Core plugins)

| Plugin | Por quê |
|---|---|
| **Tags pane** | Filtra por tag (`#brain/povs`, `#brain/personas`) |
| **Graph view** | Visualiza grafo de wikilinks |
| **Outgoing/Backlinks** | Vê o que linka pra cada nota |
| **Templates** | Usa `_template.md` como template |
| **Daily notes** | Opcional — log diário em `brain/log.md` |

### 4. Sintaxes que **já funcionam** no kit

O kit gera markdown 100% Obsidian-compatible:

- **Wikilinks**: `[[index]]`, `[[../docs/grid-system]]`, `[[personas/_template\|Template de persona]]`.
- **Callouts**: `> [!warning]`, `> [!info]`, `> [!tip]`, `> [!example]`.
- **Tags YAML**: `tags: [brain, povs, proprietary]` no frontmatter — aparecem na tag pane.
- **Frontmatter rico**: `created`, `updated`, `status`, `kit_state`, `entity_type`, `sources` — tudo pesquisável.

### 5. Templater (opcional, recomendado)

Plugin community: `Templater`. Aponte a pasta de templates para `brain/personas/_template.md`, `brain/povs/_template.md`, `brain/glossario/_template.md`.

Cmd+P → "Templater: Insert template" → escolhe → preenche frontmatter automaticamente.

### 6. Dataview (opcional, poderoso)

Plugin community: `Dataview`. Permite queries SQL-like sobre o brain. Exemplos úteis em `brain/index.md`:

````markdown
```dataview
TABLE created, updated, status
FROM "personas"
WHERE entity_type = "persona"
SORT updated DESC
```
````

Aparece como tabela renderizada. Útil para listar todas as personas, POVs por status, glossário ordenado por updated.

### 7. Graph view configurado

`Settings → Core plugins → Graph view → Filter`:

- Group 1: `path:povs` → cor 1 (POVs proprietários)
- Group 2: `path:personas` → cor 2
- Group 3: `path:glossario` → cor 3
- Group 4: `path:tecnologia` → cor 4

Vira mapa visual da identidade do projeto.

## O que **não** funciona (limitações conhecidas)

- **Frontmatter `kit_state: template` com pipe** em wikilinks já tratado: `[[personas/_template\|Template]]` (escape com backslash).
- **JSON-LD em scripts**: Obsidian não renderiza, mas não quebra.
- **Imports relativos pra fora do vault**: se você apontou para `brain/`, links como `[[../docs/typography]]` não resolvem dentro do Obsidian. Soluções:
  - Alternativa: abrir a raiz do projeto como vault e usar `.obsidian/` filtros para esconder `node_modules/` e `.next/`.
  - Ou: ignorar o link (validador `brain-lint` ainda valida fora do Obsidian).

## Workflow recomendado

1. **Pesquisa/decisão** — agente roda `/onboard-brain` e popula `brain/`.
2. **Revisão** — você abre Obsidian, navega no graph view, ajusta o que está errado direto no editor.
3. **Append-only de aprendizados** — nova decisão → entrada em `brain/log.md` (Karpathy).
4. **Atualização guiada** — agente roda `/aprovado` (que dispara `/update-brain`) ao final de tarefas relevantes.

## Comandos do agente que tocam o brain

- `/onboard-brain` — popula a primeira vez.
- `/update-brain` — atualiza após `/aprovado`.
- `/brain-lint` — valida frontmatter, wikilinks, freshness.

Tudo em CLI/agent — Obsidian fica como **leitor + editor humano** principal.

## Privacidade

`brain/` está em `.gitignore`? **Não.** É commitado intencionalmente — é fonte de verdade do projeto, não secreto.

Mas:
- `brain/seo/reports/*.md` (exceto `index.md`) é git-ignored — relatórios são output efêmero.
- `.cache/` é git-ignored (state de skills).
- `.env` git-ignored.

Se precisar partes privadas no brain (notas pessoais, raw notes), use `brain/private/` e adicione ao `.gitignore`.
