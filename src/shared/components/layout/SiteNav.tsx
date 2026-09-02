"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { brand } from "@/data/brand";
import { BrandWordmark } from "@/shared/components/brand";
import {
  ComposeLink,
  HomeHashLink,
} from "@/shared/components/layout/ComposeLink";
import { OfferBar } from "@/features/account/OfferBar";
import { UnusedCredit } from "@/features/account/UnusedCredit";
import { useAccount } from "@/features/account/AccountProvider";
import { useCart } from "@/features/cart/CartProvider";
import { CART_FLY_TARGET_ID } from "@/features/cart/flyToCart";
import { cn } from "@/shared/utils/cn";

const press =
  "transition-[transform,box-shadow,background-color] duration-[var(--duration-button)] ease-[var(--ease-out)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-sticker-sm";

const iconBtn = cn(
  "inline-flex h-10 w-10 items-center justify-center rounded-pill border-[3px] border-ink shadow-sticker sm:h-11 sm:w-11",
  press,
);

const shopItem =
  "inline-flex h-10 w-11 items-center justify-center sm:h-11 sm:w-12";

const HOME_SECTIONS = ["compose", "mystery"] as const;

function useHomeSection() {
  const pathname = usePathname();
  const [active, setActive] = useState<(typeof HOME_SECTIONS)[number] | null>(
    null,
  );

  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const ratios = new Map<string, number>();

    function pick() {
      let best: (typeof HOME_SECTIONS)[number] | null = null;
      let bestRatio = 0;
      for (const id of HOME_SECTIONS) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      }
      setActive(bestRatio > 0.08 ? best : null);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }
        pick();
      },
      {
        rootMargin: "-88px 0px -42% 0px",
        threshold: [0, 0.08, 0.2, 0.35, 0.5, 0.75, 1],
      },
    );

    const nodes = HOME_SECTIONS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (nodes.length === 0) return;
    for (const node of nodes) observer.observe(node);

    return () => observer.disconnect();
  }, [pathname]);

  return active;
}

export function SiteNav() {
  const pathname = usePathname();
  const homeSection = useHomeSection();
  const { count } = useCart();
  const { me } = useAccount();
  const bandeOn =
    pathname.startsWith("/tee") || homeSection === "compose";
  const mysteryOn =
    pathname.startsWith("/mystery") || homeSection === "mystery";
  const compteOn = pathname.startsWith("/compte");
  const cartOn = pathname === "/cart" || pathname.startsWith("/checkout");

  return (
    <div className="sticky top-0 z-40">
      <OfferBar />
      <header className="flex items-center justify-between gap-2 border-b-[3px] border-ink bg-[#fffdf8] px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandWordmark
            subtitle="Wear"
            className="[&>span:first-child]:text-[clamp(1.15rem,4vw,2.1rem)] [&>span:first-child]:[-webkit-text-stroke-width:3px] [&>span:last-child]:hidden sm:[&>span:last-child]:inline sm:[&>span:last-child]:text-[clamp(0.8rem,2vw,1.1rem)]"
          />
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2.5">
          {me && me.creditCents > 0 ? (
            <UnusedCredit cents={me.creditCents} compact className="max-w-[7.5rem]" />
          ) : null}

          <div
            className={cn(
              "flex overflow-hidden rounded-pill border-[3px] border-ink bg-acid-yellow shadow-sticker",
              press,
            )}
            role="group"
            aria-label="Boutique"
          >
            <ComposeLink
              cta="bande"
              source="nav"
              aria-label="La bande"
              aria-current={bandeOn ? "page" : undefined}
              className={cn(
                shopItem,
                "border-r-[3px] border-ink",
                bandeOn ? "bg-hot-pink text-white" : "text-ink hover:bg-white",
              )}
            >
              <TeeIcon />
            </ComposeLink>
            <HomeHashLink
              hash="mystery"
              aria-label={brand.mystery.name}
              aria-current={mysteryOn ? "page" : undefined}
              className={cn(
                shopItem,
                mysteryOn ? "bg-hot-pink text-white" : "text-ink hover:bg-white",
              )}
            >
              <MysteryIcon />
            </HomeHashLink>
          </div>

          <div className="w-10 shrink-0 sm:w-11" aria-hidden />
          <IconLink
            href={me ? "/compte" : "/compte/inscription"}
            label={me ? "Compte" : "Rejoindre"}
            current={compteOn}
          >
            <AccountIcon />
          </IconLink>
          <Link
            id={CART_FLY_TARGET_ID}
            href="/cart"
            aria-label={count > 0 ? `Panier, ${count}` : "Panier"}
            aria-current={cartOn ? "page" : undefined}
            className={cn(
              iconBtn,
              "relative",
              cartOn ? "bg-hot-pink text-white" : "bg-white text-ink hover:bg-acid-yellow",
            )}
          >
            <BagIcon />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-[1.15rem] items-center justify-center rounded-pill border-[2px] border-ink bg-acid-yellow px-1 text-[0.6rem] font-display font-bold text-ink">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </header>
    </div>
  );
}

function IconLink({
  href,
  label,
  current,
  children,
}: {
  href: string;
  label: string;
  current: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      className={cn(
        iconBtn,
        current ? "bg-hot-pink text-white" : "bg-white text-ink hover:bg-acid-yellow",
      )}
    >
      {children}
    </Link>
  );
}

function TeeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M8.2 4.2 4 7.2v3.1l3.6-1v10.2h8.8V9.3l3.6 1V7.2l-4.2-3-2.2 2.1h-3.2L8.2 4.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MysteryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.35c-.7.32-1.1.82-1.1 1.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.15" fill="currentColor" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="12" cy="8.2" r="3.1" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5.6 19.2c.7-3.3 3.1-5 6.4-5s5.7 1.7 6.4 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6.4 8.2h11.2l-.8 11.2H7.2L6.4 8.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.2V7.1a3 3 0 0 1 6 0v1.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
