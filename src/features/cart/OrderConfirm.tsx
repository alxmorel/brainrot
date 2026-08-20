"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/CartProvider";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";

export function OrderConfirm({ orderId }: { orderId?: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="relative mx-auto flex max-w-[720px] flex-1 flex-col items-center px-4 pb-16 pt-8 text-center sm:px-6">
        <p className="rotate-[-4deg] rounded-pill border-[3px] border-ink bg-acid-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm">
          C’est validé
        </p>

        <h1 className="mt-4 font-display text-[clamp(2.4rem,8vw,4.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-ink">
          Merci,{" "}
          <span className="text-hot-pink">c’est commandé</span>
        </h1>

        <p className="mt-4 max-w-md text-sm font-bold leading-snug text-ink/70 sm:text-base">
          Ton paiement est passé. On prépare ton tee Brainrototo — mail dès qu’il
          part.
        </p>

        {orderId ? (
          <div className="mt-8 w-full max-w-sm rotate-[-1.5deg] rounded-[1.5rem] border-[3px] border-ink bg-white px-5 py-6 shadow-sticker">
            <p className="font-display text-xs font-bold uppercase tracking-tight text-ink/50">
              Numéro de commande
            </p>
            <p className="mt-2 break-all font-display text-[clamp(1.6rem,5vw,2.2rem)] font-bold uppercase leading-none tracking-[-0.04em] text-ink">
              {orderId}
            </p>
            <p className="mt-3 text-xs font-bold text-ink/55">
              Garde-le au cas où tu nous écris.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/create"
            className="inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
          >
            Créer un autre →
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-pill border-[3px] border-ink bg-white px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-ink shadow-sticker-sm"
          >
            Accueil
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
