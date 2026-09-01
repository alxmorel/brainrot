import { NextResponse } from "next/server";
import { welcomeValueCents } from "@/data/pricing";
import { getSessionUser } from "@/server/get-session-user";
import { getShopSettings } from "@/server/shop-settings";
import { isWelcomeActive } from "@/server/users-repo";
import { typedCodeMatchesWelcome } from "@/server/welcome-code";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  const shop = await getShopSettings();
  const user = await getSessionUser();
  const matches = typedCodeMatchesWelcome(
    code,
    user?.welcomeCode,
    shop.welcomeCode,
  );

  if (!matches || !shop.welcomeLive) {
    return NextResponse.json({ ok: false, needsAccount: false });
  }
  if (shop.welcomeRequiresAccount && !user) {
    return NextResponse.json({ ok: false, needsAccount: true });
  }
  if (user && !isWelcomeActive(user)) {
    return NextResponse.json({ ok: false, needsAccount: false });
  }

  return NextResponse.json({
    ok: true,
    code: shop.welcomeCode,
    cents: welcomeValueCents(0, shop),
  });
}
