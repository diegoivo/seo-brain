
# SEO Técnico

Audita um site (URL pública preferencial) ou um build local e devolve relatório com score 0-100 + itens reprovados priorizados.

## Quando rodar

- Pós-deploy a produção (smoke check de SEO).
- Antes de uma campanha ou migração.
- Quando o usuário pedir "rodar SEO" sem contexto extra.

## Como rodar

```bash
node scripts/seo-score.mjs <url-de-producao>
# ou para build local:
node scripts/seo-score.mjs ./web/.next --mode=local
# forçar profile específico:
node scripts/seo-score.mjs <url> --profile=home|page|post|landing
```

### Profiles (auto-detect via path)

O score ajusta os checks ao **tipo de página**, evitando penalizar sem motivo:

| Profile | Auto-detect | Checa TL;DR | Checa FAQ | Checa Article schema | Checa Breadcrumb |
|---|---|---|---|---|---|
| `home` | `/` ou `/index.html` | ❌ | ❌ | ❌ | ❌ |
| `page` | `/sobre`, `/contato`, `/equipe`, etc. | ❌ | ❌ | ❌ | ✅ |
| `post` | `/blog/...` ou `/posts/...` | ✅ | ✅ | ✅ | ✅ |
| `landing` | `/servicos/...`, `/produtos/...` | ❌ | ✅ | ❌ | ✅ |

Por exemplo: `/contato` não é penalizado por não ter TL;DR (irrelevante). Só posts são auditados com critérios editoriais completos.

Para CWV reais, exporte `PAGESPEED_API_KEY` (Google PageSpeed API). Sem a key, CWV é skipped (não penaliza score).

## Critérios consolidados (do checklist definitivo + 46 itens)

**URL & estrutura**
- URL curta, amigável, com keyword principal mais à esquerda possível
- Cabeçalhos em hierarquia: 1 H1 único, H2/H3 sem pulos, escaneáveis
- Breadcrumbs (com schema BreadcrumbList)
- Internal linking estratégico (≥3 links contextuais, anchor descritivo)

**Indexabilidade**
- robots.txt válido e otimizado
- sitemap.xml atualizado e submetido
- canonical único e auto-referente
- HTTPS + HSTS
- Redirecionamentos 301 corretos
- HREFLANG (se i18n)

**Performance & CWV**
- LCP <2.5s, INP <200ms, CLS <0.1, TTFB <800ms
- AMP é opcional; responsividade é obrigatória

**Schema & rich snippets**
- JSON-LD válido (Article/BlogPosting/Product/Service/HowTo conforme tipo)
- BreadcrumbList, FAQPage, Person (autoria), Organization (sameAs)
- Snippets otimizados (titles e descriptions com CTR alto)

**Imagens**
- Logos e vetores em SVG
- Fotografias em JPEG/WebP
- Ilustrações em SVG ou PNG
- Peso ≤100kb (Squoosh)
- Lazy loading
- ALT descritivo (não keyword stuffing)
- Nomes de arquivo descritivos (`com-hifens.jpg`)

**Conteúdo & estratégia**
- Conteúdo original, valioso, atualizado
- Keyword principal no primeiro parágrafo (natural)
- LSI keywords ao longo do texto
- Listas e tabelas onde fizer sentido
- Vídeos com keywords no título
- Flesch PT-BR ≥50 (Martins/Ghiraldelo)

**Monitoramento & governança**
- GSC monitorando erros
- Analytics configurado e KPIs definidos
- Monitoramento de penalidades
- Conteúdos atualizados periodicamente
- Análise A/B de títulos e meta descriptions

## Output

`brain/seo/reports/<slug>-<date>.{json,md}` com:
- Score total (0-100)
- Breakdown por categoria
- Itens reprovados priorizados
- Próximos passos

**Nunca bloqueia.** Score abaixo de 80 emite alerta; decisão de publicar é do usuário.
