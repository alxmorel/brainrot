import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { trySendOrderShipped } from "@/server/email/trySendOrderShipped";
import {
  isHttpUrl,
  parseGelatoTrackingEvent,
} from "@/server/fulfillment/gelatoWebhook";
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

  const applied = await applyGelatoTracking(order.id, {
    code: payload.trackingCode,
    url: payload.trackingUrl,
  });
  if (!applied) {
    return NextResponse.json({ received: true });
  }

  if (payload.trackingUrl && isHttpUrl(payload.trackingUrl)) {
    try {
      await trySendOrderShipped(order.id);
    } catch {
      // ne pas faire échouer le webhook Gelato
    }
  }

  return NextResponse.json({ received: true });
}
