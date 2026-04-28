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
All animations are tied to scroll position via Framer Motion `useScroll` + `useTransform`. Elements do NOT animate entirely upon barely entering the screen. Animation progress maps 1:1 with the user's scroll movement. This is a core design decision — do not regress to `whileInView` trigger-based animations.

### Critical: Use `m.*` not `motion.*`
The entire app is wrapped in `<LazyMotion features={domAnimation}>` (in `components/layout/ClientProviders.tsx`). Every component uses `import { m } from "framer-motion"` and renders `<m.div>` etc. **Never write `motion.*` in new code** — it works at runtime but forces the full motion bundle to load synchronously, defeating the ~20 KB savings. If you accidentally introduce `motion.*`, run `node scripts/migrate-motion-to-m.mjs` to fix.

### Lenis is exposed via `getLenis()`
`components/animations/SmoothScroll.tsx` stores its Lenis instance in a module-level singleton. Read it live at click time via `getLenis()` — NOT a hook. Used for programmatic scrolls (`ProjectShelf` thumb clicks, `ProjectsClient` filter-change scroll). Never use native `scrollIntoView` for in-page navigation while Lenis is active — the smooth motion gets double-applied.

### Key Components
- **`ScrollReveal`** (`components/animations/ScrollReveal.tsx`) — Fade + translate tied to scroll. Supports `direction` prop: `up`, `left`, `right`, `none`. Uses `useScroll` with offset `["start 0.95", "start 0.4"]`.
- **`ScrollStagger`** (`components/animations/ScrollStagger.tsx`) — Wraps children; each child tracks its own viewport position independently via its own `useScroll` ref. Do NOT share a parent scroll progress across children.
- **`ServiceCard`** (`components/ui/ServiceCard.tsx`) — Parallax image (shifts with scroll), 3D tilt on hover (spring physics), cursor-following shine effect. Icon badge turns from white to original red on hover.
- **`ProjectRevealCard`** (in `FeaturedProjects.tsx`) — Clip-path curtain reveal scrubbed to scroll. Alternating directions (left, right, bottom). Curtain colors cycle through logo colors (blue, red, gold). Text fades in after image is 70% revealed.

### Process Section (`components/sections/Process.tsx`)
Complex sticky scroll storytelling with separate desktop and mobile implementations. Uses 4 illustrated WebPs in `/public/images/process/` (`free-consultation`, `custom-design`, `expert-installation`, `final-walkthrough`).

**Desktop:** Left side pins a large image that cross-fades as steps scroll on the right. Image switch thresholds at `[0.35, 0.58, 0.8]` of the steps container scroll. Each image holds until the next step fully arrives.

**Mobile:** Sticky image pins below header (top-20, z-20). Cards 1-3 scroll behind the image (z-10). Image switches when each card becomes readable (tracked per-card via individual `useScroll` refs with `onVisible` callbacks). Card 4 is outside the sticky wrapper — it sits below the image with a gap, and both scroll out of view together. Image transitions use `animate` with `duration: 0.15s` fade-in (z-2) and `0.3s` fade-out (z-1) to prevent flash. Reverse scrolling fires `onVisible(index - 1)`.

This section uses plain `<img>` (not `next/image`) because of how the layered cross-fade is built. Blur map entries for these images exist but are unused here — they would activate if the section were upgraded to `next/image`.

## Page Structure (36 pages)

### Routes
- `/` — Homepage (9 sections)
- `/services` — Services overview grid
- `/services/[slug]` — 11 individual service detail pages
- `/projects` — Sticky-stacking editorial gallery with per-chapter pin, clip-path curtain transitions, URL-state filtering, sticky-bottom shelf nav. See "Projects Gallery" section below.
- `/areas` — Service areas hub, groups cities by county (Contra Costa, Alameda); each card links to `/[city]`
- `/about` — Steve's story, values, credentials
- `/contact` — Multi-step quote form (also accessible via modal from any page)
- `/blog` — Coming soon shell (structure only, no content yet)
- `/[city]` — 12 city SEO landing pages
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

### Quote Modal (`components/ui/QuoteModal.tsx`)
- Global context provider wrapping the entire app via `ClientProviders`
- Blurred backdrop (12px blur + dark overlay)
- 3-step form: service select → project details → contact info
- Triggered by `QuoteButton` component — used in: Hero, Header, mobile menu, mobile bottom bar, FinalCTA, service detail sidebar, city pages
- The `/contact` page has its own inline form for direct URL traffic / SEO
- Form backend is NOT wired yet (logs to console) — TODO

## Data Architecture
All data lives in `lib/data/`:
- `services.ts` — 11 services with: slug, name, icon, image, imagePosition, shortDescription, description, features, FAQs, relatedSlugs
- `company.ts` — Business info, service area cities, contact details (uses `as const`)
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
- Sitemap: auto-generated at `app/sitemap.ts`
- Robots: `app/robots.ts`
- Favicon: dynamic "LP" icon at `app/icon.tsx`
- Open Graph + Twitter card meta tags

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

## TODO (Not Yet Done)
- ⚠️ **Confirm placeholder editorial fields** (`scope`, `duration`, `year`, `materials`) on the 4 real projects with Steve before launch. TODO block at top of `lib/data/projects.ts`.
- Wire contact/quote form to email backend via Resend Server Action — **paused** awaiting `lamorindapaving.com` DNS verification on Resend. Plan: send from `quotes@lamorindapaving.com`, recipient is Steve's personal email, `replyTo: customer_email` on notifications. See memory file `project_form_routing.md` for full plan.
- Add real project photos for project-5 (Outdoor Kitchen) and project-6 (Putting Green) — currently render gradient "Photo coming soon" fallback in the gallery.
- Add remaining 3 service images (putting greens, water features, arbors) + their icons
- Add Steve's photo for About page and homepage About Preview (currently uses placeholder spots)
- Set up Google Analytics 4 + Vercel Analytics
- Connect custom domain on Netlify
- Set up redirects from old WordPress URLs to new routes
- Blog content (structure is ready)
- **Optional polish:** upgrade Process section's `<img>` tags to `next/image` to activate the (already-generated) blur entries for those WebPs.

## Build & Dev Commands
```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build — verify before pushing.
                  # Auto-runs `prebuild` (which runs blur:gen) first.
npm run blur:gen  # Manually regenerate lib/blur-map.json from /public/images.
                  # Run this after adding/changing/removing images.
npm run lint      # ESLint
```

Always run `npm run build` before pushing to verify zero TypeScript errors and successful static generation.

### Dev server gotcha
Next.js 16 + Turbopack's dev cache can wedge with a misleading `ReferenceError: require is not defined` in server components (build still works, only dev 500s). Fix: stop the dev server, `rm -rf .next`, restart. Not a code issue.
