import { NextResponse } from "next/server";
import { createEvent, markOrderPaid } from "@/server/orders-repo";
import { getStripe } from "@/server/stripe";

export const runtime = "nodejs";

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
      await markOrderPaid(orderId, session.id);
      try {
        await createEvent({
          id: `ev_${event.id}`,
          sessionId: "stripe",
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
