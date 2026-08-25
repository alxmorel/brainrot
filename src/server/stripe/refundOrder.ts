import { getStripe } from "@/server/stripe";

export type RefundResult =
  | { ok: true; refundId: string }
  | { ok: false; error: string; skipped?: boolean };

export function stripeRefundOnCancelEnabled() {
  return process.env.STRIPE_REFUND_ON_CANCEL === "true";
}

export async function refundStripeCheckout(
  stripeCheckoutId: string,
): Promise<RefundResult> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Stripe non configuré.", skipped: true };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(stripeCheckoutId);
    if (session.payment_status !== "paid") {
      return { ok: false, error: "Paiement non remboursable.", skipped: true };
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      return { ok: false, error: "PaymentIntent introuvable.", skipped: true };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return { ok: true, refundId: refund.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Remboursement Stripe échoué.";
    return { ok: false, error: message };
  }
}
