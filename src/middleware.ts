import { NextRequest, NextResponse } from "next/server";
import { isOpsTokenValid, opsCookieName } from "@/server/ops-session";

function isPublic(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/ops/login") return true;
  if (pathname === "/api/ops/login") return true;
  if (pathname === "/api/ops/logout") return true;
  if (pathname === "/api/checkout" && request.method === "POST") return true;
  if (pathname.startsWith("/api/stripe/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  if (isPublic(request)) return NextResponse.next();

  const token = request.cookies.get(opsCookieName())?.value;
  const ok = await isOpsTokenValid(token);
  if (ok) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const login = new URL("/ops/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/ops/:path*",
    "/api/ops/:path*",
    "/api/orders",
    "/api/orders/:path*",
  ],
};
