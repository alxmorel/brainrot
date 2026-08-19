import { NextResponse } from "next/server";
import { listOrders } from "@/server/orders-repo";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}
