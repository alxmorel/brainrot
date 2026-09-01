import { NextResponse } from "next/server";
import {
  createUserToken,
  userCookieName,
  userCookieOptions,
} from "@/server/auth-session";
import { accountMeOf, authenticateUser } from "@/server/users-repo";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const email = typeof record.email === "string" ? record.email : "";
  const password = typeof record.password === "string" ? record.password : "";

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Email ou mot de passe incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, user: await accountMeOf(user) });
  const token = await createUserToken(user.id);
  response.cookies.set(userCookieName(), token, userCookieOptions());
  return response;
}
