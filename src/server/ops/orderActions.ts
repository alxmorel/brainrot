import { clearConfirmationEmailSend, clearShippingEmailSend } from "@/server/orders-repo";
import { cancelOrder } from "@/server/orders/cancelOrder";
import { recordOrderEvent } from "@/server/orders/orderEvents";
import { markOrderAsShipped } from "@/server/orders/shipOrder";
import { retryFulfillOrder } from "@/server/fulfillment/tryFulfillOrder";
import { trySendOrderConfirmation } from "@/server/email/trySendOrderConfirmation";
import { trySendOrderShipped } from "@/server/email/trySendOrderShipped";

export type OpsOrderActionResult = {
  ok: boolean;
  error?: string;
  refunded?: boolean;
  refundError?: string | null;
  emailSent?: boolean;
};

export async function handleOpsOrderAction(
  orderId: string,
  action: string,
  body: Record<string, unknown>,
): Promise<OpsOrderActionResult> {
  if (action === "cancel") {
    const result = await cancelOrder(orderId);
    if (!result.ok) return { ok: false, error: result.error };
    await recordOrderEvent(orderId, "cancelled", {
      refunded: result.refunded,
      refundError: result.refundError,
    });
    return {
      ok: true,
      refunded: result.refunded,
      refundError: result.refundError,
    };
  }

  if (action === "ship") {
    const tracking = typeof body.tracking === "string" ? body.tracking : null;
    const trackingUrl = typeof body.trackingUrl === "string" ? body.trackingUrl : null;
    const result = await markOrderAsShipped(orderId, { tracking, trackingUrl });
    if (!result.ok) return { ok: false, error: result.error };
    await recordOrderEvent(orderId, "shipped", {
      tracking,
      trackingUrl,
      emailSent: result.emailSent,
    });
    return { ok: true, emailSent: result.emailSent };
  }

  if (action === "fulfill") {
    const retried = await retryFulfillOrder(orderId);
    if (!retried) return { ok: false, error: "Action impossible pour ce statut." };
    return { ok: true };
  }

  if (action === "resend_confirmation") {
    await clearConfirmationEmailSend(orderId);
    const sent = await trySendOrderConfirmation(orderId);
    await recordOrderEvent(orderId, "email_confirmation", { resent: true, sent });
    return { ok: true, emailSent: sent };
  }

  if (action === "resend_shipped") {
    await clearShippingEmailSend(orderId);
    const sent = await trySendOrderShipped(orderId);
    await recordOrderEvent(orderId, "email_shipped", { resent: true, sent });
    return { ok: true, emailSent: sent };
  }

  return { ok: false, error: "Action inconnue." };
}
