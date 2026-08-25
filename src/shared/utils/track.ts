import type { AnalyticsEventName } from "@/models";

const SID_KEY = "br_sid";
const CONSENT_KEY = "br_consent";
export const CONSENT_EVENT = "br-consent";

export type ConsentChoice = "all" | "necessary";

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (raw === "all" || raw === "necessary") return raw;
  return null;
}

export function setConsent(choice: ConsentChoice) {
  localStorage.setItem(CONSENT_KEY, choice);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function hasAnalyticsConsent() {
  return getConsent() === "all";
}

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
  if (name !== "consent_choice" && !hasAnalyticsConsent()) return;
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
