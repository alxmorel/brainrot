import { NextResponse } from "next/server";
import { brainrots } from "@/data/brainrots";
import { teePriceCents } from "@/data/pricing";
import { teeColorLabel } from "@/data/teeColors";
import { sendToGelato } from "@/server/fulfillment/gelato";
import { getOrder, saveOrder } from "@/server/orders-repo";
import type { OrderStatus } from "@/models";

const PAID_STATUSES: OrderStatus[] = [
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "shipped",
];

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const sessionId = new URL(request.url).searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Session requise." }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Commande introuvable." }, { status: 404 });
  }
  if (order.sessionId !== sessionId) {
    return NextResponse.json({ ok: false, error: "Accès refusé." }, { status: 403 });
  }

  const items = order.items.map((item) => {
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    return {
      brainrotId: item.brainrotId,
      name: brainrot?.name ?? item.brainrotId,
      size: item.size,
      color: item.color,
      colorLabel: teeColorLabel(item.color),
      quantity: item.quantity,
      lineCents: item.quantity * teePriceCents,
    };
  });

  const totalCents = items.reduce((sum, item) => sum + item.lineCents, 0);
  const isPaid = PAID_STATUSES.includes(order.status);
  const email =
    order.shipping.email && order.shipping.email !== "—"
      ? order.shipping.email
      : null;

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      status: order.status,
      isPaid,
      email,
      items,
      totalCents,
    },
  });
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
  if (
    action !== "validate" &&
    action !== "fulfill" &&
    action !== "ship" &&
    action !== "cancel"
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });

  if (action === "validate") {
    if (order.status !== "paid") {
      return NextResponse.json({ ok: false }, { status: 409 });
    }
    order.status = "validated";
  }

  if (action === "cancel") order.status = "cancelled";
  if (action === "ship") order.status = "shipped";

  if (action === "fulfill") {
    if (order.status !== "validated" && order.status !== "failed") {
      return NextResponse.json({ ok: false }, { status: 409 });
    }
    order.status = "fulfillment_queued";
    const sent = await sendToGelato(order);
    if (!sent.ok) {
      order.status = "failed";
      order.supplier.lastError = sent.error;
    } else {
      order.status = "fulfillment_sent";
      order.supplier.externalId = sent.externalId;
      order.supplier.lastError = sent.mode === "simulated" ? "simulated" : null;
    }
  }

  order.updatedAt = new Date().toISOString();
  await saveOrder(order);
  return NextResponse.json({ ok: true, order });
}
