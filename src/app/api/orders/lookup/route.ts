import { NextResponse } from "next/server";
import {
  buildPublicOrderView,
  orderEmailMatches,
} from "@/server/orders/publicOrder";
import { getOrder } from "@/server/orders-repo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const orderId =
    typeof record.orderId === "string" ? record.orderId.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";

  if (!orderId || !email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "N° de commande et email requis." },
      { status: 400 },
    );
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json(
      { ok: false, error: "Commande introuvable." },
      { status: 404 },
    );
  }

  if (!orderEmailMatches(order, email)) {
    return NextResponse.json(
      { ok: false, error: "Email ou n° de commande incorrect." },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, order: buildPublicOrderView(order) });
}
