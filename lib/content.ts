import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostSource = {
  slug: string;
  filePath: string;
  raw: string;
  body: string;
  frontmatter: PostFrontmatter;
};

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author?: string;
  keywords?: string[];
  ogImage?: string;
  intencao?: "informacional" | "navegacional" | "comercial" | "transacional";
  povs?: string[];
  fontes?: Array<{ titulo: string; url: string; acessado?: string }>;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function listMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"));
}

export function getAllPosts(): PostSource[] {
  return listMdxFiles()
    .map((file) => readPost(file.replace(/\.mdx$/, "")))
    .filter((post): post is PostSource => post !== null)
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
    );
}

export function getAllSlugs(): string[] {
  return listMdxFiles().map((file) => file.replace(/\.mdx$/, ""));
}

export function readPost(slug: string): PostSource | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as PostFrontmatter;
  validateFrontmatter(slug, fm);
  return {
    slug,
    filePath,
    raw,
    body: parsed.content,
    frontmatter: fm,
  };
}

function validateFrontmatter(slug: string, fm: Partial<PostFrontmatter>) {
  const missing: string[] = [];
  if (!fm.title) missing.push("title");
  if (!fm.description) missing.push("description");
  if (!fm.date) missing.push("date");
  if (missing.length > 0) {
    throw new Error(
      `Frontmatter inválido em content/${slug}.mdx — faltando: ${missing.join(", ")}`,
    );
  }
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
