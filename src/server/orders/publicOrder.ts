import { brainrots } from "@/data/brainrots";
import { teeColorLabel } from "@/data/teeColors";
import type { Order, OrderStatus, PublicOrderLine, PublicOrderView } from "@/models";
import { isHttpUrl } from "@/server/fulfillment/gelatoWebhook";
import { orderLineCents, orderPaidTotal } from "@/server/order-money";

export const PAID_STATUSES: OrderStatus[] = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "fulfillment_failed",
  "failed",
  "shipped",
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
  cancelled: "Annulée",
  failed: "Confirmée - on prépare ton tee",
};

export function orderStatusLabel(status: OrderStatus) {
  return STATUS_LABELS[status];
}

export function orderEmailMatches(order: Order, email: string) {
  const stored = order.shipping.email.trim().toLowerCase();
  if (!stored || stored === "-") return false;
  return stored === email.trim().toLowerCase();
}

export function buildPublicOrderView(order: Order): PublicOrderView {
  const items = order.items.map((item) => {
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    return {
      brainrotId: item.brainrotId,
      name: brainrot?.name ?? item.brainrotId,
      size: item.size,
      color: item.color,
      colorLabel: teeColorLabel(item.color),
      quantity: item.quantity,
      lineCents: orderLineCents(order, item.quantity),
    };
  });

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
  };
}
