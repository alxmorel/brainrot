import Link from "next/link";
import { archiveCopy } from "@/data/archive";
import { cn } from "@/shared/utils/cn";

export function ArchiveLocalNav({ current }: { current: "characters" | "blog" }) {
  const links = [
    { href: "/brainrots", label: archiveCopy.allCharacters, id: "characters" as const },
    { href: "/blog", label: archiveCopy.allArticles, id: "blog" as const },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-pill border-[3px] border-ink px-3 py-1 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm",
            current === link.id
              ? "bg-hot-pink text-white"
              : "bg-white text-ink hover:bg-acid-yellow",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
