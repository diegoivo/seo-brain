import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";
import { Crimes } from "@/components/brandbook/Crimes";

export const metadata = { title: "Tipografia" };

const SCALE = [
  { token: "--text-4xl", size: "4.736rem", use: "h1 (clamp)" },
  { token: "--text-3xl", size: "3.553rem", use: "h2" },
  { token: "--text-2xl", size: "2.667rem", use: "h3" },
  { token: "--text-xl",  size: "2rem",     use: "h4" },
  { token: "--text-lg",  size: "1.5rem",   use: "h5 / lead paragraph" },
  { token: "--text-md",  size: "1.125rem", use: "body default" },
  { token: "--text-base",size: "1rem",     use: "UI dense (label, button)" },
  { token: "--text-sm",  size: "0.844rem", use: "meta, help text" },
  { token: "--text-xs",  size: "0.75rem",  use: "eyebrow, microcopy" },
];

export default function Typography() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Sistema visual · Tipografia"
          state="F+M"
          title="Escala canônica."
          lead="Perfect fourth (1.333) sobre body 1.125rem. Tokens em globals.css. Filosofia em docs/typography.md. Mude as fontes; escala e ritmo permanecem."
        />

        <h2 className="mb-8">Headings em layout real</h2>
        <article
          className="prose"
          style={{ marginBottom: "var(--space-16)", maxWidth: "100%" }}
        >
          <p className="eyebrow">Categoria · 04 mai 2026</p>
          <h1 style={{ marginTop: "var(--space-3)" }}>
            Headline em h1 — text-wrap balance evita rios.
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-muted)",
              maxWidth: "55ch",
            }}
          >
            Sub-headline opcional em <code>--text-lg</code>: descreve o tema em
            uma frase só, ressoa com a headline sem repetir.
          </p>
          <h2>Subtítulo em h2 — anchor-down spacing</h2>
          <p>
            Note como o <strong>h2 acima</strong> está mais perto deste
            parágrafo do que do conteúdo anterior. Isso é{" "}
            <code>margin-block-start: 2em</code> + <code>margin-block-end: 0.5em</code>:
            o heading ancora visualmente o texto que ele introduz.
          </p>
          <p>
            Body em <code>1.125rem</code>, line-height 1.7, measure 65ch.
            Parágrafos com <code>text-wrap: pretty</code> evitam órfãs. Em PT-BR
            com <code>lang=&quot;pt-BR&quot;</code>, hyphens auto funciona em
            Chrome, Safari e Firefox.
          </p>
          <h3>h3 quando? Subseção dentro de h2</h3>
          <p>
            Use h3 para sub-tópico claro. <strong>Nunca pule</strong> de h1
            direto para h3 — rompe semântica e SEO. Se um h2 é muito grande, a
            cura é dividir em mais de um h2, não cair em h3.
          </p>
          <h4>h4 e abaixo: raros</h4>
          <p>
            Se você precisa de h4, provavelmente o conteúdo está fragmentado
            demais. Considere uma lista, callout ou tabela.
          </p>
        </article>

        <h2 className="mb-8">Escala completa</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "var(--space-16)",
          }}
        >
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

        <h2 className="mb-8">UI dense — formulário compacto</h2>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            padding: "var(--space-6)",
            marginBottom: "var(--space-16)",
            display: "grid",
            gap: "var(--space-4)",
            maxWidth: "420px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                marginBottom: "var(--space-1)",
              }}
            >
              Nome
            </label>
            <input
              type="text"
              placeholder="Maria Silva"
              style={{
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.25rem",
                fontSize: "var(--text-base)",
                fontFamily: "inherit",
              }}
            />
            <p
              style={{
                margin: "var(--space-1) 0 0",
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
              }}
            >
              Como você quer ser identificada.
            </p>
          </div>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              margin: 0,
            }}
          >
            Label <code>--text-sm</code> · input <code>--text-base</code> · help text{" "}
            <code>--text-sm</code> · microcopy <code>--text-xs</code>
          </p>
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
            <h3 style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xl)" }}>
              Como otimizar SEO técnico em 2026
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
                marginTop: "var(--space-2)",
              }}
            >
              Capitalização brasileira: 1ª maiúscula + nomes próprios. SEO mantém caixa-alta (sigla).
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
            <h3 style={{ marginTop: "var(--space-2)", fontSize: "var(--text-xl)" }}>
              Como Otimizar SEO Técnico Em 2026
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-muted)",
                marginTop: "var(--space-2)",
              }}
            >
              Title-case americano. Não é regra brasileira.
            </p>
          </div>
        </div>

        <Crimes
          category="tipografia"
          items={[
            {
              name: "Crime do title-case americano",
              why: "'Como Otimizar SEO Em 2026'. Capitalização BR: 1ª maiúscula + nomes próprios + siglas. Aplicar é correção ortográfica, não preferência.",
            },
            {
              name: "Crime do anchor-up",
              why: "Heading com margin simétrico (2em top + 2em bottom). Faz parecer flutuando entre parágrafos. Anchor-down (margin-top muito maior que bottom) ancora o heading no conteúdo abaixo.",
            },
            {
              name: "Crime da line-height 1.5 em parágrafo longo",
              why: "Cansa a leitura em texto extenso. .prose usa 1.7 — herança Bringhurst. 1.5 é mínimo aceitável só em UI dense.",
            },
            {
              name: "Crime do max-width 100% em prose",
              why: "Linha com 120ch+ é antipattern de leitura. Olho perde início da próxima linha. .prose limita em 65ch (faixa Butterick).",
            },
            {
              name: "Crime do letter-spacing em body",
              why: "Tracking ajustado em texto corrido. Não melhora leitura, parece estilo ad-hoc. Reservado para headings ≥ 2rem (negativo) e eyebrows uppercase (positivo 0.1em).",
            },
            {
              name: "Crime da fonte Inter como default",
              why: "Não é crime ter Inter — é crime escolher Inter sem motivo. /design-init pergunta atmosfera; se 'editorial sério', talvez serif. Inter é fallback de quem não decidiu.",
            },
          ]}
        />
      </GridCol>
    </GridContainer>
  );
}
