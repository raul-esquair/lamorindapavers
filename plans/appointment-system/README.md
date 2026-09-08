# Lead notification + follow-up — implementation plan

Written 2026-09-07. **Scope substantially reduced 2026-09-08** after the owner
conversation — see Change log.

Gets leads in front of Steve the moment they arrive, and closes the loop from
a won job into the review sequence that already exists.

## Change log

**2026-09-08 — scope cut from "AI appointment setter" to "notify only."**
Steve wants to be involved in vetting appointments and does all customer
contact himself. He also asked for a **text** with full lead details, because
he is not on email consistently.

Removed: customer-facing SMS, the AI conversation engine, slot proposal to
customers, calendar booking, appointment reminders. Kept as deferred, not
deleted — see "Deferred."

What this bought: no TCPA exposure (the only recipient is the business owner),
no prompt-injection surface, no double-booking race, and `DEFAULT_RULES` stops
being the riskiest number in the system because nothing books anything.

**2026-09-08 (later) — ntfy is out. Steve wants a direct text, no app.**

That settles the cheap-stopgap question: there isn't one. SMS is the only
channel that reaches him, which puts carrier registration on the critical path
with nothing to hand him while it queues.

Two consequences:

1. **Consider a toll-free number, not 10DLC.** For a single internal recipient,
   toll-free verification skips the Campaign Registry brand + campaign vetting
   and is generally much faster. Steve does not care that his alert comes from
   an 800 number. If the deferred customer-facing work ever returns, buy a
   local 10DLC number *then* — a local number is the right sender for
   customers anyway, so this is a clean split rather than a compromise.
   ⚠️ Verify current timelines against Twilio's own docs.
2. **`/feedback` has the same broken alert.** `submit-feedback.ts` pushes at
   ntfy **priority 5** when an unhappy customer submits — CLAUDE.md calls that
   push "what turns an unhappy customer into a same-day callback." If Steve
   won't run the app, that has never worked either, and it is more
   time-critical than a lead. Same channel, one more sender. Folded into
   phase 003.

The ntfy code stays in place — it costs nothing and gives Esquair a monitoring
channel — but it is no longer part of the answer for Steve.

## Goal

1. **Steve** — see every lead immediately, on the device he actually carries.
2. **Esquair** — reference implementation for future clients.

The second is why lead volume does not gate this.

## Shipped (phase 001, Sep 2026)

- **Leads are persisted.** `submit-quote.ts` writes every submission via
  `lib/leads/queries.ts`, with `sourcePath` / `sourceKind` attribution.
- **`/dashboard/leads`** — table plus a "Leads by page" breakdown, which is
  what finally answers *which of the 37 pages produce work*.
- **SMS consent capture**, form restructure (address on step 2), service
  pre-select, "Not sure yet" option. See `001-persist-leads.md`.

## Phases

| # | Phase | Blocks | External wait | Rough scope |
|---|---|---|---|---|
| [001](001-persist-leads.md) | Persist leads + capture consent | everything | — | **DONE** |
| 002 | Twilio number + carrier registration (**toll-free first**) | 003 | **days–weeks** | account work |
| 003 | Alert SMS to Steve: new lead **and** unhappy `/feedback` | 004 | — | ~5 files |
| 004 | Outcome capture: Steve replies won/quoted/lost | — | — | ~4 files |
| 005 | Triage signals in the alert + dashboard | — | — | ~2 files |

## Execution order

**002 → 003 → 004 → 005**

**002 is the critical path and there is no way around it.** Steve gets nothing
until a number is verified, and there is no stopgap now that ntfy is out.
Start it today; everything else is days of work waiting on weeks of vetting.

**Spend ten minutes choosing the number type before registering.** Toll-free
verification is generally far faster than 10DLC brand + campaign vetting, and
for one internal recipient there is no downside. Picking 10DLC out of habit
could cost weeks for nothing.

**003 covers both alerts, not just leads.** The unhappy-customer path through
`/feedback` currently pushes at ntfy priority 5 and therefore never arrives.
It is the more time-critical of the two — a complaint decays faster than a
lead — so it ships in the same phase, not later.

**004 is the highest-value phase after the alerts.** It closes lead → job →
review request, which is the loop that makes this a system rather than a
notification. It is also cheap: Steve replies one word to a text.

## Deferred, not deleted

Everything below was designed and partly built, then cut on 2026-09-08. The
door is deliberately left open: Twilio, A2P, the message log and outcome
capture are all shared with these, so they are additive rather than a rebuild.

- Instant customer-facing acknowledgment
- AI conversation engine
- Slot proposal to customers, calendar read + write, booking, reminders

**Trigger to revisit:** Steve asking for it after seeing the alerts work — a
common arc once an owner trusts the plumbing. The consent checkbox shipped in
001 also quietly measures the demand side: what share of leads opt in.

## Now without a consumer — kept deliberately

Flagged so these do not rot silently. Decision: **keep**. The tables cost
nothing empty, the module is pure and tested, and unwinding costs more than
carrying. Same call CLAUDE.md already records for `lib/animations.ts`.

| Asset | Note |
|---|---|
| `lib/appointments/availability.ts` + `time.ts` | 73 assertions, `npm run check:availability`. Nothing proposes slots now. |
| `sms_conversations`, `sms_messages`, `appointment_reminders`, `sms_suppressions`, `appointments` | Applied in migration 0001, empty |
| SMS consent checkbox on both forms | Collects a signal nothing acts on. Wording is still accurate — Steve may text customers from his own phone. |

⚠️ If any of this is still unused by **2027**, delete it rather than carrying
it further. Speculative code that survives a year stops being optionality and
becomes maintenance.

## Open decisions

| Question | Needed by | Why it matters |
|---|---|---|
| ~~**Will Steve install the ntfy app?**~~ | ~~002~~ | **DECIDED 2026-09-08**: no. He wants a direct text. There is no stopgap; carrier registration is the critical path. |
| **Toll-free or 10DLC?** | 002 | Toll-free verification is generally much faster and has no downside for one internal recipient. Choosing 10DLC by default could cost weeks for nothing. |
| **What goes in the alert, and how long can it be?** | 003 | SMS segments at 160 chars. Full details vs. a summary plus a dashboard link is a real trade — he is often in a truck. |
| **Whose name goes on the brand?** | 002 | Lamorinda Pavers, not Esquair — the brand is the business whose customers exist. Do not reuse another client's campaign; a mismatch is a suspension risk. |
| **Does Steve want to reply to the alert at all?** | 004 | Outcome capture assumes he will answer "won/lost". If he will not, that phase dies and `leads.status` stays a dashboard-only field. Worth asking in the same conversation as the alert format — he has now said no to one thing, and it is cheaper to find the second no now. |

## Standing rules

1. **`npm run build` before pushing.** CI now runs it on every PR (#36), but
   local is faster than waiting.
2. **Never fail a lead submission on a secondary failure.** The email to Steve
   is the critical path. A database write, an ntfy push, or an SMS send that
   throws must be logged and swallowed — the pattern is already in
   `submit-quote.ts`, and phase 001 verified it against a dead `DATABASE_URL`.
3. **Nothing business-specific hardcoded.** Steve is client #1 of N. The test
   is whether a second client could be onboarded by editing one config file.
   The blog engine already taught this lesson — see memory
   `project_engine_sync.md`.
4. **Quiet hours do not apply to the owner.** Steve wants leads when they
   arrive, including at 11pm. This rule existed for customer-facing sends and
   no longer has a subject.
5. **Mirror the review system's architecture**, which is the working reference
   implementation in this repo: thin scheduled function calling an
   authenticated route handler, claim-before-send ordering, duplicate
   protection enforced by a unique index rather than application code.

## Verification gates

| Phase | Gate |
|---|---|
| 002 | Twilio console shows the number verified/approved for sending. |
| 003 | Submit a quote; Steve's phone buzzes with the details in under a minute and the number is tappable. Then submit an unhappy `/feedback` rating; a second, visibly different alert arrives. |
| 004 | Steve replies "won" to an alert; `leads.status` updates and a review request appears in `/dashboard`. |
| 005 | Steve can say, unprompted, which alerts he acts on first. |

## Cost

Roughly **$5–10/month** — a Twilio number (~$2), A2P fees, and a few cents of
messages at this volume. Down from the $25–45 estimated for the customer-facing
version, since there is no LLM and no per-conversation traffic.

## Risks

- **Deploy previews share the production database.** One `DATABASE_URL` across
  all Netlify contexts (existing, documented in CLAUDE.md). Neon's
  branch-per-preview would close it.
- **The case study is now much smaller.** "Instant lead notification" is a
  weaker story than "AI books your appointments." Accepted deliberately — the
  owner sets the scope. The deferred half is additive if he warms to it.
- **Notification fatigue is the failure mode to watch.** If Steve starts
  ignoring the alerts, the system is worse than useless because it creates the
  illusion of coverage. Phase 006's triage signals exist to keep the alerts
  worth reading.
