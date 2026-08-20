import Link from "next/link";

const links = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-[3px] border-ink/15 px-4 py-5 sm:px-6">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wide text-ink/55">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-hot-pink">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
