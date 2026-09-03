import type { OrderStatus } from "@/models";
import { trySendOrderDelivered } from "@/server/email/trySendOrderDelivered";
import { getOrder, markOrderDelivered } from "@/server/orders-repo";

export type DeliverOrderResult = {
  ok: boolean;
  error?: string;
  emailSent: boolean;
};

const DELIVERABLE: OrderStatus[] = [
  "shipped",
  "fulfillment_sent",
  "fulfillment_queued",
  "paid",
  "validated",
  "fulfillment_failed",
  "failed",
];

export async function markOrderAsDelivered(
  orderId: string,
): Promise<DeliverOrderResult> {
  const order = await getOrder(orderId);
  if (!order) {
    return { ok: false, error: "Commande introuvable.", emailSent: false };
  }
  if (order.status === "delivered") {
    let emailSent = false;
    try {
      emailSent = await trySendOrderDelivered(orderId);
    } catch {
      // idempotent resend path via claim only
    }
    return { ok: true, emailSent };
  }
  if (order.status === "cancelled" || order.status === "pending_payment") {
    return { ok: false, error: "Statut incompatible.", emailSent: false };
  }
  if (!DELIVERABLE.includes(order.status)) {
    return { ok: false, error: "Statut incompatible.", emailSent: false };
  }

  const applied = await markOrderDelivered(orderId);
  if (!applied) {
    return { ok: false, error: "Impossible de marquer livrée.", emailSent: false };
  }

  let emailSent = false;
  try {
    emailSent = await trySendOrderDelivered(orderId);
  } catch {
    // ne pas faire échouer le marquage livré
  }
  return { ok: true, emailSent };
}
