---
name: onboard
description: Onboarding interativo do Agentic SEO Kit. 3 modos (manual/intermediário/auto), 6 fases (modo+identidade+posicionamento+design+tom+escopo). Sub-agents pesquisam marca existente via agent-browser e consultor de branding propõe identidade quando marca nova. Transforma o kit-template em projeto-inicializado preenchendo o Brain. Roda na primeira clonagem ou quando o usuário pedir "iniciar projeto", "começar do zero", "configurar o kit", "fazer onboarding".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - WebSearch
  - WebFetch
---

# /onboard — v3

Transforma o kit em estado **template** em **initialized**, preenchendo o Brain. Trabalho braçal vai para sub-agents; o usuário só decide o que **só ele sabe** e aprova.

## Pré-checks

1. Leia `.cache/onboard-state.json` se existir (retomada).
2. Verifique `kit_state` em todos os arquivos do brain. Se já é `initialized`, avise: "Brain já inicializado. Refazer vai sobrescrever decisões anteriores. Confirma?"
3. Mostre overview de ~30s: 6 fases (modo + 5 fases substantivas).

---

## Fase 0a — Marca nova ou existente?

**Pergunta** (primeiro contato):

> Qual destes melhor descreve seu projeto?
>
> 1. **Marca pessoal nova** — sou eu, vou criar agora do zero
> 2. **Marca pessoal já existente** — já tenho site/LinkedIn/presença online
> 3. **Empresa/marca nova** — vou fundar
> 4. **Empresa/marca existente** — já tem presença online
> 5. **ONG / não-comercial**
> 6. **Outro** (descreva)

Resposta determina o **caminho da Fase 1-2**:
- Existente (2/4) → sub-agent pesquisador via agent-browser ou WebSearch+WebFetch
- Nova (1/3/5) → sub-agent consultor de branding propõe identidade

## Fase 0b — Modo do onboard

**Pergunta:**

> Como você quer conduzir este onboarding?
>
> 1. **Manual / guiado** — pergunta a pergunta (~18 perguntas, ~15 min). Recomendado para: marca nova sem material existente, gosta de pensar tudo.
> 2. **Intermediário** ⭐ — perguntas em batch por fase (5 inputs grandes). Sub-agents fazem o trabalho braçal. Você valida pontos críticos. Recomendado para: maioria dos casos.
> 3. **Auto / extremo** — sub-agents decidem tudo com base no que pesquisam. Você aprova um diff final único. Recomendado para: marca já existente com presença online forte e protótipo rápido.

**Recomendação automática do agente** (com base em Fase 0a):
- Existente forte (2/4 com site + LinkedIn + posts públicos) → sugere **Auto**
- Existente parcial → sugere **Intermediário**
- Nova → sugere **Intermediário** (consultor de branding propõe, você valida)

> "Recomendo modo **[X]** baseado no que você descreveu. Aceita?"

**Não prossiga sem o usuário escolher um modo explicitamente.**

---

## Fase 1 — Identidade

**Atualiza:** `brain/index.md` + `brain/config.md`

### Modo manual
Pergunte uma a uma:
1. Nome do projeto (com 3 sugestões + opção livre)
2. Sobre você (livre, com sugestão se Fase 0a for "existente" e tiver pesquisa)
3. Domínio:
   > Como você vai começar?
   > 1. Já tenho domínio comprado e quero usar agora
   > 2. Tenho domínio mas vou apontar depois — uso vercel.app primeiro ⭐ recomendado
   > 3. Ainda não tenho domínio — uso vercel.app por enquanto
   > 4. Outro

### Modo intermediário
Apresente as 3 perguntas **em uma única mensagem**, com:
- **Recomendado** ao lado de cada (vindo da pesquisa do sub-agent ou inferência)
- "Para validar, me confirme: aceito todas as recomendações? Ou quer ajustar algum item?"

Exemplo:
> Fase 1 — Identidade. Recomendações com base na minha pesquisa:
>
> 1. **Nome:** "Diego Ivo" (recomendado — é como você se posiciona online)
> 2. **Sobre:** "Diego Ivo, fundador e CEO da Conversion, maior agência de SEO do Brasil. Site pessoal..." (recomendado — extraído do seu LinkedIn)
> 3. **Domínio:** opção 2 — vercel.app primeiro, apontar `diegoivo.com` depois (recomendado)
>
> Aceita as 3? Ou quer ajustar algum?

### Modo auto
Sub-agent pesquisador preenche tudo, agente apresenta resultado já gravado, pergunta só "alguma correção?".

→ Atualiza `brain/index.md` (posicionamento + nome) e `brain/config.md` (domínio definitivo + temporário).

---

## Fase 2 — Posicionamento

**Atualiza:** `brain/index.md` (Posicionamento), `brain/personas.md`, `brain/principios-agentic-seo.md`

### Sub-agent pesquisador (marca existente)

Antes de perguntar, dispare sub-agent que:
1. Tenta `agent-browser` (se instalado): navega site/LinkedIn/About/posts e extrai conteúdo.
2. Fallback: `WebSearch` + `WebFetch` nativos.

Sub-agent retorna proposta consolidada de:
- Posicionamento (1 frase)
- 1-2 personas-alvo (com base em quem comenta, que conteúdo ressoa)
- 3 POVs proprietários (inferidos com baixa confiança — usuário valida)

### Sub-agent consultor de branding (marca nova)

Roda mini-pesquisa de **benchmarks do nicho** (concorrentes, tom de mercado) e propõe:
- Posicionamento que se diferencia do mercado em 1 frase
- Persona-alvo provável
- 3 POVs candidatos (com lista de "como descobrir o seu" — perguntas curtas que extraem opinião)

### Modo manual
3 perguntas:
4. O que torna esta marca única em uma frase? (3 sugestões + livre)
5. Persona principal (5 linhas: cargo, objetivo, dor, fontes, o que precisa de você) — com proposta do sub-agent
6. 3 POVs proprietários (sub-agent propõe, você confirma 1 a 1)

### Modo intermediário
Mostra proposta consolidada do sub-agent. Pergunta:
> "Validei [posicionamento, persona, 3 POVs]. Aceita ou quer ajustar algo? Sub-pergunta opcional: para cada POV, ele realmente conflita com o consenso de mercado, ou é posição que qualquer player também sustentaria?"

### Modo auto
Grava direto, mostra diff, pergunta "alguma correção?".

→ Persiste arquivos. Salva estado fase 2.

---

## Fase 3 — Design system + Brandbook

**Chama** `/design-init` (10 perguntas) com adaptação por modo:

### Modo manual
`/design-init` perguntas uma a uma.

### Modo intermediário
`/design-init` agrupa em 2 batches:
- **Batch A** (DNA da marca): arquétipo, mood (3 adjetivos), 3 referências, 3 antipadrões
- **Batch B** (decisões técnicas): paleta, tipografia, densidade, contraste, motion

Em cada batch, agente traz **recomendado** ao lado de cada item (com base em Fases 0-2).

### Modo auto
`/design-init` decide tudo via consultor de branding + benchmarks. Apresenta `DESIGN.md` + `tokens.json` para aprovar.

### Brandbook visual (oferta)

Após gerar `DESIGN.md` e `DESIGN.tokens.json`:

> "Quer que eu gere um **brandbook visual interativo** no navegador para você testar antes de seguir? (~30s, abre `http://localhost:XXXX/brandbook`)"

Se sim → chama `/brandbook` (cria rota `web/src/app/brandbook/page.tsx`, abre browser).

→ Salva estado fase 3.

---

## Fase 4 — Tom de voz

**Atualiza:** `brain/tom-de-voz.md` (seção "Customizações deste projeto")

### Modo manual
1 pergunta:
7. Calibração — default é PT-BR + voz ativa + capitalização BR + antivícios IA banidos. Quer ajustar?
   1. Mais informal (tu, contrações)
   2. Pode usar humor / ironia
   3. 1ª pessoa do singular permitida
   4. Combinar 1+2+3
   5. Outro
   6. ⭐ Manter o default

### Modo intermediário
Apresenta o default + recomenda manter. Se modo auto na Fase 0, agente decide com base no arquétipo (Fase 3) — "criador" → tolera 1ª pessoa singular; "sábio" → mais distante.

### Modo auto
Decide. Mostra diff.

→ Salva estado fase 4.

---

## Fase 5 — Escopo & tecnologia

**Atualiza:** `brain/tecnologia/index.md` + `brain/config.md`

### Modo manual
2 perguntas:
8. Tipo do projeto:
   1. Institucional (5-15 páginas)
   2. Blog editorial (foco em conteúdo)
   3. Produto (landing + features)
   4. Mistura institucional + blog ⭐ recomendado para marca pessoal
   5. Outro

   Subpergunta automática: "≥100 páginas dinâmicas em 3 meses?" Se sim, sinaliza `/add-cms`.

9. Plataforma de deploy:
   1. **Vercel** ⭐ default — `next/image` otimiza, `next/font` self-host, OG dinâmico
   2. Cloudflare Pages / Netlify / GitHub Pages — host estático, requer ajustes
   3. Outro

### Modo intermediário / auto
Recomenda Vercel + tipo baseado em Fase 0a (institucional para pessoa, mistura para empresa, etc.). Pergunta confirmação ou direto.

→ Atualiza `brain/tecnologia/index.md` + `brain/config.md` (deploy).

→ Salva estado fase 5.

---

## Conclusão

1. Mostra resumo do Brain inteiro (`brain/index.md`, `config.md`, `personas.md`, `principios-agentic-seo.md`, `DESIGN.md` summary, `tom-de-voz.md` customizações, `tecnologia/index.md`).

2. **Oferta de site mínimo viável:**

   > "Onboard completo. Posso já gerar a estrutura padrão do site? Inclui:
   >
   > - Home (hero + 3 serviços + provas + CTA)
   > - 1 página de serviço (template + 1 instância pré-preenchida)
   > - Blog list + 1 post mock
   > - Página 'sobre'
   > - Página de contato com Resend (vou perguntar sobre conta no setup)
   >
   > 1. Sim, vai (modo auto do site)
   > 2. Sim, mas pergunte cada página
   > 3. Não, customizo depois — vou usar /scaffold-page para páginas individuais"

   Se 1/2: chama `/site-criar` com modo equivalente.

3. Apaga `.cache/onboard-state.json`.

4. Sugere commit: `chore: onboarding inicial — kit_state initialized`.

---

## Princípios

### Sempre traga o "recomendado"

Em **qualquer** pergunta de qualquer modo, mostre a opção que o agente escolheria sozinho com ⭐. Não esconda recomendação atrás de "decida você". Recomendação ≠ imposição.

### Modo é decisão explícita

Não prossiga sem usuário escolher modo. Não assuma.

### Trabalho braçal vai pra sub-agents

Quando puder pesquisar, **pesquise**. Quando puder propor, **proponha**. Pergunta direta só para o que **só o usuário sabe** (3 POVs proprietários, antipadrões pessoais).

### Feedback granular sempre

Em cada fase, ao mostrar diff, pergunte 2-3 coisas específicas. Nunca "tá bom?".

### Retomada graceful

`.cache/onboard-state.json` permite pausar e retomar. Ao retomar, mostre fase atual + responde já gravadas + pergunta "continuar de onde parou?".

### Não improvise design existente

Se houver `DESIGN.md` em outro diretório do disco, **ignore**. Brain do projeto é o `brain/DESIGN.md` deste workspace, e ele só existe após `/design-init` rodar nesta sessão.
