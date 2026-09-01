import Link from "next/link";
import { brand } from "@/data/brand";
import { ComposeLink } from "@/shared/components/layout/ComposeLink";

const primaryLinks = [
  { href: "/brainrots", label: "Archive" },
  { href: "/blog", label: "Blog" },
  { href: "/cart", label: "Panier" },
  { href: "/compte", label: "Compte" },
  { href: "/commande", label: "Ma commande" },
  { href: "/guide-tailles", label: "Guide des tailles" },
] as const;

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-[3px] border-ink/15 px-4 py-5 sm:py-6">
      <p className="text-center font-display text-sm font-bold uppercase tracking-tight text-ink">
        {brand.name}
      </p>
      <p className="mt-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-ink/55 sm:text-xs">
        {brand.tagline}
      </p>
      <p className="mt-0.5 text-center text-[0.65rem] font-bold text-ink/40 sm:text-xs">
        {brand.footer.line}
      </p>
      <nav
        className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink/55 sm:gap-x-4 sm:text-xs"
      >
        <ComposeLink cta="bande" source="footer" className="hover:text-hot-pink">
          La bande
        </ComposeLink>
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
