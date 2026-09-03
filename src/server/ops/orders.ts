import { isMysteryProductId, opsLineName } from "@/data/mystery";
import { teePriceCents } from "@/data/pricing";
import { teeColorLabel } from "@/data/teeColors";
import type { OpsOrderDetail, OpsOrderLine, OpsOrderSummary } from "@/models";
import type { Order, OrderStatus } from "@/models";
import { listOrderEvents } from "@/server/orders/orderEvents";
import { prisma } from "@/server/db";
import { parisYmd } from "@/server/ops/period";
import type { Prisma } from "@prisma/client";

type OrderRow = Prisma.OrderGetPayload<{ include: { items: true } }>;

function rowUnitCents(row: OrderRow) {
  return row.unitCents > 0 ? row.unitCents : teePriceCents;
}

function orderTotalCents(row: OrderRow) {
  if (row.totalCents > 0) return row.totalCents;
  const unit = rowUnitCents(row);
  return row.items.reduce((sum, item) => {
    const itemUnit = item.unitCents > 0 ? item.unitCents : unit;
    return sum + item.quantity * itemUnit;
  }, 0);
}

function toOpsLines(row: OrderRow): OpsOrderLine[] {
  const unit = rowUnitCents(row);
  return row.items.map((item) => {
    const itemUnit = item.unitCents > 0 ? item.unitCents : unit;
    return {
      brainrotId: item.brainrotId,
      name: opsLineName(item),
      size: item.size,
      color: item.color,
      colorLabel: teeColorLabel(item.color),
      quantity: item.quantity,
      lineCents: item.quantity * itemUnit,
      printImage: item.printImage,
      mystery: isMysteryProductId(item.productId),
    };
  });
}

function toOrderSupplier(row: OrderRow): Order["supplier"] {
  return {
    provider: "gelato",
    productId: row.supplierProductId,
    sku: row.supplierSku,
    externalId: row.supplierExternalId,
    tracking: row.supplierTracking,
    trackingUrl: row.supplierTrackingUrl,
    carrier: row.supplierCarrier,
    lastError: row.supplierLastError,
  };
}

export function toOpsOrderSummary(row: OrderRow): OpsOrderSummary {
  return {
    id: row.id,
    status: row.status as OrderStatus,
    email: row.email,
    name: row.name,
    totalCents: orderTotalCents(row),
    itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0),
    lastError: row.supplierLastError,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function buildOpsOrderDetail(row: OrderRow): Promise<OpsOrderDetail> {
  const events = await listOrderEvents(row.id);
  return {
    id: row.id,
    sessionId: row.sessionId,
    status: row.status as OrderStatus,
    shipping: {
      name: row.name,
      email: row.email,
      line1: row.line1,
      city: row.city,
      postalCode: row.postalCode,
      country: row.country,
    },
    supplier: toOrderSupplier(row),
    items: toOpsLines(row),
    totalCents: orderTotalCents(row),
    stripeCheckoutId: row.stripeCheckoutId,
    confirmationEmailSentAt: row.confirmationEmailSentAt?.toISOString() ?? null,
    shippingEmailSentAt: row.shippingEmailSentAt?.toISOString() ?? null,
    deliveredEmailSentAt:
      (row as OrderRow & { deliveredEmailSentAt?: Date | null }).deliveredEmailSentAt?.toISOString() ??
      null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    events,
  };
}

export async function getOpsOrderDetail(id: string) {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? buildOpsOrderDetail(row) : null;
}

export type ListOrdersParams = {
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function listOpsOrders(params: ListOrdersParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 25));
  const where: Prisma.OrderWhereInput = {};

  if (params.status === "fulfillment_failed") {
    where.status = { in: ["fulfillment_failed", "failed"] };
  } else if (params.status) {
    where.status = params.status;
  }

  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { id: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    orders: rows.map(toOpsOrderSummary),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getOrderBySessionId(sessionId: string) {
  const row = await prisma.order.findFirst({
    where: { sessionId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return row ? toOpsOrderSummary(row) : null;
}

const PAID_STATUSES = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "fulfillment_failed",
  "shipped",
  "delivered",
] as const;

export async function revenueStats(since: Date, ymds: string[]) {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...PAID_STATUSES] },
      createdAt: { gte: since },
    },
    include: { items: true },
  });

  const totalCents = orders.reduce((sum, row) => sum + orderTotalCents(row), 0);
  const orderCount = orders.length;
  const averageCents = orderCount > 0 ? Math.round(totalCents / orderCount) : 0;

  const buckets = new Map(ymds.map((day) => [day, { orders: 0, cents: 0 }]));
  for (const row of orders) {
    const bucket = buckets.get(parisYmd(row.createdAt));
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.cents += orderTotalCents(row);
  }

  return {
    totalCents,
    orderCount,
    averageCents,
    byDay: ymds.map((day) => ({ day, ...buckets.get(day)! })),
  };
}

export async function paidLineTotals(since: Date) {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...PAID_STATUSES] },
      createdAt: { gte: since },
    },
    include: { items: true },
  });

  const byBrainrot = new Map<string, { qty: number; cents: number }>();
  let mysteryQty = 0;
  let mysteryCents = 0;

  for (const row of orders) {
    const unit = rowUnitCents(row);
    for (const item of row.items) {
      const itemUnit = item.unitCents > 0 ? item.unitCents : unit;
      const line = item.quantity * itemUnit;
      if (isMysteryProductId(item.productId)) {
        mysteryQty += item.quantity;
        mysteryCents += line;
        continue;
      }
      const current = byBrainrot.get(item.brainrotId) ?? { qty: 0, cents: 0 };
      current.qty += item.quantity;
      current.cents += line;
      byBrainrot.set(item.brainrotId, current);
    }
  }

  return { byBrainrot, mysteryQty, mysteryCents };
}

export async function listOrdersForExport(since?: Date) {
  const rows = await prisma.order.findMany({
    where: since ? { createdAt: { gte: since } } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    ...toOpsOrderSummary(row),
    sessionId: row.sessionId,
    status: row.status,
    stripeCheckoutId: row.stripeCheckoutId,
  }));
}
