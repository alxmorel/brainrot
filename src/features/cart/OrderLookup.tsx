"use client";

import { useState } from "react";
import type { PublicOrderView } from "@/models";
import { OrderStatusCard, OrderStatusLinks } from "@/features/cart/OrderStatusCard";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, Input } from "@/shared/components/ui";

type ViewState =
  | { kind: "form" }
  | { kind: "loading" }
  | { kind: "found"; order: PublicOrderView }
  | { kind: "error"; message: string };

export function OrderLookup() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "form" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const id = orderId.trim();
    const mail = email.trim();
    if (!id || !mail) {
      setState({ kind: "error", message: "N° de commande et email requis." });
      return;
    }

    setState({ kind: "loading" });
    const response = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, email: mail }),
    });
    const json: unknown = await response.json().catch(() => null);

    if (
      response.ok &&
      json &&
      typeof json === "object" &&
      "ok" in json &&
      (json as { ok: unknown }).ok &&
      "order" in json
    ) {
      setState({ kind: "found", order: (json as { order: PublicOrderView }).order });
      return;
    }

    const message =
      json &&
      typeof json === "object" &&
      "error" in json &&
      typeof (json as { error: unknown }).error === "string"
        ? (json as { error: string }).error
        : "Impossible de retrouver la commande.";
    setState({ kind: "error", message });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col px-4 pb-16 pt-8 sm:px-6">
        <div className="text-center">
          <h1 className="font-display text-[clamp(2rem,7vw,3.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink">
            Ma <span className="text-hot-pink">commande</span>
          </h1>
          <p className="mt-3 text-sm font-bold text-ink/60 sm:text-base">
            Retrouve ton statut et le lien de suivi avec ton n° de commande et l’email
            utilisé au paiement.
          </p>
        </div>

        {state.kind === "form" || state.kind === "loading" || state.kind === "error" ? (
          <form
            onSubmit={(event) => void submit(event)}
            className="mt-8 rotate-[1deg] rounded-[1.5rem] border-[3px] border-ink bg-white p-4 shadow-sticker sm:p-5"
          >
            <Input
              label="N° de commande"
              name="orderId"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="BR-…"
              autoComplete="off"
              disabled={state.kind === "loading"}
              required
            />
            <div className="mt-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ton@email.com"
                autoComplete="email"
                disabled={state.kind === "loading"}
                required
              />
            </div>
            {state.kind === "error" ? (
              <p className="mt-4 text-sm font-bold text-hot-pink">{state.message}</p>
            ) : null}
            <div className="mt-5">
              <Button type="submit" disabled={state.kind === "loading"} className="w-full">
                {state.kind === "loading" ? "Recherche…" : "Voir ma commande →"}
              </Button>
            </div>
          </form>
        ) : null}

        {state.kind === "found" ? (
          <>
            <div className="mt-8">
              <OrderStatusCard order={state.order} />
            </div>
            <button
              type="button"
              className="mt-4 text-center text-sm font-bold text-ink/50 underline"
              onClick={() => setState({ kind: "form" })}
            >
              Rechercher une autre commande
            </button>
            <OrderStatusLinks />
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
