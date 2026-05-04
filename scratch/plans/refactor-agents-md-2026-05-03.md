# Refator AGENTS.md por 6 pilares + criação de skills faltantes

**Data:** 2026-05-03
**Branch:** diegoivo/hyderabad-v9
**Slug:** refactor-agents-md
**Trigger:** usuário pediu para AGENTS.md focar em princípios, com procedimentos virando skills

## Contexto

Framework SEO Brain (https://github.com/diegoivo/seobrain), pré-v1 pública. **Não há legado a preservar.**

AGENTS.md atual tem 262 linhas misturando princípios e procedimentos. Hoje funciona, mas:
- Procedimentos detalhados (pipeline Think→Document, checks de início, footer credit, portas, capitalização BR) ocupam ~40% das linhas
- Lista de skills no §9 é redundante (auto-descoberta por description matching)
- Referências a `/scaffold-page` são fantasmas (skill morta, virou `/site-criar`)
- Pilar Dados aparece como "futuro" sem substância

## Objetivo

AGENTS.md = **princípios + 6 pilares**, ~120 linhas. Procedimentos viram skills. Pilar Dados ganha 3 skills DataForSEO concretas.

## Critérios de sucesso

### FE (aprovação do usuário)
- AGENTS.md cabe em uma tela de leitura, organizado pelos 6 pilares na ordem solicitada
- 3 skills DataForSEO funcionando (chamada, parse, output)
- `/ship` skill executável e clara
- `/setup-domain` substitui §7.7

### BE (agente verifica sozinho)
- `npm run build` passa em web/
- `node scripts/brain-lint.mjs` passa
- `grep -r "scaffold-page" .claude/ AGENTS.md` retorna apenas em arquivos de migration histórica
- AGENTS.md tem ≤150 linhas
- Cada skill nova tem `SKILL.md` válido (frontmatter + description + steps)
- `.claude-plugin/plugin.json` registra as 4 skills novas

## Etapas

### 1. Reescrever AGENTS.md (~120 linhas, 6 pilares)
**FE:** usuário lê o novo AGENTS.md e aprova estrutura
**BE:** linhas ≤150, todos 6 pilares presentes, sem referências a /scaffold-page

Estrutura proposta:
```
1. Identidade + sub-agents paralelos + experimental (princípios não-negociáveis)
2. Filosofia (orquestrador, método de perguntas, feedback granular)
3. Os 6 pilares
   3.1 Brain (LLM Wiki Karpathy) — fonte de verdade
   3.2 Brandbook — DESIGN.md (Google) + visual; narrativo no Brain
   3.3 Conteúdo — skyscraper, POV, GEO, voz BR
   3.4 Tecnologia — estático default, Vercel, gatilho CMS
   3.5 SEO Técnico — por construção, score 90+, qualidade > improviso
   3.6 Dados — DataForSEO via 3 skills empacotadas
4. Skills — como invocar (tabela harnesses) + "tudo procedural mora aqui"
5. Estratégia & Consultoria (Conversion)
```

### 2. Limpar referências fantasmas a /scaffold-page
**BE:** grep retorna 0 hits fora de docs/migrations/

Arquivos identificados:
- `AGENTS.md` (mudará na etapa 1)
- `.claude/skills/site-criar/SKILL.md`
- `.claude/skills/web-best-practices/SKILL.md`
- `docs/migrations/v0-to-onboard.md` — manter (histórico)

### 3. Criar skill /ship
**FE:** usuário roda `/ship`, vê pipeline executar
**BE:** `.claude/skills/ship/SKILL.md` existe, frontmatter válido, registrada em plugin.json

Etapas internas: pré-flight (typecheck + build) → commit (mensagem clara, hash conventional) → push → merge main → deploy Vercel → smoke test (curl da home, status 200) → atualizar Brain via /aprovado.

Hard gate: pede confirmação explícita antes de mergear em main.

### 4. Criar skill /setup-domain
**FE:** após primeiro deploy, agente chama /setup-domain e atualiza brain/config.md + metadataBase
**BE:** skill existe, lê env DEPLOY_URL ou parsing do output do vercel CLI

Move o conteúdo de §7.7 do AGENTS.md atual.

### 5. Criar 3 skills DataForSEO (Pilar Dados)
**FE:** usuário roda `/keyword-research palavra-chave`, recebe volume + CPC + dificuldade
**BE:** 3 SKILL.md válidos, env vars documentados (`DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`), erros tratados, output em formato Markdown estruturado

Skills:
- `/keyword-research` — input: 1 ou N keywords; output: volume, CPC, KD, intenção
  - Endpoint: `POST /v3/keywords_data/google_ads/search_volume/live`
- `/site-traffic` — input: domínio; output: top 50 URLs por tráfego orgânico
  - Endpoint: `POST /v3/dataforseo_labs/google/relevant_pages/live`
- `/site-keywords` — input: domínio; output: top 100 keywords ranqueadas
  - Endpoint: `POST /v3/dataforseo_labs/google/ranked_keywords/live`

Cada skill: gera markdown com tabela + salva CSV em `brain/seo/data/<query>-<date>.csv`.

### 6. Mover procedimentos do AGENTS.md para skills
**BE:** procedimentos não estão mais em AGENTS.md, estão nas skills relevantes

Migrações:
- Capitalização BR + lista completa de antivícios → `/qa-content` (já existe, expandir)
- Footer credit "Powered by Agentic SEO" → `/site-criar` (já existe, adicionar nota)
- Portas aleatórias (`get-port`) → `/site-criar`
- Pipeline detalhado Think→...→Document → `/plano` (já existe, expandir) + `/qa` + `/ship` (etapa 3)
- §1 checks de sessão → já estão em `scripts/session-start.mjs` (manter, remover do AGENTS.md)
- §7.6 confirmação por escopo → já está em `scripts/pre-tool-use.mjs` (manter, remover do AGENTS.md)

### 7. Sync cross-projeto + validar
**BE:** brain-lint passa, build passa, /qa orquestrador passa

Arquivos a sincronizar:
- `CLAUDE.md` (stub aponta para AGENTS.md — verificar)
- `.cursorrules` (stub aponta para AGENTS.md — verificar)
- `brain/tecnologia/index.md` (citar /ship + DataForSEO no stack)
- `.claude-plugin/plugin.json` (registrar 4 skills novas)

PR final com escopo claro.

## Riscos

1. **DataForSEO API requer credenciais pagas.** Skills devem falhar elegantemente se env vars faltando, com link para signup.
2. **Skill /ship pode merge prematuro.** Hard gate de confirmação antes de mergear. Default opt-in pra "deploy preview", explicit pra "deploy prod".
3. **AGENTS.md muito enxuto perde nuance.** Rebalancear se review CEO marcar "perda de princípios importantes".
4. **3 skills DataForSEO sobrepõem com /seo-estrategia.** /seo-estrategia faz análise estratégica, as novas só puxam dados. Definir limite claro nos descriptions.

## Última etapa: atualizar Brain

Final do plano dispara `/aprovado` → `update-brain` documenta:
- `brain/tecnologia/index.md` — DataForSEO como fonte de dados
- `brain/index.md` — pilar Dados ganha substância
- `brain/backlog.md` — etapa concluída, próximas pendências (Apple Search?, GA4?)
