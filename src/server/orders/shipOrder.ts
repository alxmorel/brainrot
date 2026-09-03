import { trySendOrderShipped } from "@/server/email/trySendOrderShipped";
import { isHttpUrl } from "@/server/fulfillment/gelatoWebhook";
import type { Order } from "@/models";
import { applyGelatoTracking, getOrder } from "@/server/orders-repo";

export type ShipOrderInput = {
  tracking?: string | null;
  trackingUrl?: string | null;
  carrier?: string | null;
};

export type ShipOrderResult = {
  ok: boolean;
  error?: string;
  emailSent: boolean;
};

export function hasShippableTracking(order: Order) {
  const code = order.supplier.tracking?.trim();
  const url = order.supplier.trackingUrl?.trim();
  return Boolean(code) || Boolean(url && isHttpUrl(url));
}

function normalizeTracking(input: ShipOrderInput) {
  const code = input.tracking?.trim() || null;
  const rawUrl = input.trackingUrl?.trim() || null;
  const url = rawUrl && isHttpUrl(rawUrl) ? rawUrl : null;
  const carrier = input.carrier?.trim() || null;
  return { code, url, carrier };
}

const SHIPPABLE_STATUSES = new Set([
  "paid",
  "validated",
  "fulfillment_queued",
  "fulfillment_sent",
  "fulfillment_failed",
  "failed",
  "shipped",
]);

export async function markOrderAsShipped(
  orderId: string,
  input: ShipOrderInput = {},
): Promise<ShipOrderResult> {
  const order = await getOrder(orderId);
  if (!order) {
    return { ok: false, error: "Commande introuvable.", emailSent: false };
  }

  if (order.status === "delivered") {
    const { code, url, carrier } = normalizeTracking(input);
    if (code || url || carrier) {
      await applyGelatoTracking(orderId, {
        code: code ?? order.supplier.tracking,
        url: url ?? order.supplier.trackingUrl,
        carrier: carrier ?? order.supplier.carrier,
      });
    }
    return { ok: true, emailSent: false };
  }

  if (!SHIPPABLE_STATUSES.has(order.status)) {
    return { ok: false, error: "Statut incompatible.", emailSent: false };
  }

  const { code, url, carrier } = normalizeTracking(input);
  const hasTrackingInput = Boolean(code || url);
  const hasInput = Boolean(code || url || carrier);

  if (order.status !== "shipped") {
    if (!hasTrackingInput && !hasShippableTracking(order)) {
      return {
        ok: false,
        error: "N° de suivi ou URL de suivi requis.",
        emailSent: false,
      };
    }

    const applied = await applyGelatoTracking(orderId, {
      code: code ?? order.supplier.tracking,
      url: url ?? order.supplier.trackingUrl,
      carrier: carrier ?? order.supplier.carrier,
    });
    if (!applied) {
      return { ok: false, error: "Impossible de marquer expédiée.", emailSent: false };
    }
  } else if (hasInput) {
    await applyGelatoTracking(orderId, {
      code: code ?? order.supplier.tracking,
      url: url ?? order.supplier.trackingUrl,
      carrier: carrier ?? order.supplier.carrier,
    });
  }

  let emailSent = false;
  try {
    emailSent = await trySendOrderShipped(orderId);
  } catch {
    // ne pas faire échouer le marquage expédié
  }

  return { ok: true, emailSent };
}
