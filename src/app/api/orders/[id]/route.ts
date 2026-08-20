import { NextResponse } from "next/server";
import { sendToGelato } from "@/server/fulfillment/gelato";
import { getOrder, saveOrder } from "@/server/orders-repo";

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
