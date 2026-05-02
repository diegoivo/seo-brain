import Link from "next/link";
import { getAllPosts, estimateReadingMinutes } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { buildOrganizationJsonLd, jsonLdScript } from "@/lib/seo";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 5);
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(orgJsonLd) }}
      />

      <section className="container-page py-section">
        <h1 className="hero-title font-display font-bold max-w-[18ch]">
          {siteConfig.name}
        </h1>
        <p className="mt-8 max-w-editorial text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </section>

      <section className="container-editorial py-section prose-editorial">
        <p>
          Este site foi gerado com o agentic-seo-kit. Para personalizar, rode{" "}
          <code>/onboarding</code> e depois <code>/design</code> no seu agent
          favorito (Claude Code, Cursor, Codex). Edite os princípios em{" "}
          <code>wiki/conteudo/principios.md</code> e os POVs em{" "}
          <code>wiki/conteudo/pov-da-marca.md</code> antes de pedir o primeiro
          post.
        </p>
        <p>
          A skill <code>conteudo</code> escreve artigos em PT-BR seguindo a
          wiki da sua marca. A skill <code>publicar</code> faz build e deploy
          no Vercel com PageSpeed 100.
        </p>
      </section>

      <section className="container-page py-section">
        <h2 className="h2-title font-display font-bold">Serviços</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ServiceItem
            title="Serviço 1"
            description="Substitua este texto pela descrição do primeiro serviço da sua marca."
          />
          <ServiceItem
            title="Serviço 2"
            description="Edite app/page.tsx ou app/servicos/page.tsx para personalizar."
          />
          <ServiceItem
            title="Serviço 3"
            description="O kit já vem com layout editorial e tokens de design prontos."
            extra="Rode /design <vibe> para regenerar identidade visual."
          />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page py-section">
          <div className="flex items-end justify-between">
            <h2 className="h2-title font-display font-bold">Últimos posts</h2>
            <Link href="/blog/" className="text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="mt-10 divide-y divide-border">
            {posts.map((post) => (
              <article key={post.slug} className="py-8">
                <p className="text-sm text-muted-foreground">
                  <time dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date)}
                  </time>
                  {" · "}
                  {estimateReadingMinutes(post.body)} min de leitura
                </p>
                <h3 className="mt-2 text-2xl md:text-3xl font-display font-semibold">
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="text-foreground no-underline hover:text-accent"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-editorial text-muted-foreground">
                  {post.frontmatter.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ServiceItem({
  title,
  description,
  extra,
}: {
  title: string;
  description: string;
  extra?: string;
}) {
  return (
    <article className="border border-border rounded-md p-8 md:p-10 bg-background hover:border-foreground/40 transition-colors">
      <h3 className="text-xl md:text-2xl font-display font-semibold">{title}</h3>
      <p className="mt-3 text-muted-foreground">{description}</p>
      {extra && <p className="mt-3 text-muted-foreground text-sm">{extra}</p>}
      <p className="mt-6">
        <Link href="/servicos/" className="text-sm">
          Saiba mais →
        </Link>
      </p>
    </article>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};
