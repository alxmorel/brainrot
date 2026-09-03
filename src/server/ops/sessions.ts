import type { OpsSessionDetail, OpsSessionSummary } from "@/models";
import { brainrots } from "@/data/brainrots";
import { isMysteryCartItem, MYSTERY_CART_ID } from "@/data/mystery";
import { buildAudience } from "@/server/ops/audience";
import { buildFunnel, buildFunnelBreakdown } from "@/server/ops/funnel";
import { getOrderBySessionId, paidLineTotals } from "@/server/ops/orders";
import { calendarPeriod, parisYmd } from "@/server/ops/period";
import { prisma } from "@/server/db";

export type ListSessionsParams = {
  since?: Date;
  hasCart?: boolean;
  hasOrder?: boolean;
  page?: number;
  pageSize?: number;
};

type SessionAgg = {
  sessionId: string;
  firstAt: Date;
  lastAt: Date;
  eventCount: number;
  eventNames: Set<string>;
};

function buildSessionAgg(events: { sessionId: string; name: string; createdAt: Date }[]) {
  const map = new Map<string, SessionAgg>();
  for (const event of events) {
    const current = map.get(event.sessionId);
    if (!current) {
      map.set(event.sessionId, {
        sessionId: event.sessionId,
        firstAt: event.createdAt,
        lastAt: event.createdAt,
        eventCount: 1,
        eventNames: new Set([event.name]),
      });
      continue;
    }
    current.eventCount += 1;
    current.eventNames.add(event.name);
    if (event.createdAt < current.firstAt) current.firstAt = event.createdAt;
    if (event.createdAt > current.lastAt) current.lastAt = event.createdAt;
  }
  return map;
}

export async function listOpsSessions(params: ListSessionsParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 25));
  const since = params.since ?? calendarPeriod(7).since;

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { sessionId: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  let sessions = [...buildSessionAgg(events).values()].sort(
    (a, b) => b.lastAt.getTime() - a.lastAt.getTime(),
  );

  if (params.hasCart) {
    sessions = sessions.filter((s) => s.eventNames.has("add_to_cart"));
  }
  if (params.hasOrder) {
    sessions = sessions.filter((s) => s.eventNames.has("order_placed"));
  }

  const total = sessions.length;
  const slice = sessions.slice((page - 1) * pageSize, page * pageSize);

  const summaries: OpsSessionSummary[] = await Promise.all(
    slice.map(async (session) => {
      const order = await getOrderBySessionId(session.sessionId);
      return {
        sessionId: session.sessionId,
        firstAt: session.firstAt.toISOString(),
        lastAt: session.lastAt.toISOString(),
        eventCount: session.eventCount,
        eventNames: [...session.eventNames],
        orderId: order?.id ?? null,
        hasCart: session.eventNames.has("add_to_cart"),
        hasCheckout: session.eventNames.has("begin_checkout"),
        hasOrder: session.eventNames.has("order_placed") || Boolean(order),
      };
    }),
  );

  return {
    sessions: summaries,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOpsSessionDetail(sessionId: string): Promise<OpsSessionDetail | null> {
  const events = await prisma.analyticsEvent.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
  if (events.length === 0) return null;

  const order = await getOrderBySessionId(sessionId);

  return {
    sessionId,
    events: events.map((event) => ({
      id: event.id,
      name: event.name,
      path: event.path,
      payload: event.payload as Record<string, unknown> | null,
      createdAt: event.createdAt.toISOString(),
    })),
    order,
  };
}

export async function listEventsForExport(since?: Date) {
  return prisma.analyticsEvent.findMany({
    where: since ? { createdAt: { gte: since } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50000,
  });
}

async function returningVisitorIds(since: Date, visitorIds: string[]) {
  const returning = new Set<string>();
  const chunkSize = 500;
  for (let i = 0; i < visitorIds.length; i += chunkSize) {
    const chunk = visitorIds.slice(i, i + chunkSize);
    const rows = await prisma.analyticsEvent.findMany({
      where: { sessionId: { in: chunk }, createdAt: { lt: since } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    });
    for (const row of rows) returning.add(row.sessionId);
  }
  return returning;
}

export async function analyticsReport(since: Date, ymds: string[]) {
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { sessionId: true, name: true, path: true, payload: true, createdAt: true },
  });

  const visitorIds = [...new Set(events.map((event) => event.sessionId))];
  const returningIds =
    visitorIds.length === 0
      ? new Set<string>()
      : await returningVisitorIds(since, visitorIds);

  const firstDay = new Map<string, string>();
  for (const event of events) {
    const day = parisYmd(event.createdAt);
    const prev = firstDay.get(event.sessionId);
    if (!prev || day < prev) firstDay.set(event.sessionId, day);
  }

  const counts: Record<string, number> = {};
  const sessionsWithCart = new Set<string>();
  const checkoutSessions = new Set<string>();
  const orderSessions = new Set<string>();
  const brainrotSelects: Record<string, number> = {};
  const brainrotCarts: Record<string, number> = {};
  let mysteryCarts = 0;
  const funnelSets = {
    page_view: new Set<string>(),
    view_create: new Set<string>(),
    add_to_cart: new Set<string>(),
    begin_checkout: new Set<string>(),
    order_placed: new Set<string>(),
  };
  const emptyDay = () => ({
    visits: new Set<string>(),
    newVisitors: new Set<string>(),
    returningVisitors: new Set<string>(),
    compose: new Set<string>(),
    carts: new Set<string>(),
    checkouts: new Set<string>(),
    orders: new Set<string>(),
    pageViews: 0,
  });
  const daySets = new Map(ymds.map((day) => [day, emptyDay()]));

  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    const ymd = parisYmd(event.createdAt);
    const day = daySets.get(ymd);
    if (event.name === "add_to_cart") {
      sessionsWithCart.add(event.sessionId);
      funnelSets.add_to_cart.add(event.sessionId);
      day?.carts.add(event.sessionId);
      if (event.payload && typeof event.payload === "object") {
        const payload = event.payload as { brainrotId?: unknown; productId?: unknown };
        const brainrotId = typeof payload.brainrotId === "string" ? payload.brainrotId : "";
        const productId = typeof payload.productId === "string" ? payload.productId : "";
        if (isMysteryCartItem({ brainrotId, productId })) {
          mysteryCarts += 1;
        } else if (brainrotId) {
          brainrotCarts[brainrotId] = (brainrotCarts[brainrotId] ?? 0) + 1;
        }
      }
    }
    if (event.name === "begin_checkout") {
      checkoutSessions.add(event.sessionId);
      funnelSets.begin_checkout.add(event.sessionId);
      day?.checkouts.add(event.sessionId);
    }
    if (event.name === "order_placed") {
      orderSessions.add(event.sessionId);
      funnelSets.order_placed.add(event.sessionId);
      day?.orders.add(event.sessionId);
    }
    if (event.name === "page_view") {
      funnelSets.page_view.add(event.sessionId);
      day?.visits.add(event.sessionId);
      if (day) day.pageViews += 1;
      const isReturning =
        returningIds.has(event.sessionId) ||
        (firstDay.get(event.sessionId) ?? ymd) < ymd;
      if (isReturning) day?.returningVisitors.add(event.sessionId);
      else day?.newVisitors.add(event.sessionId);
    }
    if (event.name === "view_create") {
      funnelSets.view_create.add(event.sessionId);
      day?.compose.add(event.sessionId);
    }
    if (event.name === "brainrot_select" && event.payload && typeof event.payload === "object") {
      const brainrotId = (event.payload as { brainrotId?: unknown }).brainrotId;
      if (typeof brainrotId === "string") {
        brainrotSelects[brainrotId] = (brainrotSelects[brainrotId] ?? 0) + 1;
      }
    }
  }

  if (funnelSets.view_create.size === 0) {
    for (const event of events) {
      if (event.name === "page_view" && event.path.startsWith("/create")) {
        funnelSets.view_create.add(event.sessionId);
        daySets.get(parisYmd(event.createdAt))?.compose.add(event.sessionId);
      }
    }
  }

  const names = new Map(brainrots.map((item) => [item.id, item.name]));
  const sold = await paidLineTotals(since);
  const brainrotIds = new Set([
    ...Object.keys(brainrotSelects),
    ...Object.keys(brainrotCarts),
    ...sold.byBrainrot.keys(),
  ]);
  const brainrotPerf = [...brainrotIds]
    .map((brainrotId) => {
      const soldRow = sold.byBrainrot.get(brainrotId);
      return {
        brainrotId,
        name: names.get(brainrotId) ?? brainrotId,
        selects: brainrotSelects[brainrotId] ?? 0,
        carts: brainrotCarts[brainrotId] ?? 0,
        sold: soldRow?.qty ?? 0,
        cents: soldRow?.cents ?? 0,
      };
    })
    .sort((a, b) => b.sold - a.sold || b.selects - a.selects)
    .slice(0, 12);

  if (sold.mysteryQty > 0 || mysteryCarts > 0) {
    brainrotPerf.unshift({
      brainrotId: MYSTERY_CART_ID,
      name: "Mystery Tee",
      selects: 0,
      carts: mysteryCarts,
      sold: sold.mysteryQty,
      cents: sold.mysteryCents,
    });
  }

  const topBrainrots = Object.entries(brainrotSelects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([brainrotId, count]) => ({
      brainrotId,
      name: names.get(brainrotId) ?? brainrotId,
      count,
    }));

  const { steps: funnelSteps, insight: funnelInsight } = buildFunnel(events);
  const breakdown = buildFunnelBreakdown(events);

  const funnel = {
    page_view: funnelSteps[0]?.count ?? 0,
    view_create: funnelSteps[1]?.count ?? 0,
    add_to_cart: funnelSteps[3]?.count ?? 0,
    begin_checkout: funnelSteps[4]?.count ?? 0,
    order_placed: funnelSteps[5]?.count ?? 0,
  };

  const funnelRates = {
    page_view: funnelSteps[0]?.ofPrevious ?? 0,
    view_create: funnelSteps[1]?.ofPrevious ?? 0,
    add_to_cart: funnelSteps[3]?.ofPrevious ?? 0,
    begin_checkout: funnelSteps[4]?.ofPrevious ?? 0,
    order_placed: funnelSteps[5]?.ofPrevious ?? 0,
  };

  return {
    counts,
    funnel,
    funnelRates,
    funnelSteps,
    funnelInsight,
    funnelDevices: breakdown.devices,
    funnelSources: breakdown.sources,
    funnelPaths: breakdown.paths,
    sessionsWithCart: sessionsWithCart.size,
    abandonedCheckout: funnelInsight.abandonedCheckout,
    conversionRate: funnelInsight.checkoutToOrder,
    topBrainrots,
    brainrots: brainrotPerf,
    totalEvents: events.length,
    audience: buildAudience(events, returningIds, ymds),
    byDay: ymds.map((day) => {
      const bucket = daySets.get(day)!;
      return {
        day,
        visits: bucket.visits.size,
        pageViews: bucket.pageViews,
        newVisitors: bucket.newVisitors.size,
        returningVisitors: bucket.returningVisitors.size,
        compose: bucket.compose.size,
        carts: bucket.carts.size,
        checkouts: bucket.checkouts.size,
        orders: bucket.orders.size,
      };
    }),
  };
}
