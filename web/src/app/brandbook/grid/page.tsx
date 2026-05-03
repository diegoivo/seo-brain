import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Grid" };

const cellStyle = {
  background: "color-mix(in srgb, var(--color-fg) 6%, transparent)",
  border: "1px solid var(--color-border)",
  padding: "var(--space-3)",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-sm)",
  textAlign: "center" as const,
};

export default function Grid() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Grid</p>
        <h1 className="mb-8">12 colunas escalonadas.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          Mobile <strong>4 col</strong> · Tablet <strong>8 col</strong> ·
          Desktop <strong>12 col</strong>. Filosofia em{" "}
          <code>docs/grid-system.md</code>.
        </p>
      </GridCol>

      <GridCol span={4} spanMd={8} spanLg={12}>
        <h2 className="mb-8">Grid base — todas as colunas</h2>
      </GridCol>

      {Array.from({ length: 12 }).map((_, i) => (
        <GridCol
          key={i}
          span={1}
          spanMd={1}
          spanLg={1}
          // mobile só tem 4 colunas; esconde índices 4–11 abaixo de tablet
          className={i >= 4 ? "hide-on-mobile" : ""}
        >
          <div style={cellStyle}>{i + 1}</div>
        </GridCol>
      ))}

      <GridCol span={4} spanMd={8} spanLg={12}>
        <h2 style={{ marginTop: "var(--space-16)", marginBottom: "var(--space-8)" }}>
          Layouts comuns
        </h2>
      </GridCol>

      <GridCol span={4} spanMd={4} spanLg={6}>
        <div style={cellStyle}>span 4 / 4 / 6 — esquerda</div>
      </GridCol>
      <GridCol span={4} spanMd={4} spanLg={6}>
        <div style={cellStyle}>span 4 / 4 / 6 — direita</div>
      </GridCol>

      <GridCol span={4} spanMd={3} spanLg={4}>
        <div style={cellStyle}>span 4 / 3 / 4</div>
      </GridCol>
      <GridCol span={4} spanMd={5} spanLg={8}>
        <div style={cellStyle}>span 4 / 5 / 8 (sidebar + main)</div>
      </GridCol>

      <GridCol span={4} spanMd={2} spanLg={3}>
        <div style={cellStyle}>3</div>
      </GridCol>
      <GridCol span={4} spanMd={2} spanLg={3}>
        <div style={cellStyle}>3</div>
      </GridCol>
      <GridCol span={4} spanMd={2} spanLg={3}>
        <div style={cellStyle}>3</div>
      </GridCol>
      <GridCol span={4} spanMd={2} spanLg={3}>
        <div style={cellStyle}>3 (4 cards desktop)</div>
      </GridCol>

      <GridCol span={4} spanMd={8} spanLg={12}>
        <h2 style={{ marginTop: "var(--space-16)", marginBottom: "var(--space-8)" }}>
          Spacing scale (4-base)
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[
            { token: "--space-1", value: "4px" },
            { token: "--space-2", value: "8px" },
            { token: "--space-3", value: "12px" },
            { token: "--space-4", value: "16px" },
            { token: "--space-6", value: "24px" },
            { token: "--space-8", value: "32px" },
            { token: "--space-12", value: "48px" },
            { token: "--space-16", value: "64px" },
            { token: "--space-24", value: "96px" },
            { token: "--space-32", value: "128px" },
          ].map((s) => (
            <div key={s.token} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
              <span
                style={{
                  width: `var(${s.token})`,
                  height: "0.5rem",
                  background: "var(--color-fg)",
                  flexShrink: 0,
                }}
              />
              <code style={{ fontSize: "var(--text-sm)" }}>{s.token}</code>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </GridCol>
    </GridContainer>
  );
}
