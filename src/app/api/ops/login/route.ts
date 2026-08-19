import { NextResponse } from "next/server";
import {
  createOpsToken,
  opsCookieName,
  opsCookieOptions,
  passwordsMatch,
} from "@/server/ops-session";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password: unknown }).password)
      : "";

  if (!(await passwordsMatch(password))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await createOpsToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(opsCookieName(), token, opsCookieOptions());
  return response;
}
