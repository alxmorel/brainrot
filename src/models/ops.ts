import type { Order, OrderStatus } from "./order";
import type { OrderEventRecord } from "./orderEvent";

export type OpsOrderLine = {
  brainrotId: string;
  name: string;
  size: string;
  color: string;
  colorLabel: string;
  quantity: number;
  lineCents: number;
  printImage: string;
};

export type OpsOrderSummary = {
  id: string;
  status: OrderStatus;
  email: string;
  name: string;
  totalCents: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
};

export type OpsOrderDetail = {
  id: string;
  sessionId: string;
  status: OrderStatus;
  shipping: Order["shipping"];
  supplier: Order["supplier"];
  items: OpsOrderLine[];
  totalCents: number;
  stripeCheckoutId: string | null;
  confirmationEmailSentAt: string | null;
  shippingEmailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  events: OrderEventRecord[];
};

export type OpsSessionSummary = {
  sessionId: string;
  firstAt: string;
  lastAt: string;
  eventCount: number;
  eventNames: string[];
  orderId: string | null;
  hasCart: boolean;
  hasCheckout: boolean;
  hasOrder: boolean;
};

export type OpsSessionDetail = {
  sessionId: string;
  events: {
    id: string;
    name: string;
    path: string;
    payload: Record<string, unknown> | null;
    createdAt: string;
  }[];
  order: OpsOrderSummary | null;
};
