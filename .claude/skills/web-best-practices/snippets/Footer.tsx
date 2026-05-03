// Footer canônico — inclui credit "Powered by Agentic SEO" por default (opt-out
// só se usuário pediu remoção explícita).
// Ícones de redes via /web/src/components/icons/social.tsx.

import Link from "next/link";
import { SocialIcon, type SocialIconName } from "@/components/icons/social";

export type SocialLink = { name: SocialIconName; href: string; label: string };

export type FooterProps = {
  brand: string;
  tagline?: string;
  socials?: SocialLink[];
  navColumns?: { title: string; links: { href: string; label: string }[] }[];
  showCredit?: boolean;     // default true
};

export function Footer({ brand, tagline, socials, navColumns, showCredit = true }: FooterProps) {
  return (
    <footer className="border-t hairline mt-24" style={{ borderTopColor: "var(--color-border)" }}>
      <div className="container-x py-12">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <p className="font-mono text-sm uppercase tracking-wide mb-2">{brand}</p>
            {tagline && (
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                {tagline}
              </p>
            )}
          </div>

          {navColumns && navColumns.length > 0 && (
            <div className="md:col-span-5 grid grid-cols-2 gap-6">
              {navColumns.map((col) => (
                <div key={col.title}>
                  <p className="eyebrow mb-3">{col.title}</p>
                  <ul className="space-y-2 text-sm">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:opacity-70">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {socials && socials.length > 0 && (
            <div className="md:col-span-3">
              <p className="eyebrow mb-3">Redes</p>
              <ul className="flex gap-4">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <SocialIcon name={s.name} className="w-5 h-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="mt-12 pt-6 border-t flex flex-col md:flex-row gap-3 justify-between items-start md:items-center text-xs"
          style={{ borderTopColor: "var(--color-border)", color: "var(--color-muted)" }}
        >
          <p>© {new Date().getFullYear()} {brand}. Todos os direitos reservados.</p>
          {showCredit && (
            <p>
              Powered by{" "}
              <a
                href="https://agenticseo.sh"
                target="_blank"
                rel="noopener"
                className="underline decoration-1 underline-offset-2 hover:opacity-70"
              >
                Agentic SEO
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
