/**
 * Which estimate-visit slots to offer a lead.
 *
 * PURE — no database, no Google Calendar, no fetch. Callers pass in busy
 * intervals and already-booked visits; this module decides what to propose.
 * Same discipline as lib/reviews/schedule.ts, for the same reason: the rules
 * that decide what customers get offered are the part worth being able to
 * assert in CI, and they are exactly the part an API client makes untestable.
 *
 * The pipeline, in order:
 *
 *   generateSlots      every slot the working-hours rules allow
 *   → removeBusy       minus Google's busy blocks, padded by travel buffer
 *   → applyDailyCapacity   minus days already at their visit cap
 *   → rankSlots        best first, weighing travel clustering and soonness
 *   → diversifyByDay   at most one per day, so three offers ≠ one afternoon
 *
 * `proposeSlots` composes all five.
 *
 * A note on what Google is for: the calendar is a SUBTRACTIVE filter, never
 * the source of slots. An empty Tuesday afternoon does not mean Steve wants
 * a site visit then — free/busy answers "is he committed?", and only the
 * rules below answer "is he bookable?".
 */

import { addDays, daysBetween } from "@/lib/reviews/dates";
import {
  MINUTE_MS,
  type Weekday,
  instantFromLocal,
  localPartsOf,
  weekdayOf,
  formatDay,
  formatTime,
} from "./time";

/* -------------------------------------------------------------------------- *
 * Travel zones
 * -------------------------------------------------------------------------- */

/**
 * The service area spans Contra Costa and parts of Alameda. Lafayette to
 * Moraga is ten minutes; Lafayette to Livermore is forty-five. Without
 * clustering, an optimiser that only knows "free at 2pm" will happily book
 * Steve a day that is mostly driving.
 */
export type TravelZone =
  | "lamorinda"
  | "central"
  | "diablo-valley"
  | "east-county"
  | "inner-east-bay"
  | "unknown";

/**
 * ⚠️ Approximate, and worth tuning against Steve's actual routes — Alamo is
 * grouped with Walnut Creek here but is arguably closer to Danville. The
 * check script asserts every city in company.serviceArea has an entry, so
 * adding a city to company.ts without zoning it fails CI rather than
 * silently landing in "unknown".
 */
const ZONE_BY_CITY: Record<string, TravelZone> = {
  // Lamorinda
  lafayette: "lamorinda",
  moraga: "lamorinda",
  orinda: "lamorinda",
  canyon: "lamorinda",
  // Central Contra Costa
  "walnut creek": "central",
  "pleasant hill": "central",
  concord: "central",
  martinez: "central",
  clayton: "central",
  alamo: "central",
  lafayette_ridge: "central",
  // Diablo Valley / Tri-Valley
  danville: "diablo-valley",
  "san ramon": "diablo-valley",
  dublin: "diablo-valley",
  pleasanton: "diablo-valley",
  // East County
  pittsburg: "east-county",
  antioch: "east-county",
  brentwood: "east-county",
  oakley: "east-county",
  // Inner East Bay
  berkeley: "inner-east-bay",
  oakland: "inner-east-bay",
  piedmont: "inner-east-bay",
  albany: "inner-east-bay",
  emeryville: "inner-east-bay",
  kensington: "inner-east-bay",
  "el cerrito": "inner-east-bay",
  richmond: "inner-east-bay",
};

function normaliseCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/,\s*(ca|california)\b.*$/, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function zoneForCity(city: string | null | undefined): TravelZone {
  if (!city) return "unknown";
  return ZONE_BY_CITY[normaliseCity(city)] ?? "unknown";
}

/**
 * Pull a travel zone out of a full street address.
 *
 * The quote form asks for an address, not a city, so the city has to be
 * recovered from free text. Matches known city names as whole words and takes
 * the LAST one in the string: street names collide with city names ("1 Concord
 * Ave, Walnut Creek"), and in a US address the city always comes after the
 * street, so latest-match wins.
 */
export function zoneForAddress(address: string | null | undefined): TravelZone {
  if (!address) return "unknown";
  const haystack = normaliseCity(address);

  let bestIndex = -1;
  let best: TravelZone = "unknown";

  for (const [city, zone] of Object.entries(ZONE_BY_CITY)) {
    const match = new RegExp(`(?:^|\\s)${city}(?:\\s|$)`).exec(haystack);
    if (match && match.index > bestIndex) {
      bestIndex = match.index;
      best = zone;
    }
  }

  return best;
}

/** The city name recovered from an address, for display and storage. */
export function cityFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const haystack = normaliseCity(address);

  let bestIndex = -1;
  let best: string | null = null;

  for (const city of Object.keys(ZONE_BY_CITY)) {
    const match = new RegExp(`(?:^|\\s)${city}(?:\\s|$)`).exec(haystack);
    if (match && match.index > bestIndex) {
      bestIndex = match.index;
      best = city.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  return best;
}

/**
 * Whether a city is somewhere Steve travels. Drives the `out_of_area`
 * conversation state — better to say so in the second text than to book a
 * visit in Sacramento.
 */
export function isInServiceArea(city: string | null | undefined): boolean {
  return zoneForCity(city) !== "unknown";
}

/** Exposed so the check script can assert coverage against company.ts. */
export function knownCities(): string[] {
  return Object.keys(ZONE_BY_CITY);
}

/* -------------------------------------------------------------------------- *
 * Rules
 * -------------------------------------------------------------------------- */

/** A bookable window on a given weekday, in minutes from local midnight. */
export interface DayWindow {
  start: number;
  end: number;
}

export interface BookingRules {
  /** Bookable windows per weekday. A missing weekday means no visits. */
  hours: Partial<Record<Weekday, DayWindow[]>>;
  /** How long an estimate visit takes. */
  visitMinutes: number;
  /** Travel padding applied on BOTH sides when testing against busy blocks. */
  bufferMinutes: number;
  /** Never offer a slot sooner than this from now. */
  minLeadMinutes: number;
  /** How far ahead to offer. Past ~2 weeks, no-show rates climb. */
  horizonDays: number;
  maxVisitsPerDay: number;
  /** Slot granularity. 30 keeps the offers round ("2:00", not "2:07"). */
  slotStepMinutes: number;
}

const h = (hour: number, minute = 0) => hour * 60 + minute;

/**
 * ⚠️ PLACEHOLDER VALUES — confirm with Steve before this books anything.
 *
 * These are the single highest-risk numbers in the system and they are
 * currently guesses. A setter that books him at times he does not want to
 * work gets switched off in week one, and no amount of correct plumbing
 * survives that. The Saturday morning window in particular is an assumption
 * about a solo owner-operator, not a fact.
 *
 * Ask specifically: which days, what hours, how many visits is too many in
 * one day, and how much notice he needs.
 */
export const DEFAULT_RULES: BookingRules = {
  hours: {
    1: [{ start: h(8), end: h(16) }], // Mon
    2: [{ start: h(8), end: h(16) }], // Tue
    3: [{ start: h(8), end: h(16) }], // Wed
    4: [{ start: h(8), end: h(16) }], // Thu
    5: [{ start: h(8), end: h(15) }], // Fri — shorter
    6: [{ start: h(9), end: h(12) }], // Sat morning only
  },
  visitMinutes: 45,
  bufferMinutes: 30,
  /**
   * 3 hours. Long enough that a lead submitted at 7am isn't offered 8am,
   * short enough to keep same-day booking possible — which is most of the
   * point of answering in thirty seconds.
   */
  minLeadMinutes: 180,
  horizonDays: 14,
  maxVisitsPerDay: 4,
  slotStepMinutes: 30,
};

/* -------------------------------------------------------------------------- *
 * Types
 * -------------------------------------------------------------------------- */

export interface Slot {
  /** Epoch ms. */
  start: number;
  /** Epoch ms. */
  end: number;
  /** Local YYYY-MM-DD. */
  date: string;
  /** Minutes from local midnight. */
  startMinutes: number;
}

/**
 * A block where Steve is committed. RFC3339 strings because that is what
 * Google's freeBusy endpoint returns — parsing here keeps the integration
 * layer a straight pass-through.
 */
export interface BusyInterval {
  start: string;
  end: string;
}

/**
 * An estimate visit already on the books. Only date and zone, because time
 * collisions are already handled by the busy intervals — this exists purely
 * for capacity counting and travel clustering.
 */
export interface ScheduledVisit {
  /** Local YYYY-MM-DD. */
  date: string;
  zone: TravelZone;
}

/* -------------------------------------------------------------------------- *
 * Pipeline
 * -------------------------------------------------------------------------- */

/** Every slot the working-hours rules allow, ignoring the calendar. */
export function generateSlots(rules: BookingRules, now: number): Slot[] {
  const earliest = now + rules.minLeadMinutes * MINUTE_MS;
  const firstDate = localPartsOf(now).date;
  const slots: Slot[] = [];

  for (let i = 0; i < rules.horizonDays; i++) {
    const date = addDays(firstDate, i);
    const windows = rules.hours[weekdayOf(date)] ?? [];

    for (const w of windows) {
      for (let m = w.start; m + rules.visitMinutes <= w.end; m += rules.slotStepMinutes) {
        const start = instantFromLocal(date, m);
        if (start < earliest) continue;
        slots.push({
          start,
          end: start + rules.visitMinutes * MINUTE_MS,
          date,
          startMinutes: m,
        });
      }
    }
  }

  return slots;
}

/**
 * Drop slots that collide with a busy block, padded by `bufferMinutes` on
 * both sides. The padding is why a 45-minute visit needs more than a
 * 45-minute gap: Steve has to get there and get to the next thing.
 */
export function removeBusy(
  slots: Slot[],
  busy: BusyInterval[],
  bufferMinutes: number,
): Slot[] {
  const pad = bufferMinutes * MINUTE_MS;
  const blocks = busy
    .map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end));

  return slots.filter(
    (s) => !blocks.some((b) => s.start < b.end + pad && b.start - pad < s.end),
  );
}

/** Drop every slot on a day that already has its fill of visits. */
export function applyDailyCapacity(
  slots: Slot[],
  scheduled: ScheduledVisit[],
  rules: BookingRules,
): Slot[] {
  const perDay = new Map<string, number>();
  for (const v of scheduled) perDay.set(v.date, (perDay.get(v.date) ?? 0) + 1);
  return slots.filter((s) => (perDay.get(s.date) ?? 0) < rules.maxVisitsPerDay);
}

/**
 * Scoring weights.
 *
 * The governing tradeoff: clustering saves Steve about 45 minutes of driving,
 * while every day of delay costs close rate — a lead that waits a week is a
 * lead three other contractors have already visited. So clustering is worth a
 * few days, never a week.
 *
 * That bounds the bonus, and the bound is the non-obvious part. An earlier
 * pass used sameZoneDay: 40 against perDayOut: -3, which let the bonus rescue
 * an arbitrarily distant day: a same-zone slot 8 days out scored -8 and beat
 * a cross-zone slot *tomorrow* at -31. No cross-zone penalty fixes that,
 * because the bonus outruns the delay term. It has to be small enough that
 * delay always catches it, which is what sameZoneDay / -perDayOut ≈ 3 buys.
 *
 * Both the break-even and the 8-days-out case are asserted in the check
 * script — change one weight and those tell you what you did to the others.
 */
export const SCORING = {
  /** Day already has a visit in the same zone — he's driving there anyway. */
  sameZoneDay: 18,
  /** Day has visits, all in other zones — this one adds a cross-county hop. */
  crossZoneDay: -12,
  /** Per day of delay. 18 / 6 = clustering buys at most 3 days. */
  perDayOut: -6,
} as const;

export function scoreSlot(
  slot: Slot,
  today: string,
  zone: TravelZone,
  scheduled: ScheduledVisit[],
): number {
  let score = daysBetween(today, slot.date) * SCORING.perDayOut;

  const sameDay = scheduled.filter((v) => v.date === slot.date);
  if (sameDay.length > 0 && zone !== "unknown") {
    score += sameDay.some((v) => v.zone === zone) ? SCORING.sameZoneDay : SCORING.crossZoneDay;
  }

  return score;
}

/** Best first. Ties break earliest-first. */
export function rankSlots(
  slots: Slot[],
  now: number,
  zone: TravelZone,
  scheduled: ScheduledVisit[],
): Slot[] {
  const today = localPartsOf(now).date;
  return [...slots]
    .map((slot) => ({ slot, score: scoreSlot(slot, today, zone, scheduled) }))
    .sort((a, b) => b.score - a.score || a.slot.start - b.slot.start)
    .map((s) => s.slot);
}

/**
 * At most one slot per day. Three options on one afternoon reads as "he has
 * nothing on", and gives the customer one decision instead of three.
 */
export function diversifyByDay(slots: Slot[], count: number): Slot[] {
  const picked: Slot[] = [];
  const usedDays = new Set<string>();

  for (const s of slots) {
    if (usedDays.has(s.date)) continue;
    picked.push(s);
    usedDays.add(s.date);
    if (picked.length === count) return picked;
  }

  // Fewer distinct days than asked for — backfill rather than under-offer.
  for (const s of slots) {
    if (picked.includes(s)) continue;
    picked.push(s);
    if (picked.length === count) break;
  }

  return picked;
}

export interface ProposeInput {
  /** Epoch ms. Injected rather than read from the clock so this stays pure. */
  now: number;
  /** The lead's city, for travel clustering. Unknown is handled, not fatal. */
  city?: string | null;
  busy: BusyInterval[];
  scheduled: ScheduledVisit[];
  rules?: BookingRules;
  /** How many to offer. Three is the usual ceiling before a text gets long. */
  count?: number;
}

/**
 * The whole pipeline. Returns [] when nothing is bookable inside the horizon
 * — a real outcome the caller must handle (offer a callback from Steve
 * rather than inventing a slot).
 */
export function proposeSlots(input: ProposeInput): Slot[] {
  const rules = input.rules ?? DEFAULT_RULES;
  const zone = zoneForCity(input.city);

  const open = applyDailyCapacity(
    removeBusy(generateSlots(rules, input.now), input.busy, rules.bufferMinutes),
    input.scheduled,
    rules,
  );

  return diversifyByDay(rankSlots(open, input.now, zone, input.scheduled), input.count ?? 3);
}

/* -------------------------------------------------------------------------- *
 * Presentation
 * -------------------------------------------------------------------------- */

/** "Thursday, Sep 10 at 2:00pm" */
export function formatSlot(slot: Slot): string {
  return `${formatDay(slot.start)} at ${formatTime(slot.start)}`;
}

/**
 * The slot list as it appears in a text. Numbered so the customer can reply
 * "2" — the single most reliable input an SMS bot can ask for, and the one
 * that needs no model call to parse.
 */
export function formatSlotOptions(slots: Slot[]): string {
  return slots.map((s, i) => `${i + 1}. ${formatSlot(s)}`).join("\n");
}
