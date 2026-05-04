
# /technical-seo

Roda auditoria Lighthouse e devolve scores por categoria + lista priorizada de fixes.

## Quando rodar

- Pós-deploy (preview ou prod).
- Quando `seo-score` está OK mas o usuário relatou site lento.
- Antes de pedir review humano em PR de UI substantivo.
- Periodicamente (semanal) para detectar regressões.

## Estratégia

Sempre tente PageSpeed Insights API primeiro (não exige instalação). Se falhar, faz fallback para Lighthouse local via `npx lighthouse`. O agente gerencia tudo, usuário não precisa instalar nada.

### Caminho 1 — PageSpeed Insights API

**Sem key (rate limit ~1 req/sec):**

```bash
node scripts/technical-seo.mjs <url> --strategy=mobile
```

Funciona pra uso pontual. Pode falhar em rate-limit se rodar várias vezes em sequência.

**Com key (recomendado para uso recorrente):**

Setup uma vez:
```bash
# Criar key gratuita em https://developers.google.com/speed/docs/insights/v5/get-started
echo "PAGESPEED_API_KEY=AIza..." >> .env.local
```

```bash
PAGESPEED_API_KEY=AIza... node scripts/technical-seo.mjs <url> --strategy=mobile
```

### Caminho 2 — Fallback Lighthouse local

Se PageSpeed API falhar (sem internet, rate-limit, URL local), o script tenta:

```bash
npx -y lighthouse <url> --output=json --quiet --chrome-flags="--headless"
```

Lighthouse roda em ~30s. Não precisa instalação prévia (`npx -y` baixa sob demanda).

## Como rodar

```bash
node scripts/technical-seo.mjs https://meusite.com.br
node scripts/technical-seo.mjs https://meusite.com.br --strategy=desktop
node scripts/technical-seo.mjs http://localhost:3000  # após web:dev
```

Sem args, busca a URL canônica em `brain/index.md`.

## Targets

| Categoria | Mínimo | Alvo |
|---|---|---|
| Performance | 95 | 100 |
| SEO | 100 | 100 |
| Accessibility | 95 | 100 |
| Best Practices | 95 | 100 |

Sites SSG simples (este kit) bem feitos batem ≥98 em todas. Se está abaixo, seguir recomendações priorizadas no output.

## Output

`brain/seo/reports/perf-<slug>-<date>.md`:

```markdown
# Lighthouse — meusite.com.br
- Data: 2026-05-02T23:45:00Z
- Strategy: mobile
- Source: PageSpeed API (ou Lighthouse local)

## Scores
- Performance: 87 ⚠️ (alvo 95+)
- SEO: 100 ✅
- Accessibility: 92 ⚠️
- Best Practices: 96 ✅

## Recomendações priorizadas

### Performance — 8 pontos para subir
1. **LCP 3.4s** (alvo <2.5s) — `priority` na imagem hero
2. **Render-blocking 230ms** — Google Fonts via `<link>` → migrar para next/font
3. **Imagens 240KB** → AVIF reduz para 80KB

### Accessibility — 3 pontos para subir
1. Contraste insuficiente em `.text-muted` (3.8:1, alvo 4.5:1)
2. `<button>` sem texto acessível (linha 42, footer.tsx)
```

## Quando reportar abaixo do target

Não tente "consertar tudo automaticamente". Apresente o relatório, destaque os 3-5 itens de maior impacto, e pergunte ao usuário quais quer atacar primeiro.

## Princípio de feedback granular

Não diga "Lighthouse rodou, score 87". Aponte o que mais dói:

> "Lighthouse mobile: Performance **87/100** (alvo 95).
>
> 3 fixes mais impactantes:
> 1. **LCP 3.4s** — a foto do hero está 240KB. Trocar por AVIF (~80KB) deve subir pra ~2.1s e ganhar 6 pontos.
> 2. **Google Fonts via `<link>`** — está render-blocking 230ms. Migrar pra `next/font` ganha mais 3-4 pontos e elimina CLS.
> 3. SEO **100** ✅, Best Practices **96** ✅ — não toca.
>
> Quer que eu aplique os 2 primeiros? Faço em commit único."
