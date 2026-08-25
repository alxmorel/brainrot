import { NextResponse } from "next/server";
import { countOrders, ordersGroupedByStatus } from "@/server/orders-repo";
import { revenueStats } from "@/server/ops/orders";
import { analyticsReport } from "@/server/ops/sessions";

function parseDays(value: string | null) {
  const days = Number(value ?? "7");
  if (!Number.isFinite(days) || days < 1) return 7;
  return Math.min(days, 90);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const days = parseDays(params.get("days"));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [revenue, analytics, ordersByStatus, totalOrders] = await Promise.all([
    revenueStats(since),
    analyticsReport(since),
    ordersGroupedByStatus(),
    countOrders(),
  ]);

  return NextResponse.json({
    ok: true,
    periodDays: days,
    revenue,
    analytics,
    ordersByStatus,
    totals: {
      orders: totalOrders,
      events: analytics.totalEvents,
      sessionsWithCart: analytics.sessionsWithCart,
    },
  });
}
