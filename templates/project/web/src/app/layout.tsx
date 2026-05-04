import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "SEO Brain",
    template: "%s · SEO Brain",
  },
  description: "Site estático gerado pelo SEO Brain. Atualize após /onboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
