/**
 * All scheduling is done in plain YYYY-MM-DD strings anchored to the
 * business's own timezone. The scheduler runs on UTC infrastructure, so
 * using Date objects here would make "two days after completion" land on
 * different calendar days depending on the hour the cron fired.
 */
export const BUSINESS_TZ = "America/Los_Angeles";

const FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Today's date in the business's timezone, as YYYY-MM-DD. */
export function todayInBusinessTz(now: Date = new Date()): string {
  return FORMATTER.format(now);
}

/** Shift a YYYY-MM-DD string by whole days without timezone drift. */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`. Negative if `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const parse = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((parse(to) - parse(from)) / 86_400_000);
}
