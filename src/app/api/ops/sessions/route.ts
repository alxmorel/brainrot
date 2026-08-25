import { NextResponse } from "next/server";
import { listOpsSessions } from "@/server/ops/sessions";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const days = Number(params.get("days") ?? "30");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const hasCart = params.get("hasCart") === "1";
  const hasOrder = params.get("hasOrder") === "1";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "25");

  const result = await listOpsSessions({
    since,
    hasCart: hasCart || undefined,
    hasOrder: hasOrder || undefined,
    page,
    pageSize,
  });

  return NextResponse.json({ ok: true, ...result });
}
