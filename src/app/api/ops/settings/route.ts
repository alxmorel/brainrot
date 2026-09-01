import { NextResponse } from "next/server";
import {
  getShopSettings,
  parseShopSettingsInput,
  updateShopSettings,
} from "@/server/shop-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getShopSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  const parsed = parseShopSettingsInput(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const settings = await updateShopSettings(parsed.data);
  return NextResponse.json({ ok: true, settings });
}
