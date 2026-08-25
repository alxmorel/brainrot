import type { Order, OrderStatus } from "@/models";
import { sendToGelato } from "@/server/fulfillment/gelato";
import { recordOrderEvent } from "@/server/orders/orderEvents";
import { getOrder, saveOrder } from "@/server/orders-repo";

const AUTO_FULFILL_STATUSES: OrderStatus[] = ["paid"];
const RETRY_FULFILL_STATUSES: OrderStatus[] = ["validated", "failed"];

async function fulfillOrder(order: Order) {
  order.status = "fulfillment_queued";
  const sent = await sendToGelato(order);
  if (!sent.ok) {
    order.status = "failed";
    order.supplier.lastError = sent.error;
  } else {
    order.status = "fulfillment_sent";
    order.supplier.externalId = sent.externalId;
    order.supplier.lastError = sent.mode === "simulated" ? "simulated" : null;
  }
  order.updatedAt = new Date().toISOString();
  await saveOrder(order);
  if (!sent.ok) {
    await recordOrderEvent(order.id, "fulfillment_failed", {
      error: sent.error ?? "unknown",
    });
  } else {
    await recordOrderEvent(order.id, "fulfillment_sent", {
      externalId: sent.externalId,
      mode: sent.mode,
    });
  }
}

export async function tryFulfillOrder(orderId: string) {
  const order = await getOrder(orderId);
  if (!order || !AUTO_FULFILL_STATUSES.includes(order.status)) return;

  await fulfillOrder(order);
}

export async function retryFulfillOrder(orderId: string) {
  const order = await getOrder(orderId);
  if (!order || !RETRY_FULFILL_STATUSES.includes(order.status)) return false;

  await fulfillOrder(order);
  return true;
}
