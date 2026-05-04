import type { ReactNode } from "react";
import { SidebarNav } from "@/components/brandbook/SidebarNav";

export const metadata = {
  title: "Brandbook",
  description: "Design system ao vivo deste projeto. Dev-only, noindex.",
  robots: { index: false, follow: false },
};

export default function BrandbookLayout({ children }: { children: ReactNode }) {
  return (
    <div className="brandbook-shell">
      <SidebarNav />
      <main id="main" className="brandbook-main">
        {children}
      </main>
    </div>
  );
}
