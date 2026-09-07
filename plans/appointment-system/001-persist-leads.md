# 001 — Persist leads and capture SMS consent

- **Status**: NOT STARTED
- **Severity**: HIGH — data is being lost right now
- **Blocks**: every other phase
- **External wait**: none
- **Scope**: ~8 files, plus applying one migration

## Problem

`lib/actions/submit-quote.ts` sends an email to Steve and an ntfy push, then
drops the submission on the floor. The `leads` table has existed since the
review-system migration and is empty.

Two costs, today, with no SMS system in the picture:

1. **Nothing answers "which pages produce work."** The site has 12 city pages,
   11 service pages and 14 blog posts, all built on the assumption they
   generate leads, and there is no way to check.
2. **Every submission is one inbox search away from being unrecoverable.**

And for this plan specifically: an AI texter needs a durable row to attach a
conversation to. Nothing downstream can be built until this lands.

## What changes

### 1. Apply the migration

`drizzle/0001_past_frank_castle.sql` is generated but has never run. It creates
the four SMS/appointment tables and adds four columns to `leads`
(`address`, `sms_consent_at`, `sms_consent_text`, `sms_consent_ip`).

```bash
node --env-file=.env ./node_modules/drizzle-kit/bin.cjs migrate
```

`.env` values must stay double-quoted — Neon URLs contain `&`, which breaks
`source .env` in zsh (existing gotcha, documented in CLAUDE.md).

⚠️ **Deploy previews share this database.** There is one `DATABASE_URL` across
all Netlify contexts. Applying the migration affects previews too; that is
fine here (purely additive), but worth knowing.

### 2. `lib/leads/queries.ts` — new

One exported function:

```ts
export async function createLead(input: NewLead): Promise<Lead | null>
```

Returns `null` rather than throwing on a database failure. The caller must not
be able to fail a lead submission because Neon hiccuped — see rule 2 below.

### 3. `lib/actions/submit-quote.ts` — extend

Add to `QuoteSubmission`:

```ts
  /** Path the form was submitted from, for attribution. */
  sourcePath?: string;
  /** "modal" | "contact-page" */
  sourceKind?: string;
  /** Whether the SMS consent box was ticked. */
  smsConsent?: boolean;
  /** Street address, if the form asks for it — see open decision below. */
  address?: string;
```

**The database write joins the existing `Promise.allSettled`, and its failure is
logged, not returned.** The file already does exactly this for ntfy:

```ts
if (ntfyResult.status === "rejected") {
  console.error("ntfy error:", ntfyResult.reason);
}
```

Follow that shape precisely. Only a Resend failure returns `{ ok: false }`. A
lead lost because the database was briefly unreachable is a worse outcome than
every failure mode this whole system exists to fix.

Capture the IP server-side from `headers()` — never accept it from the client.
Nothing in the repo reads request headers today, so **log the full header set
once on a deploy preview and confirm which one Netlify actually populates**
before relying on it; `x-nf-client-connection-ip` and the first entry of
`x-forwarded-for` are the candidates. A null IP is acceptable; a wrong one is
worse than none.

### 4. Consent language — one constant, snapshotted per row

```ts
// lib/leads/consent.ts
export const SMS_CONSENT_TEXT =
  "Text me about my estimate. Message and data rates may apply. " +
  "Reply STOP to opt out. Consent is not a condition of purchase.";
```

Store the **string itself** on the lead row, not a version number. The wording
will be edited; rows written before an edit must keep what was actually on
screen at the time. A boolean proves nothing in a dispute — what matters is
what they agreed to and when.

⚠️ This exact string is also what gets submitted to the carriers during A2P
registration (phase 002), so it has to be live on the site first.

### 5. Both forms — consent checkbox + source path

`components/ui/QuoteModal.tsx` and `app/contact/ContactPageContent.tsx` share
their step and radio markup. CLAUDE.md's standing note applies: *a fix to one
usually belongs in both.* Both call `submitQuote` from the same import.

- Add an **unticked** checkbox on the contact step rendering `SMS_CONSENT_TEXT`.
- **Recommendation: optional, not required.** A lead that doesn't tick it still
  emails Steve, it just never gets texted. Making consent a condition of using
  the form is both worse for conversion and the riskier reading of the rules.
- Pass `sourcePath: window.location.pathname` from the modal (it opens from any
  page). `ContactPageContent` can hardcode `"/contact"`.
- Pass `sourceKind: "modal"` / `"contact-page"`.

⚠️ **If the checkbox is a visually-hidden input, its `<label>` carries the focus
ring** (`has-[:focus-visible]:ring-2`) — same rule as the service radios, and
for the same reason: the browser focuses a 1px-clipped input invisibly and the
tab stop reads as skipped. A plain visible checkbox is simpler and preferred.

New tappable surfaces get `.press`, not a bare `hover:` (design decision #15).

### 6. Pre-select the service on step 1

Step 1 asks the visitor to pick one of 11 services before they can do anything
else. Most of the time **the page already answered that question** — the modal
opens from `/services/retaining-walls`, or a blog post about paver driveways —
and asking anyway turns a confirmation into a decision.

Do NOT delete step 1 to fix this. It is the easiest possible first action —
one tap, no typing, no personal information — and that ramp is doing real work:
completing a trivial first step raises the odds of finishing the rest. Deleting
it makes the opening screen a text area or, worse, the contact fields. Step
count is the wrong metric; what sits on the first screen is the right one.

**Nothing pre-selects today.** The context exposes `open: () => void` and
`QuoteButton` takes no service prop, so every entry point starts from a blank
11-way choice.

Changes:

1. `components/ui/QuoteModal.tsx` — widen the context to
   `open: (service?: string) => void`. Hold the value in provider state and
   pass it to `useForm`'s `defaultValues`. Keep the existing trigger capture in
   `open()` exactly as it is: it is captured at click time, not on unmount,
   because the mobile menu closes itself when its CTA is tapped and takes the
   button with it.
2. `components/ui/QuoteButton.tsx` — accept an optional `service?: string` and
   forward it to `open()`.
3. `app/services/[slug]/ServiceDetailContent.tsx:189` — pass the page's own
   slug. **This is the only call site today that knows a service.** The other
   nine (Hero, Header ×2, FinalCTA, and the city pages) legitimately don't, and
   must keep today's blank-choice behaviour.
4. Add a **"Not sure yet / a few things"** option to the service list. Some
   real leads genuinely don't know, and forcing a pick either loses them or
   produces junk data. It maps to a null `service` on the lead row.

Optional follow-on, not required for this phase: `components/blog/BlogCTA.tsx`
currently renders a plain `href` link rather than opening the modal. Posts
carry a `relatedService`, so switching it to a `QuoteButton service={...}`
would pre-select from 14 more entry points. Worth doing, but it changes blog
CTA behaviour and belongs in its own change.

⚠️ **Do not measure this.** At Steve's volume a 5–10% conversion difference is
undetectable for years. Pre-selecting is right because it dominates both
alternatives — strictly less work than today, strictly more momentum than
deleting the step — not because a test will confirm it.

### 7. Dashboard — a leads list

`app/dashboard/(app)/` currently holds only review requests. Add a leads view:
name, phone, city, service, source path, date, status. Server Actions re-check
the session themselves via `requireAuth()` — the layout gate protects the page,
not the action (`lib/actions/review-requests.ts` has the pattern).

Read-only is enough for this phase. Editing `status` can wait for 009.

## Open decision — resolve before starting

**Street address on the form, or over SMS?**

Decided: **on the form, replacing `city`, on step 2.** `city` is currently an
optional field on step 3 — the contact step, where abandonment concentrates and
it is the fourth thing asked alongside name, phone and email. Moving it to step
2 and widening it to a full address is net-zero on field count, shortens the
worst step, and puts the question where it reads as being about the project
rather than about the person. Keep it optional; anything skipped gets collected
over SMS in phase 006.

`zoneForCity()` takes a city string, so add a sibling that scans an address for
a known city name — the list is already in `company.allCities()` and the
normaliser handles case and punctuation. Falls back to `"unknown"` exactly as
today.

⚠️ **Hold this loosely.** The form currently collects everything because it is
the only touchpoint. After phase 006 an AI texts every lead within 30 seconds
and can ask anything, at which point the form's job shrinks to name and phone,
and the address is the first field that should come back off it. This is a
stopgap that the SMS system may make unnecessary.

Original framing, for the record:

- **On the form**: one fewer text exchange, and you get an address for every
  lead including the ones that never reply. Costs one more field.
- **Over SMS**: lower form friction; the AI must collect it before proposing
  slots, since it feeds travel-zone clustering.

The column exists either way. If it goes on the form, add it here; if not,
it stays null until phase 006.

## Verification

1. `npm run build` — must be clean. CI will not do this for a `feat/` branch.
2. `npm run check:schedule` and `npm run check:availability` — both still pass.
3. Submit a quote **from the modal on a city page** (not `/contact`), with the
   consent box ticked.
   - The email arrives at `stevebarsanti@icloud.com` as before.
   - The ntfy push fires as before.
   - A row appears in `leads` with `source_path` = that city page,
     `source_kind` = `"modal"`, and `sms_consent_text` matching the constant.
4. Submit again from `/contact` **without** ticking consent.
   - Row appears; `sms_consent_at` is null.
5. **Break the database deliberately** — point `DATABASE_URL` at a bad host
   locally and submit. The email must still send and the form must still show
   success. This is the single most important check in this phase; the whole
   design rests on the write being non-fatal.
6. The row is visible in `/dashboard`.
7. Open the modal from `/services/patios` — step 1 shows Patios already
   selected, and Continue advances without a tap on the radio list.
8. Open it from the header on the homepage — step 1 is blank, as today.
9. Tab through step 1 with a keyboard. The pre-selected radio takes focus and
   the visible focus ring appears on its `<label>`, not nowhere — the radios
   are `sr-only`, so a missing ring reads as a skipped tab stop.
10. Pick "Not sure yet"; the lead row's `service` is null and the email to
   Steve still renders a sensible service line rather than "undefined".

## Notes for whoever picks this up

- `leads.phone` is nullable in the schema but the form requires it. Leave the
  column nullable; phase 003 requires a phone before opening a conversation.
- **Duplicate submissions are not deduped.** Someone double-clicking creates
  two rows. Harmless now; phase 003's partial unique index on
  `sms_conversations.phone` stops it becoming two AI texters talking over each
  other. Worth revisiting only if the data gets noisy.
- Do not add a `leads` write inside `submit-feedback.ts`. Different table,
  different lifecycle.
