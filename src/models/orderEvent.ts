export type OrderEventKind =
  | "paid"
  | "fulfillment_sent"
  | "fulfillment_failed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "email_confirmation"
  | "email_shipped"
  | "email_delivered"
  | "ops_action";

export interface OrderEventRecord {
  id: string;
  orderId: string;
  kind: OrderEventKind;
  detail?: Record<string, string | number | boolean | null> | null;
  createdAt: string;
}
