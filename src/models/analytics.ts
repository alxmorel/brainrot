export type AnalyticsEventName =
  | "page_view"
  | "view_create"
  | "add_to_cart"
  | "remove_from_cart"
  | "preview_open"
  | "trait_select"
  | "brainrot_select"
  | "size_change"
  | "color_change"
  | "quantity_change"
  | "view_cart"
  | "begin_checkout"
  | "checkout_error"
  | "consent_choice"
  | "order_placed";

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  name: AnalyticsEventName;
  path: string;
  payload?: Record<string, string | number | boolean | null>;
  createdAt: string;
}
