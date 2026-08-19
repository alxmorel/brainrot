const COOKIE = "br_ops";
const MAX_AGE_SEC = 60 * 60 * 12;

function requiredSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET (32+ chars) is required in production");
  }
  return "dev-only-session-secret-change-me!!";
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requiredSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return bufferToHex(sig);
}

async function expectedSig(value: string) {
  return sign(value);
}

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function opsCookieName() {
  return COOKIE;
}

export async function createOpsToken() {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `ops.${exp}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function isOpsTokenValid(token: string | undefined) {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await expectedSig(payload);
  if (!timingEqual(sig, expected)) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export function opsCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export async function passwordsMatch(input: string) {
  const expected = process.env.OPS_PASSWORD;
  if (!expected) return false;
  const left = await sign(`pwd.${input}`);
  const right = await sign(`pwd.${expected}`);
  return timingEqual(left, right);
}
