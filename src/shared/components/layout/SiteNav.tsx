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
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b-[3px] border-ink bg-[#fffdf8] px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
      <Link href="/" className="shrink-0">
        <BrandWordmark
          subtitle="Wear"
          className="[&>span:first-child]:text-[clamp(1.15rem,4vw,2.1rem)] [&>span:first-child]:[-webkit-text-stroke-width:3px] [&>span:last-child]:hidden sm:[&>span:last-child]:inline sm:[&>span:last-child]:text-[clamp(0.8rem,2vw,1.1rem)]"
        />
      </Link>

      <nav className="flex items-center gap-1 sm:gap-3">
        <Link
          href="/create"
          className={cn(
            "rounded-pill border-[3px] border-ink px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-tight shadow-sticker-sm sm:px-3 sm:py-1.5 sm:text-sm",
            pathname === "/create" || pathname.startsWith("/tee")
              ? "bg-hot-pink text-white"
              : "bg-white text-ink hover:bg-acid-yellow",
          )}
        >
          Collection
        </Link>
        <Link
          href="/cart"
          className={cn(
            "relative inline-flex items-center rounded-pill border-[3px] border-ink px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-tight shadow-sticker-sm sm:px-3 sm:py-1.5 sm:text-sm",
            pathname === "/cart" || pathname.startsWith("/checkout")
              ? "bg-hot-pink text-white"
              : "bg-white text-ink hover:bg-acid-yellow",
          )}
        >
          Panier
          {count > 0 ? (
            <span className="ml-1.5 inline-flex min-w-[1.2rem] items-center justify-center rounded-pill bg-acid-yellow px-1.5 text-[0.65rem] text-ink">
              {count}
            </span>
          ) : null}
        </Link>
      </nav>
    </header>
  );
}
