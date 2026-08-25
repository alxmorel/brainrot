import type { OrderEventKind } from "@/models";
import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export async function recordOrderEvent(
  orderId: string,
  kind: OrderEventKind,
  detail?: Record<string, string | number | boolean | null>,
) {
  await prisma.orderEvent.create({
    data: {
      orderId,
      kind,
      detail: detail as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function listOrderEvents(orderId: string) {
  const rows = await prisma.orderEvent.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    orderId: row.orderId,
    kind: row.kind as OrderEventKind,
    detail: row.detail as Record<string, string | number | boolean | null> | null,
    createdAt: row.createdAt.toISOString(),
  }));
}
