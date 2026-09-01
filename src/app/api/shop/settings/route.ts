import { NextResponse } from "next/server";
import { getShopSettings } from "@/server/shop-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getShopSettings();
  return NextResponse.json({ ok: true, settings });
}
