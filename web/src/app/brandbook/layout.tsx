import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Brandbook",
  description: "Design system ao vivo deste projeto. Dev-only, noindex.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { href: "/brandbook", label: "Overview" },
  { href: "/brandbook/typography", label: "Tipografia" },
  { href: "/brandbook/grid", label: "Grid" },
  { href: "/brandbook/colors", label: "Cores" },
  { href: "/brandbook/components", label: "Componentes" },
  { href: "/brandbook/wordmark", label: "Wordmark" },
];

export default function BrandbookLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        minHeight: "100dvh",
      }}
      className="brandbook-shell"
    >
      <aside
        style={{
          padding: "var(--space-8) var(--space-6)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/brandbook"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-md)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Brandbook
        </Link>
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            marginTop: "var(--space-4)",
          }}
        >
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
                textDecoration: "none",
              }}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main
        id="main"
        style={{
          padding: "var(--space-12) 0",
        }}
      >
        {children}
      </main>
    </div>
  );
}
