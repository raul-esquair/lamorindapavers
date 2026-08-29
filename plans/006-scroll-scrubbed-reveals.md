# 006 — Convert the 16 `whileInView` reveals to scroll-scrubbed reveals

- **Status**: DONE — 14 of 15 sites converted; see Execution note (feel-check pending human)

## Execution note (2026-08-28)

Two deviations from the plan as written:

1. **`app/services/[slug]/ServiceDetailContent.tsx:120` was NOT converted.** The
   plan's table listed it as a Recipe A site, but it is an `<m.ul>` with
   `<m.li>` children, not `<m.div>`. `ScrollStagger` renders a `<div>` wrapper
   around each child, which would put `<div>` between `<ul>` and `<li>` —
   invalid HTML and a broken list for assistive tech. Per this plan's own
   Boundaries ("if a call site's shape differs materially, STOP and report"), it
   was left as `whileInView`. Converting it needs an `as` prop on
   `ScrollStagger`, which the Boundaries forbid in this plan.
2. **7 grid children needed `h-full`** added per step 4 (the plan anticipated
   this). Files: `ServicesPageContent`, `AboutPageContent`,
   `ServiceDetailContent`, `CityPageContent`, `LafayetteContent`,
   `MoragaContent`, `OrindaContent` — one child each.

So step 10's grep now returns **two** matches, not one: `TextReveal.tsx:28` and
`ServiceDetailContent.tsx:120`.
- **Commit**: 77e805a
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Cohesion
- **Estimated scope**: 7 files, 16 call sites
- **Depends on**: none. Best run *after* 002, which adds reduced-motion handling
  to `ScrollReveal` and `ScrollStagger` — the components this plan routes
  everything through. Running 006 first is harmless but means those 16 sites
  gain reduced-motion support only once 002 lands.

## Problem

`CLAUDE.md` states the site's core motion decision:

> **Critical Pattern: Scroll-Position-Linked.** All animations are tied to
> scroll position via Framer Motion `useScroll` + `useTransform`. Elements do
> NOT animate entirely upon barely entering the screen. Animation progress maps
> 1:1 with the user's scroll movement. This is a core design decision — do not
> regress to `whileInView` trigger-based animations.

The homepage and `/projects` follow it. Sixteen call sites across seven other
files do not — they fire a fixed 0.8s animation the moment the element clips the
viewport and then play out regardless of what the user does. Scroll back up and
nothing reverses; stop scrolling and it keeps going.

Representative site:

```tsx
// app/services/ServicesPageContent.tsx:33-41 — current
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <m.div key={service.slug} variants={fadeUp}>
```

Compounding it, `staggerContainer` uses a 120ms gap — well above the 30–80ms
band where a stagger reads as a cascade rather than a queue:

```ts
// lib/animations.ts:82-90 — current
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};
```

On a six-card grid that is `0.1 + 5 × 0.12 = 0.7s` before the last card even
starts, plus `defaultTransition`'s 0.8s to run — about 1.5s for a grid to settle.

Full inventory — 14 `staggerContainer` grids and 2 single slide-ins:

| File | Line | Variant |
| --- | --- | --- |
| `app/about/AboutPageContent.tsx` | 58 | `slideInLeft` |
| `app/about/AboutPageContent.tsx` | 71 | `slideInRight` |
| `app/about/AboutPageContent.tsx` | 119 | `staggerContainer` |
| `app/about/AboutPageContent.tsx` | 153 | `staggerContainer` |
| `app/[city]/CityPageContent.tsx` | 63 | `staggerContainer` |
| `app/[city]/CityPageContent.tsx` | 178 | `staggerContainer` |
| `app/lafayette/LafayetteContent.tsx` | 139 | `staggerContainer` |
| `app/lafayette/LafayetteContent.tsx` | 691 | `staggerContainer` |
| `app/moraga/MoragaContent.tsx` | 247 | `staggerContainer` |
| `app/orinda/OrindaContent.tsx` | 269 | `staggerContainer` |
| `app/orinda/OrindaContent.tsx` | 482 | `staggerContainer` |
| `app/services/ServicesPageContent.tsx` | 35 | `staggerContainer` |
| `app/services/[slug]/ServiceDetailContent.tsx` | 120 | `staggerContainer` |
| `app/services/[slug]/ServiceDetailContent.tsx` | 266 | `staggerContainer` |
| `app/services/[slug]/ServiceDetailContent.tsx` | 306 | `staggerContainer` |

## Target

Every one of those becomes a `ScrollStagger` or `ScrollReveal` — the two
components the homepage already uses, which map animation progress to scroll
position via each element's own `useScroll`.

```tsx
/* target — the staggerContainer pattern */
          <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.slug}>
```

```tsx
/* target — the slideInLeft pattern */
            <ScrollReveal direction="left">
```

The offsets already match: `ScrollReveal`'s `direction="left"` animates
`x: -60 → 0`, identical to `slideInLeft`; `direction="right"` is `x: 60 → 0`,
identical to `slideInRight`.

`ScrollStagger` produces its cascade from geometry rather than a timer — each
child tracks its own viewport position, so items lower on the page reveal later
because they *are* later. Items in the same grid row reveal together. That is
the intended behaviour and is design decision #5.

## Repo conventions to follow

- `ScrollReveal` (`components/animations/ScrollReveal.tsx`) takes
  `direction: "up" | "left" | "right" | "none"` (default `"up"`), `className`,
  and `delay`. It renders one `m.div` wrapper.
- `ScrollStagger` (`components/animations/ScrollStagger.tsx`) takes `className`
  and renders `<div className={className}>`, wrapping **each** child in its own
  `m.div` with independent scroll tracking. So the `className` carrying the grid
  goes on `ScrollStagger`, and each child becomes a grid item via that wrapper.
- Every one of the seven target files **already imports `ScrollReveal`** and uses
  it for section headings. Exemplar in the same file you are editing:
  `app/services/ServicesPageContent.tsx:8` (import) and its use around `:20`.
- `ScrollStagger` is currently imported by the homepage sections. Exemplar:
  `grep -rn "ScrollStagger" components/sections`.

## Steps

Do one file at a time, running `npm run build` after each. Do not batch all
seven — a grid-layout regression is far easier to attribute one file at a time.

### Recipe A — `staggerContainer` grid (apply at 14 sites)

Given:

```tsx
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="GRID CLASSES HERE"
          >
            {items.map((item) => (
              <m.div key={item.x} variants={fadeUp} className="CHILD CLASSES">
                ...
              </m.div>
            ))}
          </m.div>
```

1. Replace the opening `<m.div ...>` and its five props with
   `<ScrollStagger className="GRID CLASSES HERE">`, preserving the grid classes
   verbatim.
2. Replace the closing `</m.div>` of that wrapper with `</ScrollStagger>`.
3. For each direct child: change `<m.div ... variants={fadeUp} ...>` to
   `<div ...>` — drop **only** the `variants` prop, keep `key` and `className`
   exactly as they are. Change its matching `</m.div>` to `</div>`.
4. ⚠️ **Grid stretch.** The child is now a grandchild, so a card with a
   background or border no longer stretches to the grid row's height on its own.
   If the child's `className` contains `bg-`, `border`, or `rounded` **and** does
   not already contain `h-full`, add `h-full` to it. Verify visually per step in
   the feel check — mismatched card heights in a row is the symptom.
5. Add `import ScrollStagger from "@/components/animations/ScrollStagger";` to
   the file's imports if it is not already there. Place it next to the existing
   `ScrollReveal` import.

### Recipe B — single slide-in (apply at 2 sites, both in `AboutPageContent.tsx`)

1. Line 57–61: replace

   ```tsx
             <m.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={slideInLeft}
             >
   ```

   with `<ScrollReveal direction="left">`, and its matching closing `</m.div>`
   with `</ScrollReveal>`.

2. Line 70–74: the same, with `variants={slideInRight}` →
   `<ScrollReveal direction="right">`.

### Per-file order

Work in this order, building after each:

1. `app/services/ServicesPageContent.tsx` — 1 site (Recipe A). Simplest; do it
   first and confirm the recipe before repeating it.
2. `app/about/AboutPageContent.tsx` — 4 sites (2× Recipe B at lines 58 and 71,
   2× Recipe A at lines 119 and 153).
3. `app/services/[slug]/ServiceDetailContent.tsx` — 3 sites (Recipe A).
   ⚠️ The site at line 120 has `className="space-y-4 mb-12"`, not a grid.
   `ScrollStagger` wraps each child in a `div`, which keeps `space-y-4` working
   because it targets direct children — and the direct children are still the
   same count. Verify the vertical rhythm visually.
4. `app/[city]/CityPageContent.tsx` — 2 sites (Recipe A). This is the template
   behind 9 city pages, so check at least two of them.
5. `app/lafayette/LafayetteContent.tsx` — 2 sites (Recipe A).
6. `app/moraga/MoragaContent.tsx` — 1 site (Recipe A).
7. `app/orinda/OrindaContent.tsx` — 2 sites (Recipe A).

### Cleanup

8. In each edited file, remove now-unused imports from `@/lib/animations`.
   `npm run lint` will name them. Do not delete an import that is still used
   elsewhere in the same file — several of these files use `fadeUp` in places
   this plan does not touch, so check each with a search before removing.

9. **`lib/animations.ts`** — bring `staggerContainer` into the recommended band
   for any future use. Change line 86 from `staggerChildren: 0.12,` to
   `staggerChildren: 0.06,` and line 87 from `delayChildren: 0.1,` to
   `delayChildren: 0,`. Add above the export:

   ```ts
   // 60ms reads as a cascade; past ~80ms it reads as a queue the user is
   // waiting on. Most scroll reveals now use ScrollStagger instead, which
   // derives its cascade from each item's own scroll position rather than a
   // timer — prefer that for anything tied to scrolling.
   ```

10. Verify none were missed:

    ```bash
    grep -rn "whileInView" --include="*.tsx" app components
    ```

    Expected: **exactly one** match, `components/animations/TextReveal.tsx:26`.
    Anything else means a site was missed.

## Boundaries

- **Do NOT convert `components/animations/TextReveal.tsx`.** It is deliberately
  excluded. Its reveal is a per-word cascade behind an `overflow-hidden` clip;
  scrubbing that to scroll position means individual words sliding in and out of
  their clip boxes as the user scrolls up and down, which reads as jitter rather
  than a reveal. It also runs `once: true` at 0.6s, so it does not exhibit the
  "keeps playing while you scroll back" problem that motivates this plan. If the
  owner wants it converted, that is a separate design decision with a different
  technique behind it (revealing whole lines, not words).
- Do NOT change any grid class, gap, breakpoint, padding, or card styling. The
  only visual change permitted is when animation progress happens.
- Do NOT change copy or content.
- Do NOT change `viewport`/`margin` semantics by adding an `offset` prop to
  `ScrollReveal` or `ScrollStagger` — the shared components' offsets
  (`["start 0.95", "start 0.4"]` and `["start 0.95", "start 0.45"]`) are tuned
  and apply site-wide.
- Do NOT modify `ScrollReveal.tsx` or `ScrollStagger.tsx` themselves in this plan.
- Do NOT touch the homepage sections or `/projects` — they already comply.
- Do NOT add dependencies.
- If a line number does not match, locate the same expression by content and
  proceed. If a call site's shape differs materially from Recipe A or B, STOP
  and report rather than improvising a third recipe.

## Verification

- **Mechanical**:
  - `npm run lint` — zero unused-import warnings.
  - `npm run build` — zero TypeScript errors, all 37+ pages generate.
  - The grep in step 10 returns exactly one line (`TextReveal.tsx`).
- **Feel check**: run `npm run dev` and visit `/services`, `/about`,
  `/services/paver-driveways`, `/lafayette`, `/moraga`, `/orinda`, and two
  templated city pages (e.g. `/walnut-creek`, `/danville`).
  - On each, scroll down slowly until a card grid is half revealed, then **stop**.
    The animation must stop with you, mid-way. Then scroll **up** — it must
    reverse. That reversibility is the whole point of the change; if the grid
    completes on its own after you stop, the conversion did not take.
  - **Card heights within a row must match.** This is the most likely regression
    (step 4). Check every converted grid at a wide viewport, where rows have
    multiple cards. A short card next to a tall one means the child needs `h-full`.
  - On `/services/paver-driveways`, check the `space-y-4` list around line 120
    still has even vertical spacing between items.
  - On `/about`, the portrait should still enter from the left and the "Meet the
    Owner" column from the right, and they should now track the scroll.
  - Scroll each page to the bottom and back to the top at speed. Nothing should
    be left stuck at partial opacity.
  - Compare against `/` — the motion on these pages should now feel the same as
    the homepage's, not faster or more eager.
- **Done when**: `whileInView` appears only in `TextReveal.tsx`; every converted
  reveal stops when the user stops scrolling and reverses when they scroll back;
  no grid row has mismatched card heights; and `npm run build` passes.
