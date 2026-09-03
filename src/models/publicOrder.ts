import type { OrderStatus } from "./order";

export type PublicOrderLine = {
  brainrotId: string;
  name: string;
  size: string;
  color: string;
  colorLabel: string;
  quantity: number;
  lineCents: number;
  mystery: boolean;
};

export type PublicOrderTimelineStepId =
  | "confirmed"
  | "production"
  | "shipped"
  | "delivered";

export type PublicOrderTimelineStep = {
  id: PublicOrderTimelineStepId;
  label: string;
  done: boolean;
  current: boolean;
};

export type PublicOrderView = {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  isPaid: boolean;
  email: string | null;
  items: PublicOrderLine[];
  totalCents: number;
  discountCents: number;
  cashbackGrantedCents: number;
  tracking: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  etaLabel: string | null;
  timeline: PublicOrderTimelineStep[];
};
