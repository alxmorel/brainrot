import type { AnalyticsEvent, Order, OrderItem, OrderStatus } from "@/models";
import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

function toOrder(row: Prisma.OrderGetPayload<{ include: { items: true } }>): Order {
  return {
    id: row.id,
    sessionId: row.sessionId,
    userId: row.userId,
    status: row.status as OrderStatus,
    items: row.items.map(
      (item): OrderItem => ({
        brainrotId: item.brainrotId,
        productId: item.productId,
        quantity: item.quantity,
        printImage: item.printImage,
        size: item.size,
        color: item.color,
        unitCents: item.unitCents,
      }),
    ),
    shipping: {
      name: row.name,
      email: row.email,
      line1: row.line1,
      city: row.city,
      postalCode: row.postalCode,
      country: row.country,
    },
    supplier: {
      provider: "gelato",
      productId: row.supplierProductId,
      sku: row.supplierSku,
      externalId: row.supplierExternalId,
      tracking: row.supplierTracking,
      trackingUrl: row.supplierTrackingUrl,
      carrier: row.supplierCarrier,
      lastError: row.supplierLastError,
    },
    unitCents: row.unitCents,
    discountCents: row.discountCents,
    creditAppliedCents: row.creditAppliedCents,
    welcomeAppliedCents: row.welcomeAppliedCents,
    totalCents: row.totalCents,
    cashbackGrantedCents: row.cashbackGrantedCents,
    welcomeCode: row.welcomeCode,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createOrder(order: Order) {
  await prisma.order.create({
    data: {
      id: order.id,
      sessionId: order.sessionId,
      status: order.status,
      name: order.shipping.name,
      email: order.shipping.email,
      line1: order.shipping.line1,
      city: order.shipping.city,
      postalCode: order.shipping.postalCode,
      country: order.shipping.country,
      userId: order.userId,
      unitCents: order.unitCents,
      discountCents: order.discountCents,
      creditAppliedCents: order.creditAppliedCents,
      welcomeAppliedCents: order.welcomeAppliedCents,
      totalCents: order.totalCents,
      cashbackGrantedCents: order.cashbackGrantedCents,
      welcomeCode: order.welcomeCode,
      supplierProvider: order.supplier.provider,
      supplierProductId: order.supplier.productId,
      supplierSku: order.supplier.sku,
      stripeCheckoutId: null,
      items: {
        create: order.items.map((item) => ({
          brainrotId: item.brainrotId,
          productId: item.productId,
          quantity: item.quantity,
          printImage: item.printImage,
          size: item.size,
          color: item.color,
          unitCents: item.unitCents,
        })),
      },
    },
  });
}

export async function listOrdersByUserId(userId: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return rows.map(toOrder);
}

export async function listOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function getOrder(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? toOrder(row) : null;
}

export async function markOrderPaid(id: string, stripeCheckoutId: string) {
  const current = await prisma.order.findUnique({ where: { id } });
  if (!current) return null;
  if (current.status === "paid") return current;
  if (current.status !== "pending_payment") return current;
  return prisma.order.update({
    where: { id },
    data: { status: "paid", stripeCheckoutId },
  });
}

export async function attachStripeCheckout(id: string, stripeCheckoutId: string) {
  return prisma.order.update({
    where: { id },
    data: { stripeCheckoutId },
  });
}

export async function updateOrderShipping(
  id: string,
  shipping: {
    name: string;
    email: string;
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  },
) {
  return prisma.order.update({
    where: { id },
    data: {
      name: shipping.name,
      email: shipping.email,
      line1: shipping.line1,
      city: shipping.city,
      postalCode: shipping.postalCode,
      country: shipping.country,
    },
  });
}

export async function updateOrderEmail(
  id: string,
  email: string,
  name?: string,
) {
  return prisma.order.update({
    where: { id },
    data: {
      email,
      ...(name ? { name } : {}),
    },
  });
}

export async function claimConfirmationEmailSend(id: string) {
  const result = await prisma.order.updateMany({
    where: { id, confirmationEmailSentAt: null },
    data: { confirmationEmailSentAt: new Date() },
  });
  return result.count > 0;
}

export async function clearConfirmationEmailSend(id: string) {
  await prisma.order.update({
    where: { id },
    data: { confirmationEmailSentAt: null },
  });
}

export async function getOrderByExternalId(externalId: string): Promise<Order | null> {
  const row = await prisma.order.findFirst({
    where: { supplierExternalId: externalId },
    include: { items: true },
  });
  return row ? toOrder(row) : null;
}

export async function getOrderStripeCheckoutId(id: string) {
  const row = await prisma.order.findUnique({
    where: { id },
    select: { stripeCheckoutId: true },
  });
  return row?.stripeCheckoutId ?? null;
}

export async function applyGelatoTracking(
  id: string,
  tracking: {
    code: string | null;
    url: string | null;
    carrier?: string | null;
  },
) {
  const row = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!row) return false;
  if (row.status === "cancelled" || row.status === "pending_payment") {
    return false;
  }

  const data: Prisma.OrderUpdateInput = {};
  if (tracking.code) data.supplierTracking = tracking.code;
  if (tracking.url) data.supplierTrackingUrl = tracking.url;
  if (tracking.carrier) data.supplierCarrier = tracking.carrier;
  if (row.status !== "delivered" && row.status !== "shipped") {
    data.status = "shipped";
  }

  if (Object.keys(data).length === 0) return true;

  await prisma.order.update({ where: { id }, data });
  return true;
}

export async function markOrderDelivered(id: string) {
  const result = await prisma.order.updateMany({
    where: {
      id,
      status: {
        in: [
          "shipped",
          "fulfillment_sent",
          "fulfillment_queued",
          "paid",
          "validated",
          "fulfillment_failed",
          "failed",
        ],
      },
    },
    data: { status: "delivered" },
  });
  return result.count > 0;
}

export async function claimShippingEmailSend(id: string) {
  const result = await prisma.order.updateMany({
    where: { id, shippingEmailSentAt: null },
    data: { shippingEmailSentAt: new Date() },
  });
  return result.count > 0;
}

export async function clearShippingEmailSend(id: string) {
  await prisma.order.update({
    where: { id },
    data: { shippingEmailSentAt: null },
  });
}

export async function claimDeliveredEmailSend(id: string) {
  const result = await prisma.$executeRaw`
    UPDATE "Order"
    SET "deliveredEmailSentAt" = CURRENT_TIMESTAMP
    WHERE id = ${id} AND "deliveredEmailSentAt" IS NULL
  `;
  return Number(result) > 0;
}

export async function clearDeliveredEmailSend(id: string) {
  await prisma.$executeRaw`
    UPDATE "Order"
    SET "deliveredEmailSentAt" = NULL
    WHERE id = ${id}
  `;
}

export async function saveOrder(order: Order) {
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: order.status,
      supplierProductId: order.supplier.productId,
      supplierSku: order.supplier.sku,
      supplierExternalId: order.supplier.externalId,
      supplierTracking: order.supplier.tracking,
      supplierTrackingUrl: order.supplier.trackingUrl,
      supplierCarrier: order.supplier.carrier,
      supplierLastError: order.supplier.lastError,
    },
  });
}

export async function createEvent(event: AnalyticsEvent) {
  await prisma.analyticsEvent.create({
    data: {
      id: event.id,
      sessionId: event.sessionId,
      name: event.name,
      path: event.path,
      payload: (event.payload ?? undefined) as Prisma.InputJsonValue | undefined,
      createdAt: new Date(event.createdAt),
    },
  });
}

export async function listEvents() {
  return prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 8000,
  });
}

export async function countOrders(since?: Date) {
  return prisma.order.count({
    where: since ? { createdAt: { gte: since } } : undefined,
  });
}

const SOLD_STATUSES = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "fulfillment_failed",
  "failed",
  "shipped",
  "delivered",
] as const;

export async function listBestSellingBrainrotIds(limit = 8): Promise<string[]> {
  const groups = await prisma.orderItem.groupBy({
    by: ["brainrotId"],
    where: {
      order: { status: { in: [...SOLD_STATUSES] } },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
  return groups.map((group) => group.brainrotId);
}

export async function ordersGroupedByStatus(since?: Date) {
  const groups = await prisma.order.groupBy({
    by: ["status"],
    where: since ? { createdAt: { gte: since } } : undefined,
    _count: { status: true },
  });
  return Object.fromEntries(groups.map((g) => [g.status, g._count.status]));
}
