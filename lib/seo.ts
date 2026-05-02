import { siteConfig } from "./site-config";
import type { PostFrontmatter } from "./content";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/og-default.png`,
  };
}

export function buildArticleJsonLd(slug: string, fm: PostFrontmatter) {
  const url = `${siteConfig.url}/blog/${slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.date,
    author: {
      "@type": "Person",
      name: fm.author ?? siteConfig.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/og-default.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: fm.ogImage
      ? `${siteConfig.url}${fm.ogImage}`
      : `${siteConfig.url}/og-default.png`,
    keywords: fm.keywords?.join(", "),
  };
}

export function jsonLdScript<T>(data: T): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
