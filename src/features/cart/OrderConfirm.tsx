"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
import { legal } from "@/data/legal";
import { shippingNote } from "@/data/pricing";
import { useCart } from "@/features/cart/CartProvider";
import { CheckoutProgress } from "@/features/cart/CheckoutProgress";
import { OrderStatusCard, OrderStatusLinks } from "@/features/cart/OrderStatusCard";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { getSessionId } from "@/shared/utils/track";
import type { PublicOrderView } from "@/models";

type LoadState =
  | { kind: "loading" }
  | { kind: "pending" }
  | { kind: "paid"; order: PublicOrderView }
  | { kind: "failed"; message: string };

async function fetchOrder(id: string): Promise<PublicOrderView | null> {
  const response = await fetch(
    `/api/orders/${encodeURIComponent(id)}?sessionId=${encodeURIComponent(getSessionId())}`,
  );
  const json: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !json ||
    typeof json !== "object" ||
    !("ok" in json) ||
    !(json as { ok: unknown }).ok ||
    !("order" in json)
  ) {
    return null;
  }
  return (json as { order: PublicOrderView }).order;
}

export function OrderConfirm({ orderId }: { orderId?: string }) {
  const { clearCart } = useCart();
  const cleared = useRef(false);
  const [state, setState] = useState<LoadState>(
    orderId ? { kind: "loading" } : { kind: "failed", message: "Commande introuvable." },
  );

  useEffect(() => {
    if (!orderId) return;
    const id = orderId;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15;

    async function load() {
      const order = await fetchOrder(id);
      if (cancelled) return;

      if (!order) {
        setState({
          kind: "failed",
          message: "Commande introuvable ou session expirée.",
        });
        return;
      }

      if (order.isPaid) {
        if (!cleared.current) {
          clearCart();
          cleared.current = true;
        }
        setState({ kind: "paid", order });
        return;
      }

      if (order.status === "pending_payment" && attempts < maxAttempts) {
        setState({ kind: "pending" });
        attempts += 1;
        window.setTimeout(load, 2000);
        return;
      }

      setState({
        kind: "failed",
        message: "Le paiement n’a pas été confirmé. Ton panier est intact.",
      });
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId, clearCart]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col px-4 pb-16 pt-8 sm:px-6">
        <CheckoutProgress step="done" />

        {state.kind === "loading" || state.kind === "pending" ? (
          <div className="mt-10 text-center">
            <p className="font-display text-xl font-bold uppercase text-ink">
              {state.kind === "pending"
                ? "Confirmation du paiement…"
                : "Chargement…"}
            </p>
            <p className="mt-2 text-sm font-bold text-ink/60">
              Quelques secondes, on vérifie avec Stripe.
            </p>
          </div>
        ) : null}

        {state.kind === "failed" ? (
          <div className="mt-10 text-center">
            <p className="font-display text-xl font-bold uppercase text-ink">
              Paiement non confirmé
            </p>
            <p className="mt-2 text-sm font-bold text-ink/70">{state.message}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/cart"
                className="inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
              >
                Retour au panier
              </Link>
              <Link
                href="/create"
                className="inline-flex rounded-pill border-[3px] border-ink bg-white px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-ink shadow-sticker-sm"
              >
                {brand.hero.cta}
              </Link>
            </div>
          </div>
        ) : null}

        {state.kind === "paid" ? (
          <>
            <div className="mt-8 text-center">
              <p className="rotate-[-4deg] inline-flex rounded-pill border-[3px] border-ink bg-acid-yellow px-3 py-1 font-display text-xs font-bold uppercase tracking-tight shadow-sticker-sm">
                C’est validé
              </p>

              <h1 className="mt-4 font-display text-[clamp(2rem,7vw,4rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-ink">
                Merci,{" "}
                <span className="text-hot-pink">c’est commandé</span>
              </h1>

              <p className="mt-4 max-w-md mx-auto text-sm font-bold leading-snug text-ink/70 sm:text-base">
                {state.order.email
                  ? `On prépare ton tee - un récap arrive à ${state.order.email}.`
                  : "On prépare ton tee Brainrototo. Tu recevras des nouvelles à l’adresse indiquée lors du paiement."}
              </p>
              <p className="mt-2 text-sm font-bold text-ink/55">
                {shippingNote} · {legal.deliveryEstimate}
              </p>
              <p className="mt-2 max-w-md mx-auto text-sm font-bold text-ink/55">
                {legal.trackingFollowUp}
              </p>
              <Link
                href="/commande"
                className="mt-3 inline-block text-sm font-bold text-hot-pink underline"
              >
                Suivre ma commande plus tard →
              </Link>
            </div>

            <div className="mt-8">
              <OrderStatusCard order={state.order} />
            </div>

            <OrderStatusLinks />
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
