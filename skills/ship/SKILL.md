---
name: ship
description: Release pipeline for SEO Brain — pre-flight (typecheck + build + qa orchestrator), conventional commit, push, Vercel preview deploy, smoke pre-merge, merge to main, prod deploy, smoke prod, update LLM Wiki via /approved. Hard confirmation gate before any change to main branch. Use when user asks "ship", "deploy", "release", "publish", "push to production", "ir pra prod", "subir produção", "merge main", "lançar a versão", "create PR", "abrir PR". Renamed from /seobrain-ship to /ship (v0.1.0).
allowed-tools:
  - Read
  - Bash
  - Edit
  - Grep
---

# /ship — pipeline de release

Orquestra o `Ship` do pipeline `Think → Plan → Build → Test → Ship → Document`. Garante que código quebrado não chega em `main` e que produção é validada antes do Brain registrar a tarefa como concluída.

## Pré-requisitos

- Branch atual ≠ `main`
- Tarefa concluída (idealmente após `/qa` ter passado em `.cache/qa-runs/`)
- Plano em `plans/<slug>.md` com checkboxes marcadas (se não-trivial)

Se faltar qualquer um: pergunte ao usuário se quer prosseguir mesmo assim.

## Pipeline (10 etapas)

### 1. Pre-flight check
```bash
git status --porcelain
git diff --stat
```
- Se há mudanças uncommitted: pergunta se quer commitar agora ou abortar
- Se branch é main: **HARD STOP** — "ship deve sair de feature branch, não main"

### 2. Typecheck + build local
```bash
cd web && npm run typecheck && npm run build
```
- Falhou: para. Pede pro usuário corrigir. Não tenta corrigir sozinho (compilação raramente é "fix óbvio").

### 3. QA orquestrador (opcional, recomendado)
Se `.cache/qa-runs/` não tem rodada recente (<10 min) ou usuário pediu QA:
```
Invocar /qa
```
P0 do QA bloqueia. P1/P2 reportam mas seguem.

### 4. Commit conventional
Lê `git diff --staged` + `git diff` + `git log -5` para tom.

Mensagem segue formato:
```
<type>: <descrição curta>

<body opcional>
```
Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

Não usa `--no-verify`. Se hook falha: investiga causa, não pula.

### 5. Push branch
```bash
git push -u origin HEAD
```

### 6. Preview deploy Vercel
```bash
vercel deploy
```
Captura URL `*.vercel.app` retornada.

### 7. Smoke test no preview (PRE-MERGE)
```bash
curl -sI <preview-url> | head -1
curl -s <preview-url>/llms.txt -o /dev/null -w "%{http_code}\n"
curl -s <preview-url>/sitemap.xml -o /dev/null -w "%{http_code}\n"
```

Espera HTTP 200 nos 3. Retry 5s × 6 vezes antes de desistir (CDN propagation).

**Falhou:** para. Não merge. Reporta status code + URL pro usuário.

### 8. HARD GATE — confirmação para mergear em main

Mensagem ao usuário:
> "Preview verde em [URL]. Pronto para mergear em `main` e deploy a produção?
>
> 3 coisas que vão acontecer:
> 1. `git checkout main && git merge --no-ff <branch>` (sem fast-forward, preserva history)
> 2. `git push origin main` — código vai pra GitHub
> 3. Vercel deploya prod automaticamente — site público muda
>
> Confirma? [s/N]"

**Aguarda resposta explícita.** Hook `pre-tool-use.mjs` agora bloqueia `git merge|push.*main` por default — esta gate é a única forma autorizada.

### 9. Merge + push main
```bash
git checkout main
git pull --ff-only origin main
git merge --no-ff <branch> -m "Merge: <branch> via /ship"
git push origin main
git checkout <branch>
```

Se Vercel auto-deploy: aguarda webhook (5-15s).
Se manual: `vercel --prod`.

### 10. Smoke test em produção
Mesmos 3 curls da etapa 7 contra domínio prod (lê `brain/config.md` campo `Domínio temporário` ou `Domínio definitivo`).

**Falhou em prod:** alerta usuário. NÃO faz auto-revert (alto risco). Reporta opções: `git revert <merge-commit>` manual, ou rollback via Vercel UI.

## Pós-pipeline

Mensagem final ao usuário:
> "✅ Ship completo.
> - Branch: <branch> mergeado em main
> - Preview: <preview-url>
> - Produção: <prod-url>
> - Smoke: prod 200 OK
>
> Aprove com `/approved` para documentar no Brain (atualiza `brain/index.md`, `brain/backlog.md`)."

## Confirmação por escopo

- Etapa 1 (pre-flight): auto
- Etapa 2 (build): auto, falha bloqueia
- Etapa 3 (QA): auto se /qa rodou recente, senão pergunta
- Etapa 4 (commit): mostra mensagem proposta, pergunta "ok ou ajustar?"
- Etapa 5 (push branch): auto
- Etapa 6 (preview): auto
- Etapa 7 (smoke preview): auto
- **Etapa 8 (gate main): SEMPRE pergunta**
- Etapa 9 (merge+push): só após confirm explícito
- Etapa 10 (smoke prod): auto

## Erros comuns

| Erro | Ação |
|---|---|
| Branch dirty | "Você tem mudanças uncommitted. Commitar/stashar/abortar?" |
| Typecheck falha | Para. Pede usuário corrigir. |
| Build falha | Para. Pede usuário corrigir. |
| Push rejeitado (não-fast-forward) | "main divergiu. `git pull` antes de prosseguir?" |
| Preview deploy falha | Mostra log Vercel. Para. |
| Smoke preview 5xx | Aguarda 30s extra. Se persistir, para. |
| User responde "n" no gate | Aborta limpo. Branch fica como está. Não desfaz nada. |

## Anti-padrões

- ❌ `--no-verify` para pular hooks (nunca)
- ❌ `git push --force` em main (nunca)
- ❌ Auto-merge sem confirmação (nunca, gate é hard)
- ❌ Skip smoke test "porque já testei localmente" (sempre roda)
- ❌ Mensagem de commit genérica ("update", "fix") — sempre conventional + descrição

## Diferença para outras skills

| Skill | Quando |
|---|---|
| `/plan` | Antes de começar tarefa não-trivial |
| `/qa` | Durante/após desenvolvimento, para validar |
| `/ship` | Tarefa pronta, quer ir pra produção |
| `/vercel:deploy` | Só preview deploy (sem merge ou smoke) |
| `/approved` | Após ship, registra no Brain |
| `/website` (domain playbook) | Após **primeiro** ship em projeto novo |
