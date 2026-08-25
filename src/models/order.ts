export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "validated"
  | "fulfillment_queued"
  | "fulfillment_sent"
  | "fulfillment_failed"
  | "shipped"
  | "cancelled"
  | "failed";

export function isFulfillmentFailed(status: OrderStatus) {
  return status === "fulfillment_failed" || status === "failed";
}

export function needsGelatoRetry(status: OrderStatus) {
  return isFulfillmentFailed(status) || status === "validated";
}

export interface ShippingAddress {
  name: string;
  email: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  brainrotId: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  printImage: string;
}

export interface Order {
  id: string;
  sessionId: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: ShippingAddress;
  supplier: {
    provider: "gelato";
    productId: string | null;
    sku: string | null;
    externalId: string | null;
    tracking: string | null;
    trackingUrl: string | null;
    lastError: string | null;
  };
  createdAt: string;
  updatedAt: string;
}
