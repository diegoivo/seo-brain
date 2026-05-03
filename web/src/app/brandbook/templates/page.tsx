import { GridContainer, GridCol } from "@/components/grid";

export const metadata = { title: "Templates" };

export default function Templates() {
  return (
    <GridContainer>
      <GridCol span={4} spanMd={8} spanLg={10}>
        <p className="eyebrow mb-6">Brandbook · Componentes · Templates</p>
        <h1 className="mb-8">Templates de página.</h1>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          O esqueleto que <code>/site-criar</code> produz para cada tipo de
          página. Cada template é restrição opinativa, não decoração — quem
          improvisa template gera AI-slop.
        </p>

        <h2 className="mb-6">Hero</h2>
        <p className="prose" style={{ marginBottom: "var(--space-6)", maxWidth: "100%" }}>
          5 modelos canônicos não-AI-slop em{" "}
          <code>docs/hero-backgrounds.md</code>:
        </p>
        <ol className="prose" style={{ marginBottom: "var(--space-12)" }}>
          <li><strong>Sólido + tipografia</strong> — marcas editoriais, jurídicas, financeiras.</li>
          <li><strong>Split foto</strong> — texto à esquerda, foto real à direita.</li>
          <li><strong>Asymmetric editorial</strong> — estúdios, portfólios.</li>
          <li><strong>Lista vertical / manifesto</strong> — POV-heavy, mídia editorial.</li>
          <li><strong>Brutalist editorial</strong> — anti-corporate, postura forte.</li>
        </ol>

        <h2 className="mb-6">Post template</h2>
        <article
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            padding: "var(--space-12) var(--space-6)",
            marginBottom: "var(--space-12)",
            display: "grid",
            gap: "var(--space-6)",
          }}
        >
          <p className="eyebrow">Categoria · 04 mai 2026</p>
          <h2 style={{ margin: 0 }}>Headline em h1 do post</h2>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-muted)",
              maxWidth: "55ch",
              margin: 0,
            }}
          >
            TL;DR em 2-3 frases citáveis. Aparece como{" "}
            <code>&lt;blockquote class=&quot;tldr&quot;&gt;</code> no topo
            (markup) e como destacado visual no render.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
            <span>Por <a href="#" style={{ color: "inherit" }}>Maria Silva</a></span>
            <span>·</span>
            <span>8 min de leitura</span>
          </div>
        </article>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Frontmatter obrigatório: <code>title</code>, <code>slug</code>,{" "}
          <code>date</code>, <code>description</code>, <code>intent</code>,{" "}
          <code>proprietary_claims[]</code>, <code>brain_refs[]</code>,{" "}
          <code>faqs[]</code>, <code>tldr</code>. Schema JSON-LD{" "}
          <code>Article</code> + <code>FAQPage</code> + <code>Person</code> via{" "}
          <code>/web-best-practices</code>.
        </p>

        <h2 className="mb-6">Página de serviço</h2>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Estrutura: hero (modelo 2 ou 4) → o que fazemos → como fazemos →
          provas (cases, números) → CTA primário (form ou link contato).
          Skill <code>/site-criar</code> usa este esqueleto pra cada serviço
          listado em <code>brain/index.md</code>.
        </p>

        <h2 className="mb-6">Contato</h2>
        <p className="prose" style={{ marginBottom: "var(--space-12)" }}>
          Hero curto (1-line headline), formulário central (campos:{" "}
          <code>nome / e-mail / mensagem</code>), CTA{" "}
          <code>Solicitar contato</code>. Backend via{" "}
          <code>/setup-email</code> (Resend default). Sucesso/erro com mensagens
          definidas em <a href="/brandbook/mensagens">Mensagens</a>.
        </p>

        <h2 className="mb-6">Sobre</h2>
        <p className="prose">
          Síntese de <code>brain/index.md</code> + personas + POVs. Foto da
          fundadora ou equipe (real, não stock). FAQ ao final ajuda GEO.
        </p>
      </GridCol>
    </GridContainer>
  );
}
