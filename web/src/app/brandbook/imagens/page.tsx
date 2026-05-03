import { GridContainer, GridCol } from "@/components/grid";
import { PageHeader } from "@/components/brandbook/PageHeader";

export const metadata = { title: "Imagens" };

const MOOD_BOARD = [
  {
    name: "editorial",
    when: "Marcas com tom jornalístico, ensaio, pensamento.",
    queries: ["documentary photography", "cinematic light", "natural light interior"],
    refs: ["The New York Times Magazine", "Wired", "MIT Tech Review"],
  },
  {
    name: "candid",
    when: "Marcas humanas, próximas, retratos reais.",
    queries: ["candid portrait", "real moment", "off-guard"],
    refs: ["The Atlantic", "Aeon", "Patagonia"],
  },
  {
    name: "technical",
    when: "Hardware, engenharia, processo, dados.",
    queries: ["macro detail", "industrial photography", "blueprint"],
    refs: ["Edge Foundation", "Bloomberg Businessweek", "Hover"],
  },
  {
    name: "archival",
    when: "Marcas com peso histórico, pesquisa, reflexão.",
    queries: ["vintage archive", "museum photography", "1970s aesthetic"],
    refs: ["Standard Ebooks", "Public-Library", "Are.na"],
  },
  {
    name: "experimental",
    when: "Estúdios criativos, design-forward, vanguarda.",
    queries: ["abstract photography", "experimental composition", "avant-garde"],
    refs: ["IT'S NICE THAT", "Kinfolk", "Pin-Up"],
  },
];

const TYPES = [
  { name: "hero", ratio: "16:9", dir: "web/public/images/heroes/", use: "Capa de post, hero de página" },
  { name: "secondary", ratio: "4:3 ou 1:1", dir: "web/public/images/secondary/", use: "Imagens dentro do post" },
  { name: "avatar", ratio: "1:1", dir: "web/public/images/avatars/", use: "Foto de pessoa (autoria, time)" },
  { name: "illustration", ratio: "livre", dir: "web/public/images/illustration/", use: "Diagramas, decoração" },
];

export default function Imagens() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <PageHeader
          breadcrumb="Sistema visual · Imagens"
          state="F+M"
          title="Estilo, tipos, regras técnicas."
          lead="Sem estilo definido, todo banco vira AI-slop. Define mood-board canônico + tipos de uso + regras técnicas. Provider default: Pexels."
        />

        <h2 className="mb-6">Mood-board — 5 estilos opinativos</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Cada estilo é uma escolha sobre como a marca olha pro mundo. Pegue um.
          O <code>/setup-images</code> grava em <code>brain/DESIGN.md</code> e
          usa as queries default ao buscar fotos.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          {MOOD_BOARD.map((m) => (
            <article
              key={m.name}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                padding: "var(--space-6)",
                display: "grid",
                gap: "var(--space-3)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)" }}>
                {m.name}
              </h3>
              <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>
                {m.when}
              </p>
              <p className="eyebrow" style={{ marginTop: "var(--space-2)" }}>
                Queries default
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-1)" }}>
                {m.queries.map((q) => (
                  <li key={q} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
                    {q}
                  </li>
                ))}
              </ul>
              <p className="eyebrow" style={{ marginTop: "var(--space-2)" }}>
                Referências
              </p>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                {m.refs.join(" · ")}
              </p>
            </article>
          ))}
        </div>

        <h2 className="mb-6">Tipos canônicos</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          4 tipos cobrem 95% dos usos. <code>/setup-images</code> pergunta quais
          ativar — todos opt-in exceto hero (universal).
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Tipo</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Uso</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Proporção</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Local</th>
            </tr>
          </thead>
          <tbody>
            {TYPES.map((t) => (
              <tr key={t.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
                  {t.name}
                </td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{t.use}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{t.ratio}</td>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{t.dir}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Provider — Pexels (default)</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          API key em <code>.env.local</code> (modelo em <code>.env.example</code>):
        </p>
        <pre
          style={{
            background: "color-mix(in srgb, var(--color-fg) 4%, transparent)",
            padding: "var(--space-4)",
            borderRadius: "0.5rem",
            fontSize: "var(--text-sm)",
            overflowX: "auto",
            marginBottom: "var(--space-6)",
          }}
        >
          <code>{`PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...    # opcional, segundo provider`}</code>
        </pre>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Comando — busca:
        </p>
        <pre
          style={{
            background: "color-mix(in srgb, var(--color-fg) 4%, transparent)",
            padding: "var(--space-4)",
            borderRadius: "0.5rem",
            fontSize: "var(--text-sm)",
            overflowX: "auto",
            marginBottom: "var(--space-6)",
          }}
        >
          <code>{`npm run images:search "documentary photography natural light" -- \\
  --provider=pexels --limit=8 --orientation=landscape`}</code>
        </pre>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Comando — baixar item N:
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
          <code>{`npm run images:search "candid portrait" -- \\
  --download=3 --slug=maria-silva --category=avatars`}</code>
        </pre>

        <h2 className="mb-6">Antipadrões banidos</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li>Foto de stock genérica de equipe sorrindo em escritório com glass walls.</li>
          <li>Mockup de iPhone flutuando com gradient atrás.</li>
          <li>Render 3D abstrato de objetos flutuantes com lighting de showroom.</li>
          <li>Drone footage de cidade não-relacionada à marca.</li>
          <li>Diagrama de venn ou fluxograma colorido sem dados reais.</li>
        </ul>

        <h2 className="mb-6">Formato</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "var(--space-12)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Formato</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Quando</th>
              <th style={{ textAlign: "left", padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {[
              { f: "SVG",  q: "Logo, ícones, ilustrações vetoriais", n: "Inline preferido" },
              { f: "AVIF", q: "Foto fotográfica grande (hero, OG)",  n: "60-80% menor que JPEG mesma qualidade" },
              { f: "WebP", q: "Foto média, fallback de AVIF",        n: "Suporte universal moderno" },
              { f: "JPEG", q: "Fallback legacy",                     n: "Apenas se AVIF/WebP indisponíveis" },
              { f: "PNG",  q: "Capturas com texto, transparência",   n: "Não use pra fotos — peso 5-10x WebP" },
            ].map((row) => (
              <tr key={row.f} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-3)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>{row.f}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)" }}>{row.q}</td>
                <td style={{ padding: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>{row.n}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mb-6">Peso e lazy loading</h2>
        <ul className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li><strong>Hero / cover</strong>: ≤ 250kb (AVIF) / 350kb (WebP).</li>
          <li><strong>Card / inline</strong>: ≤ 100kb.</li>
          <li><strong>Avatar / icon</strong>: ≤ 30kb (PNG transparente) ou inline SVG.</li>
          <li><strong>Lazy loading</strong>: <code>loading=&quot;lazy&quot;</code> em tudo abaixo da dobra. <code>priority</code> só na imagem do hero (LCP).</li>
        </ul>

        <h2 className="mb-6">Atribuição</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          Pexels e Unsplash exigem atribuição. <code>image-search.mjs</code>{" "}
          imprime no formato pronto pra colar em frontmatter:
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
          <code>{`---
cover: /images/heroes/meu-post.jpg
cover_alt: "Maria Silva sentada em mesa de madeira"
cover_credit: "Maria Foto (Pexels) — https://www.pexels.com/photo/123"
---`}</code>
        </pre>
        <p className="prose">
          Footer do post renderiza <code>cover_credit</code> em{" "}
          <code>--text-xs --color-muted</code>. Não vire decoração — é
          obrigação legal.
        </p>

        <h2 className="mb-6">Alt text</h2>
        <p className="prose">
          Toda imagem não-decorativa precisa de alt descritivo. Imagem
          puramente decorativa: <code>alt=&quot;&quot;</code> (string vazia,
          não omitido). Skill <code>/seo-imagens</code> valida alt por imagem.
        </p>
      </GridCol>
    </GridContainer>
  );
}
