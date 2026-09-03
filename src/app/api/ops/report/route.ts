import { NextResponse } from "next/server";
import { countOrders, ordersGroupedByStatus } from "@/server/orders-repo";
import { revenueStats } from "@/server/ops/orders";
import {
  calendarPeriod,
  parsePeriodDays,
  previousCalendarPeriod,
} from "@/server/ops/period";
import { analyticsReport } from "@/server/ops/sessions";
import type { OpsReportPayload } from "@/models";

export async function GET(request: Request) {
  const days = parsePeriodDays(new URL(request.url).searchParams.get("days"));
  const period = calendarPeriod(days);
  const previous = previousCalendarPeriod(days);

  const [revenue, analytics, prevRevenue, prevAnalytics, ordersByStatus, totalOrders] =
    await Promise.all([
      revenueStats(period.since, period.days),
      analyticsReport(period.since, period.days),
      revenueStats(previous.since, previous.days),
      analyticsReport(previous.since, previous.days),
      ordersGroupedByStatus(period.since),
      countOrders(period.since),
    ]);

  const rpv = (cents: number, visitors: number) =>
    visitors > 0 ? Math.round(cents / visitors) : 0;

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
      funnelSteps: analytics.funnelSteps,
      funnelInsight: {
        ...analytics.funnelInsight,
        rpvCents: rpv(revenue.totalCents, analytics.audience.visitors),
      },
      funnelDevices: analytics.funnelDevices,
      funnelSources: analytics.funnelSources,
      funnelPaths: analytics.funnelPaths,
      conversionRate: analytics.conversionRate,
      abandonedCheckout: analytics.abandonedCheckout,
      topBrainrots: analytics.topBrainrots,
      brainrots: analytics.brainrots,
      totalEvents: analytics.totalEvents,
      sessionsWithCart: analytics.sessionsWithCart,
      audience: analytics.audience,
    },
    previous: {
      from: previous.from,
      to: previous.to,
      revenue: {
        totalCents: prevRevenue.totalCents,
        orderCount: prevRevenue.orderCount,
      },
      visitors: prevAnalytics.audience.visitors,
      visitorToOrder: prevAnalytics.funnelInsight.visitorToOrder,
      rpvCents: rpv(prevRevenue.totalCents, prevAnalytics.audience.visitors),
    },
    byDay: period.days.map((day, index) => ({
      day,
      visits: analytics.byDay[index]?.visits ?? 0,
      pageViews: analytics.byDay[index]?.pageViews ?? 0,
      newVisitors: analytics.byDay[index]?.newVisitors ?? 0,
      returningVisitors: analytics.byDay[index]?.returningVisitors ?? 0,
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
