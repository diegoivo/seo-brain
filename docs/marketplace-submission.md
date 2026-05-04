# Marketplace Submission Checklist

Plugin SEO Brain v0.1.0 — 8 canais de distribuição priorizados.

## Day 0 (pré-tag)

- [ ] `gh repo edit diegoivo/seo-brain --add-topic seo-brain --add-topic claude-code --add-topic agent-skills --add-topic seo-tools --add-topic geo --add-topic agentic-seo --add-topic portuguese-seo --add-topic seo-audit --add-topic e-e-a-t --add-topic schema-markup --add-topic content-marketing --add-topic dataforseo --add-topic ai-search --add-topic aeo --add-topic llm-seo --add-topic semantic-seo --add-topic claude-skills --add-topic marketing-automation`
- [ ] README.md com badges + GIF de `/seo-brain:start` acima da dobra.
- [ ] README com tabela "Why SEO Brain vs claude-seo / superseo-skills / searchfit-seo".
- [ ] License MIT (já está).

## Day 1

### awesome-claude-skills (22k stars, maior funil community)

```
git clone https://github.com/travisvn/awesome-claude-skills
# Editar README.md adicionando entry na seção SEO/Marketing
git checkout -b add-seo-brain
git commit -m "Add SEO Brain — Brazilian Portuguese SEO + GEO toolkit"
git push origin add-seo-brain
gh pr create --title "Add SEO Brain — Brazilian Portuguese SEO + GEO toolkit" --body-file PR_BODY.md
```

PR body deve incluir:
- 1-line value prop
- Install one-liner
- 3-5 keywords/tags
- Link pra repo

### claudemarketplaces.com (120k visitors/mês)

- Site não documenta processo de submission. Tentar issue/contact form.
- Backup: tweet @claudemarketplaces com link.

## Day 2

### mcpmarket.com/tools/skills

- Form em mcpmarket.com (provável account creation).
- Categorias: SEO, Content, Marketing.

### claudeskills.info

- Idem (form-based).

## Day 3

### awesome-claude-plugins (n8n-tracked)

- PR em github.com/awesome-claude-plugins (verificar URL exato).

### claude-seo.md/skills (nicho aggregator)

- Listing manual via form ou PR.

## Pós-validação externa (≥50⭐ ou eval externo)

### anthropic/claude-plugins-official

- Critério alto: oficial directory, requer review.
- PR em github.com/anthropics/claude-plugins-official.
- Apresentar metrics: stars, evals, casos de uso.

## Tracking

Documento markdown `docs/marketplace-status.md` (pós day 1):

```
| Marketplace | Submitted | Status | URL |
|---|---|---|---|
| awesome-claude-skills | 2026-05-XX | merged | ... |
| claudemarketplaces.com | 2026-05-XX | pending | ... |
```

## Anti-patterns a evitar

- ❌ Submeter pra todos no mesmo dia (parece spam).
- ❌ Description genérica em cada submissão. Customize por marketplace.
- ❌ Esquecer de testar `/plugin install` em Claude Code limpo antes de submeter.
- ❌ Apresentar métricas que não tem (não invente "production-tested" sem usar).
