// PostCard canônico — listagem de blog. SEMPRE com cover_image (thumbnail).
// Frontmatter do post deve ter `cover_image: /images/posts/<slug>.jpg`.

import Image from "next/image";
import Link from "next/link";

export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  date: string;             // ISO 8601
  category?: string;
  cover_image?: string;     // path em /web/public ou URL absoluta
  cover_alt?: string;
  reading_time?: number;    // minutos
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div
          className="relative w-full overflow-hidden mb-4"
          style={{ aspectRatio: "16 / 9", background: "var(--color-border)" }}
        >
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.cover_alt ?? post.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: "var(--color-muted)" }}
            >
              <span className="text-sm">Sem imagem</span>
            </div>
          )}
        </div>
        {post.category && <p className="eyebrow mb-2">{post.category}</p>}
        <h3 className="mb-2 group-hover:opacity-70 transition-opacity">{post.title}</h3>
        <p className="text-sm mb-3" style={{ color: "var(--color-muted)" }}>
          {post.description}
        </p>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.reading_time && <span>· {post.reading_time} min</span>}
        </div>
      </Link>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
