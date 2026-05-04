import { GridContainer, GridCol } from "@/components/grid";
import { StateBadge } from "@/components/brandbook/StateBadge";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";
import { BRAND } from "@/lib/brand-config";

export const metadata = { title: "Posicionamento" };

// POVs proprietários do SEO Brain — defaults pré-onboard.
// Cada POV tem qualificador anti-mal-interpretação (estilo Vtex "Bold, not immature").
const POVS = [
  {
    claim: "Skyscraper como filosofia, não como tamanho.",
    qualifier: "longo, não inflado",
    why: "Conteúdo ≥20% mais profundo que melhor concorrente — mas a profundidade vem de POVs proprietários, não padding.",
  },
  {
    claim: "Brain antes de pesquisa.",
    qualifier: "fonte de verdade, não cache",
    why: "Toda peça lê brain/ primeiro. Pesquisa externa é secundária e citada, nunca substitui posição da marca.",
  },
  {
    claim: "Capitalização brasileira em headings.",
    qualifier: "regra ortográfica, não estilo",
    why: "1ª maiúscula + nomes próprios. Title-case americano viola PT-BR. Aplicar é correção, não preferência.",
  },
  {
    claim: "POV proprietário é bloqueante.",
    qualifier: "diferencial real, não opinião qualquer",
    why: "Se 3 POVs forem consenso de mercado ('SEO técnico importa'), a skill /onboard-brain pausa. Diferenciação não é opt-in.",
  },
  {
    claim: "Framework opinativo, marca contêiner.",
    qualifier: "decisão arquitetural, não ideologia",
    why: "Grid 12-col, perfect fourth, line-height 1.7 são canônicos. Paleta, fontes, voz são da marca. Linha clara entre [F] e [M].",
  },
];

const PERSONAS_DEFAULT = [
  {
    title: "Desenvolvedor que clonou o kit",
    context: "Acabou de rodar npx github:diegoivo/seobrain bootstrap meu-projeto.",
    pain: "Quer site Lighthouse 95+ + brandbook coerente sem precisar pensar em escala tipográfica, grid, AI-slop.",
    looks_for: "Comandos /onboard, /blogpost, /site-criar. Documentação curta, exemplos vivos.",
  },
  {
    title: "Editor não-técnico do projeto",
    context: "Recebeu o projeto pronto, vai escrever posts e revisar copy.",
    pain: "Quer publicar sem quebrar SEO técnico nem violar voz da marca.",
    looks_for: "Brandbook como referência rápida de tom, banidos, capitalização.",
  },
];

export default function Posicionamento() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">
          Brandbook · Posicionamento <StateBadge state="M" />
        </p>
        <h1 className="mb-8">Quem é {BRAND.wordmark}, e por quê.</h1>

        {BRAND.state === "template" && (
          <TemplateBanner
            variant="template"
            message="Esta página mostra os defaults do SEO Brain — POVs e personas do próprio framework. Pós-/onboard-brain, é substituída pelos POVs proprietários do seu projeto."
          />
        )}

        <h2 className="mb-6">Brand statement</h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-12)", maxWidth: "100%", fontSize: "var(--text-lg)" }}
        >
          {BRAND.positioning}
        </p>

        <h2 className="mb-6">POVs proprietários</h2>
        <p
          className="prose"
          style={{ marginBottom: "var(--space-8)", maxWidth: "100%" }}
        >
          Posições que esta marca sustenta, com qualificador anti-mal-interpretação
          (o erro comum logo do lado). Mainstream do nicho contesta — esse é o teste
          do framework.
        </p>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          {POVS.map((p, i) => (
            <li
              key={i}
              style={{
                paddingInlineStart: "var(--space-6)",
                borderInlineStart: "3px solid var(--color-accent)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-lg)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {String(i + 1).padStart(2, "0")} · {p.claim}
              </p>
              <p
                style={{
                  margin: "var(--space-1) 0 var(--space-3)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "lowercase",
                }}
              >
                {p.qualifier}
              </p>
              <p style={{ margin: 0 }}>{p.why}</p>
            </li>
          ))}
        </ol>

        <h2 className="mb-6">Personas-alvo</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          {PERSONAS_DEFAULT.map((p) => (
            <article
              key={p.title}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                padding: "var(--space-6)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "var(--text-md)",
                  fontWeight: 600,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  margin: "var(--space-3) 0",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-muted)",
                }}
              >
                {p.context}
              </p>
              <p style={{ margin: "var(--space-3) 0", fontSize: "var(--text-sm)" }}>
                <strong>Dor:</strong> {p.pain}
              </p>
              <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
                <strong>Busca:</strong> {p.looks_for}
              </p>
            </article>
          ))}
        </div>

        <h2 className="mb-6">Mood verbal</h2>
        <p className="prose" style={{ marginBottom: "var(--space-16)" }}>
          {BRAND.mood} — voz ativa, frases curtas (≤ 25 palavras), parágrafos
          enxutos (≤ 4 frases). Detalhe completo em <a href="/brandbook/voz">Voz aplicada</a>.
        </p>

        <h2 className="mb-6">Onde isto vive no Brain</h2>
        <ul className="prose">
          <li><code>brain/index.md</code> — síntese de posicionamento</li>
          <li><code>brain/povs/*.md</code> — 1 arquivo por POV proprietário</li>
          <li><code>brain/personas/*.md</code> — 1 arquivo por persona</li>
          <li><code>brain/tom-de-voz.md</code> — voz e antivícios IA banidos</li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
