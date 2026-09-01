import { NextResponse } from "next/server";
import {
  createUserToken,
  userCookieName,
  userCookieOptions,
} from "@/server/auth-session";
import { trySendWelcomeEmail } from "@/server/email/trySendWelcome";
import { getShopSettings } from "@/server/shop-settings";
import { accountMeOf, createUser, getUserByEmail } from "@/server/users-repo";

export const runtime = "nodejs";

function parseBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";
  return { email, password };
}

export async function POST(request: Request) {
  const parsed = parseBody(await request.json().catch(() => null));
  if (!parsed) {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  if (!parsed.email.includes("@") || parsed.email.length < 5) {
    return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
  }
  if (parsed.password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Mot de passe : 8 caractères minimum." },
      { status: 400 },
    );
  }

  const existing = await getUserByEmail(parsed.email);
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "Un compte existe déjà avec cet email." },
      { status: 409 },
    );
  }

  const user = await createUser(parsed.email, parsed.password);
  const shop = await getShopSettings();
  if (shop.welcomeEnabled) {
    void trySendWelcomeEmail(user.email, shop.welcomeCode, shop);
  }

  const response = NextResponse.json({ ok: true, user: await accountMeOf(user) });
  const token = await createUserToken(user.id);
  response.cookies.set(userCookieName(), token, userCookieOptions());
  return response;
}
