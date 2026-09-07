# SMS appointment setting — implementation plan

Written 2026-09-07, against `main` at `e062e59`.

Wires an AI SMS appointment setter into the lead flow: a quote request comes
in, the customer is texted within seconds, an estimate visit gets booked on
Steve's calendar, and the outcome of that visit feeds the review sequence that
already exists.

## Goal

Two audiences, and the second one changes the build.

1. **Steve** — book more estimate visits with less phone tag.
2. **Esquair** — this is the reference implementation and the case study for
   selling the same system to future clients.

The second is why lead volume does not gate this. Steve may run under 15
leads/month, which would ordinarily argue for stopping at phase 004 (instant
templated reply) and letting him call people back. That argument is
**overruled**: the AI conversation and the calendar booking are the part that
demonstrates, so the build goes through 009.

Four consequences, each cheap now and expensive to retrofit:

- **Instrument for the case study from the start.** Most of it already falls
  out of the schema — lead-to-first-text latency is `leads.createdAt` against
  the first outbound `sms_messages.createdAt`; booking rate falls out of
  conversation states; outcomes come from `appointments.outcome`. The one gap
  is **job value**, which has nowhere to live today. See open decisions.
- **Business-specific strings go in config, not inline.** Steve is client #1 of
  N. The blog engine already taught this lesson the hard way (see memory
  `project_engine_sync.md`: the brand-string config refactor is the deferred
  prerequisite for cross-repo sync, and `gadgetconstruction` ran silently
  broken for eight weeks). Mirror `blog.config.ts`: business identity, service
  list, travel zones, booking rules, message templates, escalation triggers.
- **The dashboard is the case-study surface.** A prospect sees a screenshot,
  not the code. It warrants more design investment than an internal tool
  usually would.
- **Demo mode is a feature, not a debugging aid.** Being able to run a full
  conversation on a sales call, against a test number, without waiting for a
  real lead — and reset it afterwards.

⚠️ **The transcripts are Steve's customers' data, not Steve's.** Anonymise
before anything goes in a deck, and get Steve's sign-off on being named.

## Where this sits

The site already has both ends of this funnel and nothing in the middle:

```
quote form → email + ntfy to Steve                      ← built (Aug 2026)
                    ??? ← this plan
job done → dashboard → 3-email sequence → /feedback     ← built (Aug 2026)
```

The review system is the reference implementation. Every phase below reuses its
architecture rather than inventing one: a thin Netlify scheduled function
calling an authenticated route handler, claim-before-send ordering, and
duplicate protection enforced by a unique index rather than application code.
When a phase says "mirror `lib/reviews/dispatch.ts`", it means literally that.

## Already landed

Schema and the slot calculator are in `main`'s working tree, unapplied:

| Piece | Where | State |
|---|---|---|
| 4 new tables + 4 lead columns | `lib/db/schema.ts` | Written, **migration not applied** |
| Migration | `drizzle/0001_past_frank_castle.sql` | Generated, **not run** |
| Travel zones, slot ranking, DST-safe time | `lib/appointments/{availability,time}.ts` | Done, 63 assertions |
| Check script | `npm run check:availability` | Passing |

Nothing sends a text, reads a calendar, or writes a lead yet.

## Phases

| # | Phase | Blocks | External wait | Rough scope |
|---|---|---|---|---|
| [001](001-persist-leads.md) | Persist leads + capture SMS consent | everything | — | ~6 files |
| 002 | Twilio number + A2P 10DLC registration | 003 | **days–weeks** | account work, no code |
| 003 | SMS plumbing: send, receive, STOP, delivery status | 004+ | — | ~5 files |
| 004 | Instant templated auto-reply + Steve notification | — | — | ~3 files |
| 004b | Extract business-specific strings into `appointments.config.ts` | portability | — | ~1 file + call sites |
| 005 | Google Calendar read + slot preview in dashboard | 006 | Steve's answers | ~4 files |
| 006 | AI conversation engine (no booking) | 007 | — | ~6 files |
| 007 | Booking: calendar write + confirmation | 008 | — | ~4 files |
| 008 | Reminders + calendar reconciliation | — | — | ~3 files |
| 009 | Outcome capture → review-request handoff | — | — | ~3 files |

## Execution order

**001 → 002 (start, then wait) → 003 → 004 → 005 → 006 → 007 → 008 → 009**

Two things about this ordering that are not obvious:

**002 has external latency and must be started early, not done in order.**
A2P 10DLC brand and campaign registration is carrier vetting, not a form
submission — it takes days, sometimes weeks, and it can be rejected and need
resubmitting. Unregistered traffic gets filtered by carriers, often silently,
so there is no "test it now, register later" path. Registration also asks you
to show the opt-in flow, which means **the consent language from 001 has to be
live on the site before you can submit it.** So: finish 001, immediately open
the 002 registration, then build 003–005 while it sits in review.

**004 ships real value on its own and should not be skipped to reach 006.**
Speed-to-lead is where most of the return in this whole system lives. The gap
between a 4-hour callback and a 30-second acknowledgement dwarfs the gap
between a templated text and a conversational one. Ship 004, live with it, and
let it produce the corpus of real customer replies that 006's prompt should be
written against — rather than against guesses about what people text back.

## Dependency graph

```
001 (leads + consent) ──┬──> 002 (A2P registration) ──> 003 (SMS plumbing) ──> 004 (auto-reply)
                        │                                                          │
                        └──> 005 (calendar read) ────────────────────┬─────────────┘
                                                                      │
                                                                      v
                                                        006 (AI conversation)
                                                                      │
                                                                      v
                                                        007 (booking) ──> 008 (reminders)
                                                                      │
                                                                      v
                                                        009 (outcome → review request)
```

005 depends on 001 only for the lead's city; it can be built in parallel with
003 by anyone with the calendar credentials.

## Open decisions — resolve before the phase that needs them

These are not implementation details. Each one changes what gets built.

| Question | Needed by | Why it matters |
|---|---|---|
| **Steve's real bookable hours, visits/day, notice required** | 005 | `DEFAULT_RULES` in `availability.ts` is currently invented. A setter that books him at times he doesn't want to work gets switched off in week one. |
| **Is his calendar personal Gmail or Workspace?** | 005 | Personal: share the calendar with a service account's email, no OAuth. Workspace: domain-wide delegation. |
| **Does his personal life live on that calendar?** | 005 | If yes, use the FreeBusy API (busy intervals, no titles) rather than Events.list. If no, his availability data isn't trustworthy and clustering is guesswork. |
| ~~**Address on the quote form, or collected over SMS?**~~ | ~~001~~ | **DECIDED**: on the form, replacing `city`, moved to step 2. Net-zero field count, off the worst step. Revisit after 006 — the AI may make it unnecessary. See 001. |
| **Consent checkbox required or optional?** | 001 | Recommendation in 001: optional, default unchecked. Leads without it still email Steve, they just don't get texted. |
| **Where does job value get captured?** | 009 | "Booked 12 visits" is a decent case-study line; "generated $X in booked work" is the one that sells. Nothing in the schema holds a number today. Cheapest option: an amount alongside `appointments.outcome`, entered by Steve when he marks a visit won. |

## Verification gates

Every phase ends with something observable, not "the code compiles". No phase
is done until its gate passes.

| Phase | Gate |
|---|---|
| 001 | Submit a real quote from the live site; the row appears in Neon with source path and consent snapshot, **and the email still arrives**. |
| 002 | Twilio console shows the campaign approved. |
| 003 | Text the business number from a personal phone; the row appears in `sms_messages`. Reply STOP; the number lands in `sms_suppressions` and a subsequent send is refused. |
| 004 | Submit a quote; a text arrives in under a minute. Reply; Steve's ntfy fires. |
| 005 | Dashboard slot preview matches what Steve's actual calendar says he's free for, checked by eye against his phone. |
| 006 | Steve runs a full conversation from his own phone without booking. Then a real lead, watched live. |
| 007 | A booked slot appears on his calendar with the right address, at the right time — **verified across a DST boundary**, not just this week. |
| 008 | Move an appointment on the phone; the database catches up on the next cron run and the reminder fires for the new time. |
| 009 | Mark a visit won; a review request appears in `/dashboard` on its own. |

## Standing rules for every phase

1. **`npm run build` is the actual gate.** `pipeline-pr-check.yml` only runs on
   `drafts/` and `proposals/` branches — a `feat/` branch shows all-green
   having never been type-checked.
2. **Never fail a lead submission on a secondary failure.** The email to Steve
   is the critical path. A database write, an ntfy push, or an SMS send that
   throws must be logged and swallowed, the way `sendNtfy` already is in
   `submit-quote.ts`. A lead lost because Neon was briefly unreachable is a
   worse outcome than every failure mode this system is meant to fix.
3. **Treat inbound SMS as untrusted input.** It reaches an LLM holding tools
   that write to the database and a calendar. Tools stay narrowly scoped and
   server-validated; the model's output never decides whether it is authorised
   to act.
4. **Quiet hours.** Nothing automated sends between 9pm and 8am Pacific. A form
   submitted at 11pm queues for morning.
5. **Escalation silences the AI, from any state.** `aiEnabled` is a separate
   column from `state` for exactly this reason. Two voices texting one customer
   from the same number is the worst thing this system can produce.
6. **Nothing business-specific gets hardcoded past 004b.** Steve's name, phone,
   service list, hours, zones and copy live in config. The test is whether a
   second client could be onboarded by editing one file. This is the rule the
   blog engine skipped, and it cost eight weeks of silent breakage on a sibling
   repo — see memory `project_engine_sync.md`.
7. **Every phase leaves something screenshot-worthy.** The dashboard is where
   this gets sold, not just operated.

## Cost

Roughly $25–45/month at plausible volume: Twilio number ~$2, A2P fees ~$2–15,
~$0.01 per message each way, and LLM cost that rounds to nothing on Haiku for
turn-taking. The same Twilio account and A2P registration also covers the
deferred SMS review-request upgrade quoted to Steve at $49/mo — a decent
argument for doing both at once.

## Risks worth naming

- **Low volume makes the numbers thin, not the build wrong.** Under ~15
  leads/month a pure ROI argument would stop at 004; the case-study goal
  overrules that (see Goal). The consequence to plan around is that the case
  study will have a strong *narrative* and weak *statistics* — 5 bookings from
  8 leads reads well as a story and badly as a percentage. Lean it on the
  mechanism plus one real anonymised transcript, not on conversion rates.
- **Deploy previews share the production database.** One `DATABASE_URL` across
  all contexts (existing, documented in CLAUDE.md). A preview build can read and
  write real customer conversations. Neon's branch-per-preview would close it;
  until then, be careful what gets pointed at a preview URL.
- **Review gating on `/feedback` already carries Google-policy exposure.** This
  system increases traffic into that page. Not a new risk, but a growing one.
