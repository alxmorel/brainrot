import { NextResponse } from "next/server";
import { listOpsSessions } from "@/server/ops/sessions";
import { calendarPeriod, parsePeriodDays } from "@/server/ops/period";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const days = parsePeriodDays(params.get("days"), 7, 90);
  const period = calendarPeriod(days);
  const hasCart = params.get("hasCart") === "1";
  const hasOrder = params.get("hasOrder") === "1";
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "25");

  const result = await listOpsSessions({
    since: period.since,
    hasCart: hasCart || undefined,
    hasOrder: hasOrder || undefined,
    page,
    pageSize,
  });

  return NextResponse.json({
    ok: true,
    periodDays: days,
    from: period.from,
    to: period.to,
    ...result,
  });
}
