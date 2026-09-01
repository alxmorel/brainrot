"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OpsSessionSummary } from "@/models";
import { formatOpsRange, OpsPeriodToggle } from "@/features/ops/OpsPeriodToggle";
import { Button } from "@/shared/components/ui";

export function OpsSessionsList() {
  const [sessions, setSessions] = useState<OpsSessionSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [days, setDays] = useState(7);
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [hasCart, setHasCart] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "25",
      days: String(days),
    });
    if (hasCart) params.set("hasCart", "1");
    if (hasOrder) params.set("hasOrder", "1");

    const response = await fetch(`/api/ops/sessions?${params}`);
    if (response.status === 401) {
      window.location.href = "/ops/login";
      return;
    }
    const json: unknown = await response.json();
    if (json && typeof json === "object" && "sessions" in json) {
      const data = json as {
        sessions: OpsSessionSummary[];
        totalPages: number;
        from?: string;
        to?: string;
      };
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
      setFrom(data.from ?? null);
      setTo(data.to ?? null);
    }
  }, [days, hasCart, hasOrder, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase">Sessions</h2>
          <p className="text-sm font-bold text-ink/60">
            {from && to ? formatOpsRange(from, to, days) : `${days} derniers jours`}
          </p>
        </div>
        <OpsPeriodToggle
          days={days}
          onChange={(value) => {
            setDays(value);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={hasCart}
            onChange={(event) => {
              setHasCart(event.target.checked);
              setPage(1);
            }}
          />
          Avec panier
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={hasOrder}
            onChange={(event) => {
              setHasOrder(event.target.checked);
              setPage(1);
            }}
          />
          Avec commande
        </label>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {sessions.length === 0 ? (
          <li className="rounded-2xl border-[3px] border-ink bg-white p-4">Aucune session.</li>
        ) : (
          sessions.map((session) => (
            <li
              key={session.sessionId}
              className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm"
            >
              <Link
                href={`/ops/sessions/${encodeURIComponent(session.sessionId)}`}
                className="font-display text-sm font-bold underline"
              >
                {session.sessionId}
              </Link>
              <p className="mt-1 text-sm text-ink/60">
                {session.eventCount} events ·{" "}
                {new Date(session.firstAt).toLocaleString("fr-FR")} →{" "}
                {new Date(session.lastAt).toLocaleString("fr-FR")}
              </p>
              <p className="text-xs font-bold text-ink/50">
                {session.eventNames.slice(0, 6).join(", ")}
                {session.eventNames.length > 6 ? "…" : ""}
              </p>
              {session.orderId ? (
                <p className="mt-1 text-xs">
                  Commande :{" "}
                  <Link
                    href={`/ops/commandes/${encodeURIComponent(session.orderId)}`}
                    className="underline"
                  >
                    {session.orderId}
                  </Link>
                </p>
              ) : null}
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
