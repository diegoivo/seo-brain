---
name: wiki-lint
description: LLM Wiki lint — validates the project knowledge base (brain/) for required frontmatter on posts/pages, index files present, freshness of core files (>30 days triggers warning), proprietary POVs declared, voice file canonical. Runs scripts/wiki-lint.mjs. Use when user asks "lint brain", "validate wiki", "validar brain", "brain check", "wiki integrity check", "drift detection", before content PRs, or periodically to detect knowledge drift. Renamed from /brain-lint (v0.1.0).
allowed-tools:
  - Bash
  - Read
---

# Brain Lint

Validação mecânica do Brain.

## Quando rodar

- Antes de PR de conteúdo (gate manual).
- Após `update-brain` (sanity check).
- Periodicamente (semanal) — detecta arquivos parados há >30 dias.

## Como rodar

```bash
node scripts/wiki-lint.mjs            # warnings + erros, exit 0
node scripts/wiki-lint.mjs --strict   # exit 1 se erros (uso em CI)
```

## O que valida

### Erros (bloqueiam em --strict)
- `brain/index.md`, `brain/tom-de-voz.md`, `brain/personas.md`, `brain/glossario/index.md`, `brain/tecnologia/index.md`, `brain/backlog.md` existem.
- Posts e páginas têm frontmatter completo.
- `proprietary_claims[]` tem ≥3 itens.

### Warnings (não bloqueiam)
- `brain/DESIGN.md` ausente — sugere `/branding-init`.
- Arquivos do Brain core com >30 dias sem mtime — sugere revisão.
- `content/posts/index.md` ou `content/site/index.md` ausentes.

## Output

Resumo no console + exit code conforme `--strict`.
