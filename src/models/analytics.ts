export type AnalyticsEventName =
  | "page_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "preview_open"
  | "trait_select"
  | "begin_checkout"
  | "order_placed";

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  name: AnalyticsEventName;
  path: string;
  payload?: Record<string, string | number | boolean | null>;
  createdAt: string;
}
