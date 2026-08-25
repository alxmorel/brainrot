import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { tryFulfillOrder } from "@/server/fulfillment/tryFulfillOrder";
import { trySendOrderConfirmation } from "@/server/email/trySendOrderConfirmation";
import { recordOrderEvent } from "@/server/orders/orderEvents";
import {
  createEvent,
  markOrderPaid,
  updateOrderEmail,
  updateOrderShipping,
} from "@/server/orders-repo";
import { getStripe } from "@/server/stripe";

export const runtime = "nodejs";

function shippingFromSession(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email?.trim() ?? "";
  const extended = session as Stripe.Checkout.Session & {
    shipping_details?: {
      name?: string | null;
      address?: Stripe.Address | null;
    };
    collected_information?: {
      shipping_details?: {
        name?: string | null;
        address?: Stripe.Address | null;
      };
    };
  };
  const ship =
    extended.shipping_details ??
    extended.collected_information?.shipping_details;
  const name =
    ship?.name?.trim() ??
    session.customer_details?.name?.trim() ??
    "";
  const addr = ship?.address;
  const line1 = addr?.line1?.trim() ?? "";
  const city = addr?.city?.trim() ?? "";
  const postalCode = addr?.postal_code?.trim() ?? "";
  const country = addr?.country?.trim() ?? "";
  if (!email || !name || !line1 || !city || !postalCode || !country) {
    return null;
  }
  return { name, email, line1, city, postalCode, country };
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId =
      typeof session.metadata?.orderId === "string"
        ? session.metadata.orderId
        : null;
    if (orderId && session.payment_status === "paid") {
      const shipping = shippingFromSession(session);
      if (shipping) {
        await updateOrderShipping(orderId, shipping);
      } else {
        const email = session.customer_details?.email?.trim();
        const name = session.customer_details?.name?.trim();
        if (email) {
          await updateOrderEmail(orderId, email, name || undefined);
        }
      }
      await markOrderPaid(orderId, session.id);
      await recordOrderEvent(orderId, "paid", { stripeSessionId: session.id });
      try {
        const sent = await trySendOrderConfirmation(orderId);
        if (sent) {
          await recordOrderEvent(orderId, "email_confirmation", { sent: true });
        }
      } catch {
        // ne pas faire échouer le webhook Stripe
      }
      try {
        await tryFulfillOrder(orderId);
      } catch {
        // ne pas faire échouer le webhook Stripe
      }
      try {
        const analyticsSessionId =
          typeof session.metadata?.sessionId === "string"
            ? session.metadata.sessionId
            : null;
        await createEvent({
          id: `ev_${event.id}`,
          sessionId: analyticsSessionId ?? "unknown",
          name: "order_placed",
          path: "/api/stripe/webhook",
          payload: { orderId },
          createdAt: new Date().toISOString(),
        });
      } catch {
        // webhook retry / event already stored
      }
    }
  }

  return NextResponse.json({ received: true });
}
