import { NextResponse } from "next/server";
import { formatEur } from "@/data/pricing";
import { listOrdersForExport } from "@/server/ops/orders";
import { calendarPeriod, parsePeriodDays } from "@/server/ops/period";
import { listEventsForExport } from "@/server/ops/sessions";

function csvEscape(value: string | number | null | undefined) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const days = parsePeriodDays(params.get("days"), 30, 365);
  const period = calendarPeriod(days);
  const since = period.since;

  if (type === "orders") {
    const orders = await listOrdersForExport(since);
    const header = [
      "id",
      "status",
      "email",
      "name",
      "total",
      "items",
      "sessionId",
      "stripeCheckoutId",
      "createdAt",
    ];
    const lines = orders.map((order) =>
      [
        order.id,
        order.status,
        order.email,
        order.name,
        formatEur(order.totalCents),
        order.itemCount,
        order.sessionId,
        order.stripeCheckoutId ?? "",
        order.createdAt,
      ]
        .map(csvEscape)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${days}d.csv"`,
      },
    });
  }

  if (type === "events") {
    const events = await listEventsForExport(since);
    const header = ["id", "sessionId", "name", "path", "payload", "createdAt"];
    const lines = events.map((event) =>
      [
        event.id,
        event.sessionId,
        event.name,
        event.path,
        event.payload ? JSON.stringify(event.payload) : "",
        event.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="events-${days}d.csv"`,
      },
    });
  }

  return NextResponse.json({ ok: false, error: "type requis (orders|events)." }, { status: 400 });
}
