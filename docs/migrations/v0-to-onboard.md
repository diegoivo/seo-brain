# Migração: v0 → onboarding-v1

Esta versão introduz **estado explícito do kit** (`kit_state: template` vs `initialized`) e a skill `/onboard`. Se você clonou o kit antes desta mudança, seu Brain provavelmente tem conteúdo do **próprio kit** (descrevendo o Agentic SEO Kit) em vez de templates vazios prontos para o **seu projeto**.

## Sintomas

Você está nesta situação se:

- `brain/index.md` começa com "Este é o Agentic SEO Kit — um repositório template + plugin Claude Code…"
- `brain/DESIGN.md` é um placeholder mas o agent não sugeriu rodar `/design-init`
- O agent cria páginas com defaults Tailwind (purple/blue, Inter, shadow-md) sem reclamar
- `brain/principios-agentic-seo.md` lista 10 princípios genéricos, mas não tem POVs específicos da **sua** marca

## Solução

### Opção A — Reset automático (recomendado)

```bash
npm run kit:reset-template
```

Esse script:
1. Faz backup do Brain atual em `brain/.backup-pre-onboard-<data>/`
2. Substitui os arquivos do brain por templates vazios (com `kit_state: template`)
3. Imprime instrução para rodar `/onboard`

Depois rode no Claude Code:
```
/onboard
```

E preencha as 18 perguntas. Você pode consultar o backup quando precisar.

### Opção B — Manual

Se preferir migrar à mão:

1. Adicione frontmatter `kit_state: template` no topo de cada arquivo do brain:
   - `brain/index.md`
   - `brain/personas.md`
   - `brain/principios-agentic-seo.md`
   - `brain/tom-de-voz.md`
   - `brain/tecnologia/index.md`
   - `brain/DESIGN.md`
   - `brain/backlog.md`
   - `brain/glossario/index.md`

2. Limpe o conteúdo de cada um, mantendo só headers e marcadores TEMPLATE.

3. Rode `/onboard`.

## E se eu já tinha conteúdo bom no Brain?

Se você já tinha customizado o Brain com seus dados reais, **não rode reset**. Em vez disso:

1. Adicione `kit_state: initialized` no frontmatter de cada arquivo (manualmente).
2. O hook `SessionStart` vai parar de sugerir `/onboard`.
3. Skills como `scaffold-page` vão funcionar normalmente.

## E o site que eu já criei?

Continua funcionando. As mudanças desta versão afetam **apenas** o fluxo de bootstrap. Sites/páginas existentes em `/web/` não são tocadas pela migração.
