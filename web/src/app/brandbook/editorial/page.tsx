import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Editorial" };

export default function Editorial() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes · Editorial</p>
        <h1 className="mb-8">Primitivos editoriais.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Tudo aqui vive dentro de <code>.prose</code> em posts e páginas
          longas. Aplicação canônica em <code>web/src/app/globals.css</code>.
        </p>

        <h2 className="mb-6">Eyebrow</h2>
        <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
          Categoria · 04 mai 2026
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginBottom: "var(--space-12)" }}>
          Mono uppercase, letter-spacing 0.1em. Use em capa de post (categoria
          + data), seção de site (label da seção), card hero.
        </p>

        <h2 className="mb-6">Blockquote</h2>
        <article className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <blockquote>
            Branding por consenso é o atalho mais caro que você pode tomar —
            paga 100% do que cobra a agência e zero do diferencial.
          </blockquote>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            Borda esquerda 3px <code>--color-accent</code>. Itálico opcional.
            Não use blockquote pra destacar parágrafo qualquer — só citação ou
            tese forte.
          </p>
        </article>

        <h2 className="mb-6">Code inline e pre</h2>
        <p className="prose" style={{ marginBottom: "var(--space-4)", maxWidth: "100%" }}>
          Inline: <code>--space-4</code> (token canônico). Block:
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
          <code>{`function calcularContraste(fg, bg) {
  const la = relativeLuminance(fg);
  const lb = relativeLuminance(bg);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}`}</code>
        </pre>

        <h2 className="mb-6">Callouts</h2>
        <div style={{ display: "grid", gap: "var(--space-4)", marginBottom: "var(--space-12)" }}>
          {[
            { variant: "note", color: "var(--color-accent)", label: "Note", body: "Use callouts para regras críticas. Use com parcimônia — todo callout no texto vira ruído." },
            { variant: "tip", color: "var(--color-muted)", label: "Tip", body: "Compatível com sintaxe Obsidian > [!warning] em arquivos do brain." },
            { variant: "warning", color: "var(--color-fg)", label: "Warning", body: "Algo perigoso: revogar API key, deletar branch main, push --force em produção." },
            { variant: "example", color: "var(--color-muted)", label: "Example", body: "Em /blogpost, exemplos vivos do brain (POVs aplicados em texto real) entram como callout 'example'." },
          ].map((c) => (
            <aside
              key={c.variant}
              role="note"
              style={{
                borderInlineStart: `3px solid ${c.color}`,
                padding: "var(--space-4) var(--space-6)",
                background: "color-mix(in srgb, var(--color-fg) 3%, transparent)",
                borderRadius: "0.25rem",
              }}
            >
              <p className="eyebrow" style={{ marginBottom: "var(--space-1)" }}>
                {c.label}
              </p>
              <p style={{ margin: 0 }}>{c.body}</p>
            </aside>
          ))}
        </div>

        <h2 className="mb-6">Tabela</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "var(--space-12)",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Métrica</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Mínimo</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Alvo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Lighthouse Performance", "95", "100"],
              ["Lighthouse SEO", "100", "100"],
              ["Lighthouse Accessibility", "95", "100"],
              ["seo-score.mjs", "90", "100"],
            ].map(([m, mi, al]) => (
              <tr key={m} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{m}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{mi}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", fontWeight: 500 }}>{al}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Listas</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li>Item 1: <code>text-wrap: pretty</code> herdado do <code>.prose</code>.</li>
          <li>Item 2: spacing entre itens <code>--space-2</code> (8px).</li>
          <li>Item 3: indentação 1.5em.</li>
          <li>Item 4: hifenização auto via <code>lang=&quot;pt-BR&quot;</code>.</li>
        </ul>

        <h2 className="mb-6">Badge / pill</h2>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
          {[
            { label: "template", muted: true },
            { label: "initialized", muted: false },
            { label: "rascunho", muted: true },
          ].map((b) => (
            <span
              key={b.label}
              style={{
                fontSize: "var(--text-xs)",
                padding: "var(--space-1) var(--space-3)",
                border: `1px solid var(${b.muted ? "--color-border" : "--color-fg"})`,
                color: `var(${b.muted ? "--color-muted" : "--color-fg"})`,
                borderRadius: "999px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.02em",
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </GridCol>
    </GridContainer>
  );
}
