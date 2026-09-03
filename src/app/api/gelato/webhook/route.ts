import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { parseGelatoTrackingEvent } from "@/server/fulfillment/gelatoWebhook";
import { recordOrderEvent } from "@/server/orders/orderEvents";
import { markOrderAsDelivered } from "@/server/orders/deliverOrder";
import { markOrderAsShipped } from "@/server/orders/shipOrder";
import {
  applyGelatoTracking,
  getOrder,
  getOrderByExternalId,
} from "@/server/orders-repo";

export const runtime = "nodejs";

function bearerToken(header: string | null) {
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() ?? null;
}

function secretMatches(request: Request, secret: string) {
  const expected = Buffer.from(secret);
  const candidates = [
    request.headers.get("x-gelato-webhook-secret"),
    request.headers.get("x-webhook-secret"),
    bearerToken(request.headers.get("authorization")),
  ];
  return candidates.some((value) => {
    if (!value) return false;
    const got = Buffer.from(value);
    if (got.length !== expected.length) return false;
    return timingSafeEqual(got, expected);
  });
}

export async function POST(request: Request) {
  const secret = process.env.GELATO_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  if (!secretMatches(request, secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const payload = parseGelatoTrackingEvent(body);
  if (!payload) {
    return NextResponse.json({ received: true });
  }

  const order =
    (payload.orderReferenceId
      ? await getOrder(payload.orderReferenceId)
      : null) ??
    (payload.gelatoOrderId
      ? await getOrderByExternalId(payload.gelatoOrderId)
      : null);

  if (!order) {
    return NextResponse.json({ received: true });
  }

  const hasTracking = Boolean(payload.trackingCode || payload.trackingUrl);
  const isDelivered = payload.fulfillmentStatus === "delivered";

  if (isDelivered) {
    if (hasTracking || payload.carrier) {
      await applyGelatoTracking(order.id, {
        code: payload.trackingCode,
        url: payload.trackingUrl,
        carrier: payload.carrier,
      });
    }
    const delivered = await markOrderAsDelivered(order.id);
    if (delivered.ok) {
      await recordOrderEvent(order.id, "delivered", {
        source: "gelato_webhook",
        fulfillmentStatus: payload.fulfillmentStatus,
        emailSent: delivered.emailSent,
      });
      if (delivered.emailSent) {
        await recordOrderEvent(order.id, "email_delivered", { sent: true });
      }
    }
    return NextResponse.json({ received: true });
  }

  if (!hasTracking && !payload.carrier) {
    return NextResponse.json({ received: true });
  }

  if (order.status === "delivered") {
    await applyGelatoTracking(order.id, {
      code: payload.trackingCode,
      url: payload.trackingUrl,
      carrier: payload.carrier,
    });
    return NextResponse.json({ received: true });
  }

  const result = await markOrderAsShipped(order.id, {
    tracking: payload.trackingCode,
    trackingUrl: payload.trackingUrl,
    carrier: payload.carrier,
  });
  if (!result.ok) {
    await applyGelatoTracking(order.id, {
      code: payload.trackingCode,
      url: payload.trackingUrl,
      carrier: payload.carrier,
    });
    return NextResponse.json({ received: true });
  }

  await recordOrderEvent(order.id, "shipped", {
    trackingCode: payload.trackingCode,
    trackingUrl: payload.trackingUrl,
    carrier: payload.carrier,
    source: "gelato_webhook",
  });

  if (result.emailSent) {
    await recordOrderEvent(order.id, "email_shipped", { sent: true });
  }

  return NextResponse.json({ received: true });
}
