import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Wordmark" };

export default function Wordmark() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Wordmark</p>
        <h1 className="mb-8">Tipografia é a identidade.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          O SEO Brain <strong>não cria logo nem ícone</strong>. Logo é decisão
          de marca — pertence ao usuário, não ao framework. O que entregamos é
          o <strong>wordmark</strong>: o nome da marca renderizado com a fonte
          display, calibrado para servir como assinatura visual.
        </p>

        <h2 className="mb-8">Wordmark default</h2>
        <div
          style={{
            padding: "var(--space-16) var(--space-8)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            display: "flex",
            justifyContent: "center",
            marginBottom: "var(--space-12)",
            background: "var(--color-bg)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              letterSpacing: "-0.02em",
              fontWeight: 600,
              color: "var(--color-fg)",
            }}
          >
            seobrain
          </span>
        </div>

        <h2 className="mb-8">Variações</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-12)",
          }}
        >
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-3)" }}>
              Header / footer (md)
            </p>
          </div>
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              background: "var(--color-fg)",
              color: "var(--color-bg)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", opacity: 0.7, marginTop: "var(--space-3)" }}>
              Inversa (dark bg)
            </p>
          </div>
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-md)",
                letterSpacing: "0.02em",
                textTransform: "lowercase",
              }}
            >
              /seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-3)" }}>
              Mono / atribuição
            </p>
          </div>
        </div>

        <h2 className="mb-6">Regras</h2>
        <ul className="prose">
          <li>Nunca usar wordmark em tamanho menor que <code>--text-md</code>.</li>
          <li>Sem ícones, símbolos ou marcas decorativas. Apenas texto.</li>
          <li>Letter-spacing -0.02em em qualquer tamanho ≥ <code>--text-xl</code>.</li>
          <li>
            Se o usuário quiser logo de verdade, é pedido externo —
            o framework não substitui designer de marca.
          </li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
