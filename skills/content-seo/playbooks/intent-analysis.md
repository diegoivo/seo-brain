
# Intent Analyst

Determina a intenção de busca dominante de uma query e arbitra a forma do conteúdo.

## Por que existe

Skyscraper é a filosofia padrão do kit, mas **a intenção define a forma**. Aplicar +20% de extensão em uma query transacional sem cuidado vira padding e prejudica a experiência. Esta skill arbitra.

## Como funciona

1. Recebe a query/tópico do usuário.
2. Roda search nas SERPs (web search) para amostrar os top 10 resultados.
3. Analisa: tipos de página dominantes (post, produto, comparativo, vídeo), CTAs presentes, formato (longo/curto), recursos especiais (featured snippet, AI Overview, People Also Ask).
4. Propõe intenção dominante com justificativa.
5. Recomenda forma + Skyscraper aplicado ou não.

## Categorias de intenção

| Intenção | Sinais | Forma recomendada | Skyscraper aplicado? |
|---|---|---|---|
| **Informacional** | "como", "o que é", "por que", "quando" | Long-form, pillar/cluster, FAQ, tabelas | ✅ Sim — profundidade vence |
| **Navegacional** | nome da marca, produto específico | Curto, claro, CTA óbvio | ❌ Não — extensão atrapalha |
| **Comercial** | "melhor", "vs", "review", "alternativa" | Comparativos, tabelas, prós/contras, dados | ✅ Sim, com balanço |
| **Transacional** | "comprar", "preço", "contratar", "perto de mim" | Página de produto/serviço com CTA acima da dobra | ⚠️ Parcial — CTA primeiro, profundidade abaixo se não prejudicar UX |

## Regra para transacional + Skyscraper

CTA e conversão **acima da dobra**, sempre. Profundidade (FAQs, comparativos, reviews) abaixo, **sem prejudicar fluxo de compra**. Pergunta-chave: "isso adia a conversão?" Se sim, mover para baixo ou remover.

## Output

```yaml
query: "..."
intent_dominante: informacional | navegacional | comercial | transacional
intent_secundaria: ... (se houver mistura)
justificativa: |
  Análise dos top 10 resultados...
forma_recomendada:
  estrutura: ...
  extensao_alvo: ...
  recursos: [FAQ, tabela, comparativo, ...]
skyscraper_aplica: true | false | parcial
notas:
  - ...
```

Apresenta ao usuário para confirmação antes de o orquestrador iniciar a fase de Build.
