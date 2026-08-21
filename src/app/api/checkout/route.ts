import { NextResponse } from "next/server";
import { brainrots } from "@/data/brainrots";
import { catalogForProduct } from "@/data/fulfillment";
import { isTeeSize } from "@/data/sizes";
import {
  attachStripeCheckout,
  createOrder,
} from "@/server/orders-repo";
import { appUrl, getStripe, teeUnitAmountCents } from "@/server/stripe";
import type { CartItem, Order } from "@/models";

const SHIPPING_COUNTRIES = [
  "FR",
  "BE",
  "CH",
  "DE",
  "ES",
  "IT",
  "LU",
  "NL",
  "GB",
  "PT",
  "AT",
] as const;

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
  const itemsRaw = Array.isArray(record.items) ? record.items : [];
  if (!sessionId || itemsRaw.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const items: Order["items"] = [];
  for (const raw of itemsRaw) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as CartItem;
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    if (!brainrot || !item.productId || item.quantity < 1) continue;
    if (!item.size || !isTeeSize(item.size)) continue;
    items.push({
      brainrotId: item.brainrotId,
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      printImage: brainrot.image,
    });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const catalog = catalogForProduct(
    items[0].productId,
    isTeeSize(items[0].size) ? items[0].size : undefined,
  );
  const now = new Date().toISOString();
  const order: Order = {
    id: `BR-${Date.now().toString(36).toUpperCase()}`,
    sessionId,
    status: "pending_payment",
    items,
    shipping: {
      name: "—",
      email: "—",
      line1: "—",
      city: "—",
      postalCode: "—",
      country: "FR",
    },
    supplier: {
      provider: "gelato",
      productId: catalog?.productUid ?? null,
      sku: items[0].size,
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
    metadata: { orderId: order.id },
    success_url: `${origin}/checkout/merci?id=${order.id}`,
    cancel_url: `${origin}/checkout`,
    shipping_address_collection: {
      allowed_countries: [...SHIPPING_COUNTRIES],
    },
    line_items: items.map((item) => {
      const brainrot = brainrots.find((b) => b.id === item.brainrotId);
      return {
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: unit,
          product_data: {
            name: `T-shirt ${brainrot?.name ?? item.brainrotId} ${item.size}`,
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
