import Link from "next/link";
import { GridContainer, GridCol } from "@/components/grid";
import { StateBadge } from "@/components/brandbook/StateBadge";
import { TemplateBanner } from "@/components/brandbook/TemplateBanner";
import { BRANDBOOK_GROUPS } from "@/lib/brandbook-sections";
import { BRAND } from "@/lib/brand-config";

export default function BrandbookHome() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · {BRAND.wordmark}</p>
        <h1 className="mb-8">Design system ao vivo.</h1>
        <p
          className="prose"
          style={{ color: "var(--color-muted)", marginBottom: "var(--space-12)" }}
        >
          O brandbook do <strong>{BRAND.wordmark}</strong>. Pré-onboard, defaults
          canônicos do framework. Pós-<code>/onboard</code>, decisões da marca
          hidratam tokens vivos no <code>globals.css</code>. Cada rota é preview
          ao vivo, não documento.
        </p>

        {BRAND.state === "template" && <TemplateBanner variant="template" />}

        <div className="prose" style={{ marginBottom: "var(--space-16)" }}>
          <h2>Brand statement</h2>
          <p>{BRAND.positioning}</p>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            <em>Mood:</em> {BRAND.mood}
          </p>
          <h2>Como usar este brandbook</h2>
          <ul>
            <li>
              <strong>Navegação lateral</strong> em 5 grupos: Identidade, Sistema
              visual, Componentes, Voz e conteúdo, Operação.
            </li>
            <li>
              <strong>Estado por seção:</strong> <code>[F]</code> = canônico do
              framework (não muda no onboard); <code>[M]</code> = decisão de marca;{" "}
              <code>[F+M]</code> = ambos (estrutura framework, conteúdo da marca).
            </li>
            <li>
              <strong>Dev-only:</strong> rota <code>/brandbook/*</code> tem{" "}
              <code>X-Robots-Tag: noindex, nofollow</code> e{" "}
              <code>robots.txt</code> bloqueando indexação.
            </li>
          </ul>
        </div>

        <h2 className="mb-8">Seções</h2>
      </GridCol>

      {BRANDBOOK_GROUPS.map((group) => (
        <GridCol key={group.label} span={4} spanMd={8} spanLg={12}>
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            {group.label}
          </p>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gridAutoRows: "1fr",
              gap: "var(--space-4)",
              listStyle: "none",
              padding: 0,
              marginBottom: "var(--space-12)",
            }}
          >
            {group.items.map((s) => (
              <li key={s.href} style={{ display: "flex" }}>
                <Link
                  href={s.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-4) var(--space-5)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    color: "inherit",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "var(--text-md)",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.label}
                    <StateBadge state={s.state} />
                  </h3>
                  <p
                    style={{
                      marginTop: "var(--space-2)",
                      marginBottom: 0,
                      fontSize: "var(--text-sm)",
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
      ))}

      <GridCol span={4} spanMd={8} spanLg={10}>
        <h2 className="mb-6">Governança</h2>
        <div className="prose">
          <p>
            <strong>Canônico do framework</strong> ([F]): escala tipográfica
            (perfect fourth 1.333), grid 12-col + Subgrid + Container Queries,
            spacing 4-base, line-height 1.7 em parágrafos, measure 65ch,
            anchor-down em headings, banidos AI-slop. Definido em{" "}
            <code>docs/typography.md</code>, <code>docs/grid-system.md</code> e{" "}
            <code>docs/hero-backgrounds.md</code>. Não muda por projeto.
          </p>
          <p>
            <strong>Decisão de marca</strong> ([M]): paleta (6 papéis funcionais),
            fontes (display/body/mono), posicionamento, voz, POVs proprietários,
            logo (se houver). Tudo escolhido durante <code>/onboard-brandbook</code>.
          </p>
          <p>
            Mudar algo canônico afeta todos os projetos do framework — discussão
            no repo do SEO Brain. Mudar algo da marca é decisão local — vai pra{" "}
            <code>brain/log.md</code>.
          </p>
        </div>
      </GridCol>
    </GridContainer>
  );
}
