import { NextResponse } from "next/server";
import {
  countOrders,
  listEvents,
  ordersGroupedByStatus,
} from "@/server/orders-repo";

export async function GET() {
  const events = await listEvents();
  const counts: Record<string, number> = {};
  const sessionsWithCart = new Set<string>();
  const funnel = {
    page_view: 0,
    view_create: 0,
    add_to_cart: 0,
    begin_checkout: 0,
    order_placed: 0,
  };

  for (const event of events) {
    counts[event.name] = (counts[event.name] ?? 0) + 1;
    if (event.name === "add_to_cart") sessionsWithCart.add(event.sessionId);
    if (event.name === "page_view") {
      funnel.page_view += 1;
      if (event.path.startsWith("/create")) funnel.view_create += 1;
    }
    if (event.name === "add_to_cart") funnel.add_to_cart += 1;
    if (event.name === "begin_checkout") funnel.begin_checkout += 1;
    if (event.name === "order_placed") funnel.order_placed += 1;
  }

  return NextResponse.json({
    totals: {
      events: events.length,
      orders: await countOrders(),
      sessionsWithCart: sessionsWithCart.size,
    },
    counts,
    funnel,
    ordersByStatus: await ordersGroupedByStatus(),
  });
}
