import { NextResponse } from "next/server";
import { cancelOrder } from "@/server/orders/cancelOrder";
import {
  buildPublicOrderView,
  orderEmailMatches,
} from "@/server/orders/publicOrder";
import { markOrderAsShipped } from "@/server/orders/shipOrder";
import { retryFulfillOrder } from "@/server/fulfillment/tryFulfillOrder";
import { getOrder } from "@/server/orders-repo";

export const runtime = "nodejs";

function parseShipInput(body: unknown) {
  if (!body || typeof body !== "object") return {};
  const record = body as Record<string, unknown>;
  return {
    tracking: typeof record.tracking === "string" ? record.tracking : null,
    trackingUrl: typeof record.trackingUrl === "string" ? record.trackingUrl : null,
  };
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const params = new URL(request.url).searchParams;
  const sessionId = params.get("sessionId");
  const email = params.get("email");

  if (!sessionId && !email) {
    return NextResponse.json(
      { ok: false, error: "Session ou email requis." },
      { status: 400 },
    );
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Commande introuvable." }, { status: 404 });
  }

  const sessionOk = sessionId && order.sessionId === sessionId;
  const emailOk = email && orderEmailMatches(order, email);
  if (!sessionOk && !emailOk) {
    return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, order: buildPublicOrderView(order) });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  const action =
    body && typeof body === "object" && "action" in body
      ? (body as { action: unknown }).action
      : null;
  if (action !== "fulfill" && action !== "ship" && action !== "cancel") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (action === "cancel") {
    const result = await cancelOrder(id);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
    }
    const order = await getOrder(id);
    return NextResponse.json({
      ok: true,
      order,
      refunded: result.refunded,
      refundError: result.refundError,
    });
  }

  if (action === "ship") {
    const shipInput = parseShipInput(body);
    const result = await markOrderAsShipped(id, shipInput);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
    }
    const order = await getOrder(id);
    return NextResponse.json({
      ok: true,
      order,
      emailSent: result.emailSent,
    });
  }

  const retried = await retryFulfillOrder(id);
  if (!retried) {
    return NextResponse.json({ ok: false }, { status: 409 });
  }
  const updated = await getOrder(id);
  return NextResponse.json({ ok: true, order: updated });
}
