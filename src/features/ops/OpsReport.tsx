"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Report = {
  totals: { events: number; orders: number; sessionsWithCart: number };
  counts: Record<string, number>;
  funnel: Record<string, number>;
  ordersByStatus: Record<string, number>;
};

export function OpsReport() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    void fetch("/api/ops/report")
      .then((res) => res.json())
      .then((json: unknown) => {
        if (json && typeof json === "object" && "funnel" in json) {
          setReport(json as Report);
        }
      });
  }, []);

  if (!report) {
    return <p className="p-6 font-bold">Chargement…</p>;
  }

  return (
    <div className="min-h-dvh px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">Ops — reporting</h1>
        <Link href="/ops" className="font-display text-sm font-bold uppercase underline">
          Commandes
        </Link>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Events" value={report.totals.events} />
        <Stat label="Sessions panier" value={report.totals.sessionsWithCart} />
        <Stat label="Commandes" value={report.totals.orders} />
      </section>

      <h2 className="mt-8 font-display text-xl font-bold uppercase">Funnel</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {Object.entries(report.funnel).map(([name, value]) => (
          <li key={name} className="rounded-xl border-[3px] border-ink bg-white px-3 py-2">
            <span className="text-xs font-bold uppercase text-ink/50">{name}</span>
            <p className="font-display text-2xl">{value}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-display text-xl font-bold uppercase">Events</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {Object.entries(report.counts).map(([name, value]) => (
          <li key={name} className="rounded-xl border-[3px] border-ink bg-white px-3 py-2">
            <span className="text-xs font-bold uppercase text-ink/50">{name}</span>
            <p className="font-display text-2xl">{value}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 font-display text-xl font-bold uppercase">Statuts commandes</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {Object.entries(report.ordersByStatus).map(([name, value]) => (
          <li key={name} className="rounded-xl border-[3px] border-ink bg-white px-3 py-2">
            <span className="text-xs font-bold uppercase text-ink/50">{name}</span>
            <p className="font-display text-2xl">{value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-acid-yellow p-4 shadow-sticker-sm">
      <p className="text-xs font-bold uppercase">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}
