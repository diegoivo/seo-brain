import Link from "next/link";
import { GridContainer, GridCol } from "@/components/grid";

const SECTIONS = [
  {
    href: "/brandbook/typography",
    title: "Tipografia",
    summary:
      "Escala perfect fourth (1.333) sobre body 1.125rem, line-height 1.7, measure 65ch, anchor-down spacing.",
  },
  {
    href: "/brandbook/grid",
    title: "Grid",
    summary:
      "12 colunas escalonadas (4/8/12), subgrid, container queries, spacing scale 4-base.",
  },
  {
    href: "/brandbook/colors",
    title: "Cores",
    summary:
      "Pré-onboard: neutro funcional. Pós-onboard: paleta gerada por /design-init.",
  },
  {
    href: "/brandbook/components",
    title: "Componentes",
    summary: "Botões, eyebrow, callouts, blockquote — primitivos editoriais.",
  },
  {
    href: "/brandbook/wordmark",
    title: "Wordmark",
    summary:
      "Apenas wordmark — não criamos logo/ícone. Tipografia é a identidade.",
  },
];

export default function BrandbookHome() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook</p>
        <h1 className="mb-8">Design system ao vivo.</h1>
        <p
          className="prose"
          style={{ color: "var(--color-muted)", marginBottom: "var(--space-12)" }}
        >
          Esta seção é dev-only (noindex). Cada rota renderiza tokens reais do{" "}
          <code>globals.css</code> — alterar o token aqui altera o site todo.
          Pré-onboard, exibe defaults canônicos do framework. Pós-onboard,
          reflete decisões do <code>/design-init</code>.
        </p>
      </GridCol>

      <GridCol span={4} spanMd={8} spanLg={12}>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            listStyle: "none",
            padding: 0,
          }}
        >
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                style={{
                  display: "block",
                  padding: "var(--space-6)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  color: "inherit",
                  height: "100%",
                }}
              >
                <h3 style={{ marginBottom: "var(--space-3)" }}>{s.title}</h3>
                <p
                  style={{
                    fontSize: "var(--text-md)",
                    color: "var(--color-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {s.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </GridCol>
    </GridContainer>
  );
}
