import type { OrderStatus } from "@/models";
import { getOrder, getOrderStripeCheckoutId, saveOrder } from "@/server/orders-repo";
import {
  refundStripeCheckout,
  stripeRefundOnCancelEnabled,
} from "@/server/stripe/refundOrder";

const CANCELLABLE_STATUSES: OrderStatus[] = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "failed",
];

export type CancelOrderResult = {
  ok: boolean;
  error?: string;
  refunded: boolean;
  refundError: string | null;
};

export async function cancelOrder(orderId: string): Promise<CancelOrderResult> {
  const order = await getOrder(orderId);
  if (!order) {
    return { ok: false, error: "Commande introuvable.", refunded: false, refundError: null };
  }

  if (order.status === "cancelled") {
    return { ok: true, refunded: false, refundError: null };
  }

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return {
      ok: false,
      error: "Cette commande ne peut pas être annulée.",
      refunded: false,
      refundError: null,
    };
  }

  let refunded = false;
  let refundError: string | null = null;

  if (stripeRefundOnCancelEnabled()) {
    const stripeCheckoutId = await getOrderStripeCheckoutId(orderId);
    if (stripeCheckoutId) {
      const result = await refundStripeCheckout(stripeCheckoutId);
      if (result.ok) {
        refunded = true;
      } else if (!result.skipped) {
        refundError = result.error;
      }
    }
  }

  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();
  await saveOrder(order);

  return { ok: true, refunded, refundError };
}
