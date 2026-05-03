import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Tipografia" };

const SCALE = [
  { token: "--text-4xl", size: "4.736rem", use: "h1 (clamp)" },
  { token: "--text-3xl", size: "3.553rem", use: "h2" },
  { token: "--text-2xl", size: "2.667rem", use: "h3" },
  { token: "--text-xl",  size: "2rem",     use: "h4" },
  { token: "--text-lg",  size: "1.5rem",   use: "h5 / lead" },
  { token: "--text-md",  size: "1.125rem", use: "body default" },
  { token: "--text-base",size: "1rem",     use: "UI" },
  { token: "--text-sm",  size: "0.844rem", use: "meta" },
  { token: "--text-xs",  size: "0.75rem",  use: "eyebrow" },
];

export default function Typography() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Tipografia</p>
        <h1 className="mb-8">Escala canônica.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          Perfect fourth (1.333) sobre body <code>1.125rem</code>. Tokens em{" "}
          <code>globals.css</code> · filosofia em <code>docs/typography.md</code>.
          Mude as fontes (<code>--font-display</code>, <code>--font-body</code>)
          — escala e ritmo permanecem.
        </p>

        <h2 className="mb-8">Headings</h2>
        <div style={{ display: "grid", gap: "var(--space-8)", marginBottom: "var(--space-16)" }}>
          <h1 style={{ margin: 0 }}>Headline em h1 — text-wrap balance.</h1>
          <h2 style={{ margin: 0 }}>Subtítulo em h2 — letter-spacing -0.02em.</h2>
          <h3 style={{ margin: 0 }}>Seção em h3 — line-height 1.2.</h3>
          <h4 style={{ margin: 0 }}>Bloco em h4.</h4>
        </div>

        <h2 className="mb-8">Escala</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-16)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Token</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Tamanho</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Uso</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map((row) => (
              <tr key={row.token} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
                  {row.token}
                </td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{row.size}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                  {row.use}
                </td>
                <td style={{ padding: "var(--space-3)" }}>
                  <span style={{ fontSize: `var(${row.token})`, lineHeight: 1.1 }}>Aa</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-8">Parágrafo de leitura</h2>
        <article className="prose">
          <p>
            Body em <code>1.125rem (18px)</code>, line-height <code>1.7</code>,
            measure <code>65ch</code>. Esta linha tem cerca de 65 caracteres,
            que é a faixa Bringhurst/Butterick para leitura confortável em telas
            modernas — sem retorno cansativo nem perda do início da linha
            seguinte.
          </p>
          <p>
            <code>text-wrap: pretty</code> evita órfãs (última palavra do
            parágrafo numa linha sozinha) e melhora hifenização. Browser
            suporta nativamente desde Chrome 117, Safari 17.4, Firefox 121 —
            cobertura &gt; 92% em 2026.
          </p>
          <h3>Heading com anchor-down</h3>
          <p>
            Note que esse h3 está mais perto deste parágrafo do que do que vem
            antes. Margin-top muito maior que margin-bottom: o heading ancora
            visualmente o conteúdo abaixo.
          </p>
          <blockquote>
            Tipografia é o ingrediente que mais distingue site sério de site
            genérico — aqui ela é decidida por construção, não improvisação.
          </blockquote>
          <h3>Lista com pretty wrap</h3>
          <ul>
            <li>Cada item herda <code>text-wrap: pretty</code></li>
            <li>Hifenização automática em <code>lang=&quot;pt-BR&quot;</code></li>
            <li>Spacing entre itens: <code>0.4em</code> (4-base canônico)</li>
          </ul>
        </article>
      </GridCol>
    </GridContainer>
  );
}
