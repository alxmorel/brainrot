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
  lastError: string | null;
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

export type OpsFunnelStep =
  | "page_view"
  | "view_create"
  | "add_to_cart"
  | "begin_checkout"
  | "order_placed";

export type OpsFunnelCounts = Record<OpsFunnelStep, number>;

export type OpsDayPoint = {
  day: string;
  visits: number;
  compose: number;
  carts: number;
  checkouts: number;
  orders: number;
  paidOrders: number;
  cents: number;
};

export type OpsReportPayload = {
  periodDays: number;
  from: string;
  to: string;
  revenue: {
    totalCents: number;
    orderCount: number;
    averageCents: number;
  };
  analytics: {
    counts: Record<string, number>;
    funnel: OpsFunnelCounts;
    funnelRates: OpsFunnelCounts;
    conversionRate: number;
    abandonedCheckout: number;
    topBrainrots: { brainrotId: string; name: string; count: number }[];
    totalEvents: number;
    sessionsWithCart: number;
  };
  byDay: OpsDayPoint[];
  ordersByStatus: Record<string, number>;
  totals: { orders: number; events: number; sessionsWithCart: number };
};
