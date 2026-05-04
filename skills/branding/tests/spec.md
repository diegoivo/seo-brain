# /branding — spec de aceitação

Critérios assertivos para validação automatizada por sub-agente QA. **100% PASS é pré-requisito** para fechar o PR. Cada item tem ID citável (`T1.3`, `T6.2`...) que o QA referencia no relatório.

Workspace de execução: `/Users/diego/conductor/workspaces/seobrain/da-nang`.

---

## T1 — Estrutura de arquivos

| ID | Assertiva | Como verificar |
|---|---|---|
| T1.1 | `skills/branding/SKILL.md` existe | `test -f` |
| T1.2 | `skills/branding/SKILL.md` ≤ 200 linhas | `wc -l` |
| T1.3 | `skills/branding/references/` contém exatamente: `brand-archetypes.md`, `color-system.md`, `typography-guide.md`, `audit-checklist.md`, `web-interface-guidelines.md`, `brandbook-format.md` | `ls` |
| T1.4 | `skills/branding/playbooks/` contém exatamente: `discover.md`, `import-url.md`, `apply.md`, `export.md`, `images.md`, `review.md`, `list.md` | `ls` |
| T1.5 | `skills/branding/assets/design-companion.template.html` existe e tem `<!DOCTYPE html>` na primeira linha | `head -1` |
| T1.6 | `skills/branding/assets/pdf-generator.mjs` existe e usa `puppeteer-core` | `grep` |
| T1.7 | `skills/branding/assets/page-templates/` contém: `institutional.html`, `blog.html`, `dashboard.html` | `ls` |
| T1.8 | Cada `references/*.md` tem ≥ 50 linhas (sem stub) | `wc -l` |
| T1.9 | Cada `playbooks/*.md` tem ≥ 80 linhas (sem stub) | `wc -l` |
| T1.10 | Os 6 diretórios antigos `skills/branding-{init,onboard,brandbook,clone,images,review}` **não existem** | `! test -d` |

## T2 — Frontmatter e descoberta

| ID | Assertiva | Como verificar |
|---|---|---|
| T2.1 | `SKILL.md` tem frontmatter YAML válido (`---\n…\n---`) | regex |
| T2.2 | `name: branding` | grep frontmatter |
| T2.3 | `description` ≥ 40 palavras | contagem |
| T2.4 | `description` contém "Use when" **e** "Use quando" (bilíngue) | grep |
| T2.5 | `description` cita pelo menos 6 frases-gatilho das skills antigas: `brandbook`, `design system`, `clone`, `import URL`, `imagens`, `revisão visual` | grep |
| T2.6 | `allowed-tools` declara: Read, Write, Edit, Bash, Grep, Glob, WebFetch | grep |
| T2.7 | `node scripts/validate-skills.mjs` sai com exit code 0 | execução |

## T3 — Dispatch de modos

`SKILL.md` deve documentar dispatch claro para 8 modos (`<sem arg>`, `discover`, `import`, `apply`, `export`, `images`, `review`, `list`).

| ID | Assertiva | Como verificar |
|---|---|---|
| T3.1 | `SKILL.md` tem tabela ou seção que mapeia cada modo → playbook | grep ` discover` + ` playbooks/discover.md` |
| T3.2 | `SKILL.md` documenta comportamento sem argumento (perguntar qual modo) | grep "sem argumento" ou "no arg" |
| T3.3 | Cada playbook é referenciado pelo menos 1× no `SKILL.md` | grep para cada um dos 7 |
| T3.4 | `SKILL.md` documenta sintaxe `/branding import <url>` literal | grep |
| T3.5 | `SKILL.md` documenta pré-condições por modo | seção "Pré-condições" |

## T4 — Anti-regressão funcional (mapeamento 1:1)

Cada feature presente nas 6 skills antigas existe em algum playbook do `/branding`. **Sem perda silenciosa**.

| ID | Feature original (skill antiga) | Onde deve estar agora |
|---|---|---|
| T4.1 | 10 perguntas anti-AI-slop (`branding-init`) | `playbooks/discover.md` cita "10 perguntas" e "anti-AI-slop" |
| T4.2 | Regra do primeiro viewport — hero cabe em 100dvh mobile (`branding-init`) | `playbooks/discover.md` **e** `references/audit-checklist.md` citam "100dvh" |
| T4.3 | Banidos: gradient purple→blue, shadow-md genérico, slate/zinc/gray sem accent (`branding-init`) | `references/audit-checklist.md` cita os 3 antipadrões |
| T4.4 | Pré-check `command -v agent-browser` antes de tudo (`branding-clone`) | `playbooks/import-url.md` cita `command -v agent-browser` |
| T4.5 | Multi-fase de captura (above-fold + scroll incremental + full-page) (`branding-clone`) | `playbooks/import-url.md` cita "scroll incremental" e "above-fold" |
| T4.6 | Extração via `agent-browser eval --stdin` com `extractPalette/detectLogo/extractRadius` (`branding-clone`) | `playbooks/import-url.md` cita as 3 funções |
| T4.7 | Perguntas de fidelidade bloqueantes (`branding-clone`) | `playbooks/import-url.md` cita "decisions.md" e "bloqueante" |
| T4.8 | Logo prioridade SVG > PNG > og:image (`branding-clone`) | `playbooks/import-url.md` cita as 3 fontes em ordem |
| T4.9 | Diff report real vs local com veredicto APROVADO/RESSALVAS/BLOQUEADO (`branding-clone/fidelity-qa`) | `playbooks/import-url.md` cita os 3 veredictos |
| T4.10 | Atualizar `web/src/app/globals.css` (cores + fontes apenas; nunca escala/grid/spacing) (`branding-onboard`) | `playbooks/apply.md` cita "globals.css" e a restrição "nunca escala/grid/spacing" |
| T4.11 | Popular scaffold `web/src/app/brandbook/*` (`branding-onboard` + `branding-brandbook`) | `playbooks/apply.md` cita o caminho |
| T4.12 | 7 rotas vivas: `/brandbook`, `/brandbook/cores`, `/tipografia`, `/voz`, `/componentes`, `/layout`, `/marca` (`branding-brandbook`) | `playbooks/apply.md` lista as 7 rotas |
| T4.13 | Provider de imagens — Pexels (default), Unsplash, OpenAI (`branding-images`) | `playbooks/images.md` cita os 3 |
| T4.14 | 5 estilos canônicos: editorial, candid, technical, archival, experimental (`branding-images`) | `playbooks/images.md` cita os 5 |
| T4.15 | QA visual P0/P1/P2 com veredicto APROVADO/RESSALVAS/BLOQUEADO (`branding-review`) | `playbooks/review.md` cita os 3 |
| T4.16 | AI-slop checklist (gradient purple→blue, shadow-md, slate sem accent) (`branding-review`) | `playbooks/review.md` cita os 3 |
| T4.17 | Output em `.cache/qa-runs/<task>-design.md` (`branding-review`) | `playbooks/review.md` cita o caminho |

## T5 — Features novas (vindas da skill externa)

| ID | Assertiva |
|---|---|
| T5.1 | `playbooks/export.md` gera **3 artefatos**: `brandbook.md`, `brandbook.html`, `brandbook.pdf` |
| T5.2 | `playbooks/export.md` usa `assets/pdf-generator.mjs` com `puppeteer-core` + Chrome do sistema |
| T5.3 | `playbooks/export.md` documenta fallback se Chrome ausente (Cmd+P manual) |
| T5.4 | `playbooks/discover.md` documenta o design companion ao vivo (`assets/design-companion.template.html` copiado para `.cache/branding/companion.html` + `open`) |
| T5.5 | `references/brand-archetypes.md` documenta os 12 arquétipos Mark & Pearson |
| T5.6 | `references/audit-checklist.md` tem seções **Anti-AI-slop**, **Acessibilidade**, **Técnica**, **PDF/Slides** |
| T5.7 | `playbooks/list.md` lista marcas de `brain/` e `projects/<slug>/brain/` |

## T6 — Whitelist de fontes (D3)

| ID | Assertiva |
|---|---|
| T6.1 | `references/typography-guide.md` declara apenas Google/Bunny/OFL/SIL/Apache |
| T6.2 | `references/typography-guide.md` mapeia ≥ 3 fontes pagas para equivalentes grátis (ex.: GT America → Geist; Söhne → Inter; Editorial New → Fraunces) |
| T6.3 | `references/typography-guide.md` cita explicitamente "fontes pagas vetadas" ou equivalente |
| T6.4 | Nenhum playbook ou reference recomenda font paga como default |

## T7 — Idioma e estilo (D2)

| ID | Assertiva |
|---|---|
| T7.1 | Texto em PT-BR em todos os arquivos novos (heurística: ratio de palavras PT > EN no corpo) |
| T7.2 | Identifiers/comandos/paths permanecem em EN (snake_case ou kebab-case) |
| T7.3 | `playbooks/export.md` produz `brandbook.md` em PT-BR (não EN) |

## T8 — Cross-skill (referências cruzadas)

| ID | Assertiva | Como verificar |
|---|---|---|
| T8.1 | Nenhuma skill em `skills/` (exceto `skills/branding/tests/`) referencia `branding-init`, `branding-onboard`, `branding-brandbook`, `branding-clone`, `branding-images` ou `branding-review` | `grep -r` |
| T8.2 | `skills/qa/SKILL.md` referencia `/branding review` (modo da nova skill) | grep |
| T8.3 | `skills/wiki-init/SKILL.md` referencia `/branding` (não mais `branding-onboard`) | grep |
| T8.4 | `commands/seobrain.md` orquestra `/branding` (não mais `branding-onboard`) | grep |
| T8.5 | `skills/seobrain/SKILL.md` cita apenas `/branding` na tabela de skills | grep |
| T8.6 | `tests/prompts.jsonl` tem ≥ 6 entradas com `accepts` contendo `branding` (cobre os 6 modos) | jq/grep |
| T8.7 | `README.md`, `MIGRATION.md`, `CHANGELOG.md` mencionam a consolidação para `/branding` | grep |

## T9 — Determinismo e validações

| ID | Assertiva |
|---|---|
| T9.1 | Todos os comandos de exemplo nos playbooks são copiáveis (sem `<placeholder>` quebrado em meio à linha shell) |
| T9.2 | `assets/pdf-generator.mjs` é JS válido (Node parse OK via `node --check`) |
| T9.3 | `assets/design-companion.template.html` é HTML5 válido (tem `<!DOCTYPE html>` + `<html>` + `<head>` + `<body>`) |
| T9.4 | Nenhum arquivo cita URLs inventadas como `schemas.agenticseo.sh` ou similares |
| T9.5 | Nenhum arquivo cita fontes pagas (GT America, Söhne, Editorial New) como solução final — apenas como problema com solução grátis |

## T10 — Integração end-to-end (conversion.com.br)

Esta é a validação **viva**: o sub-agente QA roda o pipeline real do modo `import` contra `https://conversion.com.br/` e confirma os outputs.

| ID | Assertiva |
|---|---|
| T10.1 | `.cache/clone/full.png` existe após captura |
| T10.2 | `.cache/clone/extract.json` existe e parse JSON OK |
| T10.3 | `extract.json` tem campos: `meta`, `logo`, `favicon`, `fonts`, `palette`, `typeScale`, `radius`, `composition` |
| T10.4 | `extract.json.meta.title` contém "Conversion" (case-insensitive) |
| T10.5 | `extract.json.palette` tem ≥ 4 cores |
| T10.6 | `extract.json.fonts` tem ≥ 1 família detectada |
| T10.7 | `extract.json.composition.totalSections` ≥ 3 |
| T10.8 | `.cache/clone/decisions.md` foi gerado (ainda que sem resposta do usuário — fixture mode) |
| T10.9 | Logo (SVG ou PNG) baixado em `web/public/logo.*` OU registrado no extract com URL válida |
| T10.10 | Fixture esperada: `tests/fixtures/conversion-expected.json` contém os campos mínimos esperados; `extract.json` real bate com a fixture (campos presentes; valores não precisam casar 100%, mas estrutura sim) |

## T11 — Output final do QA

QA produz `tests/qa-report.md` com:

```markdown
# QA report — /branding

Status: PASS | FAIL
Total checks: NN
Passed: NN
Failed: NN
Date: YYYY-MM-DD

## Por categoria
- T1 Estrutura: X/Y
- T2 Frontmatter: X/Y
- T3 Dispatch: X/Y
- T4 Anti-regressão: X/Y
- T5 Features novas: X/Y
- T6 Fontes: X/Y
- T7 Idioma: X/Y
- T8 Cross-skill: X/Y
- T9 Determinismo: X/Y
- T10 Integração: X/Y

## Falhas
- [ID] descrição + arquivo:linha

## Evidências (T10)
- extract.json (resumo)
- screenshot path
```

`PASS` exige **0 falhas** em T1–T9 e **0 falhas** em T10 (skip permitido apenas se `agent-browser` ausente — neste workspace está disponível).
