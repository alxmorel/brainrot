const MAX_KEYS = 24;
const MAX_STR = 200;
const KEY = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/;

export type AnalyticsPayload = Record<string, string | number | boolean | null>;

export function sanitizePayload(raw: unknown): AnalyticsPayload | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: AnalyticsPayload = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    if (!KEY.test(key)) continue;
    if (typeof value === "string") out[key] = value.slice(0, MAX_STR);
    else if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "boolean" || value === null) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function geoFromHeaders(headers: Headers): AnalyticsPayload {
  const countryRaw =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("cloudfront-viewer-country") ??
    headers.get("x-country-code") ??
    "";
  const country = countryRaw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
  if (!country || country === "XX" || country === "T1") return {};

  let city = "";
  const cityRaw = headers.get("x-vercel-ip-city");
  if (cityRaw) {
    try {
      city = decodeURIComponent(cityRaw).slice(0, 80);
    } catch {
      city = cityRaw.slice(0, 80);
    }
  }

  const region = (headers.get("x-vercel-ip-country-region") ?? "").slice(0, 8);
  return {
    country,
    ...(region ? { region } : {}),
    ...(city ? { city } : {}),
  };
}

export function parseUserAgent(ua: string): {
  device: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
} {
  const s = ua.toLowerCase();
  let os = "autre";
  if (s.includes("android")) os = "Android";
  else if (s.includes("iphone") || s.includes("ipad") || s.includes("ios")) os = "iOS";
  else if (s.includes("mac os") || s.includes("macos") || s.includes("macintosh")) os = "macOS";
  else if (s.includes("windows")) os = "Windows";
  else if (s.includes("linux")) os = "Linux";

  let browser = "autre";
  if (s.includes("edg/") || s.includes("edgios/")) browser = "Edge";
  else if (s.includes("opr/") || s.includes("opera")) browser = "Opera";
  else if (s.includes("firefox/") || s.includes("fxios/")) browser = "Firefox";
  else if (s.includes("chrome/") || s.includes("crios/")) browser = "Chrome";
  else if (s.includes("safari/")) browser = "Safari";

  let device: "mobile" | "tablet" | "desktop" = "desktop";
  if (s.includes("ipad") || (s.includes("android") && !s.includes("mobile"))) {
    device = "tablet";
  } else if (s.includes("mobi") || s.includes("iphone") || s.includes("android")) {
    device = "mobile";
  }

  return { os, browser, device };
}

const TZ_COUNTRY: Record<string, string> = {
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Brussels": "BE",
  "Europe/Amsterdam": "NL",
  "Europe/Zurich": "CH",
  "Europe/Vienna": "AT",
  "Europe/Lisbon": "PT",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Luxembourg": "LU",
  "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ",
  "Europe/Budapest": "HU",
  "Europe/Stockholm": "SE",
  "Europe/Copenhagen": "DK",
  "Europe/Oslo": "NO",
  "Europe/Helsinki": "FI",
  "Europe/Athens": "GR",
  "Europe/Bucharest": "RO",
  "Europe/Sofia": "BG",
  "Europe/Zagreb": "HR",
  "Europe/Ljubljana": "SI",
  "Europe/Bratislava": "SK",
  "Europe/Vilnius": "LT",
  "Europe/Riga": "LV",
  "Europe/Tallinn": "EE",
  "Europe/Malta": "MT",
  "Europe/Nicosia": "CY",
  "Atlantic/Reykjavik": "IS",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Sao_Paulo": "BR",
  "Africa/Casablanca": "MA",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Australia/Sydney": "AU",
  "Asia/Tokyo": "JP",
};

export function countryFromTz(tz: string | null): string | null {
  if (!tz) return null;
  return TZ_COUNTRY[tz] ?? null;
}
