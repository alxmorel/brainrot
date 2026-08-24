"use client";

import { useMemo, useState } from "react";
import { teePriceCents } from "@/data/pricing";
import { useCart } from "@/features/cart/CartProvider";
import { getSessionId, track } from "@/shared/utils/track";
import type { CartItem } from "@/models";

export function useCheckoutPay(items: CartItem[]) {
  const { count } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * teePriceCents, 0),
    [items],
  );

  async function pay(cgvAccepted: boolean) {
    setError(null);
    if (!cgvAccepted) {
      setError("Accepte les CGV pour continuer.");
      return;
    }
    if (items.length === 0) return;

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

  return { pay, error, setError, pending, totalCents };
}
