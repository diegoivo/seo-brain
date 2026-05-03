// Placeholder default — antes de /design e /scaffold rodarem.
// Sinaliza intencionalmente "kit em construção", não "site finalizado feio".
// Substituído por /scaffold após /design gerar DESIGN.tokens.json.

export default function Home() {
  return (
    <main
      className="mx-auto max-w-[640px] px-6 py-24"
      style={{
        backgroundColor: "#FAFAF7",
        color: "#1A1A18",
        fontFamily: "Charter, Georgia, 'Times New Roman', serif",
      }}
    >
      <header className="mb-16 flex items-center justify-between text-sm">
        <span className="font-semibold">agentic-seo-kit</span>
        <span style={{ color: "#737373" }}>v0 &middot; sem design system</span>
      </header>

      <article className="space-y-6 text-lg leading-relaxed">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          Este é um kit, não um site.
        </h1>

        <p>
          Você acabou de clonar <code>agentic-seo-kit</code>. Antes de adicionar
          conteúdo, defina a identidade visual do projeto.
        </p>

        <p>
          No seu agente compatível com <code>AGENTS.md</code> (Claude Code,
          Antigravity, Codex, Cursor, Aider), rode:
        </p>

        <pre
          className="overflow-x-auto rounded-md p-4 font-mono text-sm"
          style={{ backgroundColor: "#F0EEE8" }}
        >
          /design &lt;descreva a vibe da marca em 1 par&aacute;grafo&gt;
        </pre>

        <p>
          Isso vai gerar <code>DESIGN.md</code> e{" "}
          <code>DESIGN.tokens.json</code>, e este placeholder ser&aacute;
          substitu&iacute;do por uma home com identidade pr&oacute;pria.
        </p>

        <p className="text-base" style={{ color: "#525252" }}>
          Sequ&ecirc;ncia completa:&nbsp;
          <code>/design</code>&nbsp;&middot;&nbsp;
          <code>/scaffold</code>&nbsp;&middot;&nbsp;
          <code>/conteudo &lt;tema&gt;</code>&nbsp;&middot;&nbsp;
          <code>/publicar</code>
        </p>
      </article>

      <footer
        className="mt-24 border-t pt-6 text-sm"
        style={{ borderColor: "#E5E5E2", color: "#737373" }}
      >
        Por{" "}
        <a
          className="underline"
          href="https://conversion.com.br"
          rel="noopener"
        >
          Diego Ivo, na Convers&atilde;o
        </a>
        . Open source MIT.
      </footer>
    </main>
  );
}

export const metadata = {
  title: "agentic-seo-kit — Este é um kit, não um site",
  description:
    "Template open source para criar um site Next.js SSG com PageSpeed 100 e conteúdo PT-BR otimizado para SEO Agêntico. Rode /design para começar.",
};
