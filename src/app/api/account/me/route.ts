import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/get-session-user";
import { accountMeOf } from "@/server/users-repo";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: true, user: null });
  }
  return NextResponse.json({ ok: true, user: await accountMeOf(user) });
}
