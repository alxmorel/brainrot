import type { Order } from "@/models";
import { gelatoUidForSize } from "@/data/fulfillment";
import { appUrl } from "@/server/stripe";

export type FulfillmentResult = {
  ok: boolean;
  mode: "simulated" | "gelato";
  externalId: string | null;
  error: string | null;
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] || "Client";
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

function printFileUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = appUrl().replace(/\/$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function sendToGelato(order: Order): Promise<FulfillmentResult> {
  const apiKey = process.env.GELATO_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      mode: "simulated",
      externalId: `SIM-${order.id}`,
      error: null,
    };
  }

  const items = [];
  for (const [index, item] of order.items.entries()) {
    const productUid = gelatoUidForSize(item.size, item.color);
    if (!productUid) {
      return {
        ok: false,
        mode: "gelato",
        externalId: null,
        error: `UID Gelato manquant pour la taille ${item.size} (GELATO_UID_${item.size}).`,
      };
    }
    items.push({
      itemReferenceId: `${order.id}-${index}`,
      productUid,
      quantity: item.quantity,
      files: [
        {
          type: "default",
          url: printFileUrl(item.printImage),
        },
      ],
    });
  }

  const { firstName, lastName } = splitName(order.shipping.name);
  const country = order.shipping.country.trim().toUpperCase();

  try {
    const response = await fetch("https://order.gelatoapis.com/v4/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        orderType: "order",
        orderReferenceId: order.id,
        currency: "EUR",
        shipmentMethodUid: "standard",
        items,
        shippingAddress: {
          firstName,
          lastName,
          addressLine1: order.shipping.line1,
          city: order.shipping.city,
          postCode: order.shipping.postalCode,
          country,
          email: order.shipping.email,
          phone: process.env.GELATO_FALLBACK_PHONE ?? "0000000000",
        },
      }),
    });

    const json: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        json && typeof json === "object" && "message" in json
          ? String((json as { message: unknown }).message)
          : `Gelato HTTP ${response.status}`;
      return { ok: false, mode: "gelato", externalId: null, error: message };
    }

    const externalId =
      json && typeof json === "object" && "id" in json
        ? String((json as { id: unknown }).id)
        : `GELATO-${order.id}`;

    return { ok: true, mode: "gelato", externalId, error: null };
  } catch (error) {
    return {
      ok: false,
      mode: "gelato",
      externalId: null,
      error: error instanceof Error ? error.message : "Gelato unreachable",
    };
  }
}
