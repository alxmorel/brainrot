export type OrderEventKind =
  | "paid"
  | "fulfillment_sent"
  | "fulfillment_failed"
  | "shipped"
  | "cancelled"
  | "email_confirmation"
  | "email_shipped"
  | "ops_action";

export interface OrderEventRecord {
  id: string;
  orderId: string;
  kind: OrderEventKind;
  detail?: Record<string, string | number | boolean | null> | null;
  createdAt: string;
}
