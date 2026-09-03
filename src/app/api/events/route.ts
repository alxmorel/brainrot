import { NextResponse } from "next/server";
import type { AnalyticsEventName } from "@/models";
import {
  geoFromHeaders,
  parseUserAgent,
  sanitizePayload,
} from "@/server/analytics-context";
import { createEvent } from "@/server/orders-repo";

const names: AnalyticsEventName[] = [
  "page_view",
  "page_leave",
  "view_create",
  "add_to_cart",
  "remove_from_cart",
  "preview_open",
  "trait_select",
  "brainrot_select",
  "size_change",
  "color_change",
  "quantity_change",
  "view_cart",
  "begin_checkout",
  "checkout_error",
  "consent_choice",
  "order_placed",
  "cta_composer",
  "cta_bande",
];

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const sessionId =
    typeof record.sessionId === "string" ? record.sessionId : "";
  const name = record.name;
  const path = typeof record.path === "string" ? record.path.slice(0, 300) : "/";
  if (!sessionId || typeof name !== "string" || !names.includes(name as AnalyticsEventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const client = sanitizePayload(record.payload) ?? {};
  let payload = client;
  if (name !== "consent_choice") {
    const ua = parseUserAgent(request.headers.get("user-agent") ?? "");
    const device =
      ua.device === "desktop" &&
      typeof client.viewportW === "number" &&
      client.viewportW < 768
        ? "mobile"
        : ua.device;
    payload = {
      ...client,
      ...geoFromHeaders(request.headers),
      device,
      browser: ua.browser,
      os: ua.os,
    };
  }

  const event = {
    id: `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    sessionId,
    name: name as AnalyticsEventName,
    path,
    payload,
    createdAt: new Date().toISOString(),
  };

  await createEvent(event);
  return NextResponse.json({ ok: true });
}
