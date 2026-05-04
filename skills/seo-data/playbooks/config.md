# Playbook: seo-data config (DataForSEO credenciais)

Sobe um form HTTP local pra capturar `DATAFORSEO_LOGIN` e `DATAFORSEO_PASSWORD`, valida via call gratuita ao DataForSEO, e grava em `.env.local` do projeto ativo.

## Quando usar

- Usuário acabou de criar conta no DataForSEO e quer configurar.
- Outros playbooks de `/seo-data` (keywords-volume, competitor-pages, competitor-keywords) ou `/rank-tracker` abortaram com "credenciais ausentes".
- Usuário quer trocar credenciais (ex.: rotacionou senha).

## Pré-requisitos

- Rodar de dentro de `projects/<nome>/` (cwd em projeto ativo, identificado por `seo-brain-project: true` no `package.json`).
- Conta no DataForSEO. Sem conta: o form mostra link de signup inline (https://app.dataforseo.com/register, Pay-as-you-go).

## Pipeline

1. **Detecta projeto ativo** via `requireProjectRoot` (aborta se cwd está fora de projeto).
2. **Sobe servidor HTTP** em `127.0.0.1` (loopback only) com porta aleatória.
3. **Abre navegador** automaticamente (`open`/`xdg-open`/`start`). Fallback: imprime URL no terminal.
4. **GET /** serve form com 2 campos + link pra Dashboard DataForSEO + nota: "use API Login/Password, não email/senha do site" (erro #1 dos novos usuários).
5. **POST /save** valida via `GET /v3/appendix/user_data` (endpoint **gratuito**, não queima crédito). Distingue:
   - **401:** "Credenciais inválidas. Confirme que copiou de Dashboard → API Access."
   - **OK:** mostra saldo atual, grava `.env.local`.
6. **Upsert no `.env.local`:** preserva todas as outras vars, atualiza apenas `DATAFORSEO_LOGIN` e `DATAFORSEO_PASSWORD`.
7. **Encerra:** após sucesso, página mostra confirmação + balance, server `process.exit(0)` em 2s.
8. **Timeout:** se ninguém submeteu em 5min, encerra com código 1.

## Invocação

```bash
cd projects/<nome>
node ../../scripts/dataforseo-config.mjs
```

Em Claude Code: `/seo-data` (e o usuário pede "configurar DataForSEO"). Em harness sem slash: "configurar DataForSEO".

## Output

- `projects/<nome>/.env.local` — upsert das duas vars (não clobber).
- Terminal: URL local + saldo após sucesso + dica de próximo passo (`/rank-tracker add ...` ou `/seo-data` keywords-volume).

## Segurança

- Bind em `127.0.0.1` (não `0.0.0.0`) — só processo local acessa.
- Porta aleatória — sem colisão com dev server, sem porta fixa exposta.
- Validação **gratuita** antes de gravar — credenciais erradas nunca chegam ao disco.
- Sem deps externas — `node:http` puro. Zero supply chain.

## Erros

| Erro | Ação |
|---|---|
| Não está em projeto ativo | Aborta com `requireProjectRoot`, instrui `cd projects/<nome>` ou `npm run new` |
| 401 do DataForSEO | Form re-renderiza com hint sobre API Login vs email do site |
| Porta em uso | Tenta outra (porta `0` = SO escolhe automaticamente) |
| Browser não abre | Printa URL no terminal pro usuário abrir manual |
| Timeout 5min | Encerra com erro, sem gravar nada |

## Princípios

- **Validação antes do disco.** Nunca grava credenciais sem validar primeiro.
- **Upsert seguro.** Nunca clobber `.env.local` — preserva outras vars (Pexels, Resend, etc.).
- **Loopback only.** Server nunca escuta em interface pública.
- **Self-destruct.** Servidor encerra após sucesso ou timeout — não fica rodando esquecido.
