"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/ops", label: "Dashboard", exact: true as const },
  { href: "/ops/commandes", label: "Commandes", exact: false as const },
  { href: "/ops/sessions", label: "Sessions", exact: false as const },
  { href: "/ops/report", label: "Analytics", exact: false as const },
] as const;

export function OpsNav() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink/10 pb-4">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-hot-pink">
          Brainrototo
        </p>
        <h1 className="font-display text-2xl font-bold uppercase sm:text-3xl">Ops</h1>
      </div>
      <nav className="flex flex-wrap items-center gap-3 font-display text-sm font-bold uppercase">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "text-hot-pink underline" : "text-ink/60 hover:text-ink"}
            >
              {link.label}
            </Link>
          );
        })}
        <Link href="/create" className="text-ink/40 hover:text-ink">
          Site
        </Link>
        <button
          type="button"
          className="text-ink/40 hover:text-ink"
          onClick={() => {
            void fetch("/api/ops/logout", { method: "POST" }).then(() => {
              window.location.href = "/ops/login";
            });
          }}
        >
          Sortir
        </button>
      </nav>
    </header>
  );
}
