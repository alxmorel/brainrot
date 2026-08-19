import type { AnalyticsEventName } from "@/models";

const SID_KEY = "br_sid";

export function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SID_KEY);
  if (!id) {
    id = `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem(SID_KEY, id);
  }
  return id;
}

export function track(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean | null>,
) {
  if (typeof window === "undefined") return;
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: getSessionId(),
      name,
      path: window.location.pathname,
      payload,
    }),
    keepalive: true,
  });
}
