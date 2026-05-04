import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";
import { BRAND } from "@/lib/brand-config";

export const metadata = { title: "Aplicações" };

const applicationStyle = {
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  overflow: "hidden",
  background: "var(--color-bg)",
};

const previewStyle = {
  background: "color-mix(in srgb, var(--color-fg) 6%, transparent)",
  padding: "var(--space-8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "180px",
};

const wordmarkStyle = {
  fontFamily: "var(--font-display)",
  letterSpacing: "-0.02em",
  fontWeight: 600,
};

export default function Aplicacoes() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Identidade · Aplicações"
          state="F+M"
          title="Onde a marca aparece."
          lead="5 superfícies canônicas: header, footer, OG image (1200×630), favicon (32×32) e avatar social (1:1). Tamanhos mínimos em /brandbook/marca."
        />

        <h2 className="mb-6">Header</h2>
        <div style={applicationStyle}>
          <div
            style={{
              ...previewStyle,
              padding: "var(--space-4) var(--space-6)",
              minHeight: "auto",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}
          >
            <span style={{ ...wordmarkStyle, fontSize: "var(--text-md)" }}>
              {BRAND.wordmark}
            </span>
            <nav style={{ display: "flex", gap: "var(--space-6)", fontSize: "var(--text-sm)" }}>
              <a href="#" style={{ textDecoration: "none", color: "var(--color-muted)" }}>Home</a>
              <a href="#" style={{ textDecoration: "none", color: "var(--color-muted)" }}>Blog</a>
              <a href="#" style={{ textDecoration: "none", color: "var(--color-muted)" }}>Sobre</a>
            </nav>
          </div>
          <div style={{ padding: "var(--space-4) var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            Wordmark <code>--text-md</code> · nav <code>--text-sm</code> · padding{" "}
            <code>--space-4 --space-6</code> · borda inferior 1px <code>--color-border</code>.
          </div>
        </div>

        <h2 style={{ marginTop: "var(--space-12)" }} className="mb-6">Footer</h2>
        <div style={applicationStyle}>
          <div
            style={{
              padding: "var(--space-12) var(--space-6) var(--space-8)",
              borderTop: "1px solid var(--color-border)",
              display: "grid",
              gap: "var(--space-6)",
            }}
          >
            <span style={{ ...wordmarkStyle, fontSize: "var(--text-md)" }}>
              {BRAND.wordmark}
            </span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", margin: 0, maxWidth: "55ch" }}>
              Posicionamento curto da marca em uma frase. Vem de{" "}
              <code>brain/index.md</code>.
            </p>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", margin: 0, fontFamily: "var(--font-mono)" }}>
              © 2026 · Powered by{" "}
              <a href="https://agenticseo.sh" style={{ color: "inherit" }}>
                Agentic SEO
              </a>
            </p>
          </div>
          <div style={{ padding: "var(--space-4) var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-muted)", borderTop: "1px solid var(--color-border)" }}>
            Footer credit <em>Powered by Agentic SEO</em> é default e opt-out
            (regra em AGENTS.md §8.3). Mantenha se possível — ajuda a divulgar o framework.
          </div>
        </div>

        <h2 style={{ marginTop: "var(--space-12)" }} className="mb-6">OG Image (1200×630)</h2>
        <div style={applicationStyle}>
          <div
            style={{
              aspectRatio: "1200 / 630",
              background: "var(--color-fg)",
              color: "var(--color-bg)",
              padding: "var(--space-12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span style={{ ...wordmarkStyle, fontSize: "var(--text-lg)", opacity: 0.85 }}>
              {BRAND.wordmark}
            </span>
            <h3
              style={{
                ...wordmarkStyle,
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                lineHeight: 1.05,
                margin: 0,
                maxWidth: "75%",
              }}
            >
              Headline do post · text-wrap balance
            </h3>
            <p style={{ fontSize: "var(--text-sm)", opacity: 0.6, margin: 0, fontFamily: "var(--font-mono)" }}>
              dominio.com
            </p>
          </div>
          <div style={{ padding: "var(--space-4) var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            1200×630 · contraste ≥ 4.5:1 · wordmark + headline + url. Sem
            decoração. Geração automática via{" "}
            <code>web/src/app/opengraph-image.tsx</code> (Next 16).
          </div>
        </div>

        <h2 style={{ marginTop: "var(--space-12)" }} className="mb-6">Favicon (32×32)</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          {[16, 32, 64].map((size) => (
            <div key={size} style={applicationStyle}>
              <div
                style={{
                  ...previewStyle,
                  flexDirection: "column",
                  gap: "var(--space-3)",
                  minHeight: "150px",
                }}
              >
                <div
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    background: "var(--color-fg)",
                    color: "var(--color-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: `${size * 0.5}px`,
                    borderRadius: "4px",
                  }}
                >
                  s
                </div>
                <code style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                  {size}×{size}px
                </code>
              </div>
            </div>
          ))}
        </div>

        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Sem logo do usuário, favicon é a primeira letra do wordmark sobre{" "}
          <code>--color-fg</code>. Com logo SVG em <code>web/public/logo.svg</code>
          {" "}com <code>currentColor</code>, recoloriza pelo CSS. Geração via{" "}
          <code>web/src/app/icon.tsx</code> (Next 16).
        </p>

        <h2 className="mb-6">Avatar social (1:1)</h2>
        <div
          style={{
            display: "flex",
            gap: "var(--space-6)",
            alignItems: "center",
            marginBottom: "var(--space-8)",
          }}
        >
          {[80, 120, 200].map((size) => (
            <div
              key={size}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: "var(--color-fg)",
                color: "var(--color-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: `${size * 0.4}px`,
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              s
            </div>
          ))}
        </div>
        <p className="prose">
          Quadrado preenchido em <code>--color-fg</code> com a inicial do
          wordmark, ou logo SVG centralizada com clear-space. LinkedIn, GitHub,
          X — usam crop circular: deixe margem.
        </p>
      </GridCol>
    </GridContainer>
  );
}
