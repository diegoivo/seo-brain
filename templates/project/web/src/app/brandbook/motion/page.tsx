import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";
import { Crimes } from "@/components/brandbook/Crimes";

export const metadata = { title: "Motion" };

const TIMINGS = [
  { token: "--motion-fast",   value: "120ms", use: "Hover, focus, tooltip" },
  { token: "--motion-base",   value: "200ms", use: "Modal, drawer, page transition" },
  { token: "--motion-slow",   value: "320ms", use: "Hero entrance, large state change" },
];

const EASINGS = [
  { name: "ease-out",     value: "cubic-bezier(0.16, 1, 0.3, 1)",   use: "Default — tudo que entra/desaparece" },
  { name: "ease-in-out",  value: "cubic-bezier(0.65, 0, 0.35, 1)",  use: "Movimentos longos, arrastar" },
  { name: "linear",       value: "linear",                          use: "Loading spinner, progresso" },
];

export default function Motion() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Sistema visual · Motion"
          state="F"
          title="Menos é mais."
          lead="Motion comunica intenção, não decora. Sites editoriais não precisam de animação em todo elemento. As regras canônicas, abaixo."
        />

        <h2 className="mb-6">Durações canônicas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Token</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Duração</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Uso</th>
            </tr>
          </thead>
          <tbody>
            {TIMINGS.map((t) => (
              <tr key={t.token} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>{t.token}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{t.value}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{t.use}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Easing</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Nome</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Curva</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Uso</th>
            </tr>
          </thead>
          <tbody>
            {EASINGS.map((e) => (
              <tr key={e.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>{e.name}</td>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{e.value}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{e.use}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">prefers-reduced-motion</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Sempre respeite a preferência do sistema. Toda animação maior que{" "}
          <code>--motion-fast</code> precisa de fallback estático:
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
          <code>{`@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}</code>
        </pre>

        <h2 className="mb-6">Regras</h2>
        <ul className="prose">
          <li><strong>Não anime layout</strong> (largura, altura, top/left). Anime <code>opacity</code> e <code>transform</code>. CLS ≤ 0.1 é parte do Lighthouse.</li>
          <li><strong>Não anime texto</strong> (font-size, letter-spacing, line-height). Distrai e não acrescenta sentido.</li>
          <li><strong>Hover é opcional</strong> — opacity 0.85 ou underline. Sem scale, sem shadow growing, sem rotate.</li>
          <li><strong>Page transition</strong> existe se houver razão editorial (revista, portfolio). Default: nenhuma.</li>
          <li><strong>Loading state</strong> só após 300ms — abaixo disso, mostre skeleton estático.</li>
          <li><strong>Easing default é ease-out</strong>. Movimento começa rápido e desacelera no fim — natural.</li>
        </ul>

        <Crimes
          category="motion"
          items={[
            {
              name: "Crime do animar layout",
              why: "Animar width, height, top, left. Causa reflow + repaint, mata FPS, infla CLS. Anime opacity e transform — só.",
            },
            {
              name: "Crime do hover scaleUp",
              why: "scale(1.05) no hover de card. Faz cards parecerem botões e aumenta CLS. Hover canônico: opacity 0.85 ou underline. Sem scale.",
            },
            {
              name: "Crime do parallax sem propósito",
              why: "Scroll-jacking custom em site editorial. Parallax distrai da leitura. Reservado para hero de marca expressiva — nunca em post ou listagem.",
            },
            {
              name: "Crime do loading instantâneo",
              why: "Spinner aparece antes de 300ms. Crítica perceptual: ação rápida não precisa de feedback de espera, vira flicker. Skeleton estático até 300ms; spinner depois.",
            },
            {
              name: "Crime do prefers-reduced-motion ignorado",
              why: "Animação que viola WCAG 2.3.3. Toda transição > --motion-fast precisa de @media (prefers-reduced-motion: reduce) com duration 0.01ms. Não-negociável.",
            },
          ]}
        />
      </GridCol>
    </GridContainer>
  );
}
