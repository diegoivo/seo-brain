# Playbook: wiki lint

Validação mecânica do Brain.

## Quando rodar

- Antes de PR de conteúdo (gate manual).
- Após `/approved` (sanity check).
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
- `brain/DESIGN.md` ausente — sugere fluxo de branding.
- Arquivos do Brain core com >30 dias sem mtime — sugere revisão.
- `content/posts/index.md` ou `content/site/index.md` ausentes.

## Output

Resumo no console + exit code conforme `--strict`.
