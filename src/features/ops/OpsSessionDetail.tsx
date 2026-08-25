"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { OpsSessionDetail } from "@/models";

export function OpsSessionDetail({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<OpsSessionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch(
      `/api/ops/sessions/${encodeURIComponent(sessionId)}`,
    );
    if (response.status === 401) {
      window.location.href = "/ops/login";
      return;
    }
    if (!response.ok) {
      setError("Session introuvable.");
      return;
    }
    const json: unknown = await response.json();
    if (json && typeof json === "object" && "session" in json) {
      setSession((json as { session: OpsSessionDetail }).session);
      setError(null);
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <p className="font-bold text-hot-pink">{error}</p>;
  if (!session) return <p className="font-bold">Chargement…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/ops/sessions" className="text-sm font-bold underline">
          ← Sessions
        </Link>
        <h2 className="mt-2 break-all font-display text-xl font-bold uppercase">
          {session.sessionId}
        </h2>
        {session.order ? (
          <p className="mt-2 text-sm font-bold">
            Commande :{" "}
            <Link
              href={`/ops/commandes/${encodeURIComponent(session.order.id)}`}
              className="underline"
            >
              {session.order.id}
            </Link>{" "}
            · {session.order.status}
          </p>
        ) : (
          <p className="mt-2 text-sm text-ink/50">Pas de commande liée.</p>
        )}
      </div>

      <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
        <h3 className="font-display text-lg font-bold uppercase">Timeline</h3>
        <ul className="mt-4 space-y-3">
          {session.events.map((event) => (
            <li
              key={event.id}
              className="border-b border-ink/10 pb-3 text-sm last:border-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold">{event.name}</span>
                <span className="text-xs text-ink/50">
                  {new Date(event.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>
              <p className="text-ink/60">{event.path}</p>
              {event.payload ? (
                <pre className="mt-1 overflow-x-auto rounded bg-ink-soft p-2 text-xs">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
