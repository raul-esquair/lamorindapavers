# Orinda Ranking Strategy

**Written 2026-09-09.** Source of truth for the `/orinda` ranking push.
Data pulled live from GSC (domain property) on that date; re-pull before
trusting any number here.

---

## The diagnosis — read this first, it reframes the whole task

`/orinda` does not have a ranking problem. It has a **click** problem.

Last 90 days, queries landing on `/orinda`:

| Query | Impr. | Avg pos | Clicks |
|---|---|---|---|
| paver installer orinda | 134 | **3.8**¹ | **0** |
| paver contractor orinda | 135 | 5.4¹ | **0** |
| paver patios orinda | 146 | 7.7 | **0** |
| paver driveways orinda | 31 | 8.3 | **0** |
| paver installation orinda | 12 | 11.1 | **0** |
| driveway contractor orinda | 111 | 27.5 | 0 |
| pool deck installation orinda | 74 | 18.4 | 0 |

¹ site-wide position for the query; the page-filtered figure is slightly lower.

**Zero clicks across every Orinda query in 90 days**, including several sitting
on page one. Expected CTR at position 4 is roughly 7%; 134 impressions should
have produced ~9 clicks. It produced none.

A position-4 organic result that earns literally zero clicks is not
underperforming — it is **not being seen**. For local commercial intent
("paver contractor orinda") the visible SERP is:

1. Google Ads
2. The **local pack** (three map results)
3. Aggregators — Houzz, Diamond Certified, Yelp
4. …organic, below the fold

We rank at #4 *organic*, which is roughly #12 *visually*.

**So the highest-leverage work is not more on-page content.** The Orinda page
is already the best-researched page on this SERP — every competitor ranking
against it is a programmatic doorway page (`sanpablopavers.com/paver-contractor-orinda-ca/`,
`metapavingstones.com/locations/orinda/`, `vikingpavers.com/orinda/`,
`fgpaversandturf.com/city/orinda/`, `dcarmopavers.com/location/orinda/`).
Writing more of what we already do well will not move a number that is zero
for reasons the page cannot control.

Work the two things that can: **get into the local pack**, and **win the
queries that have no local pack**.

---

## Track A — The local pack (owner-dependent, highest ROI, zero code)

Black Diamond Paver Stones ranks in the Orinda pack with **4.9 stars across
169 Google reviews**. Lamorinda Pavers has a Google Business Profile
(`company.social.googleReview` resolves) and, per project notes, **no Google
reviews yet**.

That single fact explains the zero. No amount of on-page work substitutes for
it — the pack is chosen by proximity, prominence and reviews, and we are at
zero on the one input we control.

The review-request system already exists, is live, and has been verified
end-to-end. The bottleneck is **volume of jobs entered into it**, which is
Steve's behaviour, not the software.

- Reviews are also a *recency* signal — the existing TODO notes a "recency
  cliff" at ~18–21 days. Steady trickle beats a batch.
- ⚠️ `/feedback` gates: only ratings 3–4 see the Google link. That is a
  deliberate, owner-directed business decision (design decision #13) and is
  **not** re-opened here. It does mean roughly the top-half of sentiment is
  the addressable pool — worth knowing when forecasting how fast 0 → 20
  reviews happens.

**Nothing else in this plan outranks this.** Everything below is worth doing
and is what we actually control, but if reviews stay at zero, `/orinda` keeps
converting page-one rankings into no phone calls.

---

## Track B — The Zone 0 play (the real content opportunity)

This is the one genuinely new thing, and the timing is unusually good.

### What happened

- **19 Aug 2026** — the California Board of Forestry unanimously approved the
  final **Zone 0** ember-resistant-zone regulations, after six years of drafts.
- They went to the Office of Administrative Law in early September and are
  expected to become **legally effective around the end of September 2026** —
  i.e. within weeks of this document.
- Zone 0 = the **first 5 feet** around a structure. It applies to State
  Responsibility Areas and to parcels mapped **Very High Fire Hazard Severity
  Zone** in local jurisdictions. Roughly 2 million structures.
- **Pavers, concrete, gravel and stone are the named compliant ground
  surface.** Bark mulch, wood chips, woody shrubs and vegetation against the
  wall come out. This is not a stretch connection — hardscape *is* the
  remedy the regulation points at.
- Existing homes phase in: day-one housekeeping items, **combustible material
  out of the first 5 ft within 3 years**, structural items at 3–5 years.
- **AB 38 requires documented defensible-space compliance at point of sale** —
  which matters enormously in a market like Orinda.

### Why Orinda specifically

- The Moraga-Orinda Fire District is a designated **Wildland Urban Interface
  community**, and the City states many parts of Orinda are high fire hazard
  severity zones. New CAL FIRE FHSZ maps landed February 2025.
- **MOFD ordinance 23-03** requires 100 ft of defensible space (or full parcel
  under an acre).
- MOFD runs **annual inspections by named street and date** — 2026 sweeps
  covered Camino Pablo, Miner Road, Camino Sobrante, Glorietta Boulevard,
  Overhill Road, Lombardy Lane, then Monte Vista Ridge / Claremont, the streets
  behind Orinda Country Club (Manzanita, Acacia, Los Altos), and Charles Hill /
  Diablo View.

So: a regulation taking effect this month, an inspection regime that names the
exact streets our neighbourhood section already names, a compliance deadline
tied to home sales, and a remedy we install.

### Why it wins where the current page cannot

These are **informational queries with no local pack and no ads**:

- "what can I put in zone 0 california"
- "zone 0 requirements existing homes"
- "do pavers count for zone 0"
- "orinda defensible space requirements"
- "mofd defensible space inspection"

Organic position 1 on those is *actually* position 1. And not one of the
doorway competitors will have this — their pages are template spins that
cannot carry a jurisdiction-specific regulatory story.

### What to build

1. **New section on `/orinda`**, placed second (immediately after the hero,
   ahead of the soil hook) for the next two quarters while the rule is news:
   *"Zone 0, MOFD Inspections, and What Hardscape Actually Solves."*
   Cover the 5-foot rule, the compliant-materials list, the 3-year clock, the
   MOFD inspection streets, and the AB 38 point-of-sale angle.
2. **3 new FAQs** appended to `orindaFaqs` in `app/orinda/content.ts` —
   they flow into `FAQJsonLd` automatically:
   - "Do pavers satisfy Orinda's Zone 0 ember-resistant requirement?"
   - "MOFD is inspecting my street. What do I actually have to change in the first five feet?"
   - "I'm selling my Orinda home. Does defensible space affect the sale?"
3. **One supporting blog post**, queued through the normal engine, targeting
   the informational cluster. It links to `/orinda` with a descriptive anchor
   (see Track C).
4. ⚠️ **Accuracy guardrails.** The rule was approved but the effective date is
   an expectation, not a filing. Write dated, sourced, hedged language and
   include a "confirm with MOFD at the counter" line — exactly the pattern the
   header comment in `app/orinda/content.ts` already establishes. Do **not**
   state a compliance deadline as settled fact, and do not imply we perform
   defensible-space certification. Re-verify against MOFD and the Board of
   Forestry before publishing, and put the check date in the file.

---

## Track C — Internal linking (real, fixable dilution)

`/orinda` has **47 inbound blog links** — and 47 of them use the bare anchor
text `Orinda`, nearly all inside the same repeated city-dump sentence:

> across [Lafayette](/lafayette), [Orinda](/orinda), [Moraga](/moraga), [Walnut Creek](/walnut-creek), and [Danville](/danville)

Only four descriptive anchors exist site-wide (`Orinda paver patios` ×2,
`Orinda paver patio`, `Orinda install`).

Two problems. Anchor text carries topical signal and ours carries none beyond
the city name. And the dump pattern is the same undifferentiated
all-cities-in-a-row construction that the project's own anti-doorway rule #5
warns about — we avoided it in page *sections* and then reproduced it 47 times
in prose.

**Fix:**

1. Diversify anchors on the highest-authority posts. Target a spread like
   `Orinda paver driveways`, `hillside paver work in Orinda`,
   `Orinda clay soil base spec`, `paver contractor in Orinda`. Keep bare
   `Orinda` as the minority case, not the rule.
2. On posts where the city list is pure boilerplate, cut the list to the two
   or three cities the post is actually about. Five-city lists in every closing
   paragraph are filler.
3. Add a contextual `/orinda` link from `/services/pool-decks`,
   `/services/retaining-walls` and `/services/water-features` — Orinda's three
   differentiated services, currently linked from nowhere in the service tree.
4. Update `orindaGuideSlugs` to include the new Zone 0 post once published.

---

## Track D — Technical SEO

`/orinda` is already ahead of most of the site: canonical, `BreadcrumbJsonLd`,
`ServiceJsonLd`, `FAQJsonLd`. Real gaps:

1. **⚠️ `ServiceJsonLd` breaks the entity graph.** Its `provider` emits a
   *detached* `HomeAndConstructionBusiness` node with a name, phone and URL —
   it does **not** reference `BUSINESS_ID` by `@id`
   ([components/seo/JsonLd.tsx:175](components/seo/JsonLd.tsx:175)). So every
   page using it declares a second, unlinked business entity instead of
   strengthening the canonical one. This is the same mistake the blog author
   fix was written to prevent, in a different component. **One-line fix,
   benefits every page using `ServiceJsonLd`.** Highest-value item in this
   track.
2. **The Steve note is invisible to machines.** `orindaSteveNote` is the
   page's strongest E-E-A-T signal and renders as an unattributed blockquote.
   Wrap it so it resolves to the canonical `#steve` `Person` — the entity
   already exists in `lib/seo/entities.ts` and the blog already references it.
3. **Title tag is generic.** Current: `Paver Installation in Orinda, CA |
   Lamorinda Pavers` (51 chars). It targets "paver installation orinda" — our
   *weakest* Orinda query (12 impressions) — while the two strongest are
   "paver **contractor** orinda" (135) and "paver **installer** orinda" (134),
   neither of which the title contains. Rewrite to lead with contractor/
   installer intent and a differentiator, staying ≤60 chars.
4. **Meta description is a feature list.** It reads like every doorway
   competitor. Since we cannot outrank the pack, the description has to earn
   the click on specificity — hillside, clay, ordinance handling.
5. **The nine templated city pages have no JSON-LD and no canonical at all**
   ([app/[city]/page.tsx](app/[city]/page.tsx)). Out of scope for Orinda but
   flagged here because it is a bigger hole than anything on this page, and
   `/berkeley`, `/martinez` and `/dublin` are all high-impression pages.

---

## Track E — AEO / GEO

Taking AEO as answer engines (featured snippets, People Also Ask, AI
Overviews) and GEO as generative engines (ChatGPT, Perplexity, Gemini)
citing the page as a source. They reward the same things and both favour us
here, because the competition is template spam.

**What already works:** eight substantive FAQs with `FAQPage` markup, specific
numbers (12-inch oak diameter, 50 cubic yards, 4 ft / 8 ft wall thresholds,
6–8 inch base), named ordinances (OMC §15.36, Ch. 17.21, Ord 25-03), and a
named credentialed human. That is exactly the citable-fact density generative
engines pull from.

**What to change:**

1. **Front-load every FAQ answer with a direct one-sentence answer**, then
   elaborate. Several currently open with context and reach the answer in
   sentence two or three. Snippet extraction takes the first sentence.
2. **Add a "pavers vs. asphalt vs. concrete on Orinda clay" comparison
   block.** Comparison tables are disproportionately cited by AI Overviews,
   and it captures "asphalt paving contractor orinda" (45 impressions, pos
   35.6) — a query we currently rank badly for with nothing relevant to offer.
3. **Date and source the regulatory claims inline.** Generative engines weight
   recency and verifiability; "as of September 2026, per MOFD Ordinance 23-03"
   is more citable than the same fact unattributed.
4. **Keep the specificity that already exists.** The temptation when a page
   gets no clicks is to make it broader and more commercial. That would trade
   away the only asset it has.

---

## Sequence

| # | Work | Cost | Depends on |
|---|---|---|---|
| 1 | ✅ `ServiceJsonLd` `@id` fix | done 2026-09-09 | — |
| 2 | ✅ Title + meta rewrite | done 2026-09-09 | — |
| 3 | ✅ Front-load FAQ answers; add comparison block | done 2026-09-09 | — |
| 4 | Zone 0 section + 3 FAQs on `/orinda` | ~4 h | re-verify sources |
| 5 | Anchor-text diversification pass | ~2 h | — |
| 6 | Zone 0 blog post via the engine | 1 cycle | #4 |
| 7 | Service-page → `/orinda` contextual links | ~1 h | — |
| — | **Google reviews** | ongoing | **Steve** |

1–3 are same-day and touch no content decisions. 4 and 6 are the bet. The
last row is the one that actually decides whether any of it produces a call.

## How we will know it worked

Re-pull GSC in 30 and 60 days and watch, in order:

1. **Clicks on any Orinda query > 0.** That is the whole thesis. Current: 0.
2. Impressions on Zone 0 / defensible-space queries — should appear from
   nothing, and they are queries the page cannot currently rank for at all.
3. Position on "paver contractor orinda" / "paver installer orinda" — expect
   these to be *stable*, not better. They are already page one; the fix is
   visibility, not rank.
4. Whether `/orinda` appears in the local pack. Review-count driven, slowest
   to move, largest effect.

⚠️ Attribution caveat: if reviews and content ship together, we will not know
which one worked. If Steve's review flow starts in earnest, ship items 1–3
first and hold 4–6 by two weeks so the signals separate.


---

## Shipped 2026-09-09 (items 1–3)

- **`ServiceJsonLd` `@id` fix.** `provider` now references `BUSINESS_ID`
  instead of redeclaring the business. Verified in the built HTML: exactly one
  `HomeAndConstructionBusiness` node per page, and
  `"provider":{"@id":"https://lamorindapaving.com/#business"}` on `/orinda`,
  `/moraga` and `/lafayette`.

- **⚠️ Found and fixed a production bug not in the original plan: every bespoke
  city page rendered the brand twice.** The root layout applies
  `template: "%s | Lamorinda Pavers"`, and all three pages *also* hand-appended
  it, so live titles read `Paver Installation in Orinda, CA | Lamorinda Pavers
  | Lamorinda Pavers` — 70 chars, truncated by Google, brand duplicated.
  Confirmed against production with `curl` before changing anything. This is
  the same class of bug as the blog-title fix in #42, in a different place;
  the CLAUDE.md note about blog titles should probably be generalised.
  - `/orinda` retitled to `Orinda Paver Contractor & Installer` (54 chars
    templated) — it now contains "contractor" and "installer", the two
    highest-impression Orinda queries, which the old title matched neither of.
  - `/moraga` and `/lafayette` had only the duplicate brand removed. Their
    keyword rewrites wait on their own query research.

- **Meta description** cut from 191 chars (truncated) to 150.

- **FAQ front-loading — 3 of 8, not "several".** The plan implied more were
  weak; on inspection five already answered in the first sentence and were
  left alone. Fixed: the driveway-permit, stormwater, and clay-base answers.

- **Comparison table** (`orindaMaterialComparison` in `app/orinda/content.ts`)
  rendered inside the existing spec section rather than as its own `<section>`
  — a new section between two others would have forced a cascade of
  background-class swaps down the file for cosmetic reasons only.
  Up-front cost is deliberately a row pavers lose.

**Verified:** `npm run build` green, `/orinda` still `○` static; `npm run lint`
8 problems (unchanged baseline); table semantics correct (`scope` on all
headers, `<caption>`); contained horizontal scroll confirmed at 375px, 701px
and 1280px with the page body never scrolling sideways.

**Not done, still open:** items 4–7, and the Google reviews row that decides
whether any of this converts.
