# Integração opcional — Stitch (Google Labs)

> Esta integração é **opcional** e fica fora do `npm run setup`. Use apenas se você já trabalha com Stitch (https://stitch.withgoogle.com) e quer importar o design system de um projeto existente.

## O que é

Stitch é uma ferramenta de design AI do Google Labs que gera telas de UI a partir de prompts. A skill `design-md` (do repositório `google-labs-code/stitch-skills`) lê um projeto Stitch via MCP server e sintetiza um `DESIGN.md` a partir das telas existentes.

## Quando faz sentido

- Você já tem um projeto Stitch com pelo menos uma tela desenhada.
- Quer extrair o design system dessas telas para o `brain/DESIGN.md` do kit.

Se você está começando do zero, **não precisa de Stitch** — rode `/branding discover` (10 perguntas) que produz um DESIGN.md opinativo sem dependências externas.

## Pré-requisitos

- Conta Google logada em https://stitch.withgoogle.com.
- Stitch MCP server configurado no harness (Claude Code, Codex, Cursor ou Antigravity). Documentação oficial: https://stitch.withgoogle.com/docs/mcp/setup (acesso via login).
- Projeto Stitch com telas.

> ⚠️ **Sobre custo:** Stitch é produto experimental do Google Labs. Tem free tier no momento da escrita, mas a política pode mudar. Verifique antes de adotar como dependência.

## Instalação

```bash
npx -y skills@latest add google-labs-code/stitch-skills --skill design-md -y
```

Depois, configure o MCP server seguindo a documentação oficial.

## Uso

A skill `design-md` chama tools como `stitch:list_projects`, `stitch:list_screens`, `stitch:get_screen`, `stitch:get_project`. Sem o MCP configurado, a skill não funciona.

## Por que não está no setup default

1. Depende de conta Google + serviço autenticado externo.
2. Custo futuro incerto.
3. `/branding discover` cobre o caso comum (projeto novo) sem dependências.
4. Repositório público do kit não deve forçar usuários a configurar serviços que não pediram.
