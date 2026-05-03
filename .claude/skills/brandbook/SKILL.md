---
name: brandbook
description: Gera brandbook visual interativo no navegador aplicando DESIGN.md + Brain. Cria rota web/src/app/brandbook/page.tsx (dev-only), abre browser para o usuário testar tipografia, paleta, componentes, motion. Bidirecional - reflete o Brain (DESIGN, tom, personas, POVs) e atualiza brain quando ajustes são aceitos. Use após design-init, ou quando o usuário pedir "brandbook", "preview do design", "guia de marca", "ver o design no navegador".
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# /brandbook

Brandbook visual em rota Next.js dev-only. **Aplicação tangível** do `DESIGN.md` + guia de marca completo (vindo de outras partes do brain).

## Pré-condições

- `brain/DESIGN.md` com `kit_state: initialized` e seções 1-9 preenchidas.
- `brain/DESIGN.tokens.json` com valores reais.
- `web/` configurado (Next.js + Tailwind v4 já no scaffold).

Se faltar algo, redirecione para `/design-init` ou `/onboard`.

## Pipeline

### 1. Lê o brain inteiro relevante
- `brain/index.md` (posicionamento, nome do projeto)
- `brain/DESIGN.md` (atmosfera, cores, tipografia, componentes, motion, antipadrões)
- `brain/DESIGN.tokens.json` (valores numéricos)
- `brain/personas.md` (para mostrar de quem estamos falando)
- `brain/principios-agentic-seo.md` (POVs proprietários — exibidos no brandbook)
- `brain/tom-de-voz.md` (exemplos de prosa em uso)

### 2. Cria `web/src/app/brandbook/page.tsx`

Estrutura do brandbook (em ordem):

#### Cabeçalho
- Nome do projeto
- Tagline / posicionamento (1 frase do `index.md`)
- Disclaimer: "rota dev-only. Em produção usa `noindex`."

#### 1. Atmosfera & Tema Visual
- Prosa do `DESIGN.md` §1
- 3 fotos / mood images (placeholder se não tiver)

#### 2. Cores & Papéis
- Swatches grandes para cada cor: hex + nome evocativo + papel
- Exemplo de uso (botão, link, fundo)

#### 3. Tipografia
- Display em escala (h1 a h4) com lorem real do tom de voz
- Body em parágrafos longos para testar leitura
- Mono em snippet de código
- Escala numérica (rem)

#### 4. Estilos de Componentes
- Botões — todos os estados (default, hover, focus, disabled, loading)
- Links — inline e standalone
- Cards — todos os tipos previstos no design
- Inputs — todos os estados
- Form completo (mock de contato)

#### 5. Princípios de Layout
- Grid base com colunas visíveis
- Espaçamento (escala visual de tokens)
- Border-radius em diferentes elementos

#### 6. Profundidade & Elevação
- Mostra cada nível em uso

#### 7. Motion
- Animações em loop com legenda do timing function
- Hover demos

#### 8. Antipadrões — banidos neste projeto
- Lista do `DESIGN.md` §8 com explicação do **porquê**

#### 9. Brand DNA
- 3 POVs proprietários (do `principios-agentic-seo.md`)
- Personas (do `personas.md`)
- Exemplos de prosa em tom de voz vs antivícios IA banidos

#### 10. Componentes em contexto
- Mini-página exemplo (hero + seção + CTA) usando todos os tokens

### 3. Configura noindex em prod

```tsx
// web/src/app/brandbook/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brandbook — uso interno",
  robots: { index: false, follow: false },
};
```

### 4. Build + abre browser

```bash
cd web && npm run build  # garante que compila
cd web && npm run dev    # inicia em porta aleatória via get-port
```

Apresenta:
> "Brandbook em http://localhost:XXXX/brandbook
>
> Abra no navegador e dê feedback granular:
> 1. A tipografia em ação combina com o mood [adjetivos do design]?
> 2. A paleta funciona em ambos os contextos (botão accent vs texto muted)?
> 3. Os componentes refletem o arquétipo [arquétipo escolhido] ou ficaram genéricos?
>
> Se quiser ajustar algo, me diga concretamente (ex: 'aumenta a fonte do display em 0.5rem', 'troca o accent por #X')."

### 5. Bidirecionalidade — atualizar brain quando ajustar

Se o usuário pede mudança ("aumenta a fonte do display"), o agente:

1. Atualiza `brain/DESIGN.tokens.json` (fonte de verdade dos valores).
2. Atualiza `brain/DESIGN.md` (prosa correspondente).
3. **Não edita só a página `/brandbook`** — Brain é o source-of-truth, brandbook é só o reflexo visual.
4. Re-renderiza a rota.

Se o usuário aprovar o brandbook como está, o agente:
1. Não toca o brain (já reflete tudo).
2. Apenas confirma "Brandbook aprovado. Está em `/brandbook`. Permanece como referência viva — atualiza automaticamente quando o brain mudar."

### 6. Rota fica viva no projeto

Não remova `/brandbook` ao final. Fica como referência no `web/` para consulta a qualquer momento. Em produção, `noindex` cuida de não vazar.

## Princípio: brandbook ≠ design system isolado

O brandbook **lê** o brain. Brain é a source-of-truth. Quando alguém quer mudar uma cor, edita brain → tokens.json → brandbook reflete. Não o contrário.

## Princípio: feedback granular

Após apresentar a URL, sempre faça 3 perguntas específicas (não "tá bom?"). Foque em:
- Combina com o mood/arquétipo?
- Funciona em contexto real (não só em isolamento)?
- Algum antipadrão escapou?
