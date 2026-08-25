import type { OpsSessionDetail, OpsSessionSummary } from "@/models";
import { getOrderBySessionId } from "@/server/ops/orders";
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
  const since = params.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

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

export async function analyticsReport(since: Date) {
  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { sessionId: true, name: true, path: true, payload: true, createdAt: true },
  });

  const counts: Record<string, number> = {};
  const sessionsWithCart = new Set<string>();
  const checkoutSessions = new Set<string>();
  const orderSessions = new Set<string>();
  const brainrotSelects: Record<string, number> = {};

  const funnel = {
    page_view: 0,
    view_create: 0,
    add_to_cart: 0,
    begin_checkout: 0,
    order_placed: 0,
  };

  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    if (event.name === "add_to_cart") sessionsWithCart.add(event.sessionId);
    if (event.name === "begin_checkout") checkoutSessions.add(event.sessionId);
    if (event.name === "order_placed") orderSessions.add(event.sessionId);
    if (event.name === "page_view") funnel.page_view += 1;
    if (event.name === "view_create") funnel.view_create += 1;
    if (event.name === "add_to_cart") funnel.add_to_cart += 1;
    if (event.name === "begin_checkout") funnel.begin_checkout += 1;
    if (event.name === "order_placed") funnel.order_placed += 1;
    if (event.name === "brainrot_select" && event.payload && typeof event.payload === "object") {
      const brainrotId = (event.payload as { brainrotId?: unknown }).brainrotId;
      if (typeof brainrotId === "string") {
        brainrotSelects[brainrotId] = (brainrotSelects[brainrotId] ?? 0) + 1;
      }
    }
  }

  if (funnel.view_create === 0) {
    funnel.view_create = events.filter(
      (e) => e.name === "page_view" && e.path.startsWith("/create"),
    ).length;
  }

  const abandonedCheckout = [...checkoutSessions].filter(
    (sid) => !orderSessions.has(sid),
  ).length;

  const conversionRate =
    checkoutSessions.size > 0
      ? Math.round((orderSessions.size / checkoutSessions.size) * 100)
      : 0;

  const topBrainrots = Object.entries(brainrotSelects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([brainrotId, count]) => ({ brainrotId, count }));

  return {
    counts,
    funnel,
    sessionsWithCart: sessionsWithCart.size,
    abandonedCheckout,
    conversionRate,
    topBrainrots,
    totalEvents: events.length,
  };
}
