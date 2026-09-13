import { addDays, daysBetween } from "./dates";

export const TOUCH_NUMBERS = [1, 2, 3] as const;
export type TouchNumber = (typeof TOUCH_NUMBERS)[number];

/**
 * How many emails a customer gets and how far apart. Steve edits this from
 * /dashboard/settings; DEFAULT_CADENCE applies until he saves something.
 */
export interface Cadence {
  /** 1, 2 or 3 emails per customer. */
  emailCount: TouchNumber;
  /**
   * Days to wait after the previous email *actually went out* — gapDays[2] is
   * email 1 → email 2. Measured from the real send, not from startAt, so a
   * pause, a skipped weekend or the daily batch cap can delay an email but can
   * never squeeze two of them closer together than this.
   */
  gapDays: { 2: number; 3: number };
  /** An email due on Saturday or Sunday waits for Monday. */
  skipWeekends: boolean;
}

/** Day 0 / 5 / 14 — the cadence the system launched with. */
export const DEFAULT_CADENCE: Cadence = { emailCount: 3, gapDays: { 2: 5, 3: 9 }, skipWeekends: false };

/**
 * Bounds on a gap. The floor matches NiceJob's hard minimum between messages:
 * two emails on consecutive days read as automation, not a person following
 * up. The ceiling keeps a mistyped "90" from parking a sequence for months.
 */
export const MIN_GAP_DAYS = 2;
export const MAX_GAP_DAYS = 30;

/** An email that went out, as a YYYY-MM-DD date in the business timezone. */
export interface SentTouch {
  n: number;
  date: string;
}

/**
 * Gap between a job finishing and the first email, for jobs entered on a day
 * other than the day they finished. A job marked complete *on* the day it
 * finished sends same-day instead — see resolveStartAt.
 */
export const DEFAULT_DELAY_AFTER_COMPLETION = 2;

/**
 * A completion date older than this is treated as a backfill: the sequence
 * anchors to "tomorrow" instead of the (long past) completion date, so
 * importing a year of finished jobs doesn't fire every touch at once.
 */
export const BACKFILL_THRESHOLD_DAYS = 14;

/**
 * Decide when touch 1 should fire for a newly created request.
 * `completedAt` may be null (Steve doesn't always remember the exact day).
 */
export function resolveStartAt(completedAt: string | null, today: string): string {
  if (!completedAt) return addDays(today, 1);

  /**
   * Finished today — Steve is marking it complete at the walkthrough, so send
   * while the work is still in front of the customer. Review requests convert
   * best at the point of maximum satisfaction, and two days later that moment
   * has passed.
   *
   * Note the daily cron caps how literal "today" can be: a job entered after
   * the 10am Pacific run goes out the following morning.
   */
  if (completedAt === today) return today;

  const age = daysBetween(completedAt, today);
  if (age > BACKFILL_THRESHOLD_DAYS) return addDays(today, 1);

  const natural = addDays(completedAt, DEFAULT_DELAY_AFTER_COMPLETION);
  // Never schedule into the past.
  return daysBetween(natural, today) > 0 ? addDays(today, 1) : natural;
}

/** The touches this cadence sends: [1], [1, 2] or [1, 2, 3]. */
export function touchesFor(cadence: Cadence): TouchNumber[] {
  return TOUCH_NUMBERS.filter((n) => n <= cadence.emailCount);
}

/** Saturday or Sunday. Pure calendar arithmetic, no timezone involved. */
export function isWeekend(isoDate: string): boolean {
  const [y, m, d] = isoDate.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 0 || day === 6;
}

/** Whether the daily send runs at all on `date`. */
export function isSendDay(date: string, cadence: Cadence): boolean {
  return !(cadence.skipWeekends && isWeekend(date));
}

/** `date`, or the Monday after it when weekends are skipped. */
export function nextSendDay(date: string, cadence: Cadence): string {
  let d = date;
  while (!isSendDay(d, cadence)) d = addDays(d, 1);
  return d;
}

/**
 * The next email this request will get and the day it's due, or null when the
 * sequence has nothing left to send. The date can be in the past — that email
 * is overdue (behind the batch cap, or held by a pause).
 */
export function nextTouch(
  startAt: string,
  sent: SentTouch[],
  cadence: Cadence,
): { n: TouchNumber; date: string } | null {
  for (const n of touchesFor(cadence)) {
    if (sent.some((t) => t.n === n)) continue;

    if (n === 1) return { n, date: nextSendDay(startAt, cadence) };

    const previous = sent.find((t) => t.n === n - 1);
    // Can't schedule email 3 before email 2 has actually gone out.
    if (!previous) return null;
    return { n, date: nextSendDay(addDays(previous.date, cadence.gapDays[n]), cadence) };
  }
  return null;
}

/**
 * The touch to send today, or null if none is due. Pure — no database, so the
 * scheduling rules can be reasoned about (and tested) on their own.
 *
 * Returns at most ONE touch even when several are overdue, and because each
 * gap counts from the previous real send, an overdue sequence catches up with
 * its full spacing intact rather than on consecutive days.
 */
export function nextDueTouch(
  startAt: string,
  sent: SentTouch[],
  today: string,
  cadence: Cadence = DEFAULT_CADENCE,
): TouchNumber | null {
  // An overdue Thursday email still waits for Monday.
  if (!isSendDay(today, cadence)) return null;

  const next = nextTouch(startAt, sent, cadence);
  if (!next || daysBetween(next.date, today) < 0) return null;
  return next.n;
}

/** True once every touch in the cadence has gone out and the sequence should close. */
export function isSequenceComplete(sentTouchNumbers: number[], cadence: Cadence = DEFAULT_CADENCE): boolean {
  return touchesFor(cadence).every((n) => sentTouchNumbers.includes(n));
}

/**
 * Send dates for a customer whose job finished today, assuming each email goes
 * out on the day it's due. Drives the timeline on the settings page.
 */
export function exampleSchedule(today: string, cadence: Cadence): { n: TouchNumber; date: string }[] {
  const sent: SentTouch[] = [];
  const start = resolveStartAt(today, today);
  for (;;) {
    const next = nextTouch(start, sent, cadence);
    if (!next) return sent.map((t) => ({ n: t.n as TouchNumber, date: t.date }));
    sent.push(next);
  }
}
