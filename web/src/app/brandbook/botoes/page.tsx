import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Botões e ações" };

const BTN_PRIMARY = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  background: "var(--color-accent)",
  color: "var(--color-accent-fg)",
  fontWeight: 500,
  borderRadius: "0.25rem",
  border: "none",
  fontFamily: "inherit",
  fontSize: "var(--text-base)",
  cursor: "pointer",
};

const BTN_GHOST = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.75rem 1.5rem",
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-fg)",
  fontWeight: 500,
  borderRadius: "0.25rem",
  fontFamily: "inherit",
  fontSize: "var(--text-base)",
  cursor: "pointer",
};

export default function Botoes() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes · Botões</p>
        <h1 className="mb-8">Botões e ações.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          2 variantes canônicas: <code>.btn-accent</code> (primário, ação
          principal) e <code>.btn-ghost</code> (secundário, ação alternativa).
          Não inventamos uma terceira (&quot;outline&quot;, &quot;text&quot;) — se
          precisar, refatora.
        </p>

        <h2 className="mb-6">Estados — primário</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-4)",
            marginBottom: "var(--space-12)",
          }}
        >
          <div>
            <button type="button" style={BTN_PRIMARY}>
              Default
            </button>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              opacity 1
            </p>
          </div>
          <div>
            <button type="button" style={{ ...BTN_PRIMARY, opacity: 0.85 }}>
              Hover
            </button>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              opacity 0.85
            </p>
          </div>
          <div>
            <button type="button" style={{ ...BTN_PRIMARY, opacity: 0.7 }}>
              Active
            </button>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              opacity 0.7
            </p>
          </div>
          <div>
            <button type="button" disabled style={{ ...BTN_PRIMARY, opacity: 0.5, cursor: "not-allowed" }}>
              Disabled
            </button>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              opacity 0.5 + not-allowed
            </p>
          </div>
          <div>
            <button type="button" style={{ ...BTN_PRIMARY, opacity: 0.85 }} aria-busy="true">
              <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderRightColor: "transparent", display: "inline-block" }} aria-hidden="true" />
              Carregando…
            </button>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              aria-busy + spinner
            </p>
          </div>
        </div>

        <h2 className="mb-6">Estados — secundário</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-4)",
            marginBottom: "var(--space-12)",
          }}
        >
          <button type="button" style={BTN_GHOST}>Default</button>
          <button type="button" style={{ ...BTN_GHOST, background: "color-mix(in srgb, var(--color-fg) 4%, transparent)" }}>Hover</button>
          <button type="button" style={{ ...BTN_GHOST, background: "color-mix(in srgb, var(--color-fg) 8%, transparent)" }}>Active</button>
          <button type="button" disabled style={{ ...BTN_GHOST, opacity: 0.5, cursor: "not-allowed" }}>Disabled</button>
        </div>

        <h2 className="mb-6">Tamanhos</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
          <button type="button" style={{ ...BTN_PRIMARY, padding: "0.4rem 0.75rem", fontSize: "var(--text-sm)" }}>
            sm
          </button>
          <button type="button" style={BTN_PRIMARY}>md (default)</button>
          <button type="button" style={{ ...BTN_PRIMARY, padding: "1rem 2rem", fontSize: "var(--text-md)" }}>
            lg
          </button>
        </div>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Default <strong>md</strong>. <code>sm</code> para UI dense (toolbar, table actions).{" "}
          <code>lg</code> para hero CTA. Mais que isso é improviso — refatore.
        </p>

        <h2 className="mb-6">Hierarquia em layout</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Cada bloco tem <strong>1 ação primária</strong>, opcionalmente
          1 secundária. 2+ primárias quebra hierarquia.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            padding: "var(--space-8) var(--space-6)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            background: "color-mix(in srgb, var(--color-fg) 3%, transparent)",
            marginBottom: "var(--space-12)",
          }}
        >
          <button type="button" style={BTN_PRIMARY}>Solicitar contato</button>
          <button type="button" style={BTN_GHOST}>Ver casos</button>
        </div>

        <h2 className="mb-6">Do / don&apos;t</h2>
        <ul className="prose">
          <li>✓ Verbo + objeto: <em>Solicitar contato</em>, <em>Baixar PDF</em>, <em>Criar conta</em>.</li>
          <li>✗ Genérico: <em>Clique aqui</em>, <em>Saiba mais</em>, <em>Enviar</em>.</li>
          <li>✓ Frase em capitalização BR: <em>Solicitar contato</em>.</li>
          <li>✗ Title-case: <em>Solicitar Contato</em>.</li>
          <li>✓ Foco visível com outline 2px <code>--color-accent</code>.</li>
          <li>✗ <code>outline: none</code> sem fallback (fere WCAG 2.4.7).</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
