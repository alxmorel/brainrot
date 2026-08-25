"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OpsOrderSummary } from "@/models";
import { formatEur } from "@/data/pricing";
import { Button, Input } from "@/shared/components/ui";

const STATUSES = [
  "",
  "pending_payment",
  "paid",
  "fulfillment_sent",
  "shipped",
  "failed",
  "cancelled",
] as const;

export function OpsOrdersList() {
  const [orders, setOrders] = useState<OpsOrderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (status) params.set("status", status);
    if (q.trim()) params.set("q", q.trim());

    const response = await fetch(`/api/ops/orders?${params}`);
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
      const data = json as {
        orders: OpsOrderSummary[];
        total: number;
        totalPages: number;
      };
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setError(null);
    }
  }, [page, q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase">Commandes</h2>
          <p className="text-sm font-bold text-ink/60">{total} commande(s)</p>
        </div>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            void load();
          }}
        >
          <Input
            label="Recherche"
            name="q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="ID ou email"
            className="min-w-[200px]"
          />
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-hot-pink">
              Statut
            </span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border-[3px] border-ink bg-white px-3 py-3 text-sm font-bold shadow-sticker-sm"
            >
              {STATUSES.map((value) => (
                <option key={value || "all"} value={value}>
                  {value || "Tous"}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" size="sm">
            Filtrer
          </Button>
        </form>
      </div>

      {error ? <p className="mt-4 font-bold text-hot-pink">{error}</p> : null}

      <ul className="mt-6 flex flex-col gap-3">
        {orders.length === 0 ? (
          <li className="rounded-2xl border-[3px] border-ink bg-white p-4">Aucune commande.</li>
        ) : (
          orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/ops/commandes/${encodeURIComponent(order.id)}`}
                    className="font-display text-lg font-bold underline"
                  >
                    {order.id}
                  </Link>
                  <p className="text-sm font-bold text-ink/60">
                    {order.status} · {order.email}
                  </p>
                  <p className="text-sm font-bold">
                    {formatEur(order.totalCents)} · {order.itemCount} article(s)
                  </p>
                  <p className="text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <Link
                  href={`/ops/commandes/${encodeURIComponent(order.id)}`}
                  className="text-sm font-bold uppercase underline"
                >
                  Détail →
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Préc.
          </Button>
          <span className="text-sm font-bold">
            Page {page} / {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suiv. →
          </Button>
        </div>
      ) : null}
    </div>
  );
}
