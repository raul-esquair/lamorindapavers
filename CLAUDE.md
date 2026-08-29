# Lamorinda Pavers — Project Context

## Business Details
- **Company:** Lamorinda Pavers
- **Owner:** Steve Barsanti (sole face of the business, personally oversees every project)
- **Phone:** 925-389-0119 | **Email:** steve@lamorindapaving.com
- **CA License:** #1092749
- **Warranty:** 5-year workmanship/labor
- **Financing:** No
- **Reviews:** Yelp (no Google reviews yet)
- **Service Area:** Wider East Bay — Contra Costa + parts of Alameda County
- **Domain:** lamorindapaving.com

## Services (11 total)
Paver Driveways, Retaining Walls, Patios, Artificial Turf, Landscape Design, Fire Pits & Fire Features, Outdoor Kitchens, Pool Decks, Putting Greens, Water Features, Arbors & Pergolas

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-based config in `globals.css`, no `tailwind.config.ts`)
- **Animations:** Framer Motion via `LazyMotion` + `m.*` (NOT `motion.*` — see below), GSAP + ScrollTrigger (available but not yet used), Lenis (smooth scroll)
- **Image blurs:** `plaiceholder` (build-time blur generation, output at `lib/blur-map.json`)
- **Forms:** React Hook Form
- **Database:** Neon (serverless Postgres) via Drizzle ORM — see "Database" section
- **Deployment:** Netlify (config in `netlify.toml`)
- **Repo:** https://github.com/raul-esquair/lamorindapavers

## Design System

### Brand Colors (from logo)
- Primary Blue: `#3B7DD8` (LP monogram)
- Red Accent: `#C94141` (line above "LAMORINDA")
- Gold Accent: `#E8A83E` (line below "PAVERS")
- Text Dark: `#1A1A1A`
- Warm White: `#FAF8F5` (base background)
- Cream: `#F5F0EB` (alternate section background)

All colors are defined as CSS custom properties in `app/globals.css` and exposed as Tailwind theme tokens via `@theme inline`.

### Typography
- **Headlines:** Playfair Display (serif) — `font-serif` / `var(--font-playfair)`
- **Body:** DM Sans (sans-serif) — `font-sans` / `var(--font-dm-sans)`
- **Accents/Labels:** DM Sans uppercase with wide letter-spacing — `.label-text` utility class
- Fonts loaded via `next/font` in `app/layout.tsx`

### Aesthetic
- Light & clean (warm whites/creams) — approachable luxury
- Full cinematic animations — scroll-scrubbed, not fire-on-enter
- Generous whitespace, editorial layouts

## Animation Architecture

### Critical Pattern: Scroll-Position-Linked
All animations are tied to scroll position via Framer Motion `useScroll` + `useTransform`. Elements do NOT animate entirely upon barely entering the screen. Animation progress maps 1:1 with the user's scroll movement. This is a core design decision — do not regress to `whileInView` trigger-based animations. As of Aug 2026 there are **zero** `whileInView` call sites left; keep it that way.

### Critical: Use `m.*` not `motion.*`
The entire app is wrapped in `<LazyMotion features={domAnimation}>` (in `components/layout/ClientProviders.tsx`). Every component uses `import { m } from "framer-motion"` and renders `<m.div>` etc. **Never write `motion.*` in new code** — it works at runtime but forces the full motion bundle to load synchronously, defeating the ~20 KB savings. If you accidentally introduce `motion.*`, run `node scripts/migrate-motion-to-m.mjs` to fix.

### Motion curves live in tokens — never hand-type a cubic-bezier
`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` and `--ease-in-out` are defined in `:root` and re-exported through `@theme inline` (so Tailwind emits `ease-out` / `ease-in-out` utilities), and mirrored in TS as `EASE_OUT` / `EASE_IN_OUT` in `lib/animations.ts`. The TS mirror exists because framer cannot read a CSS custom property for `ease` — **edit the two together.**

These deliberately shadow Tailwind's built-in `ease-out` / `ease-in-out`; nothing used the built-ins. The site previously had one hand-typed curve, `[0.25, 0.1, 0.25, 1]`, at 14 sites — which is the CSS `ease` keyword verbatim, a slow-start curve, wrong on the entrances it was used for.

**Never `transition-all`.** It animates `box-shadow` off-GPU and, on the header, `backdrop-filter` — which re-rasterises the viewport every frame. Name the properties: `transition-[background-color,box-shadow]`. Hover responses get `duration-200`, focus rings `duration-150`.

### Reduced motion is honoured in three layers
1. `@media (prefers-reduced-motion: reduce)` at the bottom of `globals.css` neutralises looping `animation`s. It deliberately does **not** touch `transition-*` — the common `transition-duration: 0.01ms !important` blanket would silently kill `.press`, every colour transition, and the focus rings.
2. `useReducedMotion()` in `Hero`, `ScrollReveal`, `ScrollStagger`, `TextReveal`, `ParallaxImage`, `ServiceCard`, `TrustBar`, `ProjectChapter`. The pattern is to collapse a `useTransform` output range to an identity pair — **never** move a hook inside a conditional.
3. `SmoothScroll` does not instantiate Lenis at all. `getLenis()` then returns `null`, which every caller already handles. Their `scrollIntoView` fallbacks are **also** gated, because an explicit `behavior: "smooth"` overrides the CSS `scroll-behavior`.

Opacity fades stay; position and scale changes go. `.press` stays — see below.

### Press feedback — `.press`, not a bare `hover:`
Hover does nothing on a touch screen and most traffic here is touch, so a hover-only button is silent between finger-down and the modal or navigation appearing. **Every new tappable surface gets the `.press` utility** (bottom of `app/globals.css`), not just a `hover:` class.

`.press` deliberately owns the whole `transition` shorthand instead of layering onto Tailwind's `transition-all` — `globals.css` is unlayered, so it beats the `utilities` layer, and a partial declaration would be silently clobbered. It carries the colour transitions too, so **remove `transition-all` / `transition-colors` when you add it**, or you get one or the other rather than both.

Two documented exceptions:
- **Full-width rows** (`FAQAccordion`) answer in colour instead — a 3% scale across a full-width bar reads as the layout lurching, not a button depressing. Use `active:bg-*` + `active:duration-75`.
- **Elements already carrying a transform** (`ServiceCard`) fold the press into their existing `animate` object. A competing CSS transform on `ServiceCard`'s inner `<Link>` would flatten the 3D context its `translateZ` children depend on.

Press feedback is intentionally **kept under `prefers-reduced-motion`** — a 3% scale caused directly by the user's own finger is not vestibular motion, and removing it takes away the feedback rather than gentling it.

### Gestures are hand-rolled on Pointer Events — do NOT switch to `domMax`
`LazyMotion features={domAnimation}` does not include framer's `drag` gesture. Enabling `drag` means `domMax`, which gives back the bundle saving this whole codebase is written around (see the `m.*` rule above).

So drag lives in `lib/hooks/use-drag-dismiss.ts`, on raw Pointer Events. It is not a stopgap — it implements what framer's `drag` does not give you for free: grab-offset preservation, an 80ms velocity window, exponential-decay momentum projection (`(v/1000)·d/(1−d)`, `d ≈ 0.998` — **not** the textbook `v²/2a`; they disagree noticeably at the velocities a thumb produces), release-velocity handoff into the spring, and rubber-banding at the boundary. Reuse this hook for any future sheet rather than reaching for `drag`.

### Lenis is exposed via `getLenis()`
`components/animations/SmoothScroll.tsx` stores its Lenis instance in a module-level singleton. Read it live at click time via `getLenis()` — NOT a hook. Used for programmatic scrolls (`ProjectShelf` thumb clicks, `ProjectsClient` filter-change scroll). Never use native `scrollIntoView` for in-page navigation while Lenis is active — the smooth motion gets double-applied.

### Key Components
- **`ScrollReveal`** (`components/animations/ScrollReveal.tsx`) — Fade + translate tied to scroll. Supports `direction` prop: `up`, `left`, `right`, `none`. Uses `useScroll` with offset `["start 0.95", "start 0.4"]`.
- **`ScrollStagger`** (`components/animations/ScrollStagger.tsx`) — Wraps children; each child tracks its own viewport position independently via its own `useScroll` ref. Do NOT share a parent scroll progress across children. Takes `as="ul"` to render a semantic list: container and item switch to `<ul>`/`<li>` **together**, because a `<div>` between them is invalid HTML and breaks the list for assistive tech. Used by `/services/[slug]`'s "What's Included".
- **`ServiceCard`** (`components/ui/ServiceCard.tsx`) — Parallax image (shifts with scroll), 3D tilt on hover (spring physics), cursor-following shine effect. Icon badge turns from white to original red on hover.
- **`ProjectRevealCard`** (in `FeaturedProjects.tsx`) — Clip-path curtain reveal scrubbed to scroll. Alternating directions (left, right, bottom). Curtain colors cycle through logo colors (blue, red, gold). Text fades in after image is 70% revealed.

### Process Section (`components/sections/Process.tsx`)
Complex sticky scroll storytelling with separate desktop and mobile implementations. Uses 4 illustrated WebPs in `/public/images/process/` (`free-consultation`, `custom-design`, `expert-installation`, `final-walkthrough`).

**Desktop:** Left side pins a large image that cross-fades as steps scroll on the right. Image switch thresholds at `[0.35, 0.58, 0.8]` of the steps container scroll. Each image holds until the next step fully arrives.

**Mobile:** Sticky image pins below header (top-20, z-20). Cards 1-3 scroll behind the image (z-10). Image switches when each card becomes readable (tracked per-card via individual `useScroll` refs with `onVisible` callbacks). Card 4 is outside the sticky wrapper — it sits below the image with a gap, and both scroll out of view together. Image transitions use `animate` with `duration: 0.15s` fade-in (z-2) and `0.3s` fade-out (z-1) to prevent flash. Reverse scrolling fires `onVisible(index - 1)`.

This section uses plain `<img>` (not `next/image`) because of how the layered cross-fade is built. Blur map entries for these images exist but are unused here — they would activate if the section were upgraded to `next/image`.

## Page Structure (37 pages)

### Routes
- `/` — Homepage (9 sections)
- `/services` — Services overview grid
- `/services/[slug]` — 11 individual service detail pages
- `/projects` — Sticky-stacking editorial gallery with per-chapter pin, clip-path curtain transitions, URL-state filtering, sticky-bottom shelf nav. See "Projects Gallery" section below.
- `/areas` — Service areas hub, groups cities by county (Contra Costa, Alameda); each card links to `/[city]`
- `/about` — Steve's story, values, credentials
- `/contact` — Multi-step quote form (also accessible via modal from any page)
- `/blog` — Live AI-generated blog index (14 posts published, more queued). `/blog/[slug]` renders each post. See "Blog Engine" section below.
- `/[city]` — 12 city SEO landing pages
- `/feedback` — Customer reputation page (noindex, no site chrome). Sentiment picker routes to Google review or a private form. See "Reputation Page" section below.
- `/dashboard` — Internal tool (password-gated, noindex, no site chrome). Review-request pipeline. See "Review Request System" below.
- `/unsubscribe` — Email opt-out confirmation (noindex, no site chrome).
- `/api/review-requests/dispatch` — Protected cron endpoint (bearer token). Sends due review emails.
- `/sitemap.xml` — Auto-generated
- `/robots.txt` — Crawl directives

### Homepage Sections (in scroll order)
1. Hero — full-viewport, Ken Burns background image, single CTA ("Get a Free Estimate" opens modal)
2. Trust Bar — animated counters, license/warranty/review badges
3. Services Overview — bento grid (see design decision #4 below), ServiceCard with parallax/tilt/icons
4. Featured Projects — 2x2 grid, clip-path curtain reveals with alternating directions and logo colors
5. About Preview — split layout (image left, content right), slide-in animations
6. Testimonials — carousel with star ratings, prev/next navigation
7. Process — sticky scroll storytelling (see above)
8. Service Area — 3 cards (Lamorinda, Contra Costa, Alameda) with city links
9. Final CTA — blue gradient background, quote modal + phone CTA

### Projects Gallery (`/projects`)
A stack of fullscreen "chapters," one per project. Files live under `app/projects/`:
- `page.tsx` — server entry, wraps `<ProjectsClient>` in `<Suspense>` (required by `useSearchParams`)
- `ProjectsClient.tsx` — orchestrator: hero with full-bleed image, FilterBar, AnimatePresence stack, ProjectShelf, FinalCTA
- `components/ProjectChapter.tsx` — desktop chapter (sticky pin + curtain)
- `components/ProjectChapterMobile.tsx` — mobile editorial card (no pin)
- `components/ProjectShelf.tsx` — sticky-bottom thumbnail navigator
- `components/FilterBar.tsx` — pill filters, writes URL state via `router.replace`
- `lib/chapter-config.ts` — curtain reveal directions and colors

**Desktop chapter pin/curtain mechanics:**
- Outer wrapper: `relative lg:h-[200vh]` → 1vh of pin + 1vh of curtain release per chapter
- Inner: `lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden`
- Per-chapter `useScroll` with `offset: ["start start", "end start"]` (decision: never share parent scroll across chapters)
- Entry: image scale `1.06 → 1.0`, metadata `x: 40 → 0` opacity `0 → 1`, over progress `[0, 0.15]`
- Curtain sweep: progress `[0.55, 0.95]` → clip-path opens + colored panel fades. Direction cycles `index % 4`, color cycles `index % 3` (blue/red/gold).
- **Curtain handoff trick:** chapter N's curtain renders chapter N+1's hero image as an under-layer at `transform: scale(1.06)` — matches chapter N+1's entry-zoom origin so there's no visual pop at pin handoff.
- `useReducedMotion`: collapses entry transforms AND drops `lg:h-[200vh]` + `lg:sticky` so chapters become natural `min-h-screen` blocks.

**Filter UX:**
- URL state: `?service=patios` (slugs match service slugs)
- `router.replace(..., { scroll: false })` then manual smooth-scroll to stack via `getLenis().scrollTo(target)`
- Used `AnimatePresence` (with `mode="popLayout"`, 300ms opacity), NOT `LayoutGroup`/FLIP — layout animation on `h-[200vh]` sticky parents fights the sticky.
- Empty-state copy when filter matches zero projects.

**Shelf:**
- `fixed bottom-0` on desktop only (`hidden lg:block`)
- Active chapter tracking: `useScroll` on `stackRef` with `["start start", "end end"]` offset, `floor(progress × count)` clamped
- Entry fade: separate `useScroll` with `["start end", "start start"]` offset → opacity + y translate
- `key={count}` on the `<m.nav>` forces remount when filter count changes — prevents stale closures inside `useTransform`
- Click handler reads `getLenis()` live (not at render — singleton may not be set yet on first render)

**Editorial fields on `Project`** (in `lib/data/projects.ts`):
`scope`, `duration`, `year`, `materials`, `services`, `challenge`, `solution`, `slug`, `heroIndex` — all optional. **The 4 real projects (project-1 through project-4) have placeholder values flagged with a TODO block at the top of the file. Verify with Steve before launch.**

### City Page Architecture
12 cities total. Three have **bespoke routes** with full landing pages — `/lafayette` (`app/lafayette/`), `/moraga` (`app/moraga/`), `/orinda` (`app/orinda/`). The other 9 use the generic `[city]` template (`app/[city]/CityPageContent.tsx`).

The `[city]` route filters out the bespoke slugs via `customRouteSlugs = new Set(["lafayette", "moraga", "orinda"])` so there's no path collision. To promote a city from templated to bespoke, add the slug to that Set and create the matching `app/[slug]/{page.tsx, content.ts, [Name]Content.tsx}`.

**Anti-doorway-page rules.** Every bespoke city page must satisfy these rules — they're how the site avoids near-duplicate suppression on city pages with similar service offerings. Rules derived from May 2026 research synthesis on local-SEO best practices post-Helpful Content updates.

1. **Different lead hook per city** — the section immediately after the hero must be unique to that city. Lafayette: hillside oak ordinance. Moraga: pervious-driveway code (>50 ft / >16 ft rule). Orinda: Orinda Formation soil story + paver cross-section diagram.
2. **Different featured-service mix** — Lafayette has driveways/patios/walls/decks/kitchens. Moraga swaps in fire pits + artificial turf. Orinda swaps in pool decks + water features. Don't replicate the same five.
3. **Vary section ordering** — Lafayette goes neighborhoods → soil → permits → project → services. Moraga goes lead hook → neighborhoods → permits → services. Orinda goes lead hook + cross-section → neighborhoods → permits → services. Same component palette, different sequence.
4. **Skip Materials/brands section on non-Lafayette pages** — link to Lafayette's instead. Brand grids replicated across cities are the highest-risk duplicate-content pattern.
5. **Adjacent-only nearby-cities** — link to ~3 geographically adjacent cities, not all 11 others. Footer/section dump-all-cities patterns trigger thin-content suppression.
6. **Signed paragraph from Steve** — every bespoke city page renders a `cityNameSteveNote` constant from `content.ts` in a "From the Owner" section. The constant ends with the literal suffix `— Steve Barsanti, Owner` and the JSX strips it via `.replace(/ — Steve Barsanti, Owner$/, "")` to render the byline as a separate figcaption. This is the highest-leverage E-E-A-T signal on these pages — preserve the pattern. Lafayette doesn't have it yet (TODO retrofit for parity).
7. **City-specific FAQs** — every bespoke page has 8 FAQs that reference the city's actual permit office, soil, HOAs, or ordinances. Generic FAQs reused across cities are a Helpful Content negative signal.

**Per-page SEO infrastructure.** Every bespoke city `page.tsx` includes:
- `BreadcrumbJsonLd` (Home → Service Areas → City)
- `ServiceJsonLd` with `areaServed: { "@type": "City", name: "City, CA" }`
- `FAQJsonLd` from the city's FAQ array
- Metadata with canonical URL `${company.domain}/[city-slug]`

**Hero pattern.** Hero photos live at `/public/images/areas/[slug]-hero.jpg`. After adding a hero photo, run `npm run blur:gen` so the blur map picks it up. The hero markup uses `<Image>` with a dark gradient overlay and `objectPosition` tuned per photo. The cream-bg fallback variant (used briefly during initial Moraga/Orinda development) is no longer in use.

### Quote Modal (`components/ui/QuoteModal.tsx`)
- Global context provider wrapping the entire app via `ClientProviders`
- Blurred backdrop (12px blur + dark overlay)
- 3-step form: service select → project details → contact info
- Triggered by `QuoteButton` component — used in: Hero, Header, mobile menu, mobile bottom bar, FinalCTA, service detail sidebar, city pages
- The `/contact` page has its own inline form for direct URL traffic / SEO. **It shares this modal's step and radio markup — a fix to one usually belongs in both.**
- Form backend is wired: `lib/actions/submit-quote.ts` (Resend + ntfy). See memory `project_form_routing.md`. ⚠️ Submissions are **not** written to the `leads` table yet — see TODO.

**Two-layer panel.** The presence layer (framer `initial`/`animate`/`exit`) and the drag layer (`style={{ y }}` from `useDragDismiss`) are separate elements on purpose. One motion value per transform, or framer's exit animation and the gesture fight over the same property.

**The backdrop blur is static CSS; only opacity animates.** Transitioning `backdrop-filter` from `blur(0px)` to `blur(12px)` re-rasterises the entire viewport every frame, on the highest-stakes interaction on the site. Don't reintroduce it.

**Springs, not durations.** Enter/exit are critically damped (ratio 1.0, response 0.35s → `stiffness: 322, damping: 35.9`) — the modal opens from a click, which carries no momentum, so overshoot would be motion the user never put there. The drag release *does* get bounce (ratio 0.8), because a gesture with momentum preceded it.

**`data-lenis-prevent` on the scroll container is load-bearing.** Lenis intercepts wheel events globally; without it a trackpad cannot scroll the modal at all.

**Focus management is not decoration here.** `role="dialog"` + `aria-modal` + `aria-labelledby`; focus moves into the panel on open, Tab is trapped inside it, and focus returns to the triggering button on close. The trigger is captured inside `open()` at click time, **not** on unmount — the mobile menu closes itself when its CTA is tapped, taking the button with it. The Tab handler only intervenes at the first and last focusable element; in between, the browser's own order is correct and better than a reimplementation (the 11 service radios are correctly **one** tab stop, not eleven).

⚠️ **`inert` is deliberately not used.** The modal renders *inside* `ClientProviders`, which also wraps Header/main/Footer, so no element contains the page but not the modal — making `inert` work would mean portaling the modal out of the tree. `aria-modal` plus the Tab trap covers the same ground.

⚠️ **`sr-only` inputs need the focus ring on their `<label>`.** The service picker's radios are `sr-only` (clipped to 1px), so the browser focuses them invisibly and the tab stop reads as skipped. The label carries `has-[:focus-visible]:ring-2`. Same pattern and same fix on `/contact`. Any future visually-hidden input needs this.

### Reputation Page (`/feedback`)
A standalone post-job feedback link handed to customers directly (texts, invoices, email signatures) — **not** a page anyone navigates to from the site.

**Flow.** Four sentiment faces → `rating` 1–4.
- **3–4 (Happy / Delighted)** → Google review CTA (`company.social.googleReview`), Yelp as secondary.
- **1–2 (Not happy / Could be better)** → private form → `lib/actions/submit-feedback.ts`.
- The positive path also carries a low-key "tell Steve privately" link. Taking it keeps the **originally chosen** rating in the email rather than relabeling a happy customer as unhappy.

⚠️ **This is review gating** — routing negative sentiment away from Google violates Google's review policies and is the practice the FTC's consumer reviews rule (16 CFR 465) covers. Enforcement risk lands on the Google Business Profile, which is new. Built this way at the owner's explicit direction after the tradeoff was raised. **Reverting to a compliant flow is a one-line change** in `FeedbackPageContent.tsx`: `value >= 3` → `true` (everyone sees the Google link, everyone also gets the private channel). Don't "fix" this silently in either direction — it's a business decision, not an oversight.

**Notifications** (`lib/actions/submit-feedback.ts`) mirror `submit-quote.ts`: Resend email with `replyTo` set to the customer, plus ntfy push. ntfy fires at **priority 5 with a warning tag** (quote leads are 4) since an unhappy customer is time-sensitive. Requires a phone **or** an email — a complaint with no way to reach the person back is the one failure mode that makes the page pointless. A missing `NTFY_TOPIC` no-ops silently rather than failing the submission.

**Subject lines assume the work is good** rather than asking whether it was. The original "How did your paver driveway turn out?" reads as a tradesman unsure of his own job — the ask isn't whether the driveway is good, it's whether they'd say so publicly. The three subjects must also look distinct in an inbox; three near-identical lines from one sender read as automation. Touch 1's opening line varies by elapsed days since completion (`openingLine()` in `emails.ts`) — with same-day sends possible, "has had a few days to settle" is wrong as often as it's right.

**Faces** are hand-drawn inline SVG, not emoji (emoji render differently per device/OS). The mouth paths live in `MOUTHS` in `FeedbackPageContent.tsx` and are **duplicated** in `app/feedback/opengraph-image.tsx` as SVG data URIs — change one, change both. Comments on both sides flag this.

**Indexing.** `noindex, nofollow` via metadata, and kept out of `app/sitemap.ts`. Deliberately **NOT** added to `robots.ts` disallow — a blocked URL can't be crawled, so Google would never see the noindex and would leave the bare URL indexed. If you add more private routes, follow the same pattern.

**OG card** (`app/feedback/opengraph-image.tsx`). The page is noindex but the link gets texted, so the iMessage/WhatsApp preview is the first thing a customer sees. Built with `next/og` at build time, cream background matching the page. The real logo is read off disk (`public/images/logo.png`) and inlined as a base64 data URI — satori can't resolve app-relative URLs, and fetching over the network at build time is fragile. **Satori gotcha:** any `<div>` with more than one child needs explicit `display`. Interpolating `{company.owner}` next to bare text creates *two* nodes and fails the build with a confusing error — build such copy as a single template string.

### Bare Routes (`components/layout/ChromeSlot.tsx`)
`ChromeSlot` is a client component holding a `BARE_ROUTES` set (exact paths: `/feedback`, `/unsubscribe`) and a `BARE_PREFIXES` list (everything under `/dashboard`). It renders its children on normal routes and `null` on listed ones. Wired in two places:
- `app/layout.tsx` — around `<Header />` and `<Footer />`
- `components/layout/ClientProviders.tsx` — around `<MobileBottomBar />`

The mobile bar is included deliberately: its floating "Get a Free Estimate" button would otherwise sit directly on top of `/feedback`'s Google review CTA.

Children may be server components (`Footer` is one) — they're passed through as an RSC payload. **To add a bare route, add its path to `BARE_ROUTES`** — that's the whole change. A bare route should render its own branding (`/feedback` shows the logo at the top of the page) or it reads as a phishing form.

## Database (Neon + Drizzle)
Postgres on **Neon**, accessed with **Drizzle ORM**. Chosen over Netlify Blobs because the dashboard is expected to grow (leads, projects, warranty tracking) and those are relations, which a KV store can't express.

- **Schema:** `lib/db/schema.ts` — 4 tables: `review_requests`, `review_touches`, `email_suppressions`, `leads`.
- **Client:** `lib/db/index.ts` exports `getDb()`. **Lazy on purpose** — the site prerenders 50+ static pages that never touch the database, so resolving the connection at import time would fail every build without the env var. Verified: `npm run build` succeeds with zero env vars set.
- **Driver:** `@neondatabase/serverless` over HTTP (`drizzle-orm/neon-http`). No TCP pool, so there's no connection-exhaustion failure mode in serverless. **Always use the pooled connection string** (host contains `-pooler`).
- **Migrations:** `drizzle/*.sql`, committed. Generate with `npm run db:generate`; apply with drizzle-kit migrate.
- **`.env` gotcha:** values must be **double-quoted** — Neon URLs contain `&`, which breaks `source .env` in zsh. Migration commands need Node's parser: `node --env-file=.env ./node_modules/drizzle-kit/bin.cjs migrate`.

Payload CMS was evaluated and deferred (see git history). It runs on Postgres via Drizzle too, so adopting it later means adding tables to this same Neon instance — none of this work is wasted. Put Payload in its own Postgres schema if that happens, to keep migrations from colliding.

## Review Request System
Automated post-job review requests: up to 3 emails, with any response killing the remainder. Steve manages it from `/dashboard`.

### ⚑ Current state — as of 2026-08-23 (read this first)

**Live in production and verified with real data.** Do not rebuild any of it:

| Piece | State |
|---|---|
| `/dashboard` + login + add/stop/copy-link | Live |
| 3-email sequence, daily cron 17:00 UTC | Live |
| Kill switch on `/feedback?t=` | Live — **confirmed firing in production** (a real click recorded `stopped / responded / rating 4`) |
| `/unsubscribe` | Live |
| Same-day touch 1, Set A subject lines | Live |
| Neon database + migration `0000_init_review_system` | Applied |

**Env vars are set in both places.** Netlify (marked *secret*, scoped to **Functions only** — nothing is needed at build time, verified) and local `.env`: `DATABASE_URL`, `DASHBOARD_PASSWORD`, `DASHBOARD_SESSION_SECRET`, `CRON_SECRET`, plus the pre-existing `RESEND_API_KEY`.

**A full end-to-end run has already happened:** customer added via dashboard → email sent → link clicked → face picked → remaining touches cancelled. The system works; the next work is additive.

**Checks to run before touching any of it:**
```bash
npm run check:schedule   # 36 assertions, no DB needed
npm run build            # must stay green; /feedback must stay ○ static
```

### ⚑ Decisions already made — do NOT re-open without asking

A fresh session will be tempted to "fix" several of these. They are deliberate:

1. **Review gating is intentional.** Negative sentiment routes away from Google. The owner was told the Google-policy and FTC exposure in detail and chose to proceed. NiceJob (the market-leading contractor product) does the identical thing. Reverting is one line — `value >= 3` → `true` in `FeedbackPageContent.tsx` — but it is a **business decision, not a bug**.
2. **Neon + Drizzle, not Netlify Blobs.** The dashboard is expected to grow into leads/projects/warranty, which are relations a KV store can't express.
3. **Payload CMS evaluated and deferred.** It runs on Postgres via Drizzle, so adopting it later means adding tables to the same Neon instance — nothing here is wasted. Trigger to revisit: the owner genuinely committing to editing site copy himself. Give it its own Postgres schema if adopted.
4. **Drizzle over Prisma** — lighter serverless cold starts, and Payload uses Drizzle internally.
5. **Timing = Option A** (same-day constant only). The hourly business-hours cron was costed and deliberately deferred.
6. **Subject lines = Set A** ("the confident favor"). Lines like *"I forgot to ask you something"* were rejected as dishonest — a scheduled system sent it.
7. **Email only; SMS deferred.** Owner's call. Quoted to the client at **$49/mo** (see memory `project_review_system_status.md`).
8. **Neon `neondb_owner` password was exposed in a screenshot and NOT rotated.** Raised twice, owner chose to proceed. Still outstanding.
9. **No login rate limiting.** Serverless instances don't share memory, so a counter is bypassed by parallel requests. Fixed 600ms per attempt + a 24-char random password is the mitigation. Don't replace the password with something memorable.

### ⚑ Next up (highest value first)

1. **Write quote submissions to the `leads` table.** The table exists and is empty; `submit-quote.ts` still only emails. **Data is being lost right now** — this is the cheapest remaining win and stops active bleeding. Also capture the source page for attribution (nothing currently tells you which of the 12 city / 11 service / 14 blog pages produce work).
2. Everything in the "competitive gaps" TODO list, in the order given there.

### Flow
1. Steve adds a customer at `/dashboard` after a job wraps.
2. A daily cron sends touch 1, then 2, then 3 — unless stopped.
3. The customer clicks a face on `/feedback?t=<token>` → **kill switch fires** → remaining touches never send.

### Cadence (`lib/reviews/schedule.ts`)
Touches fire at `startAt` + **0 / 5 / 14** days.

**Same-day first touch.** If `completedAt` equals today, `startAt` is today — Steve is marking the job complete at the walkthrough, and review requests convert best at the point of maximum satisfaction. That sequence runs day 0 / 5 / 14. Any other completion date keeps `completedAt + 2`, so the sequence is day 2 / 7 / 16.

⚠️ The daily cron caps how literal "today" is: a job entered after the 10am PT run goes out the following morning. Moving to an hourly business-hours cron would close that gap — deliberately deferred (see TODO).

**`startAt` is deliberately separate from `completedAt`.** A job completed more than 14 days ago (`BACKFILL_THRESHOLD_DAYS`) anchors to *tomorrow* instead, so importing a batch of past customers doesn't fire every touch at once. `resolveStartAt()` also clamps forward so nothing is ever scheduled into the past.

This module is **pure — no database imports** — so the rules that decide who gets emailed are testable in isolation. `npm run check:schedule` runs 29 assertions and needs no connection. Keep it that way.

### Idempotency (do not weaken)
`review_touches` has a **unique index on `(request_id, n)`**. A duplicate send is impossible at the database level, not merely guarded in application code.

`dispatch.ts` **claims the touch before sending**. If the process dies mid-run, a customer misses one email — invisible and recoverable. Recording *after* the send would risk sending twice, which is neither. Don't "fix" this ordering.

`findDueRequests` returns **at most one touch per request per run**, so a badly overdue sequence catches up a day at a time rather than firing three emails at once.

### Kill switch
`markResponded(token, rating)` sets `respondedAt`, `status: stopped`, `stoppedReason: responded`. It's guarded by `respondedAt is null`, so a second click never overwrites the original rating.

Fires on the **face click**, not form submit — most people who pick a positive face go straight to Google and never return to the page. Three other stop paths: manual (dashboard), unsubscribe, bounce.

### Suppression
`email_suppressions` is keyed by **email, not request** — an unsubscribe has to outlive the request it came from, or the customer's next project would email them again.

### Sending (`lib/reviews/dispatch.ts`)
- From `Steve Barsanti <steve@lamorindapaving.com>`, `replyTo` his iCloud address (where he actually reads mail).
- **Batch cap** (`REVIEW_BATCH_LIMIT`, default 8) — a domain that normally sends a handful of transactional emails suddenly emitting 40 reads as a compromised account. Also keeps runs inside Netlify's 30s scheduled-function timeout.
- Emails are **deliberately plain text-ish** (`lib/reviews/emails.ts`) — no logo banner, no button graphics. They read as one person writing to another, which converts better here and filters less.
- Missing `RESEND_API_KEY` returns **before** claiming touches, so a misconfigured deploy doesn't silently burn them.

### Cron
`netlify/functions/review-dispatch.mts`, daily at **17:00 UTC** (10am PT). Netlify scheduled functions **can't be invoked by URL** and time out at 30s, so it's a thin trigger that calls `/api/review-requests/dispatch` — where the real logic lives with normal imports, and which *can* be run by hand:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://lamorindapaving.com/api/review-requests/dispatch?dryRun=1"
```
`dryRun=1` reports what would send without sending or claiming.

### Dashboard auth (`lib/auth/`)
Single shared password → HMAC-signed, httpOnly session cookie (14 days). No user table — Steve is the only user. Swappable for real auth when there's a second.

**Every Server Action re-checks the session itself** (`requireAuth()` in `lib/actions/review-requests.ts`). The layout gate protects the *page*; Server Actions are independently reachable HTTP endpoints. Never rely on the layout alone.

**No rate limiting, deliberately** — serverless instances don't share memory, so a counter is bypassed with parallel requests. There's a fixed 600ms cost per attempt; the real defence is a long random password. Don't replace it with something memorable.

### Environment variables
`DATABASE_URL`, `DASHBOARD_PASSWORD`, `DASHBOARD_SESSION_SECRET`, `CRON_SECRET` (plus the existing `RESEND_API_KEY`). On Netlify: mark **secret**, scope to **Functions only** — nothing needs them at build time. Marking secret is **irreversible**, and `DASHBOARD_PASSWORD` is the one a human needs to read back, so store it before setting the flag.

## Data Architecture
All data lives in `lib/data/`:
- `services.ts` — 11 services with: slug, name, icon, image, imagePosition, shortDescription, description, features, FAQs, relatedSlugs
- `company.ts` — Business info, service area cities, contact details (uses `as const`). `social.googleReview` is the GBP write-a-review short link used by `/feedback`.
- `testimonials.ts` — 4 real Yelp reviews (Ashley N., Marie D., Wade P., Sharon B.), lightly trimmed for the carousel display size. Full reviews at the Yelp URL in `company.ts`.
- `projects.ts` — 6 projects (4 featured with real images, 2 non-featured placeholders)
- `cities.ts` — 12 cities with unique descriptions and meta descriptions

## Image Assets

### Service Images (`/public/images/services/`)
All 8 homepage services have images. Each service's image is also used as the hero background on its detail page. Images use `imagePosition` for custom focal points.

### Service Icons (`/public/images/icons/`)
All 8 homepage services have icons (red line-style, mix of .png and .webp). On cards: white with frosted badge, turns red on hover. On detail pages: larger badge above title.

### Project Images (`/public/images/projects/`)
4 featured projects have real images: spiral-walkway, segmented-entry-walkway, tiered-entry-steps, hillside-estate-motor-court. Plus `gallery-hero.webp` (hero image on `/projects` — extreme close-up of herringbone pavers).

### Process Images (`/public/images/process/`)
4 illustrated WebPs for the homepage Process section: `free-consultation`, `custom-design`, `expert-installation`, `final-walkthrough`. Source PNGs are external; converted to WebP at q=90 using sharp (saves ~85% file size).

### Blur Placeholders (`lib/blur-map.json` + `lib/blur.ts`)
Every `<Image>` consumer spreads `{...blurProps(src)}` to apply a build-generated PNG blur as the `placeholder` and `blurDataURL`. The map is generated by `scripts/generate-blur-map.mjs` (uses `plaiceholder` + `sharp`).

**Folders scanned:** `images/`, `images/services/`, `images/projects/`, `images/areas/`, `images/process/`. Icons folder is intentionally skipped (small + transparent — blur looks weird).

### Adding New Images
- Service images: save to `/public/images/services/[slug].jpg`, set `image` field in `services.ts`
- Service icons: save to `/public/images/icons/[slug].png`, set `icon` field in `services.ts`
- Project images: save to `/public/images/projects/[name].jpg`, set `images` array in `projects.ts`
- Process images: convert source PNG to WebP at q=90 (`node -e "require('sharp')(src).webp({quality:90}).toFile(dst)"`), save to `/public/images/process/`
- Use `imagePosition` field (e.g., `"center 70%"`) to control focal point
- **After adding any image to a scanned folder, run `npm run blur:gen`** so the blur map includes it. (Auto-runs as `prebuild` before `npm run build`.)
- Every `<Image>` should spread `{...blurProps(src)}` from `@/lib/blur` — see existing components.

## SEO Infrastructure
- JSON-LD: `LocalBusiness` schema on every page (root layout), `FAQPage` schema on service detail pages
- Metadata: unique title + description on every page via Next.js Metadata API
- Sitemap: auto-generated at `app/sitemap.ts`. **`lastmod` hygiene:** static/service/city pages use a stable `LAST_CONTENT_UPDATE` constant (NOT build-time `now`, which churns every URL's `lastmod` on each deploy and trains Google to ignore it — bump the constant only on material content change); blog posts use `dateModified ?? date`.
- Robots: `app/robots.ts`
- Favicon: dynamic "LP" icon at `app/icon.tsx`
- Open Graph + Twitter card meta tags
- **Entity graph (`lib/seo/entities.ts`):** ONE authoritative Steve Barsanti `Person` (`@id` `#steve`, with CSLB license as `hasCredential`). `LocalBusiness` (`@id` `#business`) declares him as `founder`; blog `BlogPosting.author` and `publisher` reference those same `@id`s. Do NOT revert blog author to a bare/Organization value — the shared-`@id` graph is what makes Google trust "Steve Barsanti, author" = "owner of Lamorinda Pavers."
- **Self-referencing canonicals:** homepage sets `alternates.canonical: "/"` in `app/page.tsx` (fixed an http/https index split). ⚠️ `/services/[slug]` still lacks a canonical — see TODO.
- **Blog internal linking (`lib/blog/service-guides.ts`):** curated, commercial-intent-first, cannibalization-aware maps of service-slug → post-slugs (NOT an auto-dump of all `relatedService` posts — 11 of 14 tag `patios`). Rendered as in-prose contextual links (highest weight) + a "Guides" card module on service pages, `/lafayette`, `/orinda`, and the `[city]` template. Each bespoke city gets a **distinct** set + placement (anti-doorway). Homepage `LatestGuides` module (`components/sections/LatestGuides.tsx`) links the 3 newest posts (daily-crawl discovery path). Blog data is resolved server-side and passed as props — never bundle the 3.7k-line `BLOG_POSTS` into client components.
- **GSC (Google Search Console):** property is a **Domain property** (`sc-domain:lamorindapaving.com`), not URL-prefix. `scripts/fetch-gsc-data.ts` honors a `GSC_PROPERTY_URL` env override for this. `scripts/print-gsc-report.ts` prints a live report. Service account `seo-proposal-bot@gadget-construction-seo` is a Full user on the property (shared bot). See memory `project_gsc_access.md`.
- **Discovery pipeline (on publish):** `weekly-publish.yml` pings Netlify → waits → `scripts/resubmit-sitemap.ts` (authenticated `sitemaps.submit` — the only legit re-crawl nudge; anonymous ping died in 2023, and there is NO force-index API) → `scripts/submit-indexnow.ts` (Bing/Yandex; Google ignores IndexNow). IndexNow key lives at `public/<key>.txt`. Both steps are `continue-on-error`.

## Header Behavior
- Transparent on hero with white logo (brightness-0 invert), white nav links, white hamburger
- Solid on scroll (warm-white/90 + backdrop-blur) with original color logo, dark nav links, dark hamburger
- Transition: 500ms on all properties
- Logo size: h-12 mobile, h-16 desktop

## Key Design Decisions (Do Not Change Without Discussion)
1. **Single hero CTA** — "Get a Free Estimate" only. No secondary button. Prevents decision fatigue.
2. **Modal over navigation** — All "Get a Free Estimate" buttons open the quote modal, not navigate to `/contact`. Keeps users in context.
3. **Scroll-scrubbed animations** — Never use `whileInView` trigger-based animations that play entirely on viewport entry. All reveals tied to scroll position.
4. **Bento grid for services (`ServicesOverview.tsx`)** — At `lg` (4-col grid with `auto-rows-[18rem]`): index 0 (Paver Driveways) is a tall hero (`col-span-2 row-span-2`), indexes 1-6 are singles, index 7 (Pool Decks) spans 2 cols. Below `lg` it collapses to 1 or 2 cols with fixed card heights. `ServiceCard`'s outer `m.div` wrappers have `h-full w-full` so the Link fills its grid cell — do not remove these or cards will collapse to 0 height.
5. **Per-card scroll tracking** — Each card in ScrollStagger and MobileProcessCard tracks its own viewport position. Never share a parent scroll progress across cards.
6. **Icon hover behavior** — White icons on cards transition to original red on hover, badge goes from frosted to white background.
7. **`m.*` not `motion.*`** — Entire site uses LazyMotion. Adding `motion.*` defeats the ~20 KB bundle saving. See "Critical: Use `m.*` not `motion.*`" above.
8. **`getLenis()` for programmatic scroll** — Use the live singleton getter, not native `scrollIntoView`, to avoid double-smooth artifacts. See "Lenis is exposed via `getLenis()`" above.
9. **Per-chapter scroll tracking on `/projects`** — Same rule as #5. Filter changes remount the shelf (`key={count}`) to refresh stale closures inside `useTransform`. AnimatePresence (NOT LayoutGroup) handles filter transitions on the chapter stack — layout animation fights `lg:h-[200vh]` sticky parents.
10. **Curtain handoff is image-aligned, not text-aligned** — On `/projects`, the curtain reveals the next chapter's image at `scale: 1.06` so it lines up with the next chapter's entry-zoom origin. No visual pop at pin handoff. Don't change this geometry.
11. **Bespoke city pages must vary, not replicate** — `/lafayette`, `/moraga`, and `/orinda` each have a unique lead hook, a different featured-service mix, varied section ordering, and a 100-word signed paragraph from Steve. The Materials/brands section appears only on Lafayette. Nearby-cities sections link adjacent-only, not all 11 others. See "City Page Architecture" section for the full rule set — these are anti-doorway-page rules, not stylistic preferences.
12. **Signed owner paragraphs are load-bearing E-E-A-T** — every bespoke city page renders a `cityNameSteveNote` constant ending with `— Steve Barsanti, Owner`. JSX strips the suffix via `.replace()` and renders it as the figcaption. Don't refactor to flatten this into a single paragraph — the byline-as-figcaption pattern is what makes the signal trustworthy.
13. **`/feedback` sentiment routing is a deliberate business decision, not a bug** — the two negative faces route away from Google. This is review gating and carries real Google-policy and FTC exposure; it was shipped at the owner's explicit direction. See the "Reputation Page" section. Don't change the routing in either direction without discussion.
14. **Bare routes render their own branding** — pages in `ChromeSlot`'s `BARE_ROUTES` have no Header, Footer, or MobileBottomBar. They must show the logo themselves, and carry a trust line (name + CA license + phone) in place of the removed footer. A stranger arriving from a text has no other signal the page is legitimate.
15. **`.press` on every tappable surface** — hover is dead on touch, and this site is mostly touch traffic. New buttons, links, and cards get `.press`, not a bare `hover:`. See "Press feedback" under Animation Architecture for the two exceptions. Kept under `prefers-reduced-motion` on purpose.
16. **Gestures use Pointer Events, never framer's `drag`** — `drag` requires `domMax` and forfeits the LazyMotion bundle saving. Reuse `lib/hooks/use-drag-dismiss.ts`. See "Gestures are hand-rolled on Pointer Events".
17. **The quote modal's accessibility is load-bearing** — dialog semantics, focus trap, focus restore, and the `sr-only`-radio focus ring. Without them a keyboard user tabs out of the modal into the page behind the backdrop, and can activate a link and lose everything they typed — on the site's only conversion path.

18. **Motion curves are tokens; never hand-type a cubic-bezier** — `--ease-out` / `--ease-in-out` in `globals.css` (declared in `:root`, re-exported via `@theme inline`), mirrored as `EASE_OUT` / `EASE_IN_OUT` in `lib/animations.ts` because framer cannot read a CSS custom property for `ease`. **Edit the pair together.** They deliberately shadow Tailwind's built-ins. And never `transition-all` — name the properties, or you animate `box-shadow` off-GPU and `backdrop-filter` on the header. See "Motion curves live in tokens".
19. **Reduced motion is three layers, and deliberately spares transitions** — the `@media (prefers-reduced-motion: reduce)` block neutralises looping `animation`s only. Do NOT add the common `transition-duration: 0.01ms !important` blanket: it silently kills `.press`, every colour transition, and the focus rings. Opacity fades stay; position and scale go. Lenis does not instantiate at all, and the `scrollIntoView` fallbacks are gated too, because an explicit `behavior: "smooth"` overrides the CSS `scroll-behavior`. See "Reduced motion is honoured in three layers".
20. **Zero `whileInView` call sites** — design decision #3 now holds site-wide. `ScrollStagger`'s `as="ul"` switches container and item to `<ul>`/`<li>` **together**; a `<div>` between them is invalid HTML and breaks the list for assistive tech.

## Blog Engine (AI content pipeline)
The blog is a fully automated AI content engine (installed from `esquair-blog-starter`), **not** a manual/MDX blog. It publishes AEO-tuned posts weekly with zero touch.

### Where content lives
- **Posts:** `lib/blog/data.ts` — a `BLOG_POSTS` array of `BlogPost` objects (slug, title, excerpt, date, content markdown, faqs, optional `featuredImage`). **Posts are NOT `.md`/`.mdx` files** — they're TS objects in this one file. Types in `lib/blog/types.ts`, read helpers in `lib/blog/data.ts` (`getPublishedPosts`, `getPostBySlug`).
- **Queue:** `content/post-queue.json` — array of briefs with `status: queued | drafted | published | proposed`. As of Aug 2026: 14 drafted (all published), 9 queued (~9 wks runway). Status stops at `drafted` — it never flips to `published`; visibility is purely `date <= today` + a Monday rebuild.
- **Config:** `blog.config.ts` (repo root) — brand strings, services, voice, geography, review recipients, and an optional **`author`** block (name/title/credential/experience). Loaded via `lib/blog-config.ts` (zod-validated). Committed despite private repo because CI needs it.
- **Render:** `app/blog/page.tsx` (index → `components/blog/BlogCard.tsx`), `app/blog/[slug]/page.tsx` (detail, with `BlogPosting` JSON-LD + **credentialed byline** "By Steve Barsanti, Owner · CA Lic. #1092749" + OG image). `components/blog/BlogCTA.tsx` is the shared CTA. The byline + author schema live in the render layer, so **all future posts inherit Steve authorship automatically**.
- **E-E-A-T authorship:** posts are authored by Steve as a real `Person` (see entity graph in SEO Infrastructure). `generate-post.ts` injects an experiential-authorship directive from the config `author` block so new posts are drafted in the credentialed operator's voice (field-level specifics; NO fabricated customers/projects/anecdotes).
- **Publish gating:** a post is visible only once its `date` field has passed. `weekly-publish.yml` (Mon) pings a Netlify build hook, waits, then resubmits the sitemap + submits new URLs to IndexNow (see SEO Infrastructure → Discovery pipeline).
- ⚠️ **No human content gate:** `auto-merge-drafts` merges any post that *builds* (only quality bar is the in-script SEO critique pass). A `reviewedBy`/Steve-review step is the natural next gap. See memory `project_blog_discovery_eeat.md`.

### Pipeline scripts (`scripts/`)
- `generate-post.ts` — takes the next `queued` brief, writes the post via Claude (Sonnet) + critique pass, generates a featured image (**Haiku brand-prompt → OpenAI `gpt-image-1`**), inserts into `data.ts`, opens a draft PR. **The image step is non-fatal** — if OpenAI fails, the post ships text-only with no `featuredImage`. Image helpers are exported; `main()` is guarded to run only on direct execution.
- `propose-next-batch.ts` — proposes the next batch of briefs (reads GSC data + existing queue) → PR.
- `backfill-featured-images.ts` — idempotent one-shot: regenerates images for published posts missing a `featuredImage`. Run via the `backfill-featured-images.yml` workflow (`gh workflow run backfill-featured-images.yml`). See memory `project_blog_featured_images.md`.
- `migrate-proposed-briefs.mjs` — moves `content/proposed-briefs.json` into `content/post-queue.json` as `status: queued`. Called by BOTH `merge-proposed-briefs.yml` (human merge) and `auto-merge-proposals.yml` (bot merge) so the logic can't drift. Dedupes by slug, reassigns consecutive Monday slots at least 6 days out, and quarantines refresh briefs into `content/refresh-briefs.json`.
- `gsc-index-coverage.ts` — per-URL inspection of every URL in the live sitemap: indexed vs not, plus the coverage reason. Answers a different question from `fetch-gsc-data.ts`, which only ever sees pages that already earned an impression. Run via `gsc-index-coverage.yml`.
- `optimize-images.ts` — resizes/recompresses `public/images` in place (max 1920px, JPEG q82), backing originals up to `../lamorindapaving-image-originals` first.
- `fetch-gsc-data.ts`, `build-site-inventory.ts`, `setup.ts` — supporting.

### CI workflows (`.github/workflows/`)
`weekly-draft` (Fri, generate next post PR) · `weekly-publish` (Mon, Netlify rebuild → sitemap resubmit → IndexNow) · `auto-propose-batch` + `merge-proposed-briefs` + `auto-merge-proposals` (brief proposal flow) · `auto-merge-drafts` (gated by `pipeline-pr-check`) · `gsc-report` · `gsc-index-coverage` · `backfill-featured-images` (on-demand).

**A `GITHUB_TOKEN` push does NOT trigger push-triggered workflows.** GitHub suppresses it to prevent recursion. `auto-merge-proposals.yml` squash-merges with the default token, so `merge-proposed-briefs.yml` (trigger: `push` on `content/proposed-briefs.json`) never fires for a bot merge — which is why that workflow now runs the migration inline instead. On the sibling `gadgetconstruction` repo this went unnoticed for eight weeks: six proposal PRs merged, no briefs ever reached the queue, and `weekly-draft` skipped every Friday while still reporting success. Only hand-merging proposals kept this repo fed.

**Every body line of a `run: |` block must stay indented, including lines inside a multi-line shell string.** An un-indented line silently terminates the literal block and the YAML fails to parse. GitHub still lists the workflow as `active`, but every push produces an instant startup failure with the file path as the run name. `merge-proposed-briefs.yml` was broken this way — use repeated `-m` flags for multi-paragraph commit messages instead of an embedded newline.

### Secrets / dependencies
`ANTHROPIC_API_KEY` (posts + image prompts), `OPENAI_API_KEY` (`gpt-image-1`, org `esquair` — **auto top-up enabled**, shared across client blog engines), `RESEND_API_KEY` (review emails), `NETLIFY_BUILD_HOOK_URL`, `GSC_SERVICE_ACCOUNT_JSON_BASE64` + `GSC_PROPERTY_URL` (GSC reads + publish-time sitemap resubmit; both now set in Actions secrets — before Aug 2026 the service-account secret was missing and `auto-propose-batch` silently ran without GSC data).

### Related skills
`monthly-seo-doc` (client-facing Word doc of upcoming posts) and `next-content-batch` (propose next brief batch → PR). Cross-repo engine-sync plan: memory `project_engine_sync.md`.

## TODO (Not Yet Done)
- ⚠️ **Neon `neondb_owner` password was exposed in a screenshot (Aug 2026) and NOT rotated** — owner chose to proceed. Rotate via Neon console → Roles → Reset password, then update `.env` and the Netlify variable.
- ⚠️ **Deploy previews share the production database** — one `DATABASE_URL` across all contexts. The cron won't fire from previews (scheduled functions only run on published deploys) and the dashboard is password-gated, but a preview can read/write real customer data. Neon's branch-per-preview would close this.
- **Review system — competitive gaps (researched Aug 2026, deferred by owner).** Ordered by expected return:
  1. **SMS as touch 1** — converts to completed Google reviews at ~3–5× email (CTR 25–40% vs 5–12%). NiceJob, the closest comparable product, sends one text then up to three email follow-ups; we built only the email half. Needs Twilio + documented TCPA consent.
  2. **Review velocity guard** — review *recency* is now the strongest local ranking factor (<30 days = full weight, >180 days = 10–20%), with a "recency cliff" at ~18–21 days without a new review. Reframes the goal from collecting reviews to never going 3 weeks without one, and makes batch-sending past customers actively harmful. Needs the Google Business Profile API.
  3. **Review monitoring + replies** — response rate and speed are themselves ranking factors; there's currently zero visibility. Same API work as #2.
  4. **QR card for the walkthrough** — in-person ask + digital follow-up is the highest-converting combination. Dashboard "Copy link" already covers the digital half.
  5. **Live reviews on the site** — `testimonials.ts` is still 4 hardcoded Yelp quotes, so every new review is invisible on the site.
  6. **Hourly business-hours cron** — would make same-day sends actually same-hour (see Cadence). ~10 runs/day instead of 1; watch Neon free-tier compute.
- **Review system — not yet built:** `/feedback` doesn't read the `?t=` token yet, so the kill switch never fires. Leads aren't written to the `leads` table from `submit-quote.ts`. Resend bounce webhooks aren't wired (manual stop covers it meanwhile).
- ⚠️ **Verify `NTFY_TOPIC` is set in Netlify env** before `/feedback` is handed out. Without it, `submit-feedback.ts` still emails Steve but the push silently no-ops — and the push is what turns an unhappy customer into a same-day callback. Fails quietly by design (a missing topic must not fail the submission), so nothing surfaces the gap.
- ⚠️ **Live-test `/feedback` from a phone** — confirm the OG card renders in a message thread, and that the `g.page/r/` link opens Google's review composer rather than the profile page. Redirect chain was traced and resolves correctly, but only an authenticated tap on a real device fully counts. Messaging apps cache OG data hard; append `?v=N` to force a fresh preview.
- ⚠️ **Watch the Google Business Profile for policy notices** — `/feedback` gates reviews (see "Reputation Page"). Enforcement, if it comes, lands on the GBP, which is new and is the main local-search asset.
- ⚠️ **Confirm placeholder editorial fields** (`scope`, `duration`, `year`, `materials`) on the 4 real projects with Steve before launch. TODO block at top of `lib/data/projects.ts`.
- ⚠️ **Confirm Steve's signed paragraphs** on `/moraga` and `/orinda`. Drafts are in `app/moraga/content.ts` (`moragaSteveNote`) and `app/orinda/content.ts` (`orindaSteveNote`) — published with Steve's name, so the words should be his. Edit to his voice.
- ⚠️ **Confirm Moraga patio thresholds** — the town doesn't publish a sf/grade trigger; the FAQ in `app/moraga/content.ts` is conservative. Verify with the Moraga planning counter (925-888-7040).
- ⚠️ **Confirm Orinda Downs HOA scope** — HOA exists but it's unclear whether driveway/patio scope triggers ARC review. Currently the Orinda page mentions HOA review for Wilder, Orindawoods, and OCC only.
- ~~Wire contact/quote form to email backend~~ **DONE** — Resend Server Action is live (`lib/actions/submit-quote.ts`); quote modal + `/contact` send to Steve with `replyTo: customer_email`, plus ntfy push. See memory file `project_form_routing.md`.
- Add real project photos for project-5 (Outdoor Kitchen) and project-6 (Putting Green) — currently render gradient "Photo coming soon" fallback in the gallery.
- Add remaining 3 service images (putting greens, water features, arbors) + their icons
- Add Steve's photo for About page and homepage About Preview (currently uses placeholder spots)
- Set up Google Analytics 4 + Vercel Analytics
- ~~Connect custom domain on Netlify~~ **DONE** — `lamorindapaving.com` serves the production deploy (verified Aug 2026: identical asset hashes to the `delightful-sundae-2ddcbc.netlify.app` origin).
- Set up redirects from old WordPress URLs to new routes
- ~~Blog content~~ **DONE / ongoing** — AI blog engine is live and publishing weekly. See "Blog Engine" section. Remaining briefs drain automatically; next content batch is proposed via the `next-content-batch` skill / `auto-propose-batch` workflow.
- ~~Blog was invisible to Google (ghost pages)~~ **DONE (Aug 2026)** — diagnosed all 14 posts uncrawled/unindexed; rebuilt discovery + authority: E-E-A-T authorship, entity graph, internal links from authority pages, sitemap submitted, http/https canonical fix, homepage `LatestGuides`, auto-discovery pipeline. See memory `project_blog_discovery_eeat.md` + `project_gsc_access.md`.
- ⚠️ **Steve-dependent E-E-A-T (highest remaining leverage):** his real photo → author bio box on posts + `Person.image` (also fixes the About-page placeholder); a genuine review pass on the AI-authored posts he's now credited for; a `reviewedBy` + review-date signal.
- ⚠️ **`/services/[slug]` missing canonical** — same fix already shipped for the homepage (`alternates.canonical`); service detail `page.tsx` uses raw title+description metadata only.
- **Deferred blog work:** AEO/AI-Overview optimization pass on existing posts; internal-link "Page 6/7" — homepage `LatestGuides` shipped, but `/services` hub + `/about` → blog links were skipped.
- **Esquair sales PDF** (agency collateral, on Desktop, NOT in repo): `Esquair-AI-Blog-Engine.pdf` sells the blog engine to new clients. Source HTML in the session scratchpad. Has placeholder pricing ($600/$1,200/$2,400/mo) + contact (`hello@esquair.com`) awaiting real values. See memory `reference_esquair_sales_pdf.md`.
- **Motion / a11y audit (Aug 2026) — Tier 2 shipped.** Tier 1 was press feedback, quote-modal springs + drag-dismiss + focus trap. Tier 2 (see `plans/`) shipped motion tokens, site-wide reduced-motion support, the `transition-all` sweep, the cursor rewrite, the direction-aware carousel, scroll-scrubbed reveals, and the FAQ accordion. **Still open:**
  1. **`lib/animations.ts` is now mostly unused.** Only `EASE_OUT` and `animateCounter` have consumers; `EASE_IN_OUT`, `defaultTransition`, `springTransition`, `slowReveal`, `fadeUp`, `fadeIn`, `slideInLeft/Right`, `scaleUp`, `staggerContainer`, and `textLineReveal` have none, since the `whileInView` conversion removed every caller. Kept as a preset library rather than pruned — decide deliberately.
  2. **Headings share one `letter-spacing: -0.02em`** across h1–h6 in `globals.css`. Correct at `text-8xl`, too tight at `text-xl` (ServiceCard titles). Tracking should be size-specific. *(Untouched by Tier 2.)*
  3. **No swipe gesture on the testimonials carousel.** Must be built on `lib/hooks/use-drag-dismiss.ts` and raw Pointer Events — framer's `drag` requires `domMax`.
  4. **`Process.tsx:116,221` progress dots animate `width`**, and seven "Learn more →" links animate `gap`. Both are layout properties; the correct fixes need markup changes. `ServiceCard.tsx:110`'s hover shine is still 500ms.
- **Optional polish:** upgrade Process section's `<img>` tags to `next/image` to activate the (already-generated) blur entries for those WebPs.
- **Optional polish:** retrofit the "From the Owner" signed-paragraph pattern to `/lafayette` for parity with Moraga and Orinda.
- **Optional polish:** drop in real Moraga and Orinda project photos and add a "Featured Project" section to each city page (mirror Lafayette's pattern). Currently both pages skip this section.

## Build & Dev Commands
```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build — verify before pushing.
                  # Auto-runs `prebuild` (which runs blur:gen) first.
npm run blur:gen  # Manually regenerate lib/blur-map.json from /public/images.
                  # Run this after adding/changing/removing images.
npm run lint      # ESLint
npm run check:schedule  # 29 assertions on review-request cadence (no DB needed)
npm run db:generate     # Generate a migration from lib/db/schema.ts

```

Always run `npm run build` before pushing to verify zero TypeScript errors and successful static generation.

⚠️ **CI does not do this for you on most PRs.** `pipeline-pr-check.yml` — the "Type-check + production build" check — is gated on `if: startsWith(github.head_ref, 'drafts/') || startsWith(github.head_ref, 'proposals/')`. Any `feat/`, `fix/`, or `docs/` branch gets that check reported as **SKIPPED**, and the only other PR checks are Netlify's header/redirect rules. So a front-end PR can show all-green checks having never been type-checked or built. **The local `npm run build` is the actual gate.** Widening the branch filter would close this.

### Dev server gotcha
Next.js 16 + Turbopack's dev cache can wedge with a misleading `ReferenceError: require is not defined` in server components (build still works, only dev 500s). Fix: stop the dev server, `rm -rf .next`, restart. Not a code issue.
