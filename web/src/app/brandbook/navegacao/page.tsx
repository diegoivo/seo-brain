import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Navegação" };

export default function Navegacao() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes · Navegação</p>
        <h1 className="mb-8">Header, footer, breadcrumb, skip-link.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Estrutura mínima de navegação. Skip-link é obrigatório (WCAG 2.4.1).
        </p>

        <h2 className="mb-6">Skip link</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Primeiro elemento focável no <code>&lt;body&gt;</code>. Foca para{" "}
          <code>#main</code>. Visível só com <code>:focus-visible</code>. Já
          existe global em <code>web/src/app/layout.tsx</code>.
        </p>
        <pre
          style={{
            background: "color-mix(in srgb, var(--color-fg) 4%, transparent)",
            padding: "var(--space-4)",
            borderRadius: "0.5rem",
            fontSize: "var(--text-sm)",
            overflowX: "auto",
            marginBottom: "var(--space-12)",
          }}
        >
          <code>{`<a href="#main" className="skip-link">
  Pular para o conteúdo
</a>`}</code>
        </pre>

        <h2 className="mb-6">Header</h2>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--space-4) var(--space-6)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            marginBottom: "var(--space-12)",
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-md)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              color: "var(--color-fg)",
            }}
          >
            seobrain
          </a>
          <nav style={{ display: "flex", gap: "var(--space-6)" }}>
            <a href="#" style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", textDecoration: "none" }}>Blog</a>
            <a href="#" style={{ fontSize: "var(--text-sm)", color: "var(--color-fg)", textDecoration: "none", fontWeight: 500 }} aria-current="page">Sobre</a>
            <a href="#" style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", textDecoration: "none" }}>Contato</a>
          </nav>
        </header>

        <h2 className="mb-6">Breadcrumb</h2>
        <nav aria-label="breadcrumb" style={{ marginBottom: "var(--space-12)" }}>
          <ol
            style={{
              display: "flex",
              gap: "var(--space-3)",
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "var(--text-sm)",
              color: "var(--color-muted)",
            }}
          >
            <li>
              <a href="#" style={{ color: "inherit" }}>Início</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="#" style={{ color: "inherit" }}>Blog</a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" style={{ color: "var(--color-fg)" }}>
              Headline do post
            </li>
          </ol>
        </nav>

        <h2 className="mb-6">Footer</h2>
        <footer
          style={{
            padding: "var(--space-12) var(--space-6) var(--space-8)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            display: "grid",
            gap: "var(--space-8)",
            marginBottom: "var(--space-12)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-8)" }}>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                seobrain
              </p>
              <p style={{ marginTop: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)", maxWidth: "32ch" }}>
                Posicionamento curto da marca em uma frase.
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Conteúdo</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-2)" }}>
                <li><a href="#" style={{ color: "var(--color-fg)", fontSize: "var(--text-sm)", textDecoration: "none" }}>Blog</a></li>
                <li><a href="#" style={{ color: "var(--color-fg)", fontSize: "var(--text-sm)", textDecoration: "none" }}>Newsletter</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Marca</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-2)" }}>
                <li><a href="#" style={{ color: "var(--color-fg)", fontSize: "var(--text-sm)", textDecoration: "none" }}>Sobre</a></li>
                <li><a href="#" style={{ color: "var(--color-fg)", fontSize: "var(--text-sm)", textDecoration: "none" }}>Contato</a></li>
              </ul>
            </div>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", margin: 0, fontFamily: "var(--font-mono)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
            © 2026 · Powered by{" "}
            <a href="https://agenticseo.sh" style={{ color: "inherit" }}>
              Agentic SEO
            </a>
          </p>
        </footer>

        <h2 className="mb-6">Regras</h2>
        <ul className="prose">
          <li><strong>Header:</strong> wordmark à esquerda, nav à direita. <code>aria-current=&quot;page&quot;</code> no item ativo. Logo é link pra <code>/</code>.</li>
          <li><strong>Breadcrumb:</strong> só em páginas internas profundas (≥ 2 níveis). Use <code>&lt;ol&gt;</code> com <code>aria-label=&quot;breadcrumb&quot;</code>.</li>
          <li><strong>Footer credit:</strong> &quot;Powered by Agentic SEO&quot; default. Opt-out se o usuário pedir explícito (regra AGENTS.md §8.3).</li>
          <li><strong>Sticky nav:</strong> não default. Adicionar só se justificado.</li>
          <li><strong>Mobile:</strong> hamburger menu off-canvas. Foco trap dentro do menu aberto.</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
