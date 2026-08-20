"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/CartProvider";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, Input } from "@/shared/components/ui";
import { getSessionId, track } from "@/shared/utils/track";

export function CheckoutPage() {
  const { items } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(form: FormData) {
    setError(null);
    setPending(true);
    track("begin_checkout", { items: items.length });
    const shipping = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      line1: String(form.get("line1") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      country: String(form.get("country") ?? "FR"),
    };
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        shipping,
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
      </main>
      <SiteFooter />
    </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="mx-auto max-w-lg px-4 py-6">
        <h1 className="font-display text-3xl font-bold uppercase">Checkout</h1>
        <p className="mt-2 text-sm font-bold text-ink/70">
          {items.length} article{items.length > 1 ? "s" : ""} — paiement sécurisé.
        </p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(new FormData(event.currentTarget));
          }}
        >
          <Input name="name" label="Nom" required />
          <Input name="email" type="email" label="Email" required />
          <Input name="line1" label="Adresse" required />
          <Input name="city" label="Ville" required />
          <Input name="postalCode" label="Code postal" required />
          <Input name="country" label="Pays" defaultValue="FR" required />
          <label className="flex items-start gap-2 text-sm font-bold text-ink/75">
            <input
              name="cgv"
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
              .
            </span>
          </label>
          {error ? (
            <p className="text-sm font-bold text-hot-pink">{error}</p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Redirection…" : "Payer"}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
