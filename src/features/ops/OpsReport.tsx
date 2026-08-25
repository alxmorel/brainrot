"use client";

import { useEffect, useState } from "react";
import { formatEur } from "@/data/pricing";
import { Button } from "@/shared/components/ui";

type Report = {
  periodDays: number;
  revenue: {
    totalCents: number;
    orderCount: number;
    averageCents: number;
    byDay: Record<string, { orders: number; cents: number }>;
  };
  analytics: {
    counts: Record<string, number>;
    funnel: Record<string, number>;
    conversionRate: number;
    abandonedCheckout: number;
    topBrainrots: { brainrotId: string; count: number }[];
    totalEvents: number;
    sessionsWithCart: number;
  };
  ordersByStatus: Record<string, number>;
  totals: { orders: number; events: number; sessionsWithCart: number };
};

export function OpsReport() {
  const [days, setDays] = useState(7);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    void fetch(`/api/ops/report?days=${days}`)
      .then((res) => res.json())
      .then((json: unknown) => {
        if (json && typeof json === "object" && "analytics" in json) {
          setReport(json as Report);
        }
      });
  }, [days]);

  if (!report) return <p className="font-bold">Chargement…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase">Analytics</h2>
          <p className="text-sm font-bold text-ink/60">{report.periodDays} derniers jours</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((value) => (
            <Button
              key={value}
              size="sm"
              variant={days === value ? "primary" : "ghost"}
              onClick={() => setDays(value)}
            >
              {value}j
            </Button>
          ))}
          <a
            href={`/api/ops/export?type=orders&days=${days}`}
            className="inline-flex items-center rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm"
          >
            Export commandes
          </a>
          <a
            href={`/api/ops/export?type=events&days=${days}`}
            className="inline-flex items-center rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm"
          >
            Export events
          </a>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="CA" value={formatEur(report.revenue.totalCents)} />
        <Stat label="Commandes" value={report.revenue.orderCount} />
        <Stat label="Events" value={report.analytics.totalEvents} />
        <Stat label="Abandons checkout" value={report.analytics.abandonedCheckout} />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <Panel title="Funnel">
          <ul className="space-y-2 text-sm font-bold">
            {Object.entries(report.analytics.funnel).map(([name, value]) => (
              <li key={name} className="flex justify-between">
                <span className="text-ink/60">{name}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-bold">
            Conversion checkout → commande : {report.analytics.conversionRate}%
          </p>
        </Panel>
        <Panel title="Events (top)">
          <ul className="space-y-2 text-sm font-bold">
            {Object.entries(report.analytics.counts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12)
              .map(([name, value]) => (
                <li key={name} className="flex justify-between">
                  <span className="text-ink/60">{name}</span>
                  <span>{value}</span>
                </li>
              ))}
          </ul>
        </Panel>
      </section>

      <Panel title="Top brainrots (sélections)">
        {report.analytics.topBrainrots.length === 0 ? (
          <p className="text-sm text-ink/50">Pas encore de données.</p>
        ) : (
          <ul className="space-y-2 text-sm font-bold">
            {report.analytics.topBrainrots.map((row) => (
              <li key={row.brainrotId} className="flex justify-between">
                <span>{row.brainrotId}</span>
                <span>{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="CA par jour">
        <ul className="space-y-2 text-sm font-bold">
          {Object.entries(report.revenue.byDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([day, row]) => (
              <li key={day} className="flex justify-between">
                <span className="text-ink/60">{day}</span>
                <span>
                  {row.orders} cmd · {formatEur(row.cents)}
                </span>
              </li>
            ))}
        </ul>
      </Panel>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <h3 className="font-display text-lg font-bold uppercase">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
