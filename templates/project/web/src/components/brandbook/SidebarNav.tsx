"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRANDBOOK_GROUPS } from "@/lib/brandbook-sections";

export function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="brandbook-nav-toggle no-print"
        aria-expanded={open}
        aria-controls="brandbook-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="eyebrow">{open ? "Fechar" : "Menu"}</span>
      </button>

      <aside
        id="brandbook-nav"
        className={`brandbook-nav ${open ? "is-open" : ""}`}
        data-state={open ? "open" : "closed"}
      >
        <Link
          href="/brandbook"
          className="brandbook-nav-brand"
          onClick={() => setOpen(false)}
        >
          Brandbook
        </Link>

        <nav aria-label="Brandbook">
          {BRANDBOOK_GROUPS.map((group) => (
            <div key={group.label} className="brandbook-nav-group">
              <p className="eyebrow brandbook-nav-group-label">{group.label}</p>
              <ul>
                {group.items.map((s) => {
                  const active =
                    s.href === "/brandbook"
                      ? pathname === s.href
                      : pathname?.startsWith(s.href);
                  return (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        className={`brandbook-nav-item ${
                          active ? "is-active" : ""
                        }`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
