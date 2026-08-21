"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/models";
import { Button } from "@/shared/components/ui";

export function OpsOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/orders");
    if (response.status === 401) {
      window.location.href = "/ops/login";
      return;
    }
    if (!response.ok) {
      setError("Impossible de charger les commandes.");
      return;
    }
    const json: unknown = await response.json();
    if (json && typeof json === "object" && "orders" in json) {
      setOrders((json as { orders: Order[] }).orders);
      setError(null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, action: "validate" | "fulfill" | "ship" | "cancel") {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
  }

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">Ops — commandes</h1>
        <nav className="flex gap-3 font-display text-sm font-bold uppercase">
          <Link href="/ops" className="underline">
            Commandes
          </Link>
          <Link href="/ops/report" className="underline">
            Reporting
          </Link>
          <Link href="/create">Create</Link>
          <button
            type="button"
            className="underline"
            onClick={() => {
              void fetch("/api/ops/logout", { method: "POST" }).then(() => {
                window.location.href = "/ops/login";
              });
            }}
          >
            Sortir
          </button>
        </nav>
      </header>
      {error ? <p className="mt-4 font-bold text-hot-pink">{error}</p> : null}
      <ul className="mt-6 flex flex-col gap-3">
        {orders.length === 0 ? (
          <li className="rounded-2xl border-[3px] border-ink bg-white p-4">
            Aucune commande.
          </li>
        ) : (
          orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold">{order.id}</p>
                  <p className="text-sm font-bold text-ink/60">
                    {order.status} · {order.shipping.email}
                  </p>
                  <p className="text-sm">
                    {order.items
                      .map((item) => `${item.brainrotId} ${item.size} ${item.color} ×${item.quantity}`)
                      .join(" · ")}
                  </p>
                  {order.supplier.externalId ? (
                    <p className="text-xs font-bold text-ink/50">
                      Gelato {order.supplier.externalId}
                      {order.supplier.lastError === "simulated"
                        ? " (simulé)"
                        : ""}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === "paid" ? (
                    <Button size="sm" onClick={() => void act(order.id, "validate")}>
                      Valider
                    </Button>
                  ) : null}
                  {order.status === "validated" || order.status === "failed" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void act(order.id, "fulfill")}
                    >
                      Envoyer Gelato
                    </Button>
                  ) : null}
                  {order.status === "fulfillment_sent" ? (
                    <Button size="sm" variant="ghost" onClick={() => void act(order.id, "ship")}>
                      Marquer expédié
                    </Button>
                  ) : null}
                  {order.status !== "cancelled" && order.status !== "shipped" ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => void act(order.id, "cancel")}
                    >
                      Annuler
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
