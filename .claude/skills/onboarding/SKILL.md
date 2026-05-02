---
name: onboarding
description: Preenche wiki + site-config + POVs iniciais interativamente. Primeira skill a rodar em qualquer kit recém-clonado. Triggers em "/onboarding", "começar", "setup inicial", "preencher a wiki". Recusa avançar com inputs vagos.
---

# Skill `onboarding` — preenchedor inicial

> Esta skill é a **primeira ação** do agente quando `wiki/index.md` ainda tem
> a seção "Sobre a empresa" em branco / com placeholders.

## Pré-condições

- Repositório clonado.
- `wiki/index.md`, `wiki/conteudo/pov-da-marca.md`, `lib/site-config.ts` existem.
- Agent consegue fazer perguntas interativas (Claude Code, Cursor, Antigravity).
  Em hosts não-interativos (CI), usa o fallback do passo 6.

## Passos

### 1. Detecte se já foi feito

Leia `wiki/index.md`. Se a seção "Sobre a empresa" não tem placeholders
`<...>` nem 🟡, **pare** e reporte:

> "Onboarding já foi executado. Para reconfigurar, edite manualmente
> `wiki/index.md` e rode `/onboarding` de novo, ou use `/wiki` para ajustes
> pontuais."

### 2. Apresente o que vai acontecer

```
Vou te fazer 8 perguntas curtas. Suas respostas vão preencher:
- wiki/index.md → seção "Sobre a empresa"
- wiki/conteudo/pov-da-marca.md → 3 POVs iniciais
- lib/site-config.ts → nome do site, descrição, URL, autor
- app/page.tsx → hero title e lead

Tempo estimado: 5-10 minutos. Você pode pular qualquer pergunta com "skip"
e preencher depois manualmente.
```

### 3. Faça as perguntas (uma por vez, validando cada)

Use `AskUserQuestion` (Claude Code) ou prompt direto. Valide cada resposta:

| # | Pergunta | Validação |
|---|---|---|
| 1 | Nome da empresa ou marca? | ≥2 chars, não vazio |
| 2 | Setor específico? (ex: "fintech para PMEs", não "tecnologia") | ≥10 chars, contém qualificador |
| 3 | ICP em 1-2 frases — quem é o cliente ideal? | ≥30 chars, contém pessoa+contexto |
| 4 | Oferta principal em 1 frase — o que vende? | ≥20 chars |
| 5 | Diferencial competitivo em 1 frase — o que faz diferente? | ≥30 chars, contém comparação implícita |
| 6 | URL principal? | regex `^https?://` |
| 7 | Autor principal dos posts (nome + credencial)? | "Nome — credencial" |
| 8 | Tom de marca (2-3 adjetivos)? | 2-3 palavras separadas por vírgula |

Se input falha validação, mostre exemplos (com `[[wiki/exemplos/]]`) e
re-pergunte.

### 4. Pergunte os 3 POVs iniciais

```
Agora vou pedir 3 POVs proprietários. POV é uma posição que SUA marca defende
e que o concorrente médio NÃO defende.

Para cada POV preciso de:
- Posição em 1 frase declarativa.
- Por quê (1-2 frases com evidência).
- Quem discordaria.

Veja wiki/exemplos/generico-fintech-b2b.md para inspiração de formato.
```

Faça 1 POV por vez. Para cada, valide:
- Posição é declarativa (verbo no presente, não pergunta).
- Tem ≥1 evidência citável.
- Tem alguém que discordaria nominado (player, escola de pensamento).

Se POV é vago ("acreditamos em qualidade"), recuse e re-pergunte com exemplo
do que torna POV específico.

### 5. Escreva os arquivos (em paralelo via Agent tool, conforme spec-driven)

Esta skill **escreve em código** (lib/site-config.ts, app/page.tsx). Logo,
segue o protocolo em [`wiki/tecnologia/spec-driven.md`](../../../wiki/tecnologia/spec-driven.md).

**Spec mínima** (escreve em `docs/specs/onboarding-fill.md`):

```markdown
## Objetivo
Preencher wiki + site-config + page.tsx com dados da marca informados pelo usuário.

## ACs
- [ ] AC-1: home renderiza H1 com nome da empresa do usuário
- [ ] AC-2: <title> da home contém nome da empresa
- [ ] AC-3: meta description corresponde à descrição informada
- [ ] AC-4: wiki/index.md "Sobre a empresa" não tem mais placeholders
- [ ] AC-5: wiki/conteudo/pov-da-marca.md tem POV 1, 2, 3 preenchidos
```

**Workers paralelos** (1 mensagem, 4 Agent tool calls):

- Worker A: atualiza `lib/site-config.ts` (name, description, url, author).
- Worker B: atualiza `wiki/index.md` (seção Sobre a empresa).
- Worker C: atualiza `wiki/conteudo/pov-da-marca.md` (POV 1, 2, 3).
- Worker D: atualiza `app/page.tsx` (hero title + lead).

Cada worker recebe diff exato esperado. Não inventa.

### 6. Fallback não-interativo (CI / host sem AskUserQuestion)

Se o host não suporta perguntas interativas, escreve `SETUP.md` na raiz com
o template das 8 perguntas + 3 POVs, e instrui:

```
Não consigo fazer perguntas interativas neste host. Preencha SETUP.md
manualmente e rode /onboarding novamente — vou ler dele.
```

Quando rodar de novo, lê `SETUP.md`, valida campos, executa passo 5.

### 7. Validação final (QA spec-driven)

Após workers retornarem:

1. Roda `npm run build` — deve passar.
2. Roda `npm run test:browser -- tests/onboarding-fill.spec.ts` — todos ACs verdes.
3. Invoca QA sub-agent independente conforme `wiki/tecnologia/spec-driven.md`.

Se algum AC falha, volta para passo 5 e corrige.

### 8. Reporte e instrua próximo passo

```
✅ Onboarding completo.

Marca: <nome>
Setor: <setor>
URL: <url>
POVs: 3 preenchidos

Arquivos atualizados:
- wiki/index.md
- wiki/conteudo/pov-da-marca.md
- lib/site-config.ts
- app/page.tsx

Próximos passos sugeridos:
1. Refine os POVs em wiki/conteudo/pov-da-marca.md (adicione evidência mais forte)
2. Adicione mais princípios em wiki/conteudo/principios.md (são 14 seed; mire 20)
3. Rode /design <vibe> para gerar a identidade visual
```

## Iron laws

1. **Não invente** dados da marca. Se o usuário pula uma pergunta, deixa
   placeholder visível e segue.
2. **Não escreve POVs por conta própria**. Se o usuário não consegue
   articular 3, encerra com:
   > "Volte quando tiver 3 POVs. Sem isso, a skill `conteudo` vai recusar
   > escrever, e o site fica indistinguível dos concorrentes."
3. **Segue spec-driven**. Sem spec + tests, não escreve em código.
4. **Não toca em** `wiki/conteudo/principios.md`, `voz-pt-br.md`,
   `jargao-banido.md`, `glossario.md`. Esses são fonte de verdade do método,
   não da marca específica.
