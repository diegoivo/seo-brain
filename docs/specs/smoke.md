# Spec: smoke — kit base

## Objetivo
Garantir que o kit recém-clonado (sem `/onboarding`) renderiza as 4 rotas
canônicas com JSON-LD válido e não quebra em rota inexistente.

## Critérios de aceitação

- [ ] **AC-1**: home (`/`) renderiza um `<h1>` visível.
- [ ] **AC-2**: blog index (`/blog/`) renderiza um `<h1>` visível.
- [ ] **AC-3**: serviços (`/servicos/`) renderiza um `<h1>` visível.
- [ ] **AC-4**: post de exemplo (`/blog/exemplo-post/`) renderiza H1 não vazio.
- [ ] **AC-5**: home tem `<script type="application/ld+json">` com `@type: Organization`.
- [ ] **AC-6**: post tem `<script type="application/ld+json">` com `@type: Article`.
- [ ] **AC-7**: rota inexistente não derruba o servidor (response ≥200).

## Anti-objetivos
- Não testa conteúdo específico de marca (esses ACs vêm em `onboarding-fill.md`).
- Não testa PageSpeed (esse vem em `publicar-pagespeed.md`).

## Risco / rollback
Se algum AC falhar após mudanças no scaffold, reverter o último commit que
tocou `app/` ou `lib/`.

## Como rodar

```bash
npm run build              # gera out/
npm run test:browser       # executa tests/smoke.spec.ts via npx serve out
```

Em CI:

```bash
E2E_BASE_URL=https://meu-preview.vercel.app npm run test:browser
```
