import { NextResponse } from "next/server";
import { countOrders, ordersGroupedByStatus } from "@/server/orders-repo";
import { revenueStats } from "@/server/ops/orders";
import { calendarPeriod, parsePeriodDays } from "@/server/ops/period";
import { analyticsReport } from "@/server/ops/sessions";
import type { OpsReportPayload } from "@/models";

export async function GET(request: Request) {
  const days = parsePeriodDays(new URL(request.url).searchParams.get("days"));
  const period = calendarPeriod(days);

  const [revenue, analytics, ordersByStatus, totalOrders] = await Promise.all([
    revenueStats(period.since, period.days),
    analyticsReport(period.since, period.days),
    ordersGroupedByStatus(period.since),
    countOrders(period.since),
  ]);

  const payload: OpsReportPayload = {
    periodDays: days,
    from: period.from,
    to: period.to,
    revenue: {
      totalCents: revenue.totalCents,
      orderCount: revenue.orderCount,
      averageCents: revenue.averageCents,
    },
    analytics: {
      counts: analytics.counts,
      funnel: analytics.funnel,
      funnelRates: analytics.funnelRates,
      conversionRate: analytics.conversionRate,
      abandonedCheckout: analytics.abandonedCheckout,
      topBrainrots: analytics.topBrainrots,
      totalEvents: analytics.totalEvents,
      sessionsWithCart: analytics.sessionsWithCart,
    },
    byDay: period.days.map((day, index) => ({
      day,
      visits: analytics.byDay[index]?.visits ?? 0,
      compose: analytics.byDay[index]?.compose ?? 0,
      carts: analytics.byDay[index]?.carts ?? 0,
      checkouts: analytics.byDay[index]?.checkouts ?? 0,
      orders: analytics.byDay[index]?.orders ?? 0,
      paidOrders: revenue.byDay[index]?.orders ?? 0,
      cents: revenue.byDay[index]?.cents ?? 0,
    })),
    ordersByStatus,
    totals: {
      orders: totalOrders,
      events: analytics.totalEvents,
      sessionsWithCart: analytics.sessionsWithCart,
    },
  };

  return NextResponse.json({ ok: true, ...payload });
}
