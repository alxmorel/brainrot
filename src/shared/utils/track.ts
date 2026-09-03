import type { AnalyticsEventName } from "@/models";

const SID_KEY = "br_sid";
const SRC_KEY = "br_src";
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

type VisitSource = {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
};

function readVisitSource(): VisitSource {
  try {
    const stored = sessionStorage.getItem(SRC_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === "object") return parsed as VisitSource;
    }
  } catch {
    /* ignore */
  }

  const source: VisitSource = {};
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  if (utmSource) source.source = utmSource.slice(0, 80);
  if (utmMedium) source.medium = utmMedium.slice(0, 80);
  if (utmCampaign) source.campaign = utmCampaign.slice(0, 80);

  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (url.host && url.host !== window.location.host) {
        source.referrer = url.host.slice(0, 120);
      }
    }
  } catch {
    /* ignore */
  }

  if (source.source || source.referrer) {
    try {
      sessionStorage.setItem(SRC_KEY, JSON.stringify(source));
    } catch {
      /* ignore */
    }
  }
  return source;
}

function visitContext(): Record<string, string | number | boolean | null> {
  const source = readVisitSource();
  return {
    ...(source.source ? { source: source.source } : {}),
    ...(source.medium ? { medium: source.medium } : {}),
    ...(source.campaign ? { campaign: source.campaign } : {}),
    ...(source.referrer ? { referrer: source.referrer } : {}),
    lang: navigator.language?.slice(0, 16) ?? "",
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    viewportW: window.innerWidth,
  };
}

export function track(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean | null>,
) {
  if (typeof window === "undefined") return;
  if (name !== "consent_choice" && !hasAnalyticsConsent()) return;
  const context = name === "page_view" || name === "page_leave" ? visitContext() : undefined;
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: getSessionId(),
      name,
      path: window.location.pathname,
      payload: { ...context, ...payload },
    }),
    keepalive: true,
  });
}
