import { NextResponse } from "next/server";
import { brainrots } from "@/data/brainrots";
import { catalogForProduct } from "@/server/fulfillment/aliexpress";
import {
  attachStripeCheckout,
  createOrder,
} from "@/server/orders-repo";
import { appUrl, getStripe, teeUnitAmountCents } from "@/server/stripe";
import type { CartItem, Order, ShippingAddress } from "@/models";

function parseShipping(value: unknown): ShippingAddress | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Record<string, unknown>;
  const name = typeof s.name === "string" ? s.name.trim() : "";
  const email = typeof s.email === "string" ? s.email.trim() : "";
  const line1 = typeof s.line1 === "string" ? s.line1.trim() : "";
  const city = typeof s.city === "string" ? s.city.trim() : "";
  const postalCode = typeof s.postalCode === "string" ? s.postalCode.trim() : "";
  const country = typeof s.country === "string" ? s.country.trim() : "";
  if (!name || !email || !line1 || !city || !postalCode || !country) return null;
  return { name, email, line1, city, postalCode, country };
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Stripe n’est pas configuré (STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const sessionId =
    typeof record.sessionId === "string" ? record.sessionId : "";
  const shipping = parseShipping(record.shipping);
  const itemsRaw = Array.isArray(record.items) ? record.items : [];
  if (!sessionId || !shipping || itemsRaw.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const items: Order["items"] = [];
  for (const raw of itemsRaw) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as CartItem;
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    if (!brainrot || !item.productId || item.quantity < 1) continue;
    items.push({
      brainrotId: item.brainrotId,
      productId: item.productId,
      quantity: item.quantity,
      printImage: brainrot.image,
    });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const catalog = catalogForProduct(items[0].productId);
  const now = new Date().toISOString();
  const order: Order = {
    id: `BR-${Date.now().toString(36).toUpperCase()}`,
    sessionId,
    status: "pending_payment",
    items,
    shipping,
    supplier: {
      provider: "aliexpress",
      productId: catalog?.aliexpressProductId ?? null,
      sku: catalog?.sku ?? null,
      externalId: null,
      tracking: null,
      lastError: null,
    },
    createdAt: now,
    updatedAt: now,
  };

  await createOrder(order);

  const unit = teeUnitAmountCents();
  const origin = appUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: shipping.email,
    metadata: { orderId: order.id },
    success_url: `${origin}/checkout/merci?id=${order.id}`,
    cancel_url: `${origin}/checkout`,
    line_items: items.map((item) => {
      const brainrot = brainrots.find((b) => b.id === item.brainrotId);
      return {
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: unit,
          product_data: {
            name: `T-shirt ${brainrot?.name ?? item.brainrotId}`,
          },
        },
      };
    }),
  });

  if (!session.url) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  await attachStripeCheckout(order.id, session.id);
  return NextResponse.json({ ok: true, url: session.url, orderId: order.id });
}
