import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Cores" };

const TOKENS = [
  { token: "--color-bg",        role: "Fundo principal" },
  { token: "--color-fg",        role: "Texto principal" },
  { token: "--color-muted",     role: "Texto secundário" },
  { token: "--color-border",    role: "Hairlines, bordas" },
  { token: "--color-accent",    role: "Botão primário, ações" },
  { token: "--color-accent-fg", role: "Texto sobre accent" },
];

export default function Colors() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Cores</p>
        <h1 className="mb-8">Paleta funcional.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          Pré-onboard, paleta neutra (não AI-slop). Pós-onboard, gerada por{" "}
          <code>/design-init</code> a partir do briefing visual. Tokens em{" "}
          <code>globals.css</code> · 6 papéis funcionais (não &quot;primary 50–900&quot;
          que ninguém usa).
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {TOKENS.map((t) => (
            <div
              key={t.token}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "120px",
                  background: `var(${t.token})`,
                  borderBottom: "1px solid var(--color-border)",
                }}
              />
              <div style={{ padding: "var(--space-4)" }}>
                <code
                  style={{
                    fontSize: "var(--text-sm)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t.token}
                </code>
                <p
                  style={{
                    marginTop: "var(--space-2)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                  }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GridCol>
    </GridContainer>
  );
}
