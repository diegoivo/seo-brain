---
name: website-cms
description: Bolt-on de Payload CMS + Neon Postgres no projeto, quando o gatilho disparar (≥100 páginas/3 meses, OU editor não-técnico, OU necessidade comprovada de UI). Por padrão o kit roda estático. Use quando o usuário disser "adicionar CMS", "instalar Payload", "preciso de banco", ou quando os números justificarem.
allowed-tools:
  - Read
  - Write
  - Bash
  - WebFetch
---

# Add CMS

Adiciona Payload CMS + Neon Postgres ao projeto. Não é o default — só rode quando o gatilho disparar.

## Antes de rodar — confirme o gatilho

Pergunte ao usuário e confirme **pelo menos um**:

1. O site terá **≥100 páginas dinâmicas** nos próximos 3 meses?
2. Existe **editor não-técnico** publicando conteúdo?
3. Existe **necessidade comprovada** de UI de edição (versionamento de drafts, multi-autor, fluxos editoriais)?

Se nenhum dispara: **não rode**. Mantenha o projeto estático e responda: "O gatilho de banco ainda não disparou. Markdown + git é o suficiente. Documentei a decisão em `brain/tecnologia/index.md`."

## Quando rodar — passos

1. Provisionar Neon via **Vercel Marketplace** (não criar conta separada). Comando: `vercel integrations add neon`.
2. Instalar a skill externa oficial do Payload (entra agora, não no setup default):
   ```bash
   npx -y skills@latest add payloadcms/skills --skill payload -y
   ```
3. Adicionar Payload ao `/web`:
   ```bash
   cd web && pnpm add payload @payloadcms/db-postgres @payloadcms/next
   ```
4. Criar `web/payload.config.ts` com:
   - Adaptador Postgres apontando para `process.env.POSTGRES_URL` (auto-provisionado pelo Marketplace).
   - Coleções: `Posts`, `Pages`, `Authors`, `Categories`.
   - Cada campo do frontmatter de `/content/posts/_template.md` mapeado.
5. Rodar `scripts/content-sync.mjs` para seedar Payload com posts existentes.
6. Atualizar `brain/tecnologia/index.md` com:
   - Data da decisão.
   - Qual gatilho disparou.
   - Estado anterior (estático) e novo (Payload + Neon).
7. Adicionar ao README a seção "Editorial workflow após CMS".

## Princípios pós-CMS

- `/content/*.md` continua existindo como **fonte de drafts e geração agentic**.
- Pipeline: `markdown (drafts) → content-sync → Payload (publicado)`.
- Posts com `status: published` no frontmatter **não são editados** pelo agent sem confirmação humana.
- Editores não-técnicos editam no Payload Admin.

## Output

Confirmação dos passos executados + link para o admin do Payload + nota em `brain/tecnologia/index.md`.
