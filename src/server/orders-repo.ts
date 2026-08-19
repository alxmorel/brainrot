import type { AnalyticsEvent, Order, OrderItem, OrderStatus } from "@/models";
import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

function toOrder(row: Prisma.OrderGetPayload<{ include: { items: true } }>): Order {
  return {
    id: row.id,
    sessionId: row.sessionId,
    status: row.status as OrderStatus,
    items: row.items.map(
      (item): OrderItem => ({
        brainrotId: item.brainrotId,
        productId: item.productId,
        quantity: item.quantity,
        printImage: item.printImage,
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
      provider: "aliexpress",
      productId: row.supplierProductId,
      sku: row.supplierSku,
      externalId: row.supplierExternalId,
      tracking: row.supplierTracking,
      lastError: row.supplierLastError,
    },
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
        })),
      },
    },
  });
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

export async function saveOrder(order: Order) {
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: order.status,
      supplierProductId: order.supplier.productId,
      supplierSku: order.supplier.sku,
      supplierExternalId: order.supplier.externalId,
      supplierTracking: order.supplier.tracking,
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

export async function countOrders() {
  return prisma.order.count();
}

export async function ordersGroupedByStatus() {
  const groups = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  return Object.fromEntries(groups.map((g) => [g.status, g._count.status]));
}
