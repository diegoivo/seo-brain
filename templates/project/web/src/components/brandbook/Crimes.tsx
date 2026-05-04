// Bloco "Crimes" — antipatterns nomeados por seção do brandbook.
// Inspirado na ideia da Vtex (color crimes, logo crimes, composition crimes)
// mas linguagem PT-BR direta. Substitui "do/don't" genérico — cada crime
// tem nome próprio, citável.

type Crime = {
  /** Nome curto do antipattern. Ex: "Anchor-down crime" */
  name: string;
  /** Por que é crime — 1 frase. */
  why: string;
};

type CrimesProps = {
  /** Categoria — vira parte do título: "Crimes de [category]". */
  category: string;
  items: Crime[];
};

export function Crimes({ category, items }: CrimesProps) {
  return (
    <section style={{ marginBottom: "var(--space-16)" }}>
      <h2 style={{ marginBottom: "var(--space-3)" }}>Crimes de {category}</h2>
      <p
        className="prose"
        style={{
          marginBottom: "var(--space-6)",
          maxWidth: "100%",
          color: "var(--color-muted)",
        }}
      >
        Antipatterns nomeados. Quando um aparece num PR, cite pelo nome — vira
        atalho do time.
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gap: "var(--space-4)",
        }}
      >
        {items.map((c, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "var(--space-4)",
              padding: "var(--space-3) 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <code
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                fontFamily: "var(--font-mono)",
                paddingTop: "0.15em",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </code>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: "var(--text-md)",
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  margin: "var(--space-1) 0 0",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                {c.why}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
