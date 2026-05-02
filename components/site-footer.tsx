import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-section">
      <div className="container-page py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {year} {siteConfig.name}. Construído com{" "}
          <Link
            href="https://github.com/diegoivo/agentic-seo-kit"
            className="text-foreground no-underline hover:text-accent"
          >
            agentic-seo-kit
          </Link>
          .
        </p>
        <nav aria-label="Rodapé" className="flex gap-6">
          <Link href="/blog/" className="text-foreground no-underline hover:text-accent">
            Blog
          </Link>
          <Link href="/servicos/" className="text-foreground no-underline hover:text-accent">
            Serviços
          </Link>
        </nav>
      </div>
    </footer>
  );
}
