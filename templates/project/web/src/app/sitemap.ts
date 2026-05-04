import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  // Rotas estáticas. Quando /content/posts/*.md existir, leitura dinâmica via fs.
  const routes = ["", "/sobre", "/contato", "/blog"];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
