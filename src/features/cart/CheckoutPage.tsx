"use client";

import { useState } from "react";
import Link from "next/link";
import { brainrots } from "@/data/brainrots";
import { legal } from "@/data/legal";
import {
  customProductNote,
  formatEur,
  shippingNote,
  teePriceCents,
} from "@/data/pricing";
import { defaultProduct, products } from "@/data/products";
import { teeColorLabel } from "@/data/teeColors";
import { useCart } from "@/features/cart/CartProvider";
import { TeeMockup } from "@/features/generator/TeeMockup";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button } from "@/shared/components/ui";
import { getSessionId, track } from "@/shared/utils/track";

export function CheckoutPage() {
  const { items, count } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * teePriceCents,
    0,
  );

  async function pay() {
    setError(null);
    setPending(true);
    track("begin_checkout", { items: count });
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        items,
      }),
    });
    const json: unknown = await response.json().catch(() => null);
    setPending(false);
    if (
      !response.ok ||
      !json ||
      typeof json !== "object" ||
      !("url" in json) ||
      typeof (json as { url: unknown }).url !== "string"
    ) {
      const message =
        json && typeof json === "object" && "error" in json
          ? String((json as { error: unknown }).error)
          : "Paiement indisponible. Réessaie.";
      setError(message);
      return;
    }
    window.location.href = (json as { url: string }).url;
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteNav />
        <main className="mx-auto max-w-lg flex-1 px-4 py-10 text-center">
          <p className="font-display text-xl font-bold uppercase">Panier vide</p>
          <Link
            href="/create"
            className="mt-4 inline-flex rounded-pill border-[3px] border-ink bg-hot-pink px-6 py-3 font-display text-sm font-bold uppercase tracking-tight text-white shadow-sticker"
          >
            Choisir un tee →
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-lg px-4 py-6">
        <Link
          href="/cart"
          className="font-display text-xs font-bold uppercase text-ink/55 underline decoration-2 underline-offset-2 hover:text-hot-pink"
        >
          ← Modifier le panier
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase">
          Commande
        </h1>
        <p className="mt-2 text-sm font-bold text-ink/70">
          {count} article{count > 1 ? "s" : ""} · adresse sur Stripe
        </p>

        <ul className="mt-5 flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
          {items.map((item) => {
            const brainrot = brainrots.find((b) => b.id === item.brainrotId);
            const product = products.find((p) => p.id === item.productId);
            if (!brainrot || !product) return null;
            return (
              <li
                key={item.id}
                className="flex gap-3 border-b-[3px] border-ink/10 pb-3 last:border-0 last:pb-0"
              >
                <div className="w-16 shrink-0 sm:w-20">
                  <TeeMockup
                    product={defaultProduct}
                    brainrot={brainrot}
                    color={item.color}
                    className="max-w-none"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold uppercase leading-tight text-ink">
                    {brainrot.name}
                  </p>
                  <p className="text-xs font-bold text-ink/60">
                    {item.size} · {teeColorLabel(item.color)} · ×{item.quantity}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-ink">
                    {formatEur(item.quantity * teePriceCents)}
                  </p>
                </div>
              </li>
            );
          })}
          <li className="mt-2 flex items-baseline justify-between border-t-[3px] border-ink pt-2 font-display text-base font-bold uppercase">
            <span>Total</span>
            <span>{formatEur(totalCents)} TTC</span>
          </li>
          <li className="text-xs font-bold text-ink/55">
            {shippingNote} · {legal.deliveryEstimate}
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <label className="flex items-start gap-2 text-sm font-bold text-ink/75">
            <input
              id="checkout-cgv"
              type="checkbox"
              required
              className="mt-1 size-4 accent-hot-pink"
            />
            <span>
              J’accepte les{" "}
              <Link href="/cgv" className="underline hover:text-hot-pink">
                CGV
              </Link>{" "}
              et la{" "}
              <Link
                href="/confidentialite"
                className="underline hover:text-hot-pink"
              >
                politique de confidentialité
              </Link>
              . {customProductNote}
            </span>
          </label>
          {error ? (
            <p className="text-sm font-bold text-hot-pink">{error}</p>
          ) : null}
          <Button
            type="button"
            disabled={pending}
            onClick={() => {
              const cgv = document.getElementById(
                "checkout-cgv",
              ) as HTMLInputElement | null;
              if (!cgv?.checked) {
                setError("Accepte les CGV pour continuer.");
                return;
              }
              void pay();
            }}
          >
            {pending ? "Redirection…" : `Payer ${formatEur(totalCents)}`}
          </Button>
          <p className="text-xs font-bold text-ink/45">
            Tu saisiras ton adresse de livraison sur la page de paiement Stripe.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
