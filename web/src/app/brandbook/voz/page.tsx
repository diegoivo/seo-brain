import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";

export const metadata = { title: "Voz aplicada" };

const ANTIVICIOS = [
  "vale destacar",
  "é importante ressaltar",
  "em síntese",
  "em suma",
  "no cenário atual",
  "no mundo cada vez mais",
  "uma jornada de",
  "elevando ao próximo nível",
  "desbloqueando o potencial",
  "navegando pelas águas",
  "delve",
  "crucial",
  "robust",
  "comprehensive",
  "nuanced",
  "multifaceted",
  "pivotal",
  "tapestry",
];

const COMPARISONS = [
  {
    bad: "É importante ressaltar que o SEO técnico desempenha um papel crucial no cenário atual do marketing digital.",
    good: "SEO técnico é o piso. Sem ele, conteúdo bom morre no índice.",
    why: "Voz ativa, frase curta, posição clara. Sem antivícios.",
  },
  {
    bad: "No mundo cada vez mais competitivo das vendas B2B, é fundamental adotar uma abordagem comprehensive e robust.",
    good: "B2B vende quando o lead chega informado. SDR responde dúvida, não apresenta produto.",
    why: "Tira o filler genérico, entrega POV proprietário concreto.",
  },
  {
    bad: "Estamos elevando o seu negócio ao próximo nível através de uma jornada de transformação digital.",
    good: "Diagnóstico em 14 dias. Roadmap em 30. Implementação em 90.",
    why: "Promessas verificáveis, não slogans. Cada frase é uma decisão.",
  },
];

export default function Voz() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Voz e conteúdo · Voz aplicada"
          state="F+M"
          title="Como esta marca soa."
          lead="Princípios em brain/tom-de-voz.md. Aqui mostramos aplicação viva — antes/depois, do/don't, antivícios IA banidos."
        />

        <h2 className="mb-6">Princípios canônicos</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li><strong>Voz ativa</strong>. Sujeito faz, objeto recebe. <em>&quot;A skill detecta…&quot;</em>, não <em>&quot;É detectado pela skill…&quot;</em>.</li>
          <li><strong>Frase curta</strong>. Máx 25 palavras. Acima disso, divida.</li>
          <li><strong>Parágrafo enxuto</strong>. Máx 4 frases. Acima, divida ou vire lista.</li>
          <li><strong>Capitalização brasileira em headings</strong>: 1ª maiúscula + nomes próprios. Siglas mantêm caixa-alta (SEO, GEO).</li>
          <li><strong>POVs proprietários</strong>: cada peça pública carrega 3-5 posições que só esta marca sustenta.</li>
        </ul>

        <h2 className="mb-6">Antes / depois</h2>
        <div style={{ display: "grid", gap: "var(--space-6)", marginBottom: "var(--space-16)" }}>
          {COMPARISONS.map((c, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "var(--space-4) var(--space-6)",
                  borderBottom: "1px solid var(--color-border)",
                  background: "color-mix(in srgb, var(--color-fg) 4%, transparent)",
                }}
              >
                <p className="eyebrow" style={{ color: "var(--color-muted)", marginBottom: "var(--space-2)" }}>
                  ✗ Antes (AI-slop)
                </p>
                <p style={{ margin: 0, color: "var(--color-muted)" }}>{c.bad}</p>
              </div>
              <div style={{ padding: "var(--space-4) var(--space-6)" }}>
                <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>
                  ✓ Depois
                </p>
                <p style={{ margin: 0 }}>{c.good}</p>
                <p style={{ margin: "var(--space-3) 0 0", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                  <em>Por quê:</em> {c.why}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-6">Antivícios IA banidos</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Lista canônica — <code>/qa-content</code> e{" "}
          <code>scripts/article-quality.mjs</code> bloqueiam publicação se
          algum aparece no body:
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            flexWrap: "wrap",
            marginBottom: "var(--space-12)",
          }}
        >
          {ANTIVICIOS.map((p) => (
            <code
              key={p}
              style={{
                fontSize: "var(--text-sm)",
                padding: "var(--space-1) var(--space-3)",
                background: "color-mix(in srgb, var(--color-fg) 5%, transparent)",
                borderRadius: "0.25rem",
                color: "var(--color-muted)",
              }}
            >
              {p}
            </code>
          ))}
        </div>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Lista completa em <code>brain/tom-de-voz.md</code>. Atualize lá
          quando descobrir um antivício novo.
        </p>

        <h2 className="mb-6">Capitalização brasileira</h2>
        <div style={{ display: "grid", gap: "var(--space-3)", marginBottom: "var(--space-12)" }}>
          {[
            { ok: "Como otimizar SEO técnico em 2026", bad: "Como Otimizar SEO Técnico Em 2026" },
            { ok: "O que é GEO (Generative Engine Optimization)", bad: "O Que é GEO (Generative Engine Optimization)" },
            { ok: "Por que rejeitamos design por consenso", bad: "Por Que Rejeitamos Design Por Consenso" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-4)",
                fontSize: "var(--text-sm)",
              }}
            >
              <p style={{ margin: 0 }}>
                <span className="eyebrow" style={{ marginRight: "var(--space-2)" }}>✓</span>
                {c.ok}
              </p>
              <p style={{ margin: 0, color: "var(--color-muted)" }}>
                <span className="eyebrow" style={{ marginRight: "var(--space-2)" }}>✗</span>
                {c.bad}
              </p>
            </div>
          ))}
        </div>
      </GridCol>
    </GridContainer>
  );
}
