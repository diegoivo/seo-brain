# Playbook: `/branding list`

Lista todas as marcas conhecidas no repositório. Útil para multi-projeto (`projects/<slug>/brain/`) ou para conferir o que já foi exportado.

## Pré-condições

Nenhuma. Roda sempre.

## Pipeline

### 1. Coleta marcas em `brain/`

```bash
# Marca raiz (single-project ou template)
if [ -f brain/index.md ] && [ -f brain/DESIGN.md ]; then
  NAME=$(grep '^name:' brain/index.md 2>/dev/null | cut -d: -f2 | xargs)
  STATE=$(grep 'kit_state:' brain/DESIGN.md 2>/dev/null | cut -d: -f2 | xargs)
  echo "ROOT|$NAME|$STATE|brain/"
fi
```

### 2. Coleta marcas em `projects/<slug>/brain/`

```bash
for dir in projects/*/brain/; do
  if [ -f "$dir/DESIGN.md" ]; then
    SLUG=$(basename "$(dirname "$dir")")
    NAME=$(grep '^name:' "$dir/index.md" 2>/dev/null | cut -d: -f2 | xargs)
    STATE=$(grep 'kit_state:' "$dir/DESIGN.md" 2>/dev/null | cut -d: -f2 | xargs)
    echo "PROJECT|$NAME|$STATE|$dir"
  fi
done
```

### 3. Coleta exportados em `brand/`

```bash
for dir in brand/*/; do
  if [ -f "$dir/brandbook.md" ]; then
    SLUG=$(basename "$dir")
    VERSION=$(grep '^version:' "$dir/brandbook.md" 2>/dev/null | cut -d: -f2 | xargs)
    HAS_HTML=$([ -f "$dir/brandbook.html" ] && echo "html" || echo "—")
    HAS_PDF=$([ -f "$dir/brandbook.pdf" ] && echo "pdf" || echo "—")
    echo "EXPORT|$SLUG|v$VERSION|$HAS_HTML|$HAS_PDF|$dir"
  fi
done
```

### 4. Renderiza tabela

```markdown
# Marcas conhecidas

## Brain (source-of-truth)

| Tipo | Nome | Estado | Caminho |
|---|---|---|---|
| Root | conversion | initialized | brain/ |
| Project | acme | initialized | projects/acme/brain/ |
| Project | beta | template | projects/beta/brain/ |

## Exportados (brand/)

| Slug | Versão | HTML | PDF | Caminho |
|---|---|---|---|---|
| conversion | v1.0.0 | html | pdf | brand/conversion/ |
| acme | v0.2.1 | html | — | brand/acme/ |
```

### 5. Sugestão final

Baseado no estado:

- **Sem brain inicializado**: "Comece com `/branding discover` ou `/branding import <url>`."
- **Brain initialized, sem export**: "Marca pronta. Quer gerar deck? Rode `/branding export`."
- **Export existente, brain mudou desde então**: "Brain atualizado depois do último export. Considere `/branding export` para regenerar."

## Princípios

- **Rápido.** Sem network call. Apenas FS.
- **Read-only.** Não modifica nada.
- **Tabela é citável.** Caminhos copiáveis para `cd` ou `cat`.
- **Distingue source vs export.** `brain/` é fonte; `brand/` é derivado.

## Conclusão

Apenas imprime. Sem auto-commit. Sem update de log.
