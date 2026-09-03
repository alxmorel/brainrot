"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicOrderView } from "@/models";
import { useAccount } from "@/features/account/AccountProvider";
import { OrderStatusCard, OrderStatusLinks } from "@/features/cart/OrderStatusCard";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteNav } from "@/shared/components/layout/SiteNav";
import { Button, Input } from "@/shared/components/ui";

type ViewState =
  | { kind: "form" }
  | { kind: "loading" }
  | { kind: "found"; order: PublicOrderView }
  | { kind: "error"; message: string };

function peekOrderIdFromToken(token: string): string | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  return parts[0]?.trim() || null;
}

function parseOrderResponse(response: Response, json: unknown): PublicOrderView | null {
  if (
    response.ok &&
    json &&
    typeof json === "object" &&
    "ok" in json &&
    (json as { ok: unknown }).ok &&
    "order" in json
  ) {
    return (json as { order: PublicOrderView }).order;
  }
  return null;
}

function errorMessage(json: unknown, fallback: string) {
  if (
    json &&
    typeof json === "object" &&
    "error" in json &&
    typeof (json as { error: unknown }).error === "string"
  ) {
    return (json as { error: string }).error;
  }
  return fallback;
}

export function OrderLookup() {
  const { me, loaded } = useAccount();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "form" });
  const autoTried = useRef(false);

  async function fetchById(id: string, query: Record<string, string>) {
    const params = new URLSearchParams(query);
    const response = await fetch(
      `/api/orders/${encodeURIComponent(id)}${params.size ? `?${params}` : ""}`,
    );
    const json: unknown = await response.json().catch(() => null);
    return { response, json, order: parseOrderResponse(response, json) };
  }

  async function lookup(id: string, mail: string) {
    const response = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, email: mail }),
    });
    const json: unknown = await response.json().catch(() => null);
    return { response, json, order: parseOrderResponse(response, json) };
  }

  useEffect(() => {
    if (!loaded || autoTried.current) return;
    autoTried.current = true;

    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id")?.trim() ?? "";
    const tokenParam = params.get("token")?.trim() ?? "";

    if (me?.email) setEmail(me.email);
    if (idParam) setOrderId(idParam);

    async function run() {
      if (tokenParam) {
        const idFromToken = peekOrderIdFromToken(tokenParam);
        if (!idFromToken) {
          setState({ kind: "error", message: "Lien de suivi invalide." });
          return;
        }
        setOrderId(idFromToken);
        setState({ kind: "loading" });
        const result = await fetchById(idFromToken, { token: tokenParam });
        if (result.order) {
          setState({ kind: "found", order: result.order });
          return;
        }
        setState({
          kind: "error",
          message: errorMessage(result.json, "Lien de suivi invalide ou expiré."),
        });
        return;
      }

      if (!idParam) return;

      setState({ kind: "loading" });
      const byAuth = await fetchById(idParam, {});
      if (byAuth.order) {
        setState({ kind: "found", order: byAuth.order });
        return;
      }

      if (me?.email) {
        const byEmail = await lookup(idParam, me.email);
        if (byEmail.order) {
          setState({ kind: "found", order: byEmail.order });
          return;
        }
      }

      setState({ kind: "form" });
    }

    void run();
  }, [loaded, me]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const id = orderId.trim();
    const mail = email.trim();
    if (!id || !mail) {
      setState({ kind: "error", message: "N° de commande et email requis." });
      return;
    }

    setState({ kind: "loading" });
    const result = await lookup(id, mail);
    if (result.order) {
      setState({ kind: "found", order: result.order });
      return;
    }
    setState({
      kind: "error",
      message: errorMessage(result.json, "Impossible de retrouver la commande."),
    });
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
