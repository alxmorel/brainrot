import { createHmac, timingSafeEqual } from "node:crypto";

function tokenSecret() {
  return process.env.SESSION_SECRET ?? "dev-order-access-secret";
}

/** Token HMAC orderId.exp.sig — lien magique emails /suivi. */
export function createOrderAccessToken(orderId: string, ttlDays = 90): string {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 86_400;
  const payload = `${orderId}.${exp}`;
  const sig = createHmac("sha256", tokenSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function peekOrderIdFromToken(token: string): string | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  const orderId = parts[0]?.trim();
  return orderId || null;
}

export function verifyOrderAccessToken(token: string): string | null {
  const raw = token.trim();
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [orderId, expStr, sig] = parts;
  if (!orderId || !expStr || !sig) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;

  const payload = `${orderId}.${expStr}`;
  const expected = createHmac("sha256", tokenSecret()).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return orderId;
}
