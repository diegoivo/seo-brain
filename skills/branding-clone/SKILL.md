---
name: branding-clone
description: Clone visual de site existente — extrai paleta, fontes, logo, favicon, type scale, radius, densidade composicional via agent-browser headless. Após clone, valida fidelidade comparando real vs local. Renamed from /site-clone + /clone-fidelity (consolidated v0.1.0). Use when user asks "clone site visual", "import design from URL", "fidelity check", "clone diegoivo.com", "importa o site existente", "extrai o design", "compare clone with original", "validar clone", "clone fiel". Triggers: brand identity import, visual cloning, design extraction.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# /branding-clone — clone visual + fidelity QA

Clonagem **visual real** via browser headless (não Fetch HTML puro), com **loop de fidelity validation** obrigatório após apply.

## Quando usar

- Usuário tem domínio existente e quer importar visual ("clone X.com").
- Disparado por `/seobrain:start` ou `/branding-onboard` quando há domínio.
- Manualmente pra validar clone vs original ("validar clone", "comparar real").

## Decision tree

```
agent-browser disponível?
  ├── NÃO → instalar OU abortar (sem fallback — clone visual exige browser)
  └── SIM
        ↓
playbooks/clone.md  (extrai tokens + aplica em web/)
        ↓
dev server local rodando?
  ├── NÃO → suba via `npm run web:dev` antes da fidelity
  └── SIM
        ↓
playbooks/fidelity-qa.md  (compara real vs local, gera diff report)
        ↓
Veredicto: APROVADO / RESSALVAS / BLOQUEADO
```

## Pré-condições não-negociáveis

1. **`agent-browser` no PATH.** Sem ele, abortar — não tentar WebFetch como fallback (entrega lixo).
2. **`tom-de-voz.md` NÃO é clonado.** Visual ≠ voz. Sempre perguntar se usuário quer também clonar voz (sub-skill separada).
3. **Fidelity QA é obrigatória** após apply. Loop de validação não-negociável.

## Playbooks

- `playbooks/clone.md` — pipeline completo de extração + apply (7 etapas).
- `playbooks/fidelity-qa.md` — diff real vs local + veredicto P0/P1/P2.

## Outputs

- `brain/DESIGN.md` (com `kit_state: initialized`)
- `brain/DESIGN.tokens.json`
- `web/src/app/globals.css` atualizado (cores, fontes — não escala/grid)
- `web/public/{logo, favicon, og}.{svg,png}`
- `.cache/clone/full.png`, `.cache/clone/extract.json`, `.cache/clone/diff-report.md`

## Princípios

- **Sem agent-browser, aborta.** Não tenta fallback que entrega lixo.
- **Logo é prioridade SVG > PNG > og:image.**
- **Paleta é computed** (não inferida de class names utility).
- **Fontes pagas → equivalente Google.** GT America → Geist; Söhne → Inter ou Mona Sans.
- **Visual ≠ voz.** Pergunta antes de extrair.
- **Fidelity report é citável.** "Está parecido" não é resposta — aponte os 3 P0.
