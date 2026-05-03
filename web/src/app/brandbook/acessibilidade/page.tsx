import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Acessibilidade" };

const CHECKLIST = [
  {
    cat: "Perceptível",
    items: [
      { id: "1.1.1", label: "Toda imagem não-decorativa tem alt descritivo. Decorativa tem alt=\"\"." },
      { id: "1.3.1", label: "Hierarquia de headings (h1 → h2 → h3) sem pular nível." },
      { id: "1.4.3", label: "Contraste texto sobre fundo ≥ 4.5:1 (AA), ≥ 7:1 (AAA)." },
      { id: "1.4.4", label: "Texto pode ser ampliado até 200% sem quebrar layout." },
      { id: "1.4.10", label: "Conteúdo reflowa em viewport 320px sem scroll horizontal." },
    ],
  },
  {
    cat: "Operável",
    items: [
      { id: "2.1.1", label: "Toda funcionalidade acessível por teclado. Sem trap." },
      { id: "2.4.1", label: "Skip-link no topo do body (#main)." },
      { id: "2.4.4", label: "Texto do link descreve destino. Sem 'clique aqui'." },
      { id: "2.4.7", label: "Foco visível em todo elemento focável (outline)." },
      { id: "2.5.5", label: "Target size ≥ 44×44px em mobile (botões, links inline em parágrafo)." },
    ],
  },
  {
    cat: "Compreensível",
    items: [
      { id: "3.1.1", label: "<html lang=\"pt-BR\"> declarado." },
      { id: "3.2.1", label: "Foco em elemento não dispara mudança de contexto inesperada." },
      { id: "3.3.1", label: "Erros de form identificados claramente, com instrução de correção." },
      { id: "3.3.2", label: "Labels de form sempre visíveis (não placeholder-as-label)." },
    ],
  },
  {
    cat: "Robusto",
    items: [
      { id: "4.1.2", label: "Componentes interativos com nome, papel e estado acessíveis (aria-* quando custom)." },
      { id: "4.1.3", label: "Mensagens de status anunciadas (role=\"status\" ou aria-live)." },
    ],
  },
];

const PREFERENCES = [
  { name: "prefers-reduced-motion", action: "Reduzir animação para ~0ms (regra global em motion)." },
  { name: "prefers-color-scheme: dark", action: "Inverter --bg/--fg + ajustar accent. Todo design system precisa." },
  { name: "prefers-contrast: more", action: "Reforçar bordas, aumentar contraste de textos secundários." },
];

export default function Acessibilidade() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Acessibilidade</p>
        <h1 className="mb-8">A11y como construção, não auditoria.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          A11y é parte do SEO técnico — Lighthouse audita, mas o framework
          aplica por construção. Esta página é referência de bolso para
          revisão. Skill <code>/qa-tech</code> automatiza a maioria.
        </p>

        <h2 className="mb-6">Checklist WCAG 2.2 AA</h2>
        {CHECKLIST.map((cat) => (
          <div key={cat.cat} style={{ marginBottom: "var(--space-8)" }}>
            <h3 style={{ marginBottom: "var(--space-3)" }}>{cat.cat}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-2)" }}>
              {cat.items.map((it) => (
                <li
                  key={it.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) 0",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <code style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", minWidth: "3em" }}>
                    {it.id}
                  </code>
                  <span style={{ fontSize: "var(--text-sm)" }}>{it.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2 style={{ marginTop: "var(--space-12)" }} className="mb-6">Preferências do sistema</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          {PREFERENCES.map((p) => (
            <li key={p.name}>
              <code>{p.name}</code> — {p.action}
            </li>
          ))}
        </ul>

        <h2 className="mb-6">Ferramentas</h2>
        <ul className="prose">
          <li><strong>axe DevTools</strong> (extensão Chrome) — captura ~50% dos issues automaticamente.</li>
          <li><strong>Lighthouse</strong> — Accessibility score ≥ 95 obrigatório (regra do framework).</li>
          <li><strong>VoiceOver / NVDA</strong> — teste manual com leitor de tela em flows críticos.</li>
          <li><strong>Tab key only</strong> — navegue o site só com teclado. Se algo não focar ou abre trap, é P0.</li>
          <li><strong>Skill <code>/qa-tech</code></strong> — roda Lighthouse + checa hierarquia + alt + JSON-LD.</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
