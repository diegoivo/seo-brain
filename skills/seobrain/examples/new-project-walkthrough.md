# Walkthrough — criar projeto + onboarding

Mockup do output esperado para usuário fresh.

## Cenário 1: instalar plugin + criar projeto

```
$ /plugin marketplace add diegoivo/seobrain
✓ Marketplace 'seobrain-marketplace' added (1 plugin)

$ /plugin install seobrain@seobrain-marketplace
✓ Plugin 'seobrain' installed (24 skills + 3 commands + 2 hooks)
  Type /seobrain:start to begin.

$ /seobrain:start
🧠 SEO Brain v0.1.0 — Brazilian-first SEO + GEO toolkit

  Status: nenhum projeto ativo (cwd não é um projeto SEO Brain).
  
  Para começar:
    /seobrain:start create-project <nome>
  
  Available skills (24, agrupadas por pilar):
    LLM Wiki:    /wiki-init /wiki-update /wiki-lint
    Branding:    /branding (modos: discover, import, apply, export, images, review, list)
    Content:     /content-seo /content-seo-review
    Technical:   /technical-seo /seo-strategy /seo-data
    Website:     /website-create /website-bestpractices /website-cms
                 /website-domain /website-email /website-qa
    Pipeline:    /plan /ship /approved /qa
  
  Trigger words (PT-BR + EN): "escrever artigo", "audit SEO",
  "criar projeto", "GEO content", "AI Overviews", "validar voz".

$ /seobrain:start create-project acme-cliente
✓ Created /Users/you/dev/clients/acme-cliente/
  Templates copied. brain/ in template state.
  
  Next: cd acme-cliente && /seobrain:start

$ cd acme-cliente
$ /seobrain:start
🧠 SEO Brain — projeto 'acme-cliente' detectado.
   brain/ ainda em estado template (kit_state: template em 6 arquivos).
   
   Vamos popular brain + branding (~10min, 18 perguntas).
   
   Modo:
   1. Express (default) — 18 perguntas essenciais, ~10min
   2. Guiado — 35 perguntas, ~50min, mais profundidade
   3. Auto — LLM preenche tudo, você ajusta
   
   Escolha [1/2/3]:
```

## Cenário 2: dentro do projeto template

Após escolher modo Express, o agente roda em sequência:

```
[Phase 1 — LLM Wiki / wiki-init]
  Pergunta 1/9: Qual é o nome do cliente/projeto? > Acme Cliente
  Pergunta 2/9: Sobre o que é o projeto, em 1 frase? > Marketplace de produtos artesanais
  Pergunta 3/9: Domínio definitivo (ou "depois")? > acme.com.br
  Pergunta 4/9: Qual é o USP em uma frase? > ...
  Pergunta 5/9: Persona principal (em 30s, descreva)? > ...
  Pergunta 6-8/9: 3 POVs proprietários (opiniões fortes que vão diferenciar) > ...
  Pergunta 9/9: Tom de voz (sério/lúdico, formal/casual, etc.)? > ...

✓ brain/ populado (kit_state: initialized).

[Phase 2 — Branding / /branding apply (orquestra discover + apply)]
  Pergunta 1/10: Mood (3 palavras)? > moderno, elegante, terra
  ...
  Pergunta 10/10: Logo (upload ou skip)? > skip (depois)

✓ brain/DESIGN.md + brain/DESIGN.tokens.json gerados.
✓ web/src/app/brandbook/ scaffold populado.

[Phase 3 — Próximos passos sugeridos]
  - /website-create (gera scaffold do site)
  - /content-seo (escrever primeiro post)
  - /seo-data (pesquisar keywords)
```

## Cenário 3: projeto inicializado

```
$ cd acme-cliente && /seobrain:start
🧠 SEO Brain — projeto 'acme-cliente' inicializado.
   brain/index.md atualizado há 2 dias (✓ fresh).
   
   Próximos passos sugeridos:
   - Escrever conteúdo: /content-seo
   - Auditar SEO: /technical-seo
   - Pesquisar keywords: /seo-data
   - Ship pra produção: /ship
   
   O que você quer fazer agora?
```
