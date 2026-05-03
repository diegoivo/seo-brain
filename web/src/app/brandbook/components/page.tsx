import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Componentes" };

export default function Components() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes</p>
        <h1 className="mb-8">Primitivos editoriais.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          O framework não vem com biblioteca de UI inflada. São poucos
          primitivos, todos definidos como classes CSS em <code>globals.css</code>.
          Cada um pode ser estilizado pós-<code>/design-init</code> sem mudar o
          markup.
        </p>

        <h2 className="mb-6">Botões</h2>
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            marginBottom: "var(--space-12)",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn-accent">
            Primário (.btn-accent)
          </button>
          <button type="button" className="btn-ghost">
            Secundário (.btn-ghost)
          </button>
        </div>

        <h2 className="mb-6">Eyebrow</h2>
        <p className="eyebrow" style={{ marginBottom: "var(--space-12)" }}>
          Categoria · Editorial — .eyebrow
        </p>

        <h2 className="mb-6">Blockquote</h2>
        <article className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <blockquote>
            Sites de marca sofrem três doenças: layout AI-slop, mobile
            improvisado e componentes desalinhados. A cura é um único grid
            global com spacing canônico.
          </blockquote>
        </article>

        <h2 className="mb-6">Inline code</h2>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Use <code>--space-N</code> para qualquer padding/margin. Nunca
          hardcode valores que não sejam múltiplos de 4.
        </p>

        <h2 className="mb-6">Foco visível (a11y)</h2>
        <p style={{ marginBottom: "var(--space-4)" }}>
          Todos os elementos focáveis recebem outline canônico (2px accent,
          offset 3px). Tente <kbd>Tab</kbd>:
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <a href="#main" className="btn-ghost">
            Link focável
          </a>
          <button type="button" className="btn-ghost">
            Botão focável
          </button>
          <input
            type="text"
            placeholder="Input focável"
            style={{
              padding: "var(--space-3) var(--space-4)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.25rem",
            }}
          />
        </div>
      </GridCol>
    </GridContainer>
  );
}
