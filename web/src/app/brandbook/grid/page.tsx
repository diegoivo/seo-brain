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

const subgridCardStyle = {
  display: "grid",
  gridTemplateRows: "subgrid",
  gridRow: "span 3",
  gap: "var(--space-3)",
  padding: "var(--space-5)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
};

export default function Grid() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Grid</p>
        <h1 className="mb-8">12 colunas escalonadas.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
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
          Subgrid — alinhamento herdado
        </h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-8)", maxWidth: "100%" }}
        >
          Cards filhos com <code>grid-template-rows: subgrid</code> herdam
          linhas do pai. Header, body e footer alinham mesmo com conteúdos
          de tamanhos diferentes.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gridTemplateRows: "auto auto auto",
            gap: "var(--space-4)",
          }}
        >
          {[
            { t: "Card 1", b: "Body curto.", f: "footer" },
            {
              t: "Card 2 com título maior",
              b: "Body com mais texto, ocupa duas linhas no desktop e três no mobile.",
              f: "footer",
            },
            { t: "Card 3", b: "Médio aqui.", f: "footer" },
          ].map((c, i) => (
            <article key={i} style={subgridCardStyle}>
              <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>{c.t}</h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                  lineHeight: 1.5,
                }}
              >
                {c.b}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-xs)",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {c.f}
              </p>
            </article>
          ))}
        </div>
      </GridCol>

      <GridCol span={4} spanMd={8} spanLg={12}>
        <h2 style={{ marginTop: "var(--space-16)", marginBottom: "var(--space-8)" }}>
          Container queries — componente, não viewport
        </h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-8)", maxWidth: "100%" }}
        >
          O componente abaixo declara <code>container-type: inline-size</code> e
          adapta layout pelo container, não pela viewport. Redimensione a janela
          ou inspecione com DevTools mobile pra ver virar coluna.
        </p>
        <div style={{ containerType: "inline-size", marginBottom: "var(--space-8)" }}>
          <div
            style={{
              display: "grid",
              gap: "var(--space-4)",
              padding: "var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              gridTemplateColumns: "1fr",
            }}
            className="cq-card"
          >
            <p className="eyebrow">Container query</p>
            <h3 style={{ margin: 0 }}>
              Componente que se adapta ao próprio espaço.
            </h3>
            <p
              style={{
                margin: 0,
                color: "var(--color-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Em containers ≥ 480px vira 2 colunas (texto + meta).
            </p>
          </div>
        </div>
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

      <GridCol span={4} spanMd={8} spanLg={10}>
        <h2 style={{ marginTop: "var(--space-16)", marginBottom: "var(--space-8)" }}>
          Regra do primeiro viewport
        </h2>
        <div className="prose">
          <p>
            Hero precisa caber em <strong>100dvh mobile</strong> e{" "}
            <strong>~80vh desktop</strong> sem scroll. Antipadrões automáticos:
          </p>
          <ul>
            <li>Headline com <code>text-[15vw]</code> ou maior em mobile.</li>
            <li>Display font &gt; 6rem em mobile portrait.</li>
            <li>Padding vertical do hero &gt; 50% da viewport.</li>
            <li>Hero com 4+ blocos verticais em mobile.</li>
            <li>Foto vertical 4:5 ocupando 70%+ da viewport.</li>
          </ul>
          <p>
            Validação obrigatória: simule em viewport 375×812 (iPhone 14). Se
            não cabe, refaça.
          </p>
        </div>
      </GridCol>
    </GridContainer>
  );
}
