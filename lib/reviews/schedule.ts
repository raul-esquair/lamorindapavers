import { addDays, daysBetween } from "./dates";

/**
 * Days after `startAt` that each touch fires. Touch 1 is the anchor, so the
 * full cadence relative to a job finishing (with startAt = completed + 2) is
 * day 2, day 7, day 16.
 */
export const TOUCH_OFFSET_DAYS: Record<1 | 2 | 3, number> = { 1: 0, 2: 5, 3: 14 };

export const TOUCH_NUMBERS = [1, 2, 3] as const;
export type TouchNumber = (typeof TOUCH_NUMBERS)[number];

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

/** The date a given touch is due for a request starting on `startAt`. */
export function touchDueDate(startAt: string, n: TouchNumber): string {
  return addDays(startAt, TOUCH_OFFSET_DAYS[n]);
}

/**
 * The next touch to send, or null if none is due. Pure — no database, so the
 * scheduling rules can be reasoned about (and tested) on their own.
 *
 * Returns at most ONE touch even when several are overdue: a request that
 * somehow fell behind catches up a day at a time rather than sending three
 * emails at once.
 */
export function nextDueTouch(
  startAt: string,
  sentTouchNumbers: number[],
  today: string,
): TouchNumber | null {
  for (const n of TOUCH_NUMBERS) {
    if (sentTouchNumbers.includes(n)) continue;
    const due = touchDueDate(startAt, n);
    // Not due yet — and no later touch can be due either.
    if (daysBetween(due, today) < 0) return null;
    return n;
  }
  return null;
}

/** True once every touch has gone out and the sequence should close. */
export function isSequenceComplete(sentTouchNumbers: number[]): boolean {
  return TOUCH_NUMBERS.every((n) => sentTouchNumbers.includes(n));
}
