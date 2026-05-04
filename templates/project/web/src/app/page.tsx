import Link from "next/link";
import { GridContainer, GridCol } from "@/components/grid";

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <GridContainer>
          <GridCol span={4} spanMd={6} spanLg={8}>
            <p className="eyebrow mb-6">SEO Brain</p>
            <h1 className="mb-8">Framework experimental de SEO Agêntico.</h1>
            <p
              className="text-lg mb-10"
              style={{ color: "var(--color-muted)", maxWidth: "55ch" }}
            >
              Site estático placeholder. Rode <code>/onboard</code> no Claude
              Code (ou diga &quot;execute o onboard&quot; em outros harnesses)
              para gerar o brain e o brandbook deste projeto.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Link href="/brandbook" className="btn-accent">
                Ver brandbook
              </Link>
              <a
                href="https://github.com/diegoivo/seo-brain"
                className="btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </GridCol>
        </GridContainer>
      </section>
    </main>
  );
}
