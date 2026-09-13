import {
  DEFAULT_CADENCE,
  exampleSchedule,
  isSequenceComplete,
  isWeekend,
  nextDueTouch,
  nextSendDay,
  nextTouch,
  resolveStartAt,
  type Cadence,
  type SentTouch,
} from "@/lib/reviews/schedule";
import {
  DEFAULT_TEMPLATES,
  renderReviewEmail,
  sampleCustomer,
  templateProblems,
  unknownFields,
} from "@/lib/reviews/emails";
import { customizedTemplates, parseEmailList, validateSettings } from "@/lib/reviews/settings";
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

// Same-day: Steve is marking it complete at the walkthrough, so send while
// the work is still in front of the customer.
check("finished TODAY -> sends today", resolveStartAt(TODAY, TODAY), TODAY);
check("  same-day beats the +2 default", resolveStartAt(TODAY, TODAY) !== addDays(TODAY, 2), true);
check("finished yesterday -> NOT same-day", resolveStartAt("2026-08-20", TODAY), "2026-08-22");
check("future date -> still +2", resolveStartAt("2026-08-25", TODAY), "2026-08-27");
check("no completion date -> tomorrow", resolveStartAt(null, TODAY), "2026-08-22");
check("backfill (6 months old) -> tomorrow", resolveStartAt("2026-02-14", TODAY), "2026-08-22");
// Inside the backfill window, but its natural date (08-10) has already passed.
// Must clamp forward rather than schedule into the past.
check("13 days old -> clamps to tomorrow", resolveStartAt("2026-08-08", TODAY), "2026-08-22");
check("  never schedules into the past", daysBetween(resolveStartAt("2026-08-08", TODAY), TODAY) <= 0, true);
// A job finished yesterday is inside the window AND still in the future.
check("1 day old -> natural (no clamp)", resolveStartAt("2026-08-20", TODAY), "2026-08-22");

// Shorthand: touches sent on the given dates, in order (touch 1 first).
const sent = (...dates: string[]): SentTouch[] => dates.map((date, i) => ({ n: i + 1, date }));
const D = DEFAULT_CADENCE;

console.log("\n— default cadence: same-day sequence lands on day 0 / 5 / 14 —");
check("example schedule", exampleSchedule(TODAY, D), [
  { n: 1, date: TODAY },
  { n: 2, date: "2026-08-26" },
  { n: 3, date: "2026-09-04" },
]);
check("touch 1 is due immediately", nextDueTouch(resolveStartAt(TODAY, TODAY), [], TODAY), 1);

console.log("\n— nextDueTouch —");
check("nothing sent, start today -> 1", nextDueTouch("2026-08-21", [], TODAY), 1);
check("nothing sent, starts tomorrow -> null", nextDueTouch("2026-08-22", [], TODAY), null);
check("1 sent 3 days ago -> null (2 not due)", nextDueTouch("2026-08-18", sent("2026-08-18"), TODAY), null);
check("1 sent 5 days ago -> 2", nextDueTouch("2026-08-16", sent("2026-08-16"), TODAY), 2);
check("2 sent today -> null", nextDueTouch("2026-08-16", sent("2026-08-16", TODAY), TODAY), null);
check("2 sent 9 days ago -> 3", nextDueTouch("2026-08-07", sent("2026-08-07", "2026-08-12"), TODAY), 3);
check("2 sent 8 days ago -> null", nextDueTouch("2026-08-08", sent("2026-08-08", "2026-08-13"), TODAY), null);
check("all sent -> null", nextDueTouch("2026-08-01", sent("2026-08-01", "2026-08-06", "2026-08-15"), TODAY), null);

console.log("\n— gaps count from the real send, not from startAt —");
// Touch 1 was due 08-10 but went out 08-19 (a pause, or the batch cap).
// Measured from startAt, touch 2 would be long overdue and follow the next
// day; measured from the send, it waits the full five days.
check("late touch 1 -> touch 2 not yet due", nextDueTouch("2026-08-10", sent("2026-08-19"), TODAY), null);
check("  touch 2 lands 5 days after the send", nextTouch("2026-08-10", sent("2026-08-19"), D), { n: 2, date: "2026-08-24" });
check("touch 3 waits for touch 2 to go out", nextTouch("2026-08-01", [{ n: 1, date: "2026-08-01" }], D)?.n, 2);

console.log("\n— catch-up: badly overdue sends ONE touch, then keeps its spacing —");
check("start 60 days ago, nothing sent -> 1", nextDueTouch("2026-06-22", [], TODAY), 1);
check("  next day -> nothing (gap from the send)", nextDueTouch("2026-06-22", sent(TODAY), "2026-08-22"), null);
check("  5 days later -> 2", nextDueTouch("2026-06-22", sent(TODAY), "2026-08-26"), 2);
check("  then 9 more -> 3", nextDueTouch("2026-06-22", sent(TODAY, "2026-08-26"), "2026-09-04"), 3);
check("  then done", nextDueTouch("2026-06-22", sent(TODAY, "2026-08-26", "2026-09-04"), "2026-09-30"), null);

console.log("\n— custom cadence —");
const tight: Cadence = { emailCount: 3, gapDays: { 2: 3, 3: 4 }, skipWeekends: false };
check("3 / 4 day gaps -> day 0 / 3 / 7", exampleSchedule(TODAY, tight).map((t) => t.date), [TODAY, "2026-08-24", "2026-08-28"]);
const two: Cadence = { ...D, emailCount: 2 };
check("2 emails -> schedule stops at 2", exampleSchedule(TODAY, two).length, 2);
check("  nothing after touch 2", nextDueTouch("2026-08-01", sent("2026-08-01", "2026-08-06"), TODAY, two), null);
check("  complete after 2", isSequenceComplete([1, 2], two), true);
const one: Cadence = { ...D, emailCount: 1 };
check("1 email -> complete after 1", isSequenceComplete([1], one), true);
check("  no follow-up", nextDueTouch("2026-08-01", sent("2026-08-01"), TODAY, one), null);

console.log("\n— skip weekends —");
const weekdays: Cadence = { ...D, skipWeekends: true };
check("Saturday is a weekend", isWeekend("2026-08-22"), true);
check("Friday is not", isWeekend(TODAY), false);
check("Saturday -> Monday", nextSendDay("2026-08-22", weekdays), "2026-08-24");
check("Sunday -> Monday", nextSendDay("2026-08-23", weekdays), "2026-08-24");
check("off: Saturday stays Saturday", nextSendDay("2026-08-22", D), "2026-08-22");
check("Saturday start -> nothing sends Saturday", nextDueTouch("2026-08-22", [], "2026-08-22", weekdays), null);
check("  sends Monday", nextDueTouch("2026-08-22", [], "2026-08-24", weekdays), 1);
check("overdue Thursday email waits on Sunday", nextDueTouch("2026-08-20", [], "2026-08-23", weekdays), null);
// Fri + 2 = Sun -> Mon; Mon + 5 = Sat -> Mon. Each gap counts from the
// shifted Monday send, so the weekend never shortens the next gap.
check("2 / 5 day gaps from a Friday -> Fri, Mon, Mon", exampleSchedule(TODAY, { ...weekdays, gapDays: { 2: 2, 3: 5 } }).map((t) => t.date), [
  TODAY,
  "2026-08-24",
  "2026-08-31",
]);

console.log("\n— completion —");
check("partial not complete", isSequenceComplete([1, 2]), false);
check("all three complete", isSequenceComplete([1, 2, 3]), true);
check("out of order still complete", isSequenceComplete([3, 1, 2]), true);

console.log("\n— email templates —");
{
  const jane = sampleCustomer(TODAY);
  const e1 = renderReviewEmail(jane, 1, TODAY);
  // The launch subject, unchanged by moving the copy into a template.
  check("default subject 1 fills {project}", e1.subject, "A favor about your new paver driveway");
  check("default body 1 fills {when_finished}", e1.text.includes("We finished your new paver driveway a few days ago."), true);
  check("same day reads 'today'", renderReviewEmail({ ...jane, completedAt: TODAY }, 1, TODAY).text.includes("your new paver driveway today."), true);
  check("no project -> 'your project'", renderReviewEmail({ ...jane, projectType: null }, 1, TODAY).subject, "A favor about your project");
  check("multi-word service reads naturally", renderReviewEmail({ ...jane, projectType: "Fire Pits & Fire Features" }, 1, TODAY).subject, "A favor about your new fire pit");
  check("unknown project text falls back", renderReviewEmail({ ...jane, projectType: "Stone Steps" }, 1, TODAY).subject, "A favor about your stone step");
  check("default subject 2 fills {first_name}", renderReviewEmail(jane, 2, TODAY).subject, "Still hoping to hear from you, Jane");
  check("signed by Steve", e1.text.includes("Thanks,\nSteve Barsanti\nLamorinda Pavers · CA Lic. #1092749"), true);
  check("empty token links to bare /feedback", e1.text.includes("lamorindapaving.com/feedback\n"), true);
  check("real token lands in the link", renderReviewEmail({ ...jane, token: "abc" }, 1, TODAY).text.includes("/feedback?t=abc"), true);

  const custom = { subject: "Quick one, {first_name}", body: "Hi {first_name},\n\nLine one\nline two" };
  const c = renderReviewEmail(jane, 1, TODAY, custom);
  check("custom subject", c.subject, "Quick one, Jane");
  check("custom body: single newline -> <br>", c.html.includes("Line one<br>line two"), true);
  check("custom body is escaped", renderReviewEmail(jane, 1, TODAY, { subject: "x", body: "<b>hi</b>" }).html.includes("&lt;b&gt;"), true);
  check("link + unsubscribe survive any edit", c.text.includes("/feedback") && c.text.includes("Unsubscribe"), true);

  check("typo'd field is caught", unknownFields("Hi {frist_name} {project}"), ["frist_name"]);
  check("known fields pass", templateProblems(DEFAULT_TEMPLATES[1]), []);
  check("empty subject fails", templateProblems({ subject: " ", body: "x" }).length, 1);
}

console.log("\n— settings validation —");
{
  const base = {
    emailCount: 3 as const,
    gapDays: { 2: 5, 3: 9 },
    skipWeekends: false,
    repeatWindowDays: 180,
    templates: DEFAULT_TEMPLATES,
    replyTo: null,
    alertEmails: [],
  };
  check("defaults are valid", validateSettings(base).ok, true);
  const bad = validateSettings({ ...base, gapDays: { 2: 1, 3: 45 } });
  check("gap below 2 and above 30 rejected", bad.ok ? [] : Object.keys(bad.errors).sort(), ["gap2", "gap3"]);
  check("unused gap isn't validated", validateSettings({ ...base, emailCount: 1, gapDays: { 2: 0, 3: 0 } }).ok, true);
  const badEmail = validateSettings({ ...base, replyTo: "steve@", alertEmails: ["a@b.com", "nope"] });
  check("bad addresses rejected", badEmail.ok ? [] : Object.keys(badEmail.errors).sort(), ["alertEmails", "replyTo"]);
  check("email list parsing", parseEmailList("A@x.com, b@y.com;a@x.com"), ["a@x.com", "b@y.com"]);
  check("only edited templates are stored", Object.keys(customizedTemplates({ ...DEFAULT_TEMPLATES, 2: { subject: "Hi", body: "Yo" } })), ["2"]);
  check("whitespace-only edits count as default", Object.keys(customizedTemplates({ ...DEFAULT_TEMPLATES, 1: { ...DEFAULT_TEMPLATES[1], body: DEFAULT_TEMPLATES[1].body + "\n\n  " } })), []);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
