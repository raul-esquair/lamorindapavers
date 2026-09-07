/**
 * Timezone primitives for appointment scheduling.
 *
 * The review scheduler works in whole days, so lib/reviews/dates.ts can get
 * away with YYYY-MM-DD strings. Appointments need wall-clock times, which
 * means confronting the thing day-granularity lets you ignore: the offset
 * between local time and UTC is not constant. "9am next Tuesday" is a
 * different instant depending on which side of a DST boundary it falls on,
 * and Netlify runs this on UTC infrastructure.
 *
 * So the representation here is deliberately split:
 *   - an **instant** is epoch milliseconds — unambiguous, safe to compare
 *   - a **local date** is YYYY-MM-DD in the business timezone
 *   - a **local time** is minutes from local midnight
 *
 * Anything crossing a boundary (the database, Google Calendar, an SMS) uses
 * instants. Anything a human reasons about ("Steve works 8 to 4") uses the
 * local pair. Conversion happens here and nowhere else.
 */

import { BUSINESS_TZ } from "@/lib/reviews/dates";

export { BUSINESS_TZ };

/** 0 = Sunday … 6 = Saturday, matching Date#getUTCDay. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const MINUTE_MS = 60_000;

/**
 * hourCycle "h23" rather than hour12:false — the latter can yield "24" for
 * midnight in some ICU builds, which would silently shift a day.
 */
const PARTS_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function partsOf(instant: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of PARTS_FMT.formatToParts(new Date(instant))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return out;
}

/** Milliseconds the business timezone is ahead of UTC at a given instant. */
function offsetMsAt(instant: number): number {
  const p = partsOf(instant);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asIfUtc - instant;
}

/**
 * Convert a local date + minutes-from-midnight into an instant.
 *
 * Two passes: the offset is looked up at a first guess, then re-checked at
 * the resulting instant. One refinement is enough for a 1-hour DST shift —
 * the guess can only be wrong by the size of the transition.
 *
 * Times that don't exist locally (2:30am on spring-forward day) resolve to
 * the instant one hour later rather than throwing. Callers generate slots
 * from business hours, which never straddle 2am, so this is a safety net
 * rather than a path anything relies on.
 */
export function instantFromLocal(isoDate: string, minutesFromMidnight: number): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  const naiveUtc = Date.UTC(y, m - 1, d) + minutesFromMidnight * MINUTE_MS;

  const firstGuess = naiveUtc - offsetMsAt(naiveUtc);
  const refined = naiveUtc - offsetMsAt(firstGuess);
  return refined;
}

export interface LocalParts {
  /** YYYY-MM-DD in the business timezone. */
  date: string;
  weekday: Weekday;
  /** Minutes from local midnight. */
  minutes: number;
}

export function localPartsOf(instant: number): LocalParts {
  const p = partsOf(instant);
  const date = `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  return { date, weekday: weekdayOf(date), minutes: p.hour * 60 + p.minute };
}

/**
 * Weekday of a YYYY-MM-DD calendar date. Safe to use UTC here: the string
 * carries no time, so there is no offset to get wrong.
 */
export function weekdayOf(isoDate: string): Weekday {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Weekday;
}

const DAY_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  weekday: "long",
  month: "short",
  day: "numeric",
});

const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TZ,
  hour: "numeric",
  minute: "2-digit",
});

/** "Thursday, Sep 10" */
export function formatDay(instant: number): string {
  return DAY_FMT.format(new Date(instant));
}

/**
 * "2:00 PM" — lowercased to "2:00 pm" because these go out over SMS, where
 * a person writes "2pm", not "2:00 PM".
 */
export function formatTime(instant: number): string {
  return TIME_FMT.format(new Date(instant)).replace(/\s?([AP])M$/i, (_, p: string) =>
    `${p.toLowerCase()}m`,
  );
}

/** "Thursday, Sep 10 at 2:00pm" */
export function formatInstant(instant: number): string {
  return `${formatDay(instant)} at ${formatTime(instant)}`;
}
