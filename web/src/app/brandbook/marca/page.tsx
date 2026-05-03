import { GridContainer, GridCol } from "@/components/grid";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";

export const metadata = { title: "Marca / Logo" };

export default function Marca() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Marca / Logo</p>
        <h1 className="mb-8">Tipografia é a identidade.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          O SEO Brain <strong>não cria logo nem ícone</strong>. Logo é decisão
          de marca — pertence ao usuário, não ao framework. O que entregamos:
          (a) um <strong>wordmark</strong> tipográfico default e (b){" "}
          <strong>regras de uso e estilização</strong> caso o usuário forneça
          uma logo.
        </p>
        <TemplateBanner
          variant="template"
          message="Pré-onboard, mostramos só o wordmark default. Pós-/onboard, se o usuário fornecer arquivo de logo (SVG/PNG em web/public/logo.*), o brandbook renderiza a logo nesta página com regras de clear-space, fundos e tamanhos mínimos."
        />

        <h2 className="mb-8">Wordmark default</h2>
        <div
          style={{
            padding: "var(--space-16) var(--space-8)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            display: "flex",
            justifyContent: "center",
            marginBottom: "var(--space-12)",
            background: "var(--color-bg)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              letterSpacing: "-0.02em",
              fontWeight: 600,
              color: "var(--color-fg)",
            }}
          >
            seobrain
          </span>
        </div>

        <h2 className="mb-8">Variações do wordmark</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-12)",
          }}
        >
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-3)" }}>
              Header / footer · md
            </p>
          </div>
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              background: "var(--color-fg)",
              color: "var(--color-bg)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", opacity: 0.7, marginTop: "var(--space-3)" }}>
              Inversa (dark bg)
            </p>
          </div>
          <div
            style={{
              padding: "var(--space-8) var(--space-6)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-md)",
                letterSpacing: "0.02em",
                textTransform: "lowercase",
              }}
            >
              /seobrain
            </span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-3)" }}>
              Mono / atribuição
            </p>
          </div>
        </div>

        <h2 className="mb-6">Logo do usuário (pós-onboard)</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Quando você fornecer uma logo durante <code>/onboard-brandbook</code>{" "}
          (ou via <code>/site-clone</code>), ela substitui o wordmark nesta
          seção. O framework <strong>não desenha</strong> a logo — só aplica
          regras de uso. Permissões de estilização limitadas:
        </p>

        <h3 className="mb-4">Permitido</h3>
        <ul className="prose" style={{ marginBottom: "var(--space-8)" }}>
          <li><strong>Monocromática</strong>: render em <code>--color-fg</code> sobre fundo claro, ou <code>--color-bg</code> sobre fundo escuro/foto.</li>
          <li><strong>Tamanhos preset</strong>: header (18-24px altura), footer (16-20px), OG image (cerca de 80px), favicon (32×32px), avatar (1:1 quadrado).</li>
          <li><strong>Clear-space</strong>: margem mínima ao redor igual à altura do &quot;x&quot; da fonte display (ou metade da altura da logo, o que for maior).</li>
          <li><strong>Fundo</strong>: cor sólida da paleta, ou foto com overlay sólido (não gradient sutil).</li>
        </ul>

        <h3 className="mb-4">Não permitido</h3>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li>Alterar proporção (não esticar nem comprimir).</li>
          <li>Adicionar efeitos: sombra, glow, outline, gradient overlay.</li>
          <li>Recolorir parcialmente (ex.: pintar só uma letra).</li>
          <li>Rotacionar (exceto quando o design da logo já contempla — raro).</li>
          <li>Usar em fundos com contraste &lt; 4.5:1.</li>
        </ul>

        <h2 className="mb-6">Como fornecer sua logo</h2>
        <ol className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li>Coloque o arquivo em <code>web/public/logo.svg</code> (preferido) ou <code>web/public/logo.png</code> (fallback).</li>
          <li>SVG: viewBox declarado, sem <code>width</code>/<code>height</code> hardcoded, traços e paths em <code>currentColor</code> quando possível (permite recolor por CSS).</li>
          <li>PNG: 2× densidade (mínimo 256×256 pra avatar), fundo transparente.</li>
          <li>Atualize <code>brain/DESIGN.md</code> com a frase &quot;Logo fornecida pelo usuário&quot; — o brandbook detecta e renderiza aqui.</li>
        </ol>

        <h2 className="mb-6">Regras gerais</h2>
        <ul className="prose">
          <li>Tamanho mínimo absoluto: nunca menos que <code>--text-md</code> (18px) de altura.</li>
          <li>Letter-spacing -0.02em em qualquer wordmark ≥ <code>--text-xl</code>.</li>
          <li>Logo de verdade (símbolo + tipografia, com construção formal) é pedido externo — o framework não substitui designer de marca. Veja{" "}
            <a href="https://www.conversion.com.br" target="_blank" rel="noopener noreferrer">
              Conversion
            </a>{" "}
            ou estúdio de sua preferência.
          </li>
        </ul>
      </GridCol>
    </GridContainer>
  );
}
