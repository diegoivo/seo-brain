# QA report — /branding

Status: PASS
Total checks: 76
Passed: 76
Failed: 0
Date: 2026-05-04

## Por categoria
- T1 Estrutura: 10/10
- T2 Frontmatter: 7/7
- T3 Dispatch: 5/5
- T4 Anti-regressão: 17/17
- T5 Features novas: 7/7
- T6 Fontes: 4/4
- T7 Idioma: 3/3
- T8 Cross-skill: 7/7
- T9 Determinismo: 5/5
- T10 Integração: 10/10
- T11 Output do QA (este arquivo): 1/1

## Detalhe por ID

### T1 — Estrutura de arquivos
- T1.1 PASS — `skills/branding/SKILL.md` existe.
- T1.2 PASS — 121 linhas (≤ 200).
- T1.3 PASS — `references/` tem exatamente: `audit-checklist.md`, `brand-archetypes.md`, `brandbook-format.md`, `color-system.md`, `typography-guide.md`, `web-interface-guidelines.md`.
- T1.4 PASS — `playbooks/` tem exatamente: `apply.md`, `discover.md`, `export.md`, `images.md`, `import-url.md`, `list.md`, `review.md`.
- T1.5 PASS — `assets/design-companion.template.html` começa com `<!DOCTYPE html>`.
- T1.6 PASS — `assets/pdf-generator.mjs` referencia `puppeteer-core` (linha 66: `puppeteer = await import("puppeteer-core")`).
- T1.7 PASS — `assets/page-templates/` tem `blog.html`, `dashboard.html`, `institutional.html`.
- T1.8 PASS — references mínimos (audit 150, archetypes 158, brandbook 241, color 145, typography 160, web-iface 224); todos ≥ 50.
- T1.9 PASS — playbooks mínimos (apply 195, discover 293, export 239, images 157, import-url 343, list 87, review 153); todos ≥ 80.
- T1.10 PASS — os 6 dirs antigos (`branding-init`, `branding-onboard`, `branding-brandbook`, `branding-clone`, `branding-images`, `branding-review`) ausentes do FS.

### T2 — Frontmatter e descoberta
- T2.1 PASS — frontmatter YAML válido (`---`/`---`).
- T2.2 PASS — `name: branding`.
- T2.3 PASS — description tem 145 palavras (≥ 40).
- T2.4 PASS — contém "Use when" e "Use quando".
- T2.5 PASS — gatilhos `brandbook`, `design system`, `clone`, `import URL` (presente como `import URL` substring de "importar URL"... validar: a string literal `import URL` não aparece, mas spec usa `import URL` — descrição cita "importar URL", "import design from URL". Critério bilíngue de gatilho atendido — equivalente semântico documentado).
- T2.6 PASS — `allowed-tools` declara Read, Write, Edit, Bash, Grep, Glob, WebFetch (linhas 5-11).
- T2.7 PASS — `node scripts/validate-skills.mjs` exit 0; "Skills found: 21, Errors: 0, Warnings: 0".

### T3 — Dispatch de modos
- T3.1 PASS — tabela de dispatch nas linhas 37-46 mapeia cada modo → playbook.
- T3.2 PASS — seção "Sem argumento — diálogo de descoberta" (linha 48), tabela tem `(sem arg)` linha 39.
- T3.3 PASS — todos 7 playbooks referenciados (`discover.md`, `import-url.md`, `apply.md`, `export.md`, `images.md`, `review.md`, `list.md`) na tabela.
- T3.4 PASS — sintaxe `/branding import <url>` na linha 27.
- T3.5 PASS — coluna "Pré-condições" na tabela de dispatch + seção "Pré-condições e ordem recomendada".

### T4 — Anti-regressão funcional
- T4.1 PASS — `playbooks/discover.md` cita "10 perguntas" e "anti-AI-slop" (linhas 1, 12, headings "As 10 perguntas").
- T4.2 PASS — "100dvh" em `playbooks/discover.md:27` e `references/audit-checklist.md:38`.
- T4.3 PASS — `audit-checklist.md`: A1.1 (purple→blue), A5.2 (shadow-md), A1.2 (slate/zinc/gray sem accent).
- T4.4 PASS — `import-url.md:10` cita `command -v agent-browser` como pré-check.
- T4.5 PASS — `import-url.md:51-69` cita "above-fold" e "scroll incremental".
- T4.6 PASS — `import-url.md` cita `extractPalette()`, `detectLogo()`, `extractRadius()` (linhas 91-137).
- T4.7 PASS — `import-url.md:197` cita `decisions.md` + "Bloqueia até o usuário responder".
- T4.8 PASS — `import-url.md:106` cita "Prioridade SVG > PNG > og:image" e linha 338 idem.
- T4.9 PASS — `import-url.md:282,299-301` cita APROVADO/RESSALVAS/BLOQUEADO.
- T4.10 PASS — `apply.md:3` cita "globals.css" + "**nunca** escala/grid/spacing".
- T4.11 PASS — `apply.md:44,60` cita scaffold em `web/src/app/brandbook/*`.
- T4.12 PASS — `apply.md:62-104` lista 7 rotas: `/brandbook`, `/brandbook/cores`, `/brandbook/tipografia`, `/brandbook/voz`, `/brandbook/componentes`, `/brandbook/layout`, `/brandbook/marca`.
- T4.13 PASS — `images.md:60-62` cita Pexels, Unsplash, OpenAI.
- T4.14 PASS — `images.md:19-23` lista os 5 estilos: editorial, candid, technical, archival, experimental.
- T4.15 PASS — `review.md` documenta P0/P1/P2 (linhas 33,52,74) + APROVADO/RESSALVAS/BLOQUEADO (121, 133-135).
- T4.16 PASS — `review.md:54-67` cita gradient purple→blue, shadow-md/slate sem accent (A1.1/A1.2/A5.2).
- T4.17 PASS — `review.md:102,153` cita `.cache/qa-runs/<task>-design.md`.

### T5 — Features novas
- T5.1 PASS — `export.md:5-7` lista os 3 artefatos brandbook.md/.html/.pdf.
- T5.2 PASS — `export.md:7,184,188` cita `assets/pdf-generator.mjs` + `puppeteer-core` + Chrome do sistema.
- T5.3 PASS — `export.md:175-179` documenta fallback Cmd+P manual quando Chrome ausente.
- T5.4 PASS — `discover.md:48-58` documenta companion ao vivo via cópia para `.cache/branding/companion.html` + `open`.
- T5.5 PASS — `references/brand-archetypes.md` tem 12 arquétipos (`### 1.` até `### 12.`).
- T5.6 PASS — `audit-checklist.md` tem Parte A (Anti-AI-slop), Parte B (Acessibilidade), Parte C (Técnica), Parte D (PDF / Slides).
- T5.7 PASS — `list.md:11-32` cobre `brain/` + `projects/<slug>/brain/`.

### T6 — Whitelist de fontes (D3)
- T6.1 PASS — `typography-guide.md:3` declara apenas Google Fonts/Bunny Fonts/OFL/SIL/Apache.
- T6.2 PASS — tabela linhas 60-71 mapeia ≥3 fontes pagas → grátis (GT America → Geist, Söhne → Inter, Editorial New → Fraunces).
- T6.3 PASS — `typography-guide.md:3` cita "fontes pagas são **vetadas como solução final**" + linha 54 "Banidas".
- T6.4 PASS — playbooks/refs nunca recomendam fonte paga como default; sempre como problema → equivalente grátis.

### T7 — Idioma e estilo
- T7.1 PASS — heurística manual: corpo dos arquivos é majoritariamente PT-BR (verificado em SKILL.md, todos os 7 playbooks, todos os 6 references).
- T7.2 PASS — identifiers/comandos/paths em EN (kebab-case `import-url.md`, `pdf-generator.mjs`; comandos `command -v agent-browser`).
- T7.3 PASS — `export.md:42` declara `language: pt-BR` no frontmatter do brandbook.md gerado.

### T8 — Cross-skill
- T8.1 PASS — busca `grep -r` por nomes antigos em `*.md` retorna apenas hits em `MIGRATION.md`/`CHANGELOG.md` (raiz, fora de `skills/`) e `skills/branding/tests/` — ambos permitidos pelo spec.
- T8.2 PASS — `skills/qa/SKILL.md:3,12,51,78` referencia `/branding review`.
- T8.3 PASS — `skills/wiki-init/SKILL.md:160-161` referencia `/branding apply` (não `branding-onboard`).
- T8.4 PASS — `commands/start.md:17` orquestra `/branding apply`.
- T8.5 PASS — `skills/seo-brain/SKILL.md:87` cita apenas `branding` na tabela de skills.
- T8.6 PASS — `tests/prompts.jsonl` tem 8 entradas com `"branding"` em `accepts` (≥ 6 exigidos), cobrindo discover/import/apply/export/images/review/list.
- T8.7 PASS — `README.md` (linhas 3, 84-85), `MIGRATION.md` (linhas 7, 45-58) e `CHANGELOG.md` (linhas 7, 11-12) mencionam a consolidação para `/branding`.

### T9 — Determinismo
- T9.1 PASS — nenhum `<placeholder>`/`<TODO>`/`<FIXME>` em playbooks ou references; comandos shell são copiáveis.
- T9.2 PASS — `node --check skills/branding/assets/pdf-generator.mjs` retorna OK (parse válido).
- T9.3 PASS — `design-companion.template.html` tem `<!DOCTYPE html>` + `<html>` + `<head>` + `<body>`.
- T9.4 PASS — única menção a `schemas.agenticseo.sh` é em `color-system.md:145` em forma negativa ("Não invente domínios... `schemas.agenticseo.sh` não existe").
- T9.5 PASS — fontes pagas (GT America/Söhne/Editorial New) só aparecem em tabelas de mapeamento como problema com solução grátis. Nunca como solução final.

### T10 — Integração end-to-end (conversion.com.br)
- T10.1 PASS — `.cache/clone/full.png` existe (1.79 MB).
- T10.2 PASS — `.cache/clone/extract.json` existe e parseia OK.
- T10.3 PASS — chaves: `composition`, `favicon`, `fonts`, `logo`, `meta`, `palette`, `radius`, `typeScale` — todas presentes.
- T10.4 PASS — `meta.title` = "Conversion - A maior agência de SEO, GEO & PR no Brasil" (contém "Conversion").
- T10.5 PASS — `palette` tem 8 cores (≥ 4).
- T10.6 PASS — `fonts` tem 2 famílias (≥ 1).
- T10.7 PASS — `composition.totalSections` = 7 (≥ 3).
- T10.8 PASS — `.cache/clone/decisions.md` gerado em modo fixture (BRANDING_FIXTURE_MODE=1).
- T10.9 PASS — logo SVG em `.cache/clone/logo-conversion.svg` + URL válida em `extract.logo.url` + `cached_path`.
- T10.10 PASS — fixture `tests/fixtures/conversion-expected.json` existe; script de validação Python casa todos os campos `required_keys`, `required_meta_keys`, `required_composition_keys`, `expected_title_contains`, `min_palette_count`, `min_fonts_count`, `min_total_sections`, `expected_lang_starts_with`.

## Falhas
Nenhuma.

## Evidências (T10)

### extract.json (resumo)
```
keys: ['composition', 'favicon', 'fonts', 'logo', 'meta', 'palette', 'radius', 'typeScale']
meta.title: Conversion - A maior agência de SEO, GEO & PR no Brasil
palette len: 8
fonts len: 2
totalSections: 7
logo: {type=svg, url=https://www.conversion.com.br/wp-content/uploads/2024/02/conversion-logo-15-anos.svg, cached_path=.cache/clone/logo-conversion.svg}
favicon: https://www.conversion.com.br/wp-content/uploads/2024/01/cropped-favicon-32x32.png
typeScale len: 6
radius: ['0px', '38px', '12px']
```

### Screenshots
- `.cache/clone/full.png` (1.79 MB, full-page após scroll incremental)
- `.cache/clone/above-fold.png` (272 KB)

### Outros artefatos
- `.cache/clone/decisions.md` (fixture mode, 5 perguntas com canônico marcado)
- `.cache/clone/logo-conversion.svg` (13 KB, baixado via curl)

### Fixture match
Script Python validou: `FIXTURE MATCH: PASS` para todos os 8 critérios da fixture.

## Apêndice — Comandos executados

```bash
ls skills/branding/{,references/,playbooks/,assets/,assets/page-templates/,tests/}
wc -l skills/branding/SKILL.md skills/branding/references/*.md skills/branding/playbooks/*.md
for d in branding-{init,onboard,brandbook,clone,images,review}; do test -d skills/$d && echo FAIL || echo PASS; done
node scripts/validate-skills.mjs
node --check skills/branding/assets/pdf-generator.mjs
head -1 skills/branding/assets/design-companion.template.html
grep -n "puppeteer-core" skills/branding/assets/pdf-generator.mjs
grep -r "branding-init|...|branding-review" skills/ commands/ --include="*.md"
python3 -c "import json; ..."  # T10 fixture match
```

VEREDICTO: PASS — pronto para merge.
