export type GelatoTrackingPayload = {
  orderReferenceId: string | null;
  gelatoOrderId: string | null;
  trackingCode: string | null;
  trackingUrl: string | null;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstFulfillmentTracking(items: unknown): {
  trackingCode: string | null;
  trackingUrl: string | null;
} {
  if (!Array.isArray(items)) {
    return { trackingCode: null, trackingUrl: null };
  }
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const fulfillments = (item as { fulfillments?: unknown }).fulfillments;
    if (!Array.isArray(fulfillments)) continue;
    for (const fulfillment of fulfillments) {
      if (!fulfillment || typeof fulfillment !== "object") continue;
      const trackingCode = str(
        (fulfillment as { trackingCode?: unknown }).trackingCode,
      );
      const trackingUrl = str(
        (fulfillment as { trackingUrl?: unknown }).trackingUrl,
      );
      if (trackingCode || trackingUrl) {
        return { trackingCode, trackingUrl };
      }
    }
  }
  return { trackingCode: null, trackingUrl: null };
}

export function parseGelatoTrackingEvent(
  body: unknown,
): GelatoTrackingPayload | null {
  if (!body || typeof body !== "object") return null;
  const event = str((body as { event?: unknown }).event);
  if (
    event !== "order_item_tracking_code_updated" &&
    event !== "order_status_updated"
  ) {
    return null;
  }

  const orderReferenceId = str(
    (body as { orderReferenceId?: unknown }).orderReferenceId,
  );
  const gelatoOrderId = str((body as { orderId?: unknown }).orderId);

  if (event === "order_item_tracking_code_updated") {
    return {
      orderReferenceId,
      gelatoOrderId,
      trackingCode: str((body as { trackingCode?: unknown }).trackingCode),
      trackingUrl: str((body as { trackingUrl?: unknown }).trackingUrl),
    };
  }

  const { trackingCode, trackingUrl } = firstFulfillmentTracking(
    (body as { items?: unknown }).items,
  );
  if (!trackingCode && !trackingUrl) return null;

  return {
    orderReferenceId,
    gelatoOrderId,
    trackingCode,
    trackingUrl,
  };
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
