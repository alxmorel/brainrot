import {
  customerLineName,
  isMysteryProductId,
  MYSTERY_CART_ID,
} from "@/data/mystery";
import { teeColorLabel } from "@/data/teeColors";
import type {
  Order,
  OrderStatus,
  PublicOrderLine,
  PublicOrderTimelineStep,
  PublicOrderView,
} from "@/models";
import { isHttpUrl } from "@/server/fulfillment/gelatoWebhook";
import { orderLineCents, orderPaidTotal } from "@/server/order-money";
import { orderEtaLabel } from "@/server/orders/eta";

export const PAID_STATUSES: OrderStatus[] = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "fulfillment_failed",
  "failed",
  "shipped",
  "delivered",
];

export type { PublicOrderLine, PublicOrderView } from "@/models/publicOrder";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "En attente de paiement",
  paid: "Confirmée - on prépare ton tee",
  validated: "Confirmée - on prépare ton tee",
  fulfillment_queued: "Envoi à l’imprimeur…",
  fulfillment_sent: "En production",
  fulfillment_failed: "Confirmée - on prépare ton tee",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  failed: "Confirmée - on prépare ton tee",
};

export function orderStatusLabel(status: OrderStatus) {
  return STATUS_LABELS[status];
}

export function buildOrderTimeline(status: OrderStatus): PublicOrderTimelineStep[] {
  if (status === "pending_payment" || status === "cancelled") {
    return [];
  }

  const currentIndex =
    status === "delivered"
      ? 3
      : status === "shipped"
        ? 2
        : status === "fulfillment_sent" || status === "fulfillment_queued"
          ? 1
          : 0;

  const labels: { id: PublicOrderTimelineStep["id"]; label: string }[] = [
    { id: "confirmed", label: "Confirmée" },
    { id: "production", label: "En production" },
    { id: "shipped", label: "Expédiée" },
    { id: "delivered", label: "Livrée" },
  ];

  return labels.map((step, index) => ({
    ...step,
    done: index <= currentIndex,
    current: index === currentIndex && status !== "delivered",
  }));
}

export function orderEmailMatches(order: Order, email: string) {
  const stored = order.shipping.email.trim().toLowerCase();
  if (!stored || stored === "-") return false;
  return stored === email.trim().toLowerCase();
}

export function customerOrderLines(order: Order): PublicOrderLine[] {
  const items: PublicOrderLine[] = [];
  for (const item of order.items) {
    const mystery = isMysteryProductId(item.productId);
    const line: PublicOrderLine = {
      brainrotId: mystery ? MYSTERY_CART_ID : item.brainrotId,
      name: customerLineName(item),
      size: item.size,
      color: item.color,
      colorLabel: teeColorLabel(item.color),
      quantity: item.quantity,
      lineCents: orderLineCents(order, item),
      mystery,
    };
    if (mystery) {
      const existing = items.find(
        (row) =>
          row.mystery && row.size === line.size && row.color === line.color,
      );
      if (existing) {
        existing.quantity += line.quantity;
        existing.lineCents += line.lineCents;
        continue;
      }
    }
    items.push(line);
  }
  return items;
}

export function buildPublicOrderView(order: Order): PublicOrderView {
  const items = customerOrderLines(order);

  const totalCents = orderPaidTotal(order);
  const email =
    order.shipping.email && order.shipping.email !== "-"
      ? order.shipping.email
      : null;
  const trackingUrl =
    order.supplier.trackingUrl && isHttpUrl(order.supplier.trackingUrl)
      ? order.supplier.trackingUrl
      : null;

  return {
    id: order.id,
    status: order.status,
    statusLabel: orderStatusLabel(order.status),
    isPaid: PAID_STATUSES.includes(order.status),
    email,
    items,
    totalCents,
    discountCents: order.discountCents,
    cashbackGrantedCents: order.cashbackGrantedCents,
    tracking: order.supplier.tracking ?? null,
    trackingUrl,
    carrier: order.supplier.carrier ?? null,
    etaLabel: orderEtaLabel(order.status),
    timeline: buildOrderTimeline(order.status),
  };
}
