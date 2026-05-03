import { GridContainer, GridCol } from "@/components/grid";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";

export const metadata = { title: "Cores" };

const TOKENS = [
  { token: "--color-bg",        role: "Fundo principal",        hex: "#ffffff" },
  { token: "--color-fg",        role: "Texto principal",        hex: "#0a0a0a" },
  { token: "--color-muted",     role: "Texto secundário",       hex: "#6b7280" },
  { token: "--color-border",    role: "Hairlines, bordas",      hex: "#e5e7eb" },
  { token: "--color-accent",    role: "Botão primário, ações",  hex: "#0a0a0a" },
  { token: "--color-accent-fg", role: "Texto sobre accent",     hex: "#ffffff" },
];

// WCAG contrast — calculado em dev a partir dos hex defaults.
// Pós-onboard, o brand pode trocar os hex; o brandbook mostra os defaults.
function relativeLuminance(hex: string) {
  const c = hex.replace("#", "");
  const rgb = [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(a: string, b: string) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

function rating(ratio: number) {
  if (ratio >= 7) return { label: "AAA", ok: true };
  if (ratio >= 4.5) return { label: "AA", ok: true };
  if (ratio >= 3) return { label: "AA Large", ok: true };
  return { label: "Falha", ok: false };
}

const PAIRS = [
  { fg: "--color-fg",        bg: "--color-bg",     fgHex: "#0a0a0a", bgHex: "#ffffff", use: "Body sobre fundo" },
  { fg: "--color-muted",     bg: "--color-bg",     fgHex: "#6b7280", bgHex: "#ffffff", use: "Texto secundário sobre fundo" },
  { fg: "--color-accent-fg", bg: "--color-accent", fgHex: "#ffffff", bgHex: "#0a0a0a", use: "Texto sobre botão primário" },
];

export default function Colors() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Cores</p>
        <h1 className="mb-8">Paleta funcional.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Pré-onboard, paleta neutra (não AI-slop). Pós-onboard, gerada por{" "}
          <code>/design-init</code> a partir do briefing visual. Tokens em{" "}
          <code>globals.css</code> · 6 papéis funcionais (não &quot;primary 50–900&quot;
          que ninguém usa).
        </p>
        <TemplateBanner
          variant="template"
          message="Pré-onboard, mostramos os hex defaults canônicos abaixo. Pós-/onboard, brain/DESIGN.tokens.json sobrescreve --color-* em :root, e os swatches abaixo passam a refletir a paleta da marca."
        />

        <h2 className="mb-8">6 papéis funcionais</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
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
                    marginBottom: "var(--space-1)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-muted)",
                  }}
                >
                  {t.role}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-xs)",
                    color: "var(--color-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  default {t.hex}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-8">Contraste WCAG (defaults)</h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}
        >
          Contraste calculado dos hex defaults. Se a marca trocar tokens,
          recomenda-se rerunning o checklist em <code>/brandbook/acessibilidade</code>.
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "var(--space-16)",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Par</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Uso</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Razão</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>WCAG</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((p) => {
              const ratio = contrast(p.fgHex, p.bgHex);
              const r = rating(ratio);
              return (
                <tr key={`${p.fg}-${p.bg}`} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>
                    {p.fg} sobre {p.bg}
                  </td>
                  <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                    {p.use}
                  </td>
                  <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>
                    {ratio.toFixed(2)}:1
                  </td>
                  <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>
                    <span
                      style={{
                        fontWeight: 500,
                        color: r.ok ? "var(--color-fg)" : "var(--color-muted)",
                      }}
                    >
                      {r.label}
                    </span>
                  </td>
                  <td style={{ padding: "var(--space-3)" }}>
                    <span
                      style={{
                        background: p.bgHex,
                        color: p.fgHex,
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "0.25rem",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        display: "inline-block",
                      }}
                    >
                      Aa Texto
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="mb-8">Estados</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-4)",
            marginBottom: "var(--space-16)",
          }}
        >
          {[
            { label: "default", style: { background: "var(--color-accent)", color: "var(--color-accent-fg)" } },
            { label: "hover (opacity .85)", style: { background: "var(--color-accent)", color: "var(--color-accent-fg)", opacity: 0.85 } },
            { label: "active (opacity .7)", style: { background: "var(--color-accent)", color: "var(--color-accent-fg)", opacity: 0.7 } },
            { label: "disabled (50%)", style: { background: "var(--color-accent)", color: "var(--color-accent-fg)", opacity: 0.5, pointerEvents: "none" as const } },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                ...s.style,
                padding: "var(--space-4)",
                borderRadius: "0.25rem",
                textAlign: "center",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          ))}
        </div>

        <h2 className="mb-8">Do / don&apos;t</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          <div
            style={{
              padding: "var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
            }}
          >
            <p className="eyebrow" style={{ color: "var(--color-fg)" }}>
              ✓ Do
            </p>
            <p style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
              <code>--color-fg</code> sobre <code>--color-bg</code> em texto
              corrido. <code>--color-accent</code> apenas em CTAs e ações.
            </p>
          </div>
          <div
            style={{
              padding: "var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
            }}
          >
            <p className="eyebrow" style={{ color: "var(--color-muted)" }}>
              ✗ Don&apos;t
            </p>
            <p style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
              Não use <code>--color-accent</code> como cor de texto de
              parágrafo. Não invente cores fora dos 6 papéis (ex.: amarelo
              para warning) — defina um papel novo no DESIGN.tokens.json.
            </p>
          </div>
        </div>
      </GridCol>
    </GridContainer>
  );
}
