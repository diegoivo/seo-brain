# Playbook: wiki init — fase 1 do onboarding

Popula o **Brain** (Karpathy LLM Wiki) deste projeto. Trabalha **uma sub-fase por vez**, com auto-commit ao fim de cada uma.

## Inputs do orquestrador

Quando chamada pelo `/seo-brain:start`, recebe:
- `mode`: `auto` | `express` | `guiado`
- `input_raw`: resposta literal do usuário à pergunta aberta
- `research`: caminho opcional para `.cache/seo-brain-research.md` (output do sub-agent pesquisador)

Quando chamada **standalone**:
- Faz a pergunta aberta (mesma do `/seo-brain:start`).
- Pergunta o modo.

## Sub-fases

Brain é populado em 6 sub-fases. Cada sub-fase grava 1+ arquivo, atualiza `brain/log.md` (append-only Karpathy) e auto-commita.

### 1.1 Identidade (`brain/index.md` + `brain/config.md`)

Grava posicionamento (1-line + 1-paragraph), domínio (definitivo ou TEMPLATE), mood verbal (1-3 adjetivos), data de início. Em `brain/config.md`: deploy target (Vercel default), porta dev preferida, domínio temporário (preenchido pós-deploy).

`kit_state` muda de `template` → `initialized`.

### 1.2 Personas (`brain/personas/<slug>.md`, mínimo 1)

1 arquivo por persona. Use o template em `brain/personas/_template.md`. Frontmatter `entity_type: persona`. Atualize `brain/personas/index.md` (MoC) com link cada um.

Mínimo: 1 persona principal. Recomendado: 2-3.

### 1.3 POVs proprietários (`brain/povs/<slug>.md`, **mínimo 3**)

**Bloqueante.** Sem 3 POVs proprietários, o fluxo pausa.

POV proprietário = posição que **mainstream do nicho contesta publicamente**. NÃO é consenso ("conteúdo bom vence", "SEO técnico importa", "experiência do usuário é tudo").

Se os candidatos do usuário forem consenso, pergunte:

> Os POVs que tenho são consenso. Preciso de algo proprietário. Pense:
>
> - Qual posição você defende que **seus pares discordam publicamente**?
> - O que mainstream do seu mercado diz que está errado, mas você sustenta?
> - Onde sua experiência prova um padrão que dados públicos contradizem?

**Não auto-resolva.** Se o usuário não conseguir produzir 3, pause e ofereça: "Posso pesquisar consenso do seu nicho e propor 3 POVs *contra* esse consenso para você reagir?"

Use o template `brain/povs/_template.md`. Atualize `brain/povs/index.md`.

### 1.4 Tom de voz (`brain/tom-de-voz.md`)

Default Estadão + capitalização brasileira (já está no template). Cliente customiza apenas o que for **diferente do default** — não reescrever do zero.

Customizações comuns:
- Pessoa (1ª singular / 1ª plural / 3ª)
- Humor (seco / leve / nenhum)
- Frases curtas vs. médias
- Termos próprios da marca (jargão permitido / banido)

`kit_state: initialized`.

### 1.5 Glossário inicial (`brain/glossario/<termo>.md`, opcional mas recomendado)

Se a marca tem 2+ termos proprietários (jargão criado pela marca), grave 1 arquivo por termo. Use `brain/glossario/_template.md`. Atualize `brain/glossario/index.md`.

Pula se não houver termos proprietários.

### 1.6 Tecnologia (`brain/tecnologia/index.md`)

Confirma stack default (Next 16 SSG + Tailwind v4 + Vercel + sem banco) ou registra desvios. Decisão sobre CMS (`add-cms`) só roda se algum dos 3 gatilhos disparar (>100 páginas dinâmicas / editor não-técnico / UI de edição necessária).

`kit_state: initialized`.

---

## Modos

### Auto

1. Sub-agents pesquisam tudo (paralelo).
2. Mostra plano consolidado em `plans/wiki-init-<data>.md`.
3. Aguarda **"go"**.
4. Escreve as 6 sub-fases em sequência, auto-commit por sub-fase.
5. Apresenta diff final + 3 perguntas granulares específicas.

### Express (default)

1. Sub-agents pesquisam.
2. Para cada sub-fase, mostra proposta consolidada e pergunta apenas o que falta.
3. Sub-fase 1.3 (POVs) **bloqueia** se vier vazia ou consenso.
4. Auto-commit por sub-fase.

### Guiado

Pergunta em batch por sub-fase. Cada sub-fase: mostra recomendado, usuário aprova ou ajusta.

---

## Lint de antivícios IA

Antes de gravar qualquer copy:

```js
const ANTIVICIOS = [
  /vale destacar/i, /é importante ressaltar/i,
  /em síntese|em suma/i, /no cenário atual/i,
  /no mundo cada vez mais/i, /uma jornada de/i,
  /elevando ao próximo nível/i, /desbloqueando/i,
  /navegando pelas águas/i,
  /\bdelve\b|\bcrucial\b|\brobust\b|\bcomprehensive\b/i,
  /\bnuanced\b|\bmultifaceted\b|\bpivotal\b|\btapestry\b/i,
];
```

Match → reescreva com voz ativa antes de mostrar.

## Auto-commit

Após cada sub-fase aprovada:

```bash
git add brain/
git commit -m "chore(wiki): <sub-fase> — <slug>"
```

## Atualização do controle

Ao fim de cada sub-fase, edite `.cache/seo-brain.md`:

```markdown
## Fase 1 — Brain
Status: in_progress
- [x] 1.1 Identidade
- [x] 1.2 Personas
- [ ] 1.3 POVs (bloqueado: consenso)
- [ ] 1.4 Tom
- [ ] 1.5 Glossário
- [ ] 1.6 Tecnologia
```

Quando todas as sub-fases concluírem: Status: completed.

## Conclusão

1. Roda `node scripts/wiki-lint.mjs` — se houver erros, pause e mostre.
2. Atualiza `brain/log.md` com entrada `## <data> — wiki init concluído`.
3. Devolve controle ao orquestrador `/seo-brain:start` (que aciona `/branding apply`).
4. Se rodando standalone: pergunta se usuário quer prosseguir para `/branding apply`.
