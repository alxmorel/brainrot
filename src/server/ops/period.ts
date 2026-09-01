const PARIS = "Europe/Paris";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function parisYmd(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parisOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    num("year"),
    num("month") - 1,
    num("day"),
    num("hour"),
    num("minute"),
    num("second"),
  );
  return asUtc - instant.getTime();
}

export function parisDayStartUtc(ymd: string): Date {
  const utcGuess = new Date(`${ymd}T00:00:00.000Z`);
  const offset = parisOffsetMs(utcGuess);
  let instant = new Date(utcGuess.getTime() - offset);
  const offset2 = parisOffsetMs(instant);
  if (offset2 !== offset) {
    instant = new Date(utcGuess.getTime() - offset2);
  }
  return instant;
}

export function addYmd(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days));
  return `${utc.getUTCFullYear()}-${pad(utc.getUTCMonth() + 1)}-${pad(utc.getUTCDate())}`;
}

export function enumerateYmd(from: string, toInclusive: string): string[] {
  const days: string[] = [];
  let cursor = from;
  while (cursor <= toInclusive) {
    days.push(cursor);
    cursor = addYmd(cursor, 1);
  }
  return days;
}

export function parsePeriodDays(
  value: string | null,
  fallback = 7,
  max = 90,
) {
  const days = Number(value ?? fallback);
  if (!Number.isFinite(days) || days < 1) return fallback;
  return Math.min(Math.floor(days), max);
}

export function calendarPeriod(dayCount: number, now = new Date()) {
  const today = parisYmd(now);
  const from = addYmd(today, -(dayCount - 1));
  return {
    since: parisDayStartUtc(from),
    from,
    to: today,
    days: enumerateYmd(from, today),
  };
}
