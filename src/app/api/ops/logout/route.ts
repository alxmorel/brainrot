import { NextResponse } from "next/server";
import { opsCookieName } from "@/server/ops-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(opsCookieName(), "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
