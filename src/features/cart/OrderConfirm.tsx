"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
import { legal } from "@/data/legal";
import { defaultProduct } from "@/data/products";
import { formatEur, shippingNote } from "@/data/pricing";
import { useCart } from "@/features/cart/CartProvider";
import { CheckoutProgress } from "@/features/cart/CheckoutProgress";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { getSessionId } from "@/shared/utils/track";
import { brainrots } from "@/data/brainrots";

type PublicOrderLine = {
  brainrotId: string;
  name: string;
  size: string;
  color: string;
  colorLabel: string;
  quantity: number;
  lineCents: number;
};

type PublicOrder = {
  id: string;
  status: string;
  isPaid: boolean;
  email: string | null;
  items: PublicOrderLine[];
  totalCents: number;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "pending" }
  | { kind: "paid"; order: PublicOrder }
  | { kind: "failed"; message: string };

async function fetchOrder(id: string): Promise<PublicOrder | null> {
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
  return (json as { order: PublicOrder }).order;
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
                  ? `On prépare ton tee — un récap arrive à ${state.order.email}.`
                  : "On prépare ton tee Brainrototo. Tu recevras des nouvelles à l’adresse indiquée lors du paiement."}
              </p>
              <p className="mt-2 text-sm font-bold text-ink/55">
                {shippingNote} · {legal.deliveryEstimate}
              </p>
              <p className="mt-2 max-w-md mx-auto text-sm font-bold text-ink/55">
                {legal.trackingFollowUp}
              </p>
            </div>

            <div className="mt-8 w-full rotate-[-1deg] rounded-[1.5rem] border-[3px] border-ink bg-white p-4 shadow-sticker sm:p-5">
              <p className="font-display text-xs font-bold uppercase tracking-tight text-ink/50">
                Numéro de commande
              </p>
              <p className="mt-1 break-all font-display text-2xl font-bold uppercase leading-none tracking-[-0.04em] text-ink">
                {state.order.id}
              </p>

              <ul className="mt-5 flex flex-col gap-3 border-t-[3px] border-ink/10 pt-4">
                {state.order.items.map((item) => {
                  const brainrot = brainrots.find((b) => b.id === item.brainrotId);
                  return (
                    <li key={`${item.brainrotId}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-16 shrink-0">
                        {brainrot ? (
                          <TeeMockup
                            product={defaultProduct}
                            brainrot={brainrot}
                            color={item.color}
                            className="max-w-none"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-bold uppercase leading-tight text-ink">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-ink/60">
                          {item.size} · {item.colorLabel} · ×{item.quantity}
                        </p>
                        <p className="mt-1 font-display text-sm font-bold text-ink">
                          {formatEur(item.lineCents)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 flex items-baseline justify-between border-t-[3px] border-ink pt-3 font-display text-base font-bold uppercase">
                <span>Total</span>
                <span>{formatEur(state.order.totalCents)} TTC</span>
              </p>
            </div>

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
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
