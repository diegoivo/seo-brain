import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="container-page flex items-center justify-between py-5">
        <Link
          href="/"
          className="font-display text-lg font-semibold no-underline text-foreground hover:text-accent"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-6 text-sm">
          <Link href="/servicos/" className="text-foreground no-underline hover:text-accent">
            Serviços
          </Link>
          <Link href="/blog/" className="text-foreground no-underline hover:text-accent">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
