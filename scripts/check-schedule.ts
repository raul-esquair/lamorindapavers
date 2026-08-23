import { resolveStartAt, nextDueTouch, touchDueDate, isSequenceComplete } from "@/lib/reviews/schedule";
import { addDays, daysBetween } from "@/lib/reviews/dates";

let pass = 0, fail = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "  ok  " : "FAIL  "} ${label}${ok ? "" : `\n        got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`}`);
}

const TODAY = "2026-08-21";

console.log("\n— date helpers —");
check("addDays across month boundary", addDays("2026-08-30", 5), "2026-09-04");
check("addDays across year boundary", addDays("2026-12-30", 3), "2027-01-02");
check("addDays across leap day", addDays("2028-02-28", 1), "2028-02-29");
check("daysBetween forward", daysBetween("2026-08-21", "2026-08-26"), 5);
check("daysBetween negative", daysBetween("2026-08-26", "2026-08-21"), -5);

console.log("\n— resolveStartAt —");
check("fresh job -> completed + 2", resolveStartAt("2026-08-20", TODAY), "2026-08-22");
check("job finished today -> +2", resolveStartAt(TODAY, TODAY), "2026-08-23");
check("no completion date -> tomorrow", resolveStartAt(null, TODAY), "2026-08-22");
check("backfill (6 months old) -> tomorrow", resolveStartAt("2026-02-14", TODAY), "2026-08-22");
// Inside the backfill window, but its natural date (08-10) has already passed.
// Must clamp forward rather than schedule into the past.
check("13 days old -> clamps to tomorrow", resolveStartAt("2026-08-08", TODAY), "2026-08-22");
check("  never schedules into the past", daysBetween(resolveStartAt("2026-08-08", TODAY), TODAY) <= 0, true);
// A job finished yesterday is inside the window AND still in the future.
check("1 day old -> natural (no clamp)", resolveStartAt("2026-08-20", TODAY), "2026-08-22");

console.log("\n— touch due dates (startAt 2026-08-22) —");
check("touch 1", touchDueDate("2026-08-22", 1), "2026-08-22");
check("touch 2", touchDueDate("2026-08-22", 2), "2026-08-27");
check("touch 3", touchDueDate("2026-08-22", 3), "2026-09-05");

console.log("\n— nextDueTouch —");
check("nothing sent, start today -> 1", nextDueTouch("2026-08-21", [], TODAY), 1);
check("nothing sent, starts tomorrow -> null", nextDueTouch("2026-08-22", [], TODAY), null);
check("1 sent, day 3 -> null (2 not due)", nextDueTouch("2026-08-18", [1], TODAY), null);
check("1 sent, day 5 -> 2", nextDueTouch("2026-08-16", [1], TODAY), 2);
check("1,2 sent, day 5 -> null", nextDueTouch("2026-08-16", [1, 2], TODAY), null);
check("1,2 sent, day 14 -> 3", nextDueTouch("2026-08-07", [1, 2], TODAY), 3);
check("all sent -> null", nextDueTouch("2026-08-01", [1, 2, 3], TODAY), null);

console.log("\n— catch-up: badly overdue sends ONE touch, not three —");
check("start 60 days ago, nothing sent -> 1", nextDueTouch("2026-06-22", [], TODAY), 1);
check("  then next run -> 2", nextDueTouch("2026-06-22", [1], TODAY), 2);
check("  then next run -> 3", nextDueTouch("2026-06-22", [1, 2], TODAY), 3);
check("  then done", nextDueTouch("2026-06-22", [1, 2, 3], TODAY), null);

console.log("\n— completion —");
check("partial not complete", isSequenceComplete([1, 2]), false);
check("all three complete", isSequenceComplete([1, 2, 3]), true);
check("out of order still complete", isSequenceComplete([3, 1, 2]), true);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
