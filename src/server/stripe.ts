import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) {
    client = new Stripe(key);
  }
  return client;
}

export function teeUnitAmountCents() {
  const raw = Number(process.env.STRIPE_TEE_CENTS ?? "2490");
  return Number.isFinite(raw) && raw > 0 ? raw : 2490;
}

export function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000"
  );
}
