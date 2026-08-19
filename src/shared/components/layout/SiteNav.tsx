"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "@/shared/components/brand";
import { useCart } from "@/features/cart/CartProvider";
import { cn } from "@/shared/utils/cn";

export function SiteNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <Link href="/" className="shrink-0">
        <BrandWordmark
          subtitle="Wear"
          className="[&>span:first-child]:text-[clamp(1.4rem,4vw,2.1rem)] [&>span:first-child]:[-webkit-text-stroke-width:3px] [&>span:last-child]:text-[clamp(0.8rem,2vw,1.1rem)]"
        />
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/create"
          className={cn(
            "rounded-pill border-[3px] border-ink px-3 py-1.5 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm sm:text-sm",
            pathname === "/create"
              ? "bg-hot-pink text-white"
              : "bg-white text-ink hover:bg-acid-yellow",
          )}
        >
          Create
        </Link>
        <Link
          href="/cart"
          className="relative inline-flex items-center rounded-pill border-[3px] border-ink bg-white px-3 py-1.5 font-display text-xs font-bold uppercase tracking-tight text-ink shadow-sticker-sm hover:bg-acid-yellow sm:text-sm"
        >
          Panier
          {count > 0 ? (
            <span className="ml-1.5 inline-flex min-w-[1.2rem] items-center justify-center rounded-pill bg-hot-pink px-1.5 text-[0.65rem] text-white">
              {count}
            </span>
          ) : null}
        </Link>
      </nav>
    </header>
  );
}
