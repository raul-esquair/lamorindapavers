import {
  DEFAULT_RULES,
  SCORING,
  applyDailyCapacity,
  diversifyByDay,
  formatSlot,
  formatSlotOptions,
  generateSlots,
  cityFromAddress,
  isInServiceArea,
  knownCities,
  proposeSlots,
  rankSlots,
  removeBusy,
  scoreSlot,
  zoneForAddress,
  zoneForCity,
  type BookingRules,
  type ScheduledVisit,
  type Slot,
} from "@/lib/appointments/availability";
import { formatTime, instantFromLocal, localPartsOf, weekdayOf } from "@/lib/appointments/time";
import { company } from "@/lib/data/company";

let pass = 0,
  fail = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++;
  else fail++;
  console.log(
    `${ok ? "  ok  " : "FAIL  "} ${label}${ok ? "" : `\n        got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`}`,
  );
}

const MIN = 60_000;
const HOUR = 60 * MIN;

// Wednesday 2026-09-09, 07:00 local (PDT, UTC-7).
const NOW = instantFromLocal("2026-09-09", 7 * 60);

console.log("\n— timezone: local ↔ instant —");
check("weekdayOf Wed", weekdayOf("2026-09-09"), 3);
check("weekdayOf Sun", weekdayOf("2026-09-13"), 0);
check("round-trips the date", localPartsOf(NOW).date, "2026-09-09");
check("round-trips the time", localPartsOf(NOW).minutes, 7 * 60);

// The reason this module exists rather than using Date arithmetic: the
// offset is not constant. DST 2026 begins Mar 8 and ends Nov 1.
console.log("\n— DST: the same wall clock is a different instant —");
check(
  "9am PST is 17:00 UTC",
  new Date(instantFromLocal("2026-03-07", 9 * 60)).toISOString(),
  "2026-03-07T17:00:00.000Z",
);
check(
  "9am PDT is 16:00 UTC (day after spring forward)",
  new Date(instantFromLocal("2026-03-08", 9 * 60)).toISOString(),
  "2026-03-08T16:00:00.000Z",
);
check(
  "9am PDT before fall back",
  new Date(instantFromLocal("2026-10-31", 9 * 60)).toISOString(),
  "2026-10-31T16:00:00.000Z",
);
check(
  "9am PST after fall back",
  new Date(instantFromLocal("2026-11-02", 9 * 60)).toISOString(),
  "2026-11-02T17:00:00.000Z",
);
check(
  "  naive +24h would have been an hour off",
  instantFromLocal("2026-03-08", 9 * 60) - instantFromLocal("2026-03-07", 9 * 60) === 24 * HOUR,
  false,
);
check(
  "  it is 23 hours across spring forward",
  (instantFromLocal("2026-03-08", 9 * 60) - instantFromLocal("2026-03-07", 9 * 60)) / HOUR,
  23,
);

console.log("\n— travel zones —");
check("Lafayette", zoneForCity("Lafayette"), "lamorinda");
check("case and whitespace insensitive", zoneForCity("  WALNUT CREEK "), "central");
check("strips state suffix", zoneForCity("Orinda, CA"), "lamorinda");
check("unknown city", zoneForCity("Sacramento"), "unknown");
check("null city", zoneForCity(null), "unknown");
check("in service area", isInServiceArea("Danville"), true);
check("out of service area", isInServiceArea("Fresno"), false);

// Adding a city to company.ts without zoning it should fail here rather
// than quietly land every lead from it in "unknown".
const unzoned = company.allCities().filter((c) => zoneForCity(c) === "unknown");
check("every company.ts service-area city has a zone", unzoned, []);
check("  zone table is a superset", knownCities().length >= company.allCities().length, true);

console.log("\n— zone from a full street address —");
// Street names collide with city names, so latest-match-wins is the rule:
// in a US address the city always follows the street.
check("takes the city, not the street name", zoneForAddress("1 Concord Ave, Walnut Creek, CA 94596"), "central");
check("  and reports that city", cityFromAddress("1 Concord Ave, Walnut Creek, CA 94596"), "Walnut Creek");
check("Moraga Rd in Lafayette resolves to Lafayette", cityFromAddress("42 Moraga Rd, Lafayette CA"), "Lafayette");
check("plain city name still works", zoneForAddress("Orinda"), "lamorinda");
check("handles zip codes and punctuation", zoneForAddress("3 Oak Ln., Danville, CA 94526"), "diablo-valley");
check("out of area", zoneForAddress("999 Nowhere St, Fresno CA"), "unknown");
check("  reports no city", cityFromAddress("999 Nowhere St, Fresno CA"), null);
check("null address", zoneForAddress(null), "unknown");
check("empty address", zoneForAddress(""), "unknown");
// Whole-word matching: "Oakley" must not be read as "Oakland", and a street
// called "Berkeley Way" in Concord must not win over Concord.
check("does not partial-match a longer city", zoneForAddress("12 Main St, Oakley CA"), "east-county");

console.log("\n— generateSlots —");
{
  const slots = generateSlots(DEFAULT_RULES, NOW);
  check("produces slots", slots.length > 0, true);
  check("all inside the horizon", slots.every((s) => s.date <= "2026-09-22"), true);
  check(
    "honours minimum lead time",
    slots.every((s) => s.start >= NOW + DEFAULT_RULES.minLeadMinutes * MIN),
    true,
  );
  check(
    "never starts before opening",
    slots.every((s) => s.startMinutes >= 8 * 60),
    true,
  );
  check(
    "visit always finishes inside the window",
    slots.every((s) => {
      const w = (DEFAULT_RULES.hours[weekdayOf(s.date)] ?? [])[0];
      return !!w && s.startMinutes + DEFAULT_RULES.visitMinutes <= w.end;
    }),
    true,
  );
  check("no Sundays", slots.some((s) => weekdayOf(s.date) === 0), false);
  check("Saturdays are morning only", slots.filter((s) => weekdayOf(s.date) === 6).every((s) => s.startMinutes < 12 * 60), true);

  // 07:00 + 3h lead = 10:00, so today starts at 10:00 not 08:00.
  const today = slots.filter((s) => s.date === "2026-09-09");
  check("today's first slot respects lead time", today[0]?.startMinutes, 10 * 60);
  check("tomorrow starts at opening", slots.find((s) => s.date === "2026-09-10")?.startMinutes, 8 * 60);
}

console.log("\n— removeBusy —");
{
  const slots = generateSlots(DEFAULT_RULES, NOW);
  const busy = [
    {
      start: new Date(instantFromLocal("2026-09-10", 10 * 60)).toISOString(),
      end: new Date(instantFromLocal("2026-09-10", 11 * 60)).toISOString(),
    },
  ];
  const open = removeBusy(slots, busy, DEFAULT_RULES.bufferMinutes);

  const on10th = (list: Slot[]) => list.filter((s) => s.date === "2026-09-10").map((s) => s.startMinutes);
  check("removes the colliding slots", on10th(open).includes(10 * 60), false);

  // Busy 10:00–11:00, buffer 30 either side, visit 45 min.
  // 9:00–9:45 ends before 9:30 pad start? No — 9:45 > 9:30, so blocked.
  check("blocks a slot that ends inside the buffer", on10th(open).includes(9 * 60), false);
  check("keeps a slot that clears the buffer", on10th(open).includes(8 * 60 + 30), true);
  check("keeps a slot after the buffer", on10th(open).includes(11 * 60 + 30), true);
  check("leaves other days untouched", open.some((s) => s.date === "2026-09-11"), true);
  check("ignores unparseable intervals", removeBusy(slots, [{ start: "nope", end: "nope" }], 30).length, slots.length);
  check("no busy blocks is a no-op", removeBusy(slots, [], 30).length, slots.length);
}

console.log("\n— applyDailyCapacity —");
{
  const slots = generateSlots(DEFAULT_RULES, NOW);
  const full: ScheduledVisit[] = Array.from({ length: 4 }, () => ({
    date: "2026-09-11",
    zone: "lamorinda" as const,
  }));
  const open = applyDailyCapacity(slots, full, DEFAULT_RULES);
  check("drops a day at capacity", open.some((s) => s.date === "2026-09-11"), false);
  check("keeps a day under capacity", open.some((s) => s.date === "2026-09-10"), true);
  check(
    "one under the cap still opens",
    applyDailyCapacity(slots, full.slice(0, 3), DEFAULT_RULES).some((s) => s.date === "2026-09-11"),
    true,
  );
}

console.log("\n— scoring: clustering vs soonness —");
{
  const day = (d: string): Slot => ({
    start: instantFromLocal(d, 10 * 60),
    end: instantFromLocal(d, 10 * 60 + 45),
    date: d,
    startMinutes: 600,
  });
  const today = "2026-09-09";
  const lamorindaOn11: ScheduledVisit[] = [{ date: "2026-09-11", zone: "lamorinda" }];
  const antiochOn11: ScheduledVisit[] = [{ date: "2026-09-11", zone: "east-county" }];

  check("sooner beats later, all else equal", scoreSlot(day("2026-09-10"), today, "lamorinda", []) > scoreSlot(day("2026-09-14"), today, "lamorinda", []), true);
  check("same-zone day is rewarded", scoreSlot(day("2026-09-11"), today, "lamorinda", lamorindaOn11) > scoreSlot(day("2026-09-11"), today, "lamorinda", []), true);
  check("cross-zone day is penalised", scoreSlot(day("2026-09-11"), today, "lamorinda", antiochOn11) < scoreSlot(day("2026-09-11"), today, "lamorinda", []), true);
  check("unknown zone is neither rewarded nor penalised", scoreSlot(day("2026-09-11"), today, "unknown", antiochOn11), scoreSlot(day("2026-09-11"), today, "unknown", []));

  // The weights are tuned so clustering wins inside a week but not past it.
  check(
    "clustering beats a 2-day-sooner empty slot",
    scoreSlot(day("2026-09-11"), today, "lamorinda", lamorindaOn11) > scoreSlot(day("2026-09-09"), today, "lamorinda", []),
    true,
  );
  // The stated design intent: clustering is worth a few days of delay, never
  // a week of it. These two assertions are what pins the weights to that.
  check(
    "clustering does NOT beat a slot 8 days sooner",
    scoreSlot(day("2026-09-17"), today, "lamorinda", [{ date: "2026-09-17", zone: "lamorinda" }]) > scoreSlot(day("2026-09-09"), today, "lamorinda", []),
    false,
  );
  check(
    "  even against a cross-zone slot tomorrow",
    scoreSlot(day("2026-09-17"), today, "lamorinda", [{ date: "2026-09-17", zone: "lamorinda" }]) > scoreSlot(day("2026-09-10"), today, "lamorinda", [{ date: "2026-09-10", zone: "east-county" }]),
    false,
  );
  check("clustering buys at most 3 days", Math.floor(SCORING.sameZoneDay / -SCORING.perDayOut), 3);

  const ranked = rankSlots([day("2026-09-14"), day("2026-09-10")], NOW, "lamorinda", []);
  check("rankSlots puts the sooner one first", ranked[0]?.date, "2026-09-10");
  check("rankSlots does not mutate its input", [day("2026-09-14"), day("2026-09-10")][0].date, "2026-09-14");
}

console.log("\n— diversifyByDay —");
{
  const mk = (d: string, m: number): Slot => ({
    start: instantFromLocal(d, m),
    end: instantFromLocal(d, m + 45),
    date: d,
    startMinutes: m,
  });
  const sameDay = [mk("2026-09-10", 480), mk("2026-09-10", 540), mk("2026-09-10", 600)];
  const spread = [mk("2026-09-10", 480), mk("2026-09-10", 540), mk("2026-09-11", 480), mk("2026-09-14", 480)];

  check("prefers distinct days", diversifyByDay(spread, 3).map((s) => s.date), ["2026-09-10", "2026-09-11", "2026-09-14"]);
  check("backfills rather than under-offering", diversifyByDay(sameDay, 3).length, 3);
  check("never exceeds the count", diversifyByDay(spread, 2).length, 2);
  check("handles an empty list", diversifyByDay([], 3), []);
}

console.log("\n— proposeSlots (the whole pipeline) —");
{
  const three = proposeSlots({ now: NOW, city: "Lafayette", busy: [], scheduled: [] });
  check("offers three by default", three.length, 3);
  check("on three different days", new Set(three.map((s) => s.date)).size, 3);
  check("all in the future", three.every((s) => s.start > NOW), true);
  check("respects a custom count", proposeSlots({ now: NOW, city: "Lafayette", busy: [], scheduled: [], count: 2 }).length, 2);

  // Steve is already in Antioch on the 11th; a Lafayette lead should not be
  // clustered onto that day.
  const clustered = proposeSlots({
    now: NOW,
    city: "Lafayette",
    busy: [],
    scheduled: [{ date: "2026-09-11", zone: "east-county" }],
  });
  check("avoids stacking a cross-county day", clustered.some((s) => s.date === "2026-09-11"), false);

  // A fully blocked calendar is a real outcome, not an error.
  const blocked = proposeSlots({
    now: NOW,
    city: "Lafayette",
    busy: Array.from({ length: 14 }, (_, i) => {
      const d = new Date(NOW + i * 24 * HOUR).toISOString().slice(0, 10);
      return { start: `${d}T00:00:00.000Z`, end: `${d}T23:59:59.000Z` };
    }),
    scheduled: [],
  });
  check("returns [] when nothing is bookable", blocked, []);

  // Narrow rules: one hour a week.
  const narrow: BookingRules = { ...DEFAULT_RULES, hours: { 4: [{ start: 9 * 60, end: 10 * 60 }] }, slotStepMinutes: 30 };
  const scarce = proposeSlots({ now: NOW, city: "Lafayette", busy: [], scheduled: [], rules: narrow });
  check("scarce rules still offer what exists", scarce.length > 0, true);
  check("  and only on Thursdays", scarce.every((s) => weekdayOf(s.date) === 4), true);
}

console.log("\n— SMS formatting —");
{
  const slot: Slot = {
    start: instantFromLocal("2026-09-10", 14 * 60),
    end: instantFromLocal("2026-09-10", 14 * 60 + 45),
    date: "2026-09-10",
    startMinutes: 840,
  };
  check("lowercases the meridiem for SMS", formatTime(slot.start), "2:00pm");
  check("formats a slot", formatSlot(slot), "Thursday, Sep 10 at 2:00pm");
  check(
    "numbers the options so a reply of '2' parses without a model call",
    formatSlotOptions([slot, { ...slot, start: instantFromLocal("2026-09-11", 9 * 60) }]),
    "1. Thursday, Sep 10 at 2:00pm\n2. Friday, Sep 11 at 9:00am",
  );
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
