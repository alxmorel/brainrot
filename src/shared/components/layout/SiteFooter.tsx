import Link from "next/link";

const primaryLinks = [
  { href: "/create", label: "Collection" },
  { href: "/cart", label: "Panier" },
  { href: "/guide-tailles", label: "Guide des tailles" },
] as const;

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-[3px] border-ink/15 px-4 py-4 sm:py-5">
      <nav
        className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink/55 sm:gap-x-4 sm:text-xs"
      >
        {primaryLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-hot-pink">
            {link.label}
          </Link>
        ))}
      </nav>
      <nav
        className="mx-auto mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.58rem] font-bold uppercase tracking-wide text-ink/35 sm:text-[0.65rem]"
      >
        {legalLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-hot-pink">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
