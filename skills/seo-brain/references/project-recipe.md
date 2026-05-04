# Como criar um projeto (receita exata)

Quando o usuário pedir "crie um projeto", "novo cliente", "começar projeto X" ou similar, siga **exatamente** esta receita:

## 1. Confirme o nome

Use kebab-case (a-z, 0-9, hífen). Se o usuário não disse, pergunte. Exemplo: `cliente-acme`, `loja-livros`, `meu-blog`.

## 2. Confirme cwd

Em **dev local** (clone do repo): rode `pwd` — você deve estar em algo terminado em `/seo-brain` (ou nome do clone), com `package.json` contendo `"name": "seo-brain"`. Se estiver em outro lugar, faça `cd` para a raiz antes.

Em **plugin instalado**: o usuário pode estar em qualquer cwd. `scripts/new-project.mjs` detecta e cria projeto no cwd do usuário (não no plugin cache).

## 3. Crie o projeto

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/new-project.mjs <nome>
# OU em dev local:
node scripts/new-project.mjs <nome>
# OU via npm:
npm run new <nome>
```

Isso copia `templates/project/` para o destino, substitui placeholders, e **não instala** deps do Next.js (intencional — só instala quando o site for ser usado).

## 4. Mude para dentro do projeto

Path varia por modo:

```bash
# Dev local
cd projects/<nome>

# Plugin instalado (cwd do usuário)
cd <cwd>/<nome>
```

## 5. Confirme

Rode `pwd` e verifique. Verifique `package.json` contém `"seo-brain-project": true`.

## 6. Próximo passo natural

```
# Claude Code:
/seo-brain:start

# Codex / Antigravity:
"execute o seo-brain"

# Cursor:
"rode a skill seo-brain"
```

Se o usuário pediu projeto + onboard na mesma frase, encadeie automaticamente.

## Quando NÃO criar projeto

- Se já existir projeto com mesmo nome → avise e pergunte se quer outro nome ou apagar o existente.
- Se o usuário está pedindo pra **mexer** num projeto existente → apenas `cd <projeto>` e prossiga.

## Se npm install do web/ for necessário

Só faça quando o site for de fato ser executado/buildado:

```bash
cd <projeto>/web
npm install
```
