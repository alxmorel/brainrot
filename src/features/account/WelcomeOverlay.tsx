"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@/features/account/AccountProvider";
import { useShop } from "@/features/shop/ShopProvider";
import { formatWelcomeOffer } from "@/data/pricing";

const STORAGE_KEY = "br-offer-seen-v1";

function shouldSkipPath(pathname: string) {
  return (
    pathname.startsWith("/ops") ||
    pathname.startsWith("/compte") ||
    pathname.startsWith("/checkout")
  );
}

export function WelcomeOverlay() {
  const pathname = usePathname();
  const { me, loaded } = useAccount();
  const shop = useShop();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    if (shouldSkipPath(pathname)) {
      setOpen(false);
      return;
    }
    if (me && !me.welcomeValid) {
      setOpen(false);
      return;
    }
    if (!shop.welcomeLive) {
      setOpen(false);
      return;
    }
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setOpen(false);
        return;
      }
    } catch {
      // private mode
    }
    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, [loaded, me, pathname, shop.welcomeLive]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(shop.welcomeCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-offer-title"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-3 sm:items-center"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md rotate-[-1deg] rounded-[1.6rem] border-[3px] border-ink bg-[#fffdf8] p-5 shadow-sticker sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={dismiss}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-pill border-[3px] border-ink bg-white font-display text-sm font-bold shadow-sticker-sm"
        >
          ×
        </button>

        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-hot-pink">
          Offre d’ouverture
        </p>
        <h2
          id="welcome-offer-title"
          className="mt-2 font-display text-[clamp(2.2rem,8vw,3.4rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-ink"
        >
          {formatWelcomeOffer(shop)}
          <span className="block text-hot-pink">pour toi</span>
        </h2>
        <p className="mt-3 text-sm font-bold leading-snug text-ink/70">
          {me || !shop.welcomeRequiresAccount
            ? `Entre le code au paiement. Valable ${shop.welcomeTtlDays} jours, une fois.`
            : `Crée un compte, puis entre le code au paiement. Valable ${shop.welcomeTtlDays} jours.`}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border-[3px] border-ink bg-acid-yellow px-4 py-3 shadow-sticker-sm">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-ink/50">
              Ton code
            </p>
            <p className="font-display text-2xl font-bold tracking-[0.12em] text-ink">
              {shop.welcomeCode}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copyCode()}
            className="shrink-0 rounded-pill border-[3px] border-ink bg-white px-3 py-1.5 font-display text-xs font-bold uppercase shadow-sticker-sm"
          >
            {copied ? "Copié" : "Copier"}
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {me || !shop.welcomeRequiresAccount ? (
            <Link
              href="/cart#promo"
              onClick={dismiss}
              className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
            >
              L’entrer au paiement
            </Link>
          ) : (
            <Link
              href="/compte/inscription?next=/cart"
              onClick={dismiss}
              className="inline-flex w-full items-center justify-center rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
            >
              Créer un compte
            </Link>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="py-2 text-center text-xs font-bold uppercase tracking-wide text-ink/45 hover:text-ink"
          >
            Continuer sans
          </button>
        </div>
      </div>
    </div>
  );
}
