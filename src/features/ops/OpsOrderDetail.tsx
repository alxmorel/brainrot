"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OpsOrderDetail } from "@/models";
import { isFulfillmentFailed, needsGelatoRetry } from "@/models";
import { formatEur } from "@/data/pricing";
import { Button, Input } from "@/shared/components/ui";

export function OpsOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OpsOrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [tracking, setTracking] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");

  const load = useCallback(async () => {
    const response = await fetch(`/api/ops/orders/${encodeURIComponent(orderId)}`);
    if (response.status === 401) {
      window.location.href = "/ops/login";
      return;
    }
    if (!response.ok) {
      setError("Commande introuvable.");
      return;
    }
    const json: unknown = await response.json();
    if (json && typeof json === "object" && "order" in json) {
      const data = (json as { order: OpsOrderDetail }).order;
      setOrder(data);
      setTracking(data.supplier.tracking ?? "");
      setTrackingUrl(data.supplier.trackingUrl ?? "");
      setCarrier(data.supplier.carrier ?? "");
      setError(null);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setNote(null);
    const response = await fetch(`/api/ops/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const json: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        json &&
        typeof json === "object" &&
        "error" in json &&
        typeof (json as { error: unknown }).error === "string"
          ? (json as { error: string }).error
          : "Action impossible.";
      setNote(message);
      return;
    }
    setNote("Action effectuée.");
    await load();
  }

  if (error) return <p className="font-bold text-hot-pink">{error}</p>;
  if (!order) return <p className="font-bold">Chargement…</p>;

  const stripeUrl = order.stripeCheckoutId
    ? `https://dashboard.stripe.com/checkout/sessions/${order.stripeCheckoutId}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/ops/commandes" className="text-sm font-bold underline">
          ← Commandes
        </Link>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase">{order.id}</h2>
        <p className="text-sm font-bold text-ink/60">
          {order.status} · {formatEur(order.totalCents)} ·{" "}
          {new Date(order.createdAt).toLocaleString("fr-FR")}
        </p>
        {isFulfillmentFailed(order.status) ? (
          <p className="mt-2 font-bold text-hot-pink">
            Paiement reçu - échec Gelato. Relance l’envoi ci-dessous.
          </p>
        ) : null}
        {note ? <p className="mt-2 text-sm font-bold text-ink/70">{note}</p> : null}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Client">
          <p>{order.shipping.name}</p>
          <p>{order.shipping.email}</p>
          <p>{order.shipping.line1}</p>
          <p>
            {order.shipping.postalCode} {order.shipping.city}
          </p>
          <p>{order.shipping.country}</p>
          <p className="mt-2 text-xs text-ink/50">
            Session :{" "}
            <Link
              href={`/ops/sessions/${encodeURIComponent(order.sessionId)}`}
              className="underline"
            >
              {order.sessionId}
            </Link>
          </p>
        </Panel>
        <Panel title="Paiement & fulfillment">
          {stripeUrl ? (
            <p>
              <a href={stripeUrl} target="_blank" rel="noreferrer" className="underline">
                Stripe checkout
              </a>
            </p>
          ) : (
            <p className="text-ink/50">Pas de Stripe ID</p>
          )}
          <p>Gelato : {order.supplier.externalId ?? "-"}</p>
          <p>Transporteur : {order.supplier.carrier ?? "-"}</p>
          <p>Suivi : {order.supplier.tracking ?? "-"}</p>
          {order.supplier.trackingUrl ? (
            <p>
              <a href={order.supplier.trackingUrl} className="underline" target="_blank" rel="noreferrer">
                Lien suivi
              </a>
            </p>
          ) : null}
          {order.supplier.lastError && order.supplier.lastError !== "simulated" ? (
            <p className="text-hot-pink">Erreur : {order.supplier.lastError}</p>
          ) : null}
          <p className="mt-2 text-xs text-ink/50">
            Email confirm. :{" "}
            {order.confirmationEmailSentAt
              ? new Date(order.confirmationEmailSentAt).toLocaleString("fr-FR")
              : "non envoyé"}
          </p>
          <p className="text-xs text-ink/50">
            Email expéd. :{" "}
            {order.shippingEmailSentAt
              ? new Date(order.shippingEmailSentAt).toLocaleString("fr-FR")
              : "non envoyé"}
          </p>
          <p className="text-xs text-ink/50">
            Email livré :{" "}
            {order.deliveredEmailSentAt
              ? new Date(order.deliveredEmailSentAt).toLocaleString("fr-FR")
              : "non envoyé"}
          </p>
        </Panel>
      </section>

      <Panel title="Articles">
        <ul className="flex flex-col gap-3">
          {order.items.map((item, index) => (
            <li key={`${item.brainrotId}-${item.size}-${item.color}-${index}`} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
                <Image
                  src={item.printImage}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-ink/60">
                  {item.size} · {item.colorLabel} · ×{item.quantity}
                </p>
                <p className="text-sm font-bold">{formatEur(item.lineCents)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Actions">
        <div className="flex flex-wrap gap-2">
          {needsGelatoRetry(order.status) ? (
            <Button size="sm" variant="secondary" onClick={() => void act("fulfill")}>
              Réessayer Gelato
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={() => void act("resend_confirmation")}>
            Renvoyer confirmation
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void act("resend_shipped")}>
            Renvoyer expédition
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void act("resend_delivered")}>
            Renvoyer livré
          </Button>
          {order.status === "shipped" ? (
            <Button size="sm" variant="secondary" onClick={() => void act("deliver")}>
              Marquer livrée
            </Button>
          ) : null}
          {order.status !== "cancelled" &&
          order.status !== "shipped" &&
          order.status !== "delivered" ? (
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                if (window.confirm("Annuler cette commande ?")) void act("cancel");
              }}
            >
              Annuler
            </Button>
          ) : null}
        </div>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void act("ship", {
              tracking: tracking.trim() || null,
              trackingUrl: trackingUrl.trim() || null,
              carrier: carrier.trim() || null,
            });
          }}
        >
          <Input
            label="N° de suivi"
            value={tracking}
            onChange={(event) => setTracking(event.target.value)}
          />
          <Input
            label="URL de suivi"
            value={trackingUrl}
            onChange={(event) => setTrackingUrl(event.target.value)}
          />
          <Input
            label="Transporteur"
            value={carrier}
            onChange={(event) => setCarrier(event.target.value)}
          />
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Marquer expédié / mettre à jour suivi
            </Button>
          </div>
        </form>
      </Panel>

      <Panel title="Timeline">
        {order.events.length === 0 ? (
          <p className="text-sm text-ink/50">Aucun événement.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {order.events.map((event) => (
              <li key={event.id} className="flex justify-between gap-3 border-b border-ink/10 pb-2">
                <span className="font-bold">{event.kind}</span>
                <span className="text-ink/50">
                  {new Date(event.createdAt).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <h3 className="font-display text-lg font-bold uppercase">{title}</h3>
      <div className="mt-3 text-sm font-bold">{children}</div>
    </div>
  );
}
