import type { OpsAudience, OpsPageStat, OpsRankedCount } from "@/models";
import { countryFromTz } from "@/server/analytics-context";
import { addYmd, parisYmd } from "@/server/ops/period";

export type AudienceEvent = {
  sessionId: string;
  name: string;
  path: string;
  payload: unknown;
  createdAt: Date;
};

const VISIT_GAP_MS = 30 * 60 * 1000;
const MAX_PAGE_MS = 30 * 60 * 1000;
const ENGAGED = new Set([
  "view_create",
  "add_to_cart",
  "begin_checkout",
  "brainrot_select",
  "trait_select",
  "preview_open",
  "cta_composer",
  "cta_bande",
]);

export const DEVICE_LABEL: Record<string, string> = {
  mobile: "Mobile",
  tablet: "Tablette",
  desktop: "Ordinateur",
};

function strField(payload: unknown, key: string): string | null {
  if (!payload || typeof payload !== "object") return null;
  const value = (payload as Record<string, unknown>)[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function numField(payload: unknown, key: string): number | null {
  if (!payload || typeof payload !== "object") return null;
  const value = (payload as Record<string, unknown>)[key];
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function top(map: Map<string, number>, n = 8): OpsRankedCount[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

export function groupByVisitor(events: AudienceEvent[]) {
  const map = new Map<string, AudienceEvent[]>();
  for (const event of events) {
    const list = map.get(event.sessionId);
    if (list) list.push(event);
    else map.set(event.sessionId, [event]);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  return map;
}

export function splitVisits(perVisitor: Map<string, AudienceEvent[]>) {
  const visits: AudienceEvent[][] = [];
  for (const list of perVisitor.values()) {
    let bucket: AudienceEvent[] = [];
    for (const event of list) {
      const prev = bucket[bucket.length - 1];
      if (prev && event.createdAt.getTime() - prev.createdAt.getTime() > VISIT_GAP_MS) {
        visits.push(bucket);
        bucket = [];
      }
      bucket.push(event);
    }
    if (bucket.length > 0) visits.push(bucket);
  }
  return visits;
}

export function firstAttr(
  events: AudienceEvent[],
  key: string,
  names = ["page_view", "page_leave"],
): string | null {
  for (const event of events) {
    if (!names.includes(event.name)) continue;
    const value = strField(event.payload, key);
    if (value) return value;
  }
  for (const event of events) {
    const value = strField(event.payload, key);
    if (value) return value;
  }
  return null;
}

function visitDurationMs(events: AudienceEvent[]): number | null {
  let fromLeaves = 0;
  let leaveCount = 0;
  for (const event of events) {
    if (event.name !== "page_leave") continue;
    const ms = numField(event.payload, "durationMs");
    if (ms == null || ms < 0) continue;
    fromLeaves += Math.min(ms, MAX_PAGE_MS);
    leaveCount += 1;
  }
  if (leaveCount > 0) return fromLeaves;
  if (events.length < 2) return null;
  const span =
    events[events.length - 1]!.createdAt.getTime() - events[0]!.createdAt.getTime();
  if (span <= 0) return null;
  return Math.min(span, MAX_PAGE_MS);
}

function isBounce(events: AudienceEvent[]) {
  const pageViews = events.filter((event) => event.name === "page_view").length;
  if (pageViews > 1) return false;
  return !events.some((event) => ENGAGED.has(event.name));
}

export function sourceOf(events: AudienceEvent[]): string {
  const utm = firstAttr(events, "source");
  if (utm) return utm;
  const referrer = firstAttr(events, "referrer");
  if (referrer) return referrer;
  return "Direct";
}

export function buildAudience(
  events: AudienceEvent[],
  returningIds: Set<string>,
  ymds: string[],
): OpsAudience {
  const perVisitor = groupByVisitor(events);
  const visits = splitVisits(perVisitor);
  const pageViews = events.filter((event) => event.name === "page_view").length;
  const visitors = perVisitor.size;

  const countries = new Map<string, number>();
  const cities = new Map<string, number>();
  const devices = new Map<string, number>();
  const browsers = new Map<string, number>();
  const sources = new Map<string, number>();
  const langs = new Map<string, number>();
  const pageViewsByPath = new Map<string, number>();
  const pageVisitorsByPath = new Map<string, Set<string>>();
  const pageMs = new Map<string, { total: number; n: number }>();
  const pageExits = new Map<string, number>();
  const landingBounces = new Map<string, { landings: number; bounces: number }>();

  let multiDay = 0;
  let d1Eligible = 0;
  let d1Returned = 0;
  const lastYmd = ymds[ymds.length - 1];

  for (const [sessionId, list] of perVisitor) {
    const country =
      firstAttr(list, "country") ?? countryFromTz(firstAttr(list, "tz"));
    if (country) bump(countries, country);
    const city = firstAttr(list, "city");
    if (city) bump(cities, country ? `${city} (${country})` : city);
    const device = firstAttr(list, "device");
    if (device) bump(devices, DEVICE_LABEL[device] ?? device);
    const browser = firstAttr(list, "browser");
    if (browser) bump(browsers, browser);
    bump(sources, sourceOf(list));
    const lang = firstAttr(list, "lang");
    if (lang) bump(langs, lang.slice(0, 2).toLowerCase());

    const days = new Set(list.map((event) => parisYmd(event.createdAt)));
    if (days.size >= 2) multiDay += 1;

    if (!returningIds.has(sessionId) && lastYmd) {
      const firstDay = [...days].sort()[0];
      if (firstDay && firstDay < lastYmd) {
        d1Eligible += 1;
        if (days.has(addYmd(firstDay, 1))) d1Returned += 1;
      }
    }
  }

  for (const event of events) {
    if (event.name === "page_view") {
      bump(pageViewsByPath, event.path);
      let set = pageVisitorsByPath.get(event.path);
      if (!set) {
        set = new Set();
        pageVisitorsByPath.set(event.path, set);
      }
      set.add(event.sessionId);
    }
    if (event.name === "page_leave") {
      const ms = numField(event.payload, "durationMs");
      if (ms == null || ms < 0) continue;
      const current = pageMs.get(event.path) ?? { total: 0, n: 0 };
      current.total += Math.min(ms, MAX_PAGE_MS);
      current.n += 1;
      pageMs.set(event.path, current);
    }
  }

  let bounceCount = 0;
  const visitDurations: number[] = [];
  let pagesInVisits = 0;
  for (const visit of visits) {
    if (isBounce(visit)) bounceCount += 1;
    const duration = visitDurationMs(visit);
    if (duration != null) visitDurations.push(duration);
    const pageViews = visit.filter((event) => event.name === "page_view");
    pagesInVisits += pageViews.length;
    const landing = pageViews[0]?.path;
    const exit = pageViews[pageViews.length - 1]?.path;
    if (landing) {
      const row = landingBounces.get(landing) ?? { landings: 0, bounces: 0 };
      row.landings += 1;
      if (isBounce(visit)) row.bounces += 1;
      landingBounces.set(landing, row);
    }
    if (exit) bump(pageExits, exit);
  }

  const pages: OpsPageStat[] = [...pageViewsByPath.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([path, views]) => {
      const ms = pageMs.get(path);
      const exits = pageExits.get(path) ?? 0;
      return {
        path,
        views,
        visitors: pageVisitorsByPath.get(path)?.size ?? 0,
        avgMs: ms && ms.n > 0 ? Math.round(ms.total / ms.n) : null,
        exits,
        exitRate: views > 0 ? Math.round((exits / views) * 100) : 0,
      };
    });

  const landings = [...landingBounces.entries()]
    .sort((a, b) => b[1].landings - a[1].landings)
    .slice(0, 10)
    .map(([path, row]) => ({
      path,
      landings: row.landings,
      bounces: row.bounces,
      bounceRate: row.landings > 0 ? Math.round((row.bounces / row.landings) * 100) : 0,
    }));

  const pageDurations = [...pageMs.values()];
  const pageMsTotal = pageDurations.reduce((sum, row) => sum + row.total, 0);
  const pageMsN = pageDurations.reduce((sum, row) => sum + row.n, 0);

  return {
    pageViews,
    visitors,
    visits: visits.length,
    newVisitors: [...perVisitor.keys()].filter((id) => !returningIds.has(id)).length,
    returningVisitors: [...perVisitor.keys()].filter((id) => returningIds.has(id)).length,
    bounceRate: visits.length > 0 ? Math.round((bounceCount / visits.length) * 100) : 0,
    avgPageMs: pageMsN > 0 ? Math.round(pageMsTotal / pageMsN) : null,
    avgVisitMs:
      visitDurations.length > 0
        ? Math.round(visitDurations.reduce((a, b) => a + b, 0) / visitDurations.length)
        : null,
    pagesPerVisit:
      visits.length > 0 ? Math.round((pagesInVisits / visits.length) * 10) / 10 : 0,
    multiDayVisitors: multiDay,
    multiDayRate: visitors > 0 ? Math.round((multiDay / visitors) * 100) : 0,
    d1Rate: d1Eligible > 0 ? Math.round((d1Returned / d1Eligible) * 100) : null,
    d1Eligible,
    pages,
    landings,
    countries: top(countries),
    cities: top(cities),
    devices: top(devices, 4),
    browsers: top(browsers, 5),
    sources: top(sources),
    langs: top(langs, 6),
  };
}
