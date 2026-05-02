import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, estimateReadingMinutes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos opinionados sobre SEO Agêntico, escritos seguindo os princípios em wiki/conteudo/principios.md.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className="container-page py-section">
      <h1 className="hero-title font-display font-bold">Blog</h1>
      <p className="mt-6 max-w-editorial text-lg text-muted-foreground">
        {posts.length === 0
          ? "Nenhum post ainda. Rode /conteudo <tema> para escrever o primeiro."
          : `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"}, do mais recente ao mais antigo.`}
      </p>

      <div className="mt-section divide-y divide-border">
        {posts.map((post) => (
          <article key={post.slug} className="py-10">
            <p className="text-sm text-muted-foreground">
              <time dateTime={post.frontmatter.date}>
                {formatDate(post.frontmatter.date)}
              </time>
              {" · "}
              {estimateReadingMinutes(post.body)} min de leitura
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold max-w-[28ch]">
              <Link
                href={`/blog/${post.slug}/`}
                className="text-foreground no-underline hover:text-accent"
              >
                {post.frontmatter.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-editorial text-muted-foreground">
              {post.frontmatter.description}
            </p>
          </article>
        ))}
      </div>
    </section>
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
