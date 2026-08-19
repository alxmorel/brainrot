import { NextResponse } from "next/server";
import type { AnalyticsEvent, AnalyticsEventName } from "@/models";
import { createEvent } from "@/server/orders-repo";

const names: AnalyticsEventName[] = [
  "page_view",
  "add_to_cart",
  "remove_from_cart",
  "preview_open",
  "trait_select",
  "begin_checkout",
  "order_placed",
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
  const path = typeof record.path === "string" ? record.path : "/";
  if (!sessionId || typeof name !== "string" || !names.includes(name as AnalyticsEventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event: AnalyticsEvent = {
    id: `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    sessionId,
    name: name as AnalyticsEventName,
    path,
    payload:
      typeof record.payload === "object" && record.payload !== null
        ? (record.payload as AnalyticsEvent["payload"])
        : undefined,
    createdAt: new Date().toISOString(),
  };

  await createEvent(event);
  return NextResponse.json({ ok: true });
}
