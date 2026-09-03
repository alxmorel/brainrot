import { NextResponse } from "next/server";
import { getOpsOrderDetail } from "@/server/ops/orders";
import { handleOpsOrderAction } from "@/server/ops/orderActions";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const order = await getOpsOrderDetail(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Commande introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const action = typeof record.action === "string" ? record.action : "";
  const allowed = [
    "fulfill",
    "ship",
    "deliver",
    "cancel",
    "resend_confirmation",
    "resend_shipped",
    "resend_delivered",
  ];
  if (!allowed.includes(action)) {
    return NextResponse.json({ ok: false, error: "Action invalide." }, { status: 400 });
  }

  const result = await handleOpsOrderAction(id, action, record);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  }

  const order = await getOpsOrderDetail(id);
  return NextResponse.json({
    ok: true,
    order,
    refunded: result.refunded,
    refundError: result.refundError,
    emailSent: result.emailSent,
  });
}
