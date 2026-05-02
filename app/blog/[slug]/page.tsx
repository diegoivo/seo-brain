import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllSlugs,
  readPost,
  estimateReadingMinutes,
} from "@/lib/content";
import { buildArticleJsonLd, jsonLdScript } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = readPost(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = readPost(slug);
  if (!post) return notFound();

  const articleLd = buildArticleJsonLd(slug, post.frontmatter);
  const minutes = estimateReadingMinutes(post.body);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(articleLd) }}
      />

      <article className="container-editorial py-section">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/blog/"
            className="text-muted-foreground no-underline hover:text-accent"
          >
            ← Blog
          </Link>
        </p>

        <header className="mt-8">
          <p className="text-sm text-muted-foreground">
            <time dateTime={post.frontmatter.date}>
              {formatDate(post.frontmatter.date)}
            </time>
            {" · "}
            {minutes} min de leitura
            {post.frontmatter.author && <> · por {post.frontmatter.author}</>}
          </p>
          <h1 className="mt-4 hero-title font-display font-bold">
            {post.frontmatter.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {post.frontmatter.description}
          </p>
        </header>

        <div className="prose-editorial mt-12">
          <MDXRemote source={post.body} />
        </div>

        {post.frontmatter.fontes && post.frontmatter.fontes.length > 0 && (
          <section className="mt-section pt-10 border-t border-border">
            <h2 className="text-xl font-display font-semibold">Fontes</h2>
            <ol className="mt-4 list-decimal pl-6 text-sm text-muted-foreground space-y-2">
              {post.frontmatter.fontes.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    {f.titulo}
                  </a>
                  {f.acessado && <span> — acessado em {f.acessado}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </>
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
