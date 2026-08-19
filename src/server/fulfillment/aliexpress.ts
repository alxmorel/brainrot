import type { Order } from "@/models";
import { fulfillmentCatalog } from "@/data/fulfillment";

export type FulfillmentResult = {
  ok: boolean;
  mode: "simulated" | "aliexpress";
  externalId: string | null;
  error: string | null;
};

export function catalogForProduct(productId: string) {
  return fulfillmentCatalog[productId as keyof typeof fulfillmentCatalog];
}

export async function sendToAliExpress(order: Order): Promise<FulfillmentResult> {
  const key = process.env.ALIEXPRESS_APP_KEY;
  const secret = process.env.ALIEXPRESS_APP_SECRET;
  const session = process.env.ALIEXPRESS_SESSION;
  const first = order.items[0];
  const catalog = first ? catalogForProduct(first.productId) : undefined;

  if (!key || !secret || !session || !catalog?.aliexpressProductId) {
    return {
      ok: true,
      mode: "simulated",
      externalId: `SIM-${order.id}`,
      error: null,
    };
  }

  const endpoint =
    process.env.ALIEXPRESS_API_URL ?? "https://api-sg.aliexpress.com/sync";

  const body = {
    method: "aliexpress.trade.dropshiporder.create",
    product_id: catalog.aliexpressProductId,
    sku: catalog.sku,
    quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
    logistics_address: {
      contact_person: order.shipping.name,
      address: order.shipping.line1,
      city: order.shipping.city,
      zip: order.shipping.postalCode,
      country: order.shipping.country,
    },
    customization: {
      print_image: first?.printImage ?? null,
      remark: `Brainrot ${order.id}`,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AE-App-Key": key,
        "X-AE-Session": session,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return {
        ok: false,
        mode: "aliexpress",
        externalId: null,
        error: `AliExpress HTTP ${response.status}`,
      };
    }
    const json: unknown = await response.json();
    const externalId =
      typeof json === "object" &&
      json !== null &&
      "order_id" in json &&
      typeof (json as { order_id: unknown }).order_id === "string"
        ? (json as { order_id: string }).order_id
        : `AE-${order.id}`;
    return { ok: true, mode: "aliexpress", externalId, error: null };
  } catch (error) {
    return {
      ok: false,
      mode: "aliexpress",
      externalId: null,
      error: error instanceof Error ? error.message : "AliExpress unreachable",
    };
  }
}
