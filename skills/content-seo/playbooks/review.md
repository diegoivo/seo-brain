# Playbook: content-seo review (sub-agent QA editorial)

Especialista em copy. Não toca em design ou build. Lê copy de páginas/posts alteradas, compara contra:
- `brain/tom-de-voz.md` (voz, antivícios, capitalização BR).
- `brain/povs/` (POVs proprietários — frontmatter `proprietary_claims[]` deve referenciar).
- `brain/personas/` (linguagem da persona-alvo).

## Checks (priorizados)

### P0 (bloqueante)

- Heading com capitalização title-case ("Como Otimizar SEO Para Google") — viola capitalização BR.
- Frontmatter sem `proprietary_claims[]` em conteúdo informacional/comercial.
- POVs do frontmatter são consenso de mercado (não proprietários).
- Antivícios IA detectados no body: "vale destacar", "é importante ressaltar", "no cenário atual", "navegando pelas águas", "desbloqueando", "elevando ao próximo nível", "delve", "crucial", "robust", "comprehensive", "tapestry", etc.
- Conteúdo informacional sem TL;DR ou sem FAQs (perde citabilidade GEO).

### P1 (atenção)

- Frase com mais de 25 palavras (voz ativa, frase curta — regra do brain).
- Parágrafo com mais de 4 frases.
- Voz passiva onde ativa serve (diff sutil — apontar, não bloquear).
- Falta de internal links (consultou `content/posts/index.md` / `content/site/index.md`?).
- FAQs presentes mas sem schema `FAQPage` no JSON-LD.
- `Person` schema ausente em conteúdo assinado (autoria GEO).

### P2 (polimento)

- Eyebrow genérico ("Artigo", "Post") em vez de categoria editorial.
- TL;DR em mais de 3 frases (perde citabilidade — recortar para 2-3).
- FAQ resposta longa (> 3 frases — encurtar pra ser citável).

## Inputs

- Diff dos arquivos modificados (`.md`, `.tsx` com copy).
- `content/posts/<slug>.md` ou `content/site/<page>.md` — frontmatter + body.
- `brain/tom-de-voz.md` — lista canônica de antivícios.
- `brain/povs/` — POVs disponíveis para checagem.

## Processo

1. `git diff --name-only -- content/ web/src/app/` — arquivos com copy alterada.
2. Para cada arquivo:
   - Parse frontmatter. Cheque `proprietary_claims[]`.
   - Headings (regex `^#{1,6} `): capitalização BR.
   - Body: regex contra lista de antivícios IA.
   - Métricas: contagem de palavras por frase (split em `.!?`), frases por parágrafo.
3. Roda `node scripts/article-quality.mjs <path>` se for post (LLM é ruim para contar — script conta).

## Output

`.cache/qa-runs/<task>-content.md`:

```markdown
# QA content — <task>

## P0 (bloqueio)
- [arquivo:linha] descrição

## P1 (atenção)
- [arquivo:linha] descrição

## P2 (polimento)
- [arquivo:linha] descrição

## Veredicto
APROVADO / APROVADO COM RESSALVAS / BLOQUEADO

## Métricas observadas
- Capitalização BR: [N headings ok / M headings violando]
- Antivícios IA: [N ocorrências]
- POVs no frontmatter: [proprietários / consenso / ausentes]
- TL;DR: [presente / ausente]
- FAQs: [N / schema FAQPage: sim/não]
```

## Princípios

- **Curto.** Lê em 1 minuto.
- **Cite linha.** `[file:line]` para cada item.
- **P0 trava.** Capitalização errada e POVs ausentes/consenso bloqueiam — não negociar.
- **Não corrige.** Reporta. Quem corrige é orquestrador-pai (idealmente humano, copy é sensível).
