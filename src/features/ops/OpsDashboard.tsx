"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEur } from "@/data/pricing";
import { OpsBarChart, OpsFunnel } from "@/features/ops/OpsCharts";
import {
  formatOpsRange,
  OpsPeriodToggle,
} from "@/features/ops/OpsPeriodToggle";
import type { OpsReportPayload } from "@/models";

function deltaPct(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function OpsDashboard() {
  const [days, setDays] = useState(7);
  const [report, setReport] = useState<OpsReportPayload | null>(null);

  useEffect(() => {
    void fetch(`/api/ops/report?days=${days}`)
      .then((res) => res.json())
      .then((json: unknown) => {
        if (json && typeof json === "object" && "revenue" in json) {
          setReport(json as OpsReportPayload);
        }
      });
  }, [days]);

  if (!report) return <p className="font-bold">Chargement…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase">Dashboard</h2>
          <p className="text-sm font-bold text-ink/60">
            {formatOpsRange(report.from, report.to, report.periodDays)}
          </p>
          <p className="text-xs font-bold text-ink/40">
            vs {formatOpsRange(report.previous.from, report.previous.to, report.periodDays)}
          </p>
        </div>
        <OpsPeriodToggle days={days} onChange={setDays} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="CA"
          value={formatEur(report.revenue.totalCents)}
          delta={deltaPct(report.revenue.totalCents, report.previous.revenue.totalCents)}
        />
        <Stat
          label="Commandes"
          value={report.revenue.orderCount}
          delta={deltaPct(report.revenue.orderCount, report.previous.revenue.orderCount)}
        />
        <Stat
          label="Conv. visiteur"
          value={`${report.analytics.funnelInsight.visitorToOrder}%`}
          delta={deltaPct(
            report.analytics.funnelInsight.visitorToOrder,
            report.previous.visitorToOrder,
          )}
        />
        <Stat
          label="Abandon checkout"
          value={report.analytics.funnelInsight.abandonedCheckout}
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
          <h3 className="font-display text-lg font-bold uppercase">CA / jour</h3>
          <div className="mt-3">
            <OpsBarChart
              points={report.byDay.map((row) => ({
                day: row.day,
                value: row.cents,
              }))}
              formatValue={formatEur}
            />
          </div>
        </div>
        <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
          <h3 className="font-display text-lg font-bold uppercase">
            Où ça fuit
          </h3>
          <div className="mt-3">
            <OpsFunnel
              steps={report.analytics.funnelSteps}
              insight={report.analytics.funnelInsight}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
          <h3 className="font-display text-lg font-bold uppercase">
            Commandes par statut
          </h3>
          <ul className="mt-3 space-y-2 text-sm font-bold">
            {Object.entries(report.ordersByStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between">
                <span className="text-ink/60">{status}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <Link
            href="/ops/boutique"
            className="rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm"
          >
            Prix &amp; codes →
          </Link>
          <Link
            href="/ops/commandes"
            className="rounded-pill border-[3px] border-ink bg-hot-pink px-4 py-2 font-display text-sm font-bold uppercase text-white shadow-sticker-sm"
          >
            Voir commandes →
          </Link>
          <Link
            href="/ops/sessions"
            className="rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm"
          >
            Voir sessions →
          </Link>
          <Link
            href="/ops/report"
            className="rounded-pill border-[3px] border-ink bg-white px-4 py-2 font-display text-sm font-bold uppercase shadow-sticker-sm"
          >
            Analytics détaillé →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string | number;
  delta?: number | null;
}) {
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      {delta !== undefined ? (
        <p className="mt-1 text-[0.65rem] font-bold text-ink/40">
          {delta == null ? "vs préc. —" : delta > 0 ? `vs préc. +${delta}%` : `vs préc. ${delta}%`}
        </p>
      ) : null}
    </div>
  );
}
