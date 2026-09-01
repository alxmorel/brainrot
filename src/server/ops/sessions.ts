import type { OpsSessionDetail, OpsSessionSummary } from "@/models";
import { brainrots } from "@/data/brainrots";
import { getOrderBySessionId } from "@/server/ops/orders";
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

export async function analyticsReport(since: Date, ymds: string[]) {
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { sessionId: true, name: true, path: true, payload: true, createdAt: true },
  });

  const counts: Record<string, number> = {};
  const sessionsWithCart = new Set<string>();
  const checkoutSessions = new Set<string>();
  const orderSessions = new Set<string>();
  const brainrotSelects: Record<string, number> = {};
  const funnelSets = {
    page_view: new Set<string>(),
    view_create: new Set<string>(),
    add_to_cart: new Set<string>(),
    begin_checkout: new Set<string>(),
    order_placed: new Set<string>(),
  };
  const emptyDay = () => ({
    visits: new Set<string>(),
    compose: new Set<string>(),
    carts: new Set<string>(),
    checkouts: new Set<string>(),
    orders: new Set<string>(),
  });
  const daySets = new Map(ymds.map((day) => [day, emptyDay()]));

  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    const day = daySets.get(parisYmd(event.createdAt));
    if (event.name === "add_to_cart") {
      sessionsWithCart.add(event.sessionId);
      funnelSets.add_to_cart.add(event.sessionId);
      day?.carts.add(event.sessionId);
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

  const funnel = {
    page_view: funnelSets.page_view.size,
    view_create: funnelSets.view_create.size,
    add_to_cart: funnelSets.add_to_cart.size,
    begin_checkout: funnelSets.begin_checkout.size,
    order_placed: funnelSets.order_placed.size,
  };

  function stepRate(current: number, previous: number) {
    if (previous <= 0) return 0;
    return Math.min(100, Math.round((current / previous) * 100));
  }

  const composeBase = funnel.view_create > 0 ? funnel.view_create : funnel.page_view;
  const funnelRates = {
    page_view: funnel.page_view > 0 ? 100 : 0,
    view_create: stepRate(funnel.view_create, funnel.page_view),
    add_to_cart: stepRate(funnel.add_to_cart, composeBase),
    begin_checkout: stepRate(funnel.begin_checkout, funnel.add_to_cart),
    order_placed: stepRate(funnel.order_placed, funnel.begin_checkout),
  };

  const abandonedCheckout = [...checkoutSessions].filter(
    (sid) => !orderSessions.has(sid),
  ).length;

  const conversionRate =
    checkoutSessions.size > 0
      ? Math.round((orderSessions.size / checkoutSessions.size) * 100)
      : 0;

  const names = new Map(brainrots.map((item) => [item.id, item.name]));
  const topBrainrots = Object.entries(brainrotSelects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([brainrotId, count]) => ({
      brainrotId,
      name: names.get(brainrotId) ?? brainrotId,
      count,
    }));

  return {
    counts,
    funnel,
    funnelRates,
    sessionsWithCart: sessionsWithCart.size,
    abandonedCheckout,
    conversionRate,
    topBrainrots,
    totalEvents: events.length,
    byDay: ymds.map((day) => {
      const bucket = daySets.get(day)!;
      return {
        day,
        visits: bucket.visits.size,
        compose: bucket.compose.size,
        carts: bucket.carts.size,
        checkouts: bucket.checkouts.size,
        orders: bucket.orders.size,
      };
    }),
  };
}
