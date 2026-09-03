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
  mystery: boolean;
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
  deliveredEmailSentAt: string | null;
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

export type OpsFunnelStepId =
  | "visitors"
  | "compose"
  | "select"
  | "cart"
  | "checkout"
  | "order";

export type OpsFunnelStepStat = {
  id: string;
  label: string;
  count: number;
  ofTotal: number;
  ofPrevious: number;
  dropped: number;
  dropRate: number;
  skip: number;
};

export type OpsFunnelInsight = {
  worstIndex: number;
  worstFrom: string;
  worstTo: string;
  worstDropped: number;
  worstDropRate: number;
  visitorToOrder: number;
  visitorToCart: number;
  cartToOrder: number;
  checkoutToOrder: number;
  abandonedCart: number;
  abandonedCheckout: number;
  checkoutErrors: number;
  cartWithoutCompose: number;
  rpvCents: number;
};

export type OpsFunnelSlice = {
  label: string;
  steps: OpsFunnelStepStat[];
  insight: OpsFunnelInsight;
};

export type OpsBrainrotPerf = {
  brainrotId: string;
  name: string;
  selects: number;
  carts: number;
  sold: number;
  cents: number;
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
  pageViews: number;
  newVisitors: number;
  returningVisitors: number;
  compose: number;
  carts: number;
  checkouts: number;
  orders: number;
  paidOrders: number;
  cents: number;
};

export type OpsRankedCount = { label: string; count: number };

export type OpsPageStat = {
  path: string;
  views: number;
  visitors: number;
  avgMs: number | null;
  exits: number;
  exitRate: number;
};

export type OpsLandingStat = {
  path: string;
  landings: number;
  bounces: number;
  bounceRate: number;
};

export type OpsAudience = {
  pageViews: number;
  visitors: number;
  visits: number;
  newVisitors: number;
  returningVisitors: number;
  bounceRate: number;
  avgPageMs: number | null;
  avgVisitMs: number | null;
  pagesPerVisit: number;
  multiDayVisitors: number;
  multiDayRate: number;
  d1Rate: number | null;
  d1Eligible: number;
  pages: OpsPageStat[];
  landings: OpsLandingStat[];
  countries: OpsRankedCount[];
  cities: OpsRankedCount[];
  devices: OpsRankedCount[];
  browsers: OpsRankedCount[];
  sources: OpsRankedCount[];
  langs: OpsRankedCount[];
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
    funnelSteps: OpsFunnelStepStat[];
    funnelInsight: OpsFunnelInsight;
    funnelDevices: OpsFunnelSlice[];
    funnelSources: OpsFunnelSlice[];
    funnelPaths: OpsFunnelSlice[];
    conversionRate: number;
    abandonedCheckout: number;
    topBrainrots: { brainrotId: string; name: string; count: number }[];
    brainrots: OpsBrainrotPerf[];
    totalEvents: number;
    sessionsWithCart: number;
    audience: OpsAudience;
  };
  previous: {
    from: string;
    to: string;
    revenue: { totalCents: number; orderCount: number };
    visitors: number;
    visitorToOrder: number;
    rpvCents: number;
  };
  byDay: OpsDayPoint[];
  ordersByStatus: Record<string, number>;
  totals: { orders: number; events: number; sessionsWithCart: number };
};
