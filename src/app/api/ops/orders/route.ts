import { NextResponse } from "next/server";
import { listOpsOrders } from "@/server/ops/orders";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const status = params.get("status") ?? undefined;
  const q = params.get("q") ?? undefined;
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "25");

  const result = await listOpsOrders({ status, q, page, pageSize });
  return NextResponse.json({ ok: true, ...result });
}
