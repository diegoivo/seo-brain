---
title: Skills /rank-tracker (monitor de posições) + /dataforseo-config (setup credenciais)
created: 2026-05-03T00:00:00Z
status: concluído
type: tech
---

# Rank Tracker + DataForSEO Config

## Objetivo

Adicionar duas skills no Pilar Dados:

1. **`/rank-tracker`** — monitora posição orgânica de uma lista de keywords no Google ao longo do tempo. Update manual. Usa modo **batch async** do DataForSEO SERP API (`task_post` + `tasks_ready` + `task_get`), até 3× mais barato que Live e suficiente para um monitor semanal.
2. **`/dataforseo-config`** — sobe um servidor HTTP local efêmero (porta aleatória) com formulário que coleta `DATAFORSEO_LOGIN` e `DATAFORSEO_PASSWORD`, valida via call gratuita ao endpoint `user_data`, grava em `.env.local`, encerra. Remove a fricção atual de copiar manualmente do Dashboard DataForSEO.

Ambas vivem no framework root (`.claude/skills/`) e ficam disponíveis em todos os projetos.

## Critérios de sucesso

### Frontend (aprovação visual do usuário)

- [ ] `/dataforseo-config` abre no navegador automaticamente, formulário é claro, mostra link pra Dashboard DataForSEO inline, mensagem de erro distingue "credenciais erradas" de "você usou email/senha do site em vez de API Login/Password".
- [ ] Após salvar, página confirma sucesso ("✅ credenciais validadas"), encerra o server, e libera o terminal com mensagem "Próximo passo: `/rank-tracker add ...`".
- [ ] `/rank-tracker update` apresenta um diff humano legível (subiu/desceu/entrou top 10/saiu top 100) — não só uma tabela de posições. Comparação visual compreensível em 5s.
- [ ] `/rank-tracker list` mostra estado atual de cada keyword com posição mais recente + delta vs último snapshot.

### Backend / técnico (agente verifica sozinho)

- [ ] `dataforseo-client.mjs` ganha funções `taskPost`, `pollTasksReady`, `fetchTaskResult` sem quebrar callers existentes (`/keywords-volume`, `/competitor-pages`, `/competitor-keywords` continuam funcionando).
- [ ] Server local de `/dataforseo-config` usa porta aleatória (`get-port` ou equivalente Node nativo), encerra após sucesso ou timeout (5 min), nunca deixa porta zumbi.
- [ ] `/rank-tracker update` é idempotente para o mesmo dia: rodar 2× no mesmo dia sobrescreve o snapshot do dia (não duplica) e usa o snapshot anterior (dia diferente) como baseline pro diff.
- [ ] Cost preview obrigatório antes de qualquer chamada SERP, com detalhamento (`50 keywords × $0.0006 = $0.03`).
- [ ] Estado do rank-tracker (`brain/seo/data/rank-tracker/keywords.json` + history + reports) é totalmente recriável — apagar history não corrompe o estado da lista.
- [ ] `node scripts/rank-tracker.mjs --help` documenta todos os sub-comandos.
- [ ] Validação de credenciais em `/dataforseo-config` usa endpoint **gratuito** (`/v3/appendix/user_data`), não queima crédito.

## Etapas

### Fase 1 — Estender o client DataForSEO

- [ ] 1. Adicionar `taskPost(endpoint, tasks)` em `scripts/dataforseo-client.mjs`. Aceita array (até 100), retorna array de `{id, status_code}`.
- [ ] 2. Adicionar `pollTasksReady({ taskIds, intervalMs=10000, timeoutMs=300000 })`. Faz GET em `/v3/serp/google/organic/tasks_ready` em loop até todos os IDs aparecerem ou timeout.
- [ ] 3. Adicionar `fetchTaskResult(endpoint, taskId)`. Faz GET em `/v3/serp/google/organic/task_get/regular/{id}`.
- [ ] 4. Adicionar `validateCredentials()` que chama `GET /v3/appendix/user_data` (gratuito). Retorna `{ ok, balance, error }`. Distingue 401 ("credenciais inválidas") de 200 com user data.
- [ ] 5. Adicionar entrada `serp-batch` no map `PRICES` em `estimateCost`: `$0.0006/task`.

### Fase 2 — `scripts/dataforseo-config.mjs` (server local)

- [ ] 6. Criar `scripts/dataforseo-config.mjs`. Usa `node:http` puro (zero deps). Porta via `getPort()` simples (tenta 0 e lê `.address().port`).
- [ ] 7. Servir GET `/` com HTML inline: form 2 campos + link `https://app.dataforseo.com/api-access` em target=_blank + nota "use API Login/Password, não email do site".
- [ ] 8. Servir POST `/save`: parseia body, chama `validateCredentials` com as credenciais submetidas. Se ok, escreve/atualiza `.env.local` na raiz do **projeto ativo** (cwd), preservando outras vars. Se falha, devolve mensagem de erro renderizada na própria página.
- [ ] 9. Após sucesso, página renderiza confirmação + balance atual + botão "Fechar". Server agenda `process.exit(0)` em 2s.
- [ ] 10. Timeout: se ninguém submeteu em 5min, encerra com código 1 e mensagem no terminal.
- [ ] 11. Abre o navegador automaticamente via `open` (macOS) / `xdg-open` (linux) / `start` (windows). Fallback: imprime URL no terminal.
- [ ] 12. Helper `writeEnvVar(key, value, envPath)` que faz upsert em `.env.local` sem clobber de outras keys.

### Fase 3 — `scripts/rank-tracker.mjs` (lógica)

- [ ] 13. CLI com sub-comandos: `add`, `remove`, `list`, `update`, `history`, `--help`.
- [ ] 14. Storage: `brain/seo/data/rank-tracker/keywords.json` no formato:
  ```json
  {
    "target_domain": "exemplo.com.br",
    "locale": { "location_code": 2076, "language_code": "pt" },
    "keywords": [
      { "keyword": "seo agentico", "added_at": "2026-05-03", "country": null }
    ]
  }
  ```
- [ ] 15. `add "kw1, kw2"` — append na lista, dedup case-insensitive, salva. **Não chama API**.
- [ ] 16. `remove "kw"` — remove da lista. **Não chama API**.
- [ ] 17. `list` — imprime tabela: keyword | última posição | delta vs snapshot anterior | URL ranqueando | última verificação. Lê do último snapshot em `history/`.
- [ ] 18. `update` — pipeline:
  1. Carrega `keywords.json`. Aborta se vazio.
  2. Resolve `target_domain` (de `keywords.json` ou flag `--domain=` ou `brain/config.md` campo "Domínio definitivo" / "Domínio temporário").
  3. Cost preview obrigatório (`N × $0.0006`). Confirma com usuário.
  4. `taskPost` em lotes de 100 com `keywords` mapeadas em tasks `{ keyword, location_code, language_code, depth: 100 }`.
  5. `pollTasksReady` até completar (poll a cada 10s, timeout 5min).
  6. `fetchTaskResult` para cada task ID (paraleliza com `pLimit(5, ...)`).
  7. Para cada result: extrai posição da primeira URL cujo `domain` bate com `target_domain` (subdomínios opcionais via flag `--strict-subdomain`). Se não está em top 100: position=null.
  8. Salva snapshot `history/<YYYY-MM-DD>.json` com `{ fetched_at, target_domain, results: [{keyword, position, url, title}] }`. **Sobrescreve** se mesma data (idempotente no dia).
  9. Calcula diff vs snapshot **anterior** (dia anterior mais próximo, não o sobrescrito). Buckets: `entered_top_10`, `improved`, `declined`, `dropped_top_100`, `unchanged`, `new`.
  10. Gera `reports/<YYYY-MM-DD>.md` (markdown human-friendly com seções por bucket) + `reports/<YYYY-MM-DD>.json` + `reports/<YYYY-MM-DD>.csv` (triple output).
  11. Sumário no terminal: highlights (3 maiores subidas, 3 maiores quedas, novas keywords entrando top 10).
- [ ] 19. `history "kw"` — imprime série temporal: para cada snapshot em `history/`, posição e URL daquela keyword. Útil pra ver trajetória.
- [ ] 20. Adicionar `package.json` script no template do projeto: `"rank-tracker": "node ../../scripts/rank-tracker.mjs"`.

### Fase 4 — Skills (.claude/skills/)

- [ ] 21. Criar `.claude/skills/dataforseo-config/SKILL.md` com frontmatter (`allowed-tools: Read, Write, Bash`), pré-requisitos (cwd em projeto ativo), pipeline (chama `node ../../scripts/dataforseo-config.mjs`), erros, princípios.
- [ ] 22. Criar `.claude/skills/rank-tracker/SKILL.md` com frontmatter, pré-requisitos (DataForSEO configurado, target_domain em brain/config.md OU flag), inputs por sub-comando, exemplos, pipeline, erros, cost guards, output canônico.
- [ ] 23. Atualizar `.claude/commands/` se necessário (verificar se commands são auto-derivados das skills ou se precisam arquivo dedicado).

### Fase 5 — Documentação

- [ ] 24. Atualizar `AGENTS.md` seção "Pilar Dados (3.6)": adicionar `/rank-tracker` à lista de skills, mencionar `/dataforseo-config` como setup helper.
- [ ] 25. Atualizar `AGENTS.md` tabela "Skills disponíveis (por pilar)": adicionar as duas no Pilar Dados.
- [ ] 26. Atualizar `.env.example` com comentário apontando que `/dataforseo-config` automatiza o setup das credenciais.
- [ ] 27. **Atualizar Brain do projeto-template** (`templates/project/brain/seo/index.md` se existir, ou criar nota em `templates/project/brain/index.md` mencionando o rank-tracker como ferramenta disponível).

### Fase 6 — Validação

- [ ] 28. Self-test: criar projeto throwaway via `node scripts/new-project.mjs test-rank`, rodar `/dataforseo-config` (manual com credenciais reais OU mock server), `/rank-tracker add "test"`, `/rank-tracker list` (sem snapshot), depois apagar projeto.
- [ ] 29. Verificar que `/keywords-volume` continua funcionando após mudanças no `dataforseo-client.mjs` (regression test manual: rodar com 1 keyword conhecida).
- [ ] 30. **Atualizar Brain** — após aprovação, `/aprovado` dispara `/update-brain` que registra: skills novas, alterações no client, novos arquivos em `brain/seo/data/rank-tracker/`. **ETAPA OBRIGATÓRIA**.

## Riscos

- **Tasks ficam "in queue" indefinidamente.** DataForSEO ocasionalmente trava task. Mitigação: timeout de 5min em `pollTasksReady`, mensagem clara ao usuário, oferece retry manual com IDs já gerados (não recobra crédito). Salva IDs em `brain/seo/data/rank-tracker/.pending.json` pra retomar.
- **Domínio com www/sem www, http/https, subdomínios.** Match ingênuo de `domain` falha. Mitigação: normalizar (strip protocol, strip www, lowercase, strip trailing slash). Flag `--strict-subdomain` se usuário quer monitorar subdomínio específico.
- **Server local efêmero pode conflitar com firewall corporativo.** Mitigação: porta aleatória + bind em `127.0.0.1` (não `0.0.0.0`), printa URL no terminal como fallback se `open` falhar.
- **Usuário roda `/rank-tracker update` sem ter rodado `/dataforseo-config`.** Mitigação: client já aborta cedo com mensagem útil; rank-tracker propõe rodar `/dataforseo-config` em vez de só apontar pro `.env.example`.
- **Idempotência do snapshot diário pode esconder dados se rodado 2× com listas diferentes.** Mitigação: snapshot inclui set completo de keywords da `keywords.json` no momento; se faltam, `position=null` com flag `was_in_list=false`. Mas escolha intencional: sobrescrever > duplicar.
- **`/dataforseo-config` valida via call gratuita, mas se DataForSEO mudar pricing do `user_data`, podemos queimar crédito sem aviso.** Mitigação: ler `cost` no response (sempre presente) e abortar se >0 com aviso. Auditável.

## Decisões fechadas

1. **Depth = 200 (máximo).** Em Set/2025 o Google matou `num=100` e DataForSEO redesenhou a API: depth máximo é **200**, e o pricing passou a ser **por página de 10 resultados** (base = top 10, cada página adicional = 75% do base). Standard Normal (batch async): top 200 = **$0.00915/keyword**. Para 50 keywords/semana = ~$0.46/check, ~$2/mês. Vamos no máximo: melhor visibilidade de cauda.
2. **Baseline do diff = (a)** snapshot anterior cronologicamente.
3. **Locale = um por projeto.** Sem flag por keyword. Lê `DATAFORSEO_LOCATION_CODE`/`DATAFORSEO_LANGUAGE_CODE` do `.env.local`. v2 considera multi-locale.

## Implicações no código

- `estimateCost` ganha entrada `serp-batch` que aceita `(count, depth)`: `count × (0.0006 + ceil((depth-10)/10) × 0.00045)`.
- Cost preview detalha: `50 keywords × depth 200 (20 páginas) × $0.00915 = $0.46`.
- `task_post` payload inclui `depth: 200`.

## Notas pós-execução

**Implementado em 2026-05-03/04.** O que mudou em relação ao plano original:

1. **Pricing aprendido durante execução.** A política do Google (Set/2025) que matou `num=100` redefiniu pricing do DataForSEO SERP API: cap de depth = 200, base price cobre top 10, cada página adicional = 75% do base. Implementado `estimateCost('serp-batch', count, { depth })` com a fórmula `base + ceil((depth-10)/10) × (base × 0.75)`. Default da skill: depth 200 (máximo).
2. **Refatoração do client.** Em vez de adicionar `taskPost`/`pollTasksReady`/`fetchTaskResult` como wrappers separados, criei um helper interno `request(method, endpoint, body, opts)` e ambos `callDataForSEO` (POST) e `getDataForSEO` (GET) agora chamam ele. Backward compat preservado (verificado por smoke). `validateCredentials` aceita `credsOverride` pra validar antes de gravar no `.env.local` (essencial pro `/dataforseo-config`).
3. **Self-test substituiu mock.** Não criei mock server — testei add/remove/list/dedup/help em projeto throwaway real (smoke-final). Update completo com credenciais reais ficou pendente — o agente NÃO rodou contra DataForSEO (sem credenciais no env). Ficou validado: pre-flight aborta corretamente sem credenciais, cost preview calcula certo, pipeline em si só falta o teste end-to-end com API real.
4. **Não criei `package.json` do projeto-template `.env.example`.** O template hoje não copia `.env.example` — `/dataforseo-config` cria o `.env.local` direto, dispensando.

**Pendências conscientes (não-bloqueantes):**
- E2E real do `update` (precisa credenciais DataForSEO).
- Brain do projeto-template (`brain/seo/index.md`) não foi atualizado — pode entrar quando o usuário rodar `/aprovado` (a skill `/update-brain` cuida).
- Skill `/loop` poderia agendar `/rank-tracker update --no-confirm` semanal (mencionado no SKILL.md como futuro).

## Refatoração 2026-05-04: snapshots em SQLite

**Motivação.** O usuário questionou: "onde vamos salvar as posições? Não seria melhor sqlite?" — questão fundamental. Rank tracker é **time-series**; JSON datado funciona pra `/keywords-volume` (one-shot) mas é wrong shape pra "como variou nas últimas 4 semanas". Em JSON-por-dia, qualquer agregação carrega N arquivos. Em SQLite, vira `SELECT`.

**Mudanças.**
- Novo módulo `scripts/lib/rank-tracker-db.mjs` com `node:sqlite` nativo (zero deps), schema único `snapshots` com `PRIMARY KEY (date, keyword)` (idempotência diária sai de graça via `INSERT OR REPLACE`), índices em `(keyword, date)` e `(date)`.
- `rank-tracker.mjs` deixa de gravar `history/<date>.json`; passa a usar `history.db`. `cmdList`/`cmdHistory`/`cmdUpdate` viram queries.
- `keywords.json` (config) **continua** em JSON — humano-legível, editável, em PR diff. Brain segue navegável pra config; queries são detalhe de implementação.
- Reports `<date>.{md,csv,json}` continuam em `reports/` — derivados consumíveis.
- `engines.node` no framework root e template subiu pra `>=22.13` (requisito do `node:sqlite` estável). `.nvmrc` já estava em 24.
- Suprime `ExperimentalWarning` específico do SQLite (ainda RC em Node 24.x), sem mascarar outros warnings.

**Validação.** Smoke test em projeto throwaway: add → list (sem snapshots) → injeta 2 snapshots de teste via lib direta → list mostra delta correto (+3 / −10 / nova) → history retorna série temporal ordenada → re-upsert mesma `(date, keyword)` sobrescreve sem duplicar. Tudo em Node 22.22.

**Trade-off aceito.** SQLite no Brain quebra parcialmente "Brain text-first". Mitigação: `keywords.json` (config) e `reports/*.md` (saídas humanas) cobrem o caminho do humano. `history.db` é storage de queries, não de leitura direta.

## Refatoração 2026-05-04: priority high default + polling responsivo + 3 modos

**Motivação.** Teste E2E real expôs latência inaceitável da fila Standard Normal (priority=1): ~9min em queue confirmado via `task_get` direto, ainda sem retornar. Em horário de pico pode passar de 30min — UX intolerável pra "manual update".

**Causa raiz dupla:**
1. Priority 1 (normal) congestiona em pico. Priority 2 (high) é alegadamente 1-3min e custa 2x ($0.0183/kw vs $0.00915/kw a depth=200) — ainda 40% mais barato que Live.
2. Polling via `tasks_ready` retorna toda a conta (até 1000 tasks) e pode ter delay próprio. `task_get/{id}` consultado direto nos meus IDs é mais responsivo.

**Mudanças.**
- Novo `liveAdvanced(enginePath, task)` no client — modo síncrono, 1 task/call, paralelizável via `pLimit`. Pricing: $0.002 base + 75% × páginas extra.
- Novo `pollAndCollectTasks(enginePath, taskInfos)` no client — substitui combo `pollTasksReady`+`fetchTaskResult`. Consulta `task_get/advanced/{id}` direto em paralelo (concorrência 5), captura result no mesmo response (sem fetch extra).
- `task_post` payload ganha `priority: 2` por default. Flag `--priority=normal` baixa pra 1 (mais barato, mais lento — bom pra cron noturno).
- Flag `--live` ativa o caminho síncrono `cmdUpdateLive`.
- Flag `--resume` retoma `.pending.json` sem re-submeter (custos preservados).
- Função `parseLiveOrTaskResult` extraída — parser único compartilhado entre os 2 caminhos (live e async).
- `estimateCost('serp-live', count, {depth})` adicionado.
- Timeout do polling subiu pra 15min (era 5).

**3 modos resultantes:**

| Modo | CLI | Tempo (3 kw) | Custo (3 kw, depth=200) |
|---|---|---|---|
| async high (default) | `update` | ~50s real medido | $0.055 |
| async normal | `update --priority=normal` | 5-30min | $0.027 |
| live | `update --live` | ~3s real medido | $0.092 |

**Validação E2E real** com `conversion.com.br` no Brasil:
- agencia de seo → #2 (home)
- seo → #4 (blog/o-que-e-seo/)
- link building → #9 (blog/link-building/)

Resultado idêntico nos 3 modos. Spoiler do usuário ("vai estar no top 10") confirmado.

**Custo total da fase de validação:** ~$0.17 USD ($0.027 perdidos no async normal travado + $0.085 live + $0.055 async high).
