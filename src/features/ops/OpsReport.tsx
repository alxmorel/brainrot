"use client";

import { useEffect, useState } from "react";
import { formatEur } from "@/data/pricing";
import { OpsBarChart, OpsFunnel, OpsTwinChart } from "@/features/ops/OpsCharts";
import {
  formatOpsRange,
  OpsPeriodToggle,
} from "@/features/ops/OpsPeriodToggle";
import type {
  OpsFunnelInsight,
  OpsFunnelSlice,
  OpsRankedCount,
  OpsReportPayload,
} from "@/models";

/** Sous ce seuil : breakdowns / charts secondaires repliés. */
const LOW_VOLUME_VISITORS = 10;
const LOW_VOLUME_VISITS = 5;
/** Slice device/chemin : ignorer si n trop petit. */
const MIN_SLICE_VISITORS = 5;
/** Écart dropRate (pp) pour considérer un funnel distinct. */
const FUNNEL_DROP_DIFF = 10;
/** Écart conv. visiteur (pp) pour considérer un funnel distinct. */
const FUNNEL_CONV_DIFF = 2;

function formatMs(ms: number | null) {
  if (ms == null) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return r ? `${m}m ${r}s` : `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function countryLabel(code: string) {
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function convPct(orders: number, visits: number) {
  if (visits <= 0) return 0;
  return Math.round((orders / visits) * 1000) / 10;
}

function deltaPct(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

/** Masque les deltas absurdes (zéros croisés / volume trop faible). */
function safeDelta(
  current: number,
  previous: number,
  lowVolume: boolean,
): number | null | undefined {
  if (current === 0 && previous === 0) return undefined;
  if (lowVolume) return null;
  return deltaPct(current, previous);
}

function isDistinctFunnel(slice: OpsFunnelSlice, global: OpsFunnelInsight) {
  const n = slice.steps[0]?.count ?? 0;
  if (n < MIN_SLICE_VISITORS) return false;
  if (slice.insight.worstIndex !== global.worstIndex) return true;
  if (
    Math.abs(slice.insight.worstDropRate - global.worstDropRate) >=
    FUNNEL_DROP_DIFF
  ) {
    return true;
  }
  if (
    Math.abs(slice.insight.visitorToOrder - global.visitorToOrder) >=
    FUNNEL_CONV_DIFF
  ) {
    return true;
  }
  return false;
}

function trackingQualityIssue(audience: OpsReportPayload["analytics"]["audience"]) {
  const pages = audience.pagesPerVisit;
  const ms = audience.avgVisitMs;
  if (pages >= 40) return { pages, ms };
  if (ms == null) return null;
  if (pages >= 20 && ms < 60_000) return { pages, ms };
  if (pages >= 15 && ms < 30_000) return { pages, ms };
  return null;
}

export function OpsReport() {
  const [days, setDays] = useState(7);
  const [report, setReport] = useState<OpsReportPayload | null>(null);

  useEffect(() => {
    void fetch(`/api/ops/report?days=${days}`)
      .then((res) => res.json())
      .then((json: unknown) => {
        if (json && typeof json === "object" && "analytics" in json) {
          setReport(json as OpsReportPayload);
        }
      });
  }, [days]);

  if (!report) return <p className="font-bold">Chargement…</p>;

  const { audience, funnelInsight, funnelSteps } = report.analytics;
  const lowVolume =
    audience.visitors < LOW_VOLUME_VISITORS ||
    audience.visits < LOW_VOLUME_VISITS;
  const trackingIssue = trackingQualityIssue(audience);

  const distinctDevices = report.analytics.funnelDevices
    .filter((row) => row.label !== "Inconnu" || report.analytics.funnelDevices.length === 1)
    .filter((slice) => isDistinctFunnel(slice, funnelInsight));
  const distinctPaths = report.analytics.funnelPaths.filter((slice) =>
    isDistinctFunnel(slice, funnelInsight),
  );

  const showCheckoutCta = funnelInsight.abandonedCheckout > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase">Analytics</h2>
          <p className="text-sm font-bold text-ink/60">
            {formatOpsRange(report.from, report.to, report.periodDays)}
          </p>
          <p className="text-xs font-bold text-ink/40">
            vs {formatOpsRange(report.previous.from, report.previous.to, report.periodDays)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OpsPeriodToggle days={days} onChange={setDays} />
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

      {trackingIssue ? (
        <div className="rounded-2xl border-[3px] border-ink bg-acid-yellow px-4 py-3 shadow-sticker-sm">
          <p className="text-sm font-bold">
            Signal tracking incohérent : {trackingIssue.pages} pages/session pour{" "}
            {formatMs(trackingIssue.ms)} de durée — vérifier beacon / bots
          </p>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="CA"
          value={formatEur(report.revenue.totalCents)}
          delta={safeDelta(
            report.revenue.totalCents,
            report.previous.revenue.totalCents,
            lowVolume,
          )}
        />
        <Stat
          label="Commandes"
          value={report.revenue.orderCount}
          delta={safeDelta(
            report.revenue.orderCount,
            report.previous.revenue.orderCount,
            lowVolume,
          )}
        />
        <Stat
          label="Conv. visiteur"
          value={`${funnelInsight.visitorToOrder}%`}
          hint="Visiteur → commande"
          delta={safeDelta(
            funnelInsight.visitorToOrder,
            report.previous.visitorToOrder,
            lowVolume,
          )}
        />
        <Stat
          label="CA / visiteur"
          value={formatEur(funnelInsight.rpvCents)}
          delta={safeDelta(
            funnelInsight.rpvCents,
            report.previous.rpvCents,
            lowVolume,
          )}
        />
      </section>

      <Panel title="Où ça fuit">
        <OpsFunnel steps={funnelSteps} insight={funnelInsight} />
        {showCheckoutCta ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-[3px] border-ink bg-white px-3 py-2">
            <p className="text-sm font-bold">
              Fuite checkout → commande · {funnelInsight.abandonedCheckout}{" "}
              sessions
            </p>
            <a
              href="/ops/sessions"
              className="inline-flex items-center rounded-pill border-[3px] border-ink bg-hot-pink px-3 py-1.5 font-display text-xs font-bold uppercase text-white shadow-sticker-sm"
            >
              Voir les sessions →
            </a>
          </div>
        ) : null}
      </Panel>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Abandon panier"
          value={funnelInsight.abandonedCart}
          hint="Panier, pas de checkout"
        />
        <Stat
          label="Abandon checkout"
          value={funnelInsight.abandonedCheckout}
          hint="Checkout, pas de commande"
        />
        <Stat label="Rebond" value={`${audience.bounceRate}%`} />
        <Stat
          label="Erreurs checkout"
          value={funnelInsight.checkoutErrors}
        />
      </section>

      <Panel title="Créatures : sélection → panier → vente">
        {report.analytics.brainrots.length === 0 ? (
          <p className="text-sm text-ink/50">Pas encore de données.</p>
        ) : (
          <ul className="space-y-2 text-sm font-bold">
            {report.analytics.brainrots.map((row) => (
              <li key={row.brainrotId} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{row.name}</span>
                <span className="shrink-0 text-ink/70">
                  {row.selects} sél. · {row.carts} panier · {row.sold} vendus
                  {row.cents > 0 ? ` · ${formatEur(row.cents)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visiteurs" value={audience.visitors} />
        <Stat label="Sessions" value={audience.visits} hint="Inactivité 30 min" />
        <Stat label="Durée / session" value={formatMs(audience.avgVisitMs)} />
        <Stat label="Pages / session" value={audience.pagesPerVisit} />
        <Stat label="Pages vues" value={audience.pageViews} />
        <Stat label="Nouveaux" value={audience.newVisitors} />
        <Stat label="Revenants" value={audience.returningVisitors} />
        <Stat label="Durée / page" value={formatMs(audience.avgPageMs)} />
      </section>

      <VolumeGate
        lowVolume={lowVolume}
        visitors={audience.visitors}
        title="Détails funnel & tendances"
      >
        {distinctDevices.length > 0 ? (
          <section className="grid gap-3 lg:grid-cols-2">
            {distinctDevices.map((slice) => (
              <Panel key={slice.label} title={`Funnel · ${slice.label}`}>
                <OpsFunnel steps={slice.steps} insight={slice.insight} compact />
              </Panel>
            ))}
          </section>
        ) : null}

        {!lowVolume && report.analytics.funnelSources.length > 0 ? (
          <Panel title="Funnel par source">
            <SliceTable
              rows={report.analytics.funnelSources.filter((slice) =>
                isDistinctFunnel(slice, funnelInsight),
              )}
              empty="Même histoire que le funnel global, ou volume trop faible."
              fallbackEmpty="Les sources s’affichent sur les nouvelles visites."
              allRows={report.analytics.funnelSources}
            />
          </Panel>
        ) : null}

        {distinctPaths.length > 0 ? (
          <section>
            <h3 className="mb-3 font-display text-lg font-bold uppercase">
              Chemins d’achat
            </h3>
            <p className="mb-3 text-xs font-bold text-ink/45">
              Uniquement les chemins qui divergent du funnel global.
            </p>
            <div className="grid gap-3 lg:grid-cols-3">
              {distinctPaths.map((slice) => (
                <Panel key={slice.label} title={slice.label}>
                  <OpsFunnel steps={slice.steps} insight={slice.insight} compact />
                </Panel>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 lg:grid-cols-2">
          <Panel title="CA / jour">
            <OpsBarChart
              points={report.byDay.map((row) => ({ day: row.day, value: row.cents }))}
              formatValue={formatEur}
              colorClass="bg-hot-pink"
            />
          </Panel>
          <Panel title="Conv. visiteur / jour">
            <OpsBarChart
              points={report.byDay.map((row) => ({
                day: row.day,
                value: convPct(row.paidOrders, row.visits),
              }))}
              formatValue={(value) => `${value}%`}
              colorClass="bg-electric-cyan"
            />
          </Panel>
          <Panel title="Nouveaux / revenants / jour">
            <OpsTwinChart
              points={report.byDay.map((row) => ({
                day: row.day,
                left: row.newVisitors,
                right: row.returningVisitors,
              }))}
              left={{ label: "Nouveaux", colorClass: "bg-hot-pink" }}
              right={{ label: "Revenants", colorClass: "bg-ultraviolet" }}
            />
          </Panel>
          <Panel title="Rétention">
            <ul className="space-y-2 text-sm font-bold">
              <li className="flex justify-between gap-3">
                <span className="text-ink/60">Revenus un autre jour</span>
                <span>
                  {audience.multiDayVisitors}
                  <span className="ml-2 text-ink/45">{audience.multiDayRate}%</span>
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/60">Retour J+1 (nouveaux)</span>
                <span>
                  {audience.d1Rate == null ? "—" : `${audience.d1Rate}%`}
                  {audience.d1Eligible > 0 ? (
                    <span className="ml-2 text-ink/45">{audience.d1Eligible} éligibles</span>
                  ) : null}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink/60">Nouveaux / visiteurs</span>
                <span>
                  {audience.visitors > 0
                    ? `${Math.round((audience.newVisitors / audience.visitors) * 100)}%`
                    : "—"}
                </span>
              </li>
            </ul>
          </Panel>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <Panel title="Entrées (rebond)">
            {audience.landings.length === 0 ? (
              <p className="text-sm text-ink/50">Pas encore de données.</p>
            ) : (
              <ul className="space-y-2 text-sm font-bold">
                {audience.landings.map((row) => (
                  <li key={row.path} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">{row.path}</span>
                    <span className="shrink-0 text-ink/70">
                      {row.landings} · rebond {row.bounceRate}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Pages">
            {audience.pages.length === 0 ? (
              <p className="text-sm text-ink/50">Pas encore de données.</p>
            ) : (
              <ul className="space-y-2 text-sm font-bold">
                {audience.pages.map((row) => (
                  <li key={row.path} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">{row.path}</span>
                    <span className="shrink-0 text-ink/70">
                      {row.views} vues · sortie {row.exitRate}% · {formatMs(row.avgMs)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </section>
      </VolumeGate>

      <details className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
        <summary className="cursor-pointer font-display text-lg font-bold uppercase">
          Audience
        </summary>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-ink/45">Pays</p>
            <Ranked
              rows={audience.countries.map((row) => ({
                ...row,
                label: countryLabel(row.label),
              }))}
              empty="Les pays s’affichent sur les nouvelles visites (après OK cookies)."
            />
            {audience.cities.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase text-ink/45">Villes</p>
                <Ranked rows={audience.cities} empty="" />
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-ink/45">Sources</p>
            <Ranked
              rows={audience.sources}
              empty="Les sources s’affichent sur les nouvelles visites."
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-ink/45">Appareils</p>
            <Ranked
              rows={audience.devices}
              empty="Les appareils s’affichent sur les nouvelles visites."
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-ink/45">Navigateurs</p>
            <Ranked
              rows={audience.browsers}
              empty="Les navigateurs s’affichent sur les nouvelles visites."
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-ink/45">Langues</p>
            <Ranked rows={audience.langs} empty="Pas encore de données." />
          </div>
        </div>
      </details>
    </div>
  );
}

function VolumeGate({
  lowVolume,
  visitors,
  title,
  children,
}: {
  lowVolume: boolean;
  visitors: number;
  title: string;
  children: React.ReactNode;
}) {
  if (!lowVolume) {
    return <div className="flex flex-col gap-6">{children}</div>;
  }
  return (
    <details className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <summary className="cursor-pointer font-display text-lg font-bold uppercase">
        {title}
      </summary>
      <p className="mt-2 text-sm font-bold text-ink/50">
        Pas assez de volume ({visitors} visiteurs) — détails repliés.
      </p>
      <div className="mt-4 flex flex-col gap-6">{children}</div>
    </details>
  );
}

function SliceTable({
  rows,
  empty,
  fallbackEmpty,
  allRows,
}: {
  rows: OpsFunnelSlice[];
  empty: string;
  fallbackEmpty?: string;
  allRows?: OpsFunnelSlice[];
}) {
  if (rows.length === 0) {
    const msg =
      allRows && allRows.length === 0 && fallbackEmpty ? fallbackEmpty : empty;
    return <p className="text-sm text-ink/50">{msg}</p>;
  }
  return (
    <ul className="space-y-2 text-sm font-bold">
      {rows.map((row) => (
        <li key={row.label} className="flex justify-between gap-3">
          <span className="min-w-0 truncate">{row.label}</span>
          <span className="shrink-0 text-ink/70">
            {row.steps[0]?.count ?? 0} vis. · {row.insight.visitorToOrder}% conv.
            {row.insight.worstDropped > 0
              ? ` · fuite ${row.insight.worstFrom} → ${row.insight.worstTo}`
              : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Ranked({
  rows,
  empty,
}: {
  rows: OpsRankedCount[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink/50">{empty}</p>;
  }
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex justify-between text-sm font-bold">
            <span className="truncate text-ink/60">{row.label}</span>
            <span>{row.count}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-pill border-[2px] border-ink bg-white">
            <div
              className="h-full bg-electric-cyan"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Stat({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: string | number;
  hint?: string;
  delta?: number | null;
}) {
  const deltaLabel =
    delta === undefined
      ? null
      : delta == null
        ? "—"
        : delta > 0
          ? `vs préc. +${delta}%`
          : `vs préc. ${delta}%`;
  const sub = [hint, deltaLabel].filter(Boolean).join(" · ");
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-4 shadow-sticker-sm">
      <p className="text-xs font-bold uppercase text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      {sub ? <p className="mt-1 text-[0.65rem] font-bold text-ink/40">{sub}</p> : null}
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
