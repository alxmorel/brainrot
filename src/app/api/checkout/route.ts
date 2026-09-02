import { NextResponse } from "next/server";
import { brainrots } from "@/data/brainrots";
import { catalogForProduct } from "@/data/fulfillment";
import {
  isMysteryCartItem,
  MYSTERY_PRODUCT_ID,
} from "@/data/mystery";
import { cartLineUnitCents } from "@/data/pricing";
import { isTeeSize } from "@/data/sizes";
import { defaultTeeColor, isTeeColor, teeColorLabel } from "@/data/teeColors";
import { brand } from "@/data/brand";
import {
  attachStripeCheckout,
  createOrder,
} from "@/server/orders-repo";
import { quoteCheckout } from "@/server/checkout-quote";
import { getSessionUser } from "@/server/get-session-user";
import { pickMysteryBrainrots } from "@/server/pickMystery";
import { getShopSettings } from "@/server/shop-settings";
import { appUrl, getStripe } from "@/server/stripe";
import type { CartItem, Order, OrderItem } from "@/models";

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
  const typedCode =
    typeof record.welcomeCode === "string" ? record.welcomeCode : null;
  const itemsRaw = Array.isArray(record.items) ? record.items : [];
  if (!sessionId || itemsRaw.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const cartLines: {
    productId: string;
    brainrotId: string;
    size: string;
    color: string;
    quantity: number;
    mystery: boolean;
    printImage: string | null;
  }[] = [];
  for (const raw of itemsRaw) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as CartItem;
    if (!item.productId || item.quantity < 1) continue;
    if (!item.size || !isTeeSize(item.size)) continue;
    const color =
      typeof item.color === "string" && isTeeColor(item.color)
        ? item.color
        : defaultTeeColor;
    if (isMysteryCartItem(item)) {
      cartLines.push({
        productId: MYSTERY_PRODUCT_ID,
        brainrotId: MYSTERY_PRODUCT_ID,
        size: item.size,
        color,
        quantity: item.quantity,
        mystery: true,
        printImage: null,
      });
      continue;
    }
    const brainrot = brainrots.find((b) => b.id === item.brainrotId);
    if (!brainrot) continue;
    cartLines.push({
      productId: item.productId,
      brainrotId: item.brainrotId,
      size: item.size,
      color,
      quantity: item.quantity,
      mystery: false,
      printImage: brainrot.image,
    });
  }
  if (cartLines.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const shop = await getShopSettings();
  const items: OrderItem[] = [];
  for (const line of cartLines) {
    const unitCents = cartLineUnitCents(line, shop);
    if (line.mystery) {
      const picks = pickMysteryBrainrots(line.quantity);
      if (picks.length !== line.quantity) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      for (const brainrot of picks) {
        items.push({
          brainrotId: brainrot.id,
          productId: MYSTERY_PRODUCT_ID,
          size: line.size,
          color: line.color,
          quantity: 1,
          printImage: brainrot.image,
          unitCents,
        });
      }
      continue;
    }
    if (!line.printImage) continue;
    items.push({
      brainrotId: line.brainrotId,
      productId: line.productId,
      size: line.size,
      color: line.color,
      quantity: line.quantity,
      printImage: line.printImage,
      unitCents,
    });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const sessionUser = await getSessionUser();
  const quote = await quoteCheckout({
    items: cartLines,
    sessionUser,
    typedCode,
  });

  const catalog = catalogForProduct(
    items[0].productId,
    isTeeSize(items[0].size) ? items[0].size : undefined,
    items[0].color,
  );
  const now = new Date().toISOString();
  const order: Order = {
    id: `BR-${Date.now().toString(36).toUpperCase()}`,
    sessionId,
    userId: quote.userId,
    status: "pending_payment",
    items,
    shipping: {
      name: "-",
      email: "-",
      line1: "-",
      city: "-",
      postalCode: "-",
      country: "FR",
    },
    supplier: {
      provider: "gelato",
      productId: catalog?.productUid ?? null,
      sku: `${items[0].size}-${items[0].color}`,
      externalId: null,
      tracking: null,
      trackingUrl: null,
      lastError: null,
    },
    unitCents: quote.unitCents,
    discountCents: quote.discountCents,
    creditAppliedCents: quote.creditAppliedCents,
    welcomeAppliedCents: quote.welcomeAppliedCents,
    totalCents: quote.totalCents,
    cashbackGrantedCents: 0,
    welcomeCode: quote.welcomeCode,
    createdAt: now,
    updatedAt: now,
  };

  await createOrder(order);

  const origin = appUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: {
      orderId: order.id,
      sessionId,
      userId: quote.userId ?? "",
    },
    success_url: `${origin}/checkout/merci?id=${order.id}`,
    cancel_url: `${origin}/cart`,
    shipping_address_collection: {
      allowed_countries: [...SHIPPING_COUNTRIES],
    },
    line_items: cartLines.map((line) => {
      const brainrot = brainrots.find((b) => b.id === line.brainrotId);
      const name = line.mystery
        ? `${brand.mystery.name} ${line.size} ${teeColorLabel(line.color)}`
        : `T-shirt ${brainrot?.name ?? line.brainrotId} ${line.size} ${teeColorLabel(line.color)}`;
      return {
        quantity: line.quantity,
        price_data: {
          currency: "eur",
          unit_amount: cartLineUnitCents(line, shop),
          product_data: { name },
        },
      };
    }),
    ...(quote.discountCents > 0
      ? {
          discounts: [
            {
              coupon: (
                await stripe.coupons.create({
                  amount_off: quote.discountCents,
                  currency: "eur",
                  duration: "once",
                  max_redemptions: 1,
                })
              ).id,
            },
          ],
        }
      : {}),
  });

  if (!session.url) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  await attachStripeCheckout(order.id, session.id);
  return NextResponse.json({ ok: true, url: session.url, orderId: order.id });
}
