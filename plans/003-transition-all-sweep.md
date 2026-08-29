# 003 — Replace `transition: all` with named properties and halve hover durations

- **Status**: DONE (mechanical checks passed; feel-check pending human)
- **Commit**: 77e805a
- **Severity**: HIGH
- **Category**: Performance / Easing & duration
- **Estimated scope**: 15 files, ~40 class-string edits
- **Depends on**: 001 (uses the `ease-out` utility it introduces)

## Problem

There are 33 uses of `transition-all` and 19 uses of `duration-500` across the
site. They cause two separate defects.

**Defect 1 — `transition-all` animates properties nobody asked for.** Tailwind's
`transition-all` compiles to `transition-property: all`, which tells the browser
to animate *every* animatable property that differs between the two states. On
these cards that means `box-shadow` (paint-heavy — the browser cannot hand it to
the GPU) and, on the header, `backdrop-filter` (the most expensive of all — it
re-rasterises everything behind the element on every frame). The codebase
already knows this; the reasoning is written down in `QuoteModal`:

```tsx
// components/ui/QuoteModal.tsx:211-215 — the codebase's own statement of the rule
      {/* Backdrop. The blur is a static class and only opacity animates:
          transitioning `backdrop-filter` from 0px to 12px re-rasterises the
          whole viewport every frame, on the one interaction where
          responsiveness matters most. Opacity stays on the compositor. */}
```

The site-wide header violates exactly that rule:

```tsx
// components/layout/Header.tsx:48-52 — current
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-warm-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
```

`backdrop-blur-md` is added and removed by that class swap, so `transition-all`
tries to animate `backdrop-filter` from `none` to `blur(12px)` over 500ms, on a
`fixed` element spanning the full viewport width, every time the user crosses
50px of scroll.

**Defect 2 — 500ms is roughly double the hover budget.** A hover response should
land in 150–250ms. At 500ms, sweeping a mouse across a grid of cards leaves
every card still mid-transition behind the cursor; the grid smears rather than
responds. Representative site:

```tsx
// app/services/ServicesPageContent.tsx:44 — current
                  className="group block bg-cream rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500"
```

**Defect 3 (minor, same root cause) — two layout properties are being animated.**
Six "Learn more →" links animate `gap`, and the header logo and service-card
icons animate `filter`, all under `transition-all`.

## Target

Every transition names the properties it actually intends to animate, and hover
responses land in 200ms.

```tsx
/* target — the standard hover card */
className="group block bg-cream rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-[color,background-color,border-color,box-shadow] duration-200 ease-out"
```

```tsx
/* target — the header, with backdrop-filter deliberately excluded so it snaps */
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out ${
```

Note on `box-shadow`: it stays in the list. A shadow-on-hover is the intended
design and cannot be produced without it. The wins here are that the browser no
longer speculatively animates a dozen other properties, and that there are half
as many paint frames.

`ease-out` here is the Tailwind utility emitted by the `--ease-out` token that
plan 001 adds (`cubic-bezier(0.23, 1, 0.32, 1)`).

## Repo conventions to follow

- Tailwind v4 with CSS-based config; there is no `tailwind.config.ts`. Arbitrary
  transition-property lists use bracket syntax with **no spaces after the
  commas**: `transition-[background-color,box-shadow]`. A space inside the
  brackets breaks the class.
- Exemplar of a correctly-scoped transition already in the codebase:
  `components/sections/FeaturedProjects.tsx:124` uses `transition-colors
  duration-500` — named property, not `all`. And
  `components/blog/BlogCard.tsx:24` uses `transition-transform duration-700`.
- Where a file defines the class string once as a module-level `const` (see
  `app/dashboard/(app)/AddRequestForm.tsx:18`), edit the const, not each usage.

## Steps

Work through the four groups in order. After each group, run
`npm run build` before starting the next — a mistyped arbitrary-property class
fails silently at runtime, not at build, so smaller batches are easier to bisect.

### Group A — hover cards (`transition-all duration-500` → 200ms, named)

In each location below, replace the substring `transition-all duration-500`
with `transition-[color,background-color,border-color,box-shadow] duration-200 ease-out`.
Change nothing else on the line.

| File | Line |
| --- | --- |
| `app/areas/page.tsx` | 54 |
| `app/areas/page.tsx` | 109 |
| `app/[city]/CityPageContent.tsx` | 187 |
| `app/lafayette/LafayetteContent.tsx` | 700 |
| `app/services/ServicesPageContent.tsx` | 44 |
| `app/services/ServicesPageContent.tsx` | 47 |
| `app/services/[slug]/ServiceDetailContent.tsx` | 275 |
| `app/services/[slug]/ServiceDetailContent.tsx` | 315 |
| `app/orinda/OrindaContent.tsx` | 491 |
| `components/ui/ServiceCard.tsx` | 90 |
| `components/ui/ServiceCard.tsx` | 95 |
| `components/ui/ServiceCard.tsx` | 115 |

### Group B — hover cards with no explicit duration

These use bare `transition-all`, which Tailwind defaults to 150ms. The duration
is already fine; only the property list is wrong. Replace the substring
`transition-all` with
`transition-[color,background-color,border-color,box-shadow] duration-200 ease-out`.

| File | Line |
| --- | --- |
| `app/areas/page.tsx` | 166 |
| `app/[city]/CityPageContent.tsx` | 72 |
| `app/moraga/MoragaContent.tsx` | 570 |
| `app/orinda/OrindaContent.tsx` | 641 |
| `app/projects/components/FilterBar.tsx` | 31 |
| `components/blog/BlogCard.tsx` | 15 |

⚠️ `components/blog/BlogCard.tsx:15` also carries `hover:-translate-y-0.5`, so
its list needs `transform` too. For that line only, use:
`transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out`
(and drop the existing `duration-300`).

⚠️ `app/projects/components/FilterBar.tsx:31` has `duration-300` rather than no
duration — replace `transition-all duration-300` with the Group B target string.

### Group C — filter and gap animations

1. **`components/layout/Header.tsx:49`** — replace `transition-all duration-500`
   with `transition-[background-color,box-shadow] duration-300 ease-out`.

   `backdrop-filter` is deliberately excluded, so the blur snaps on instead of
   being interpolated. This is the same decision `QuoteModal` documents at
   `components/ui/QuoteModal.tsx:211-215`. Add this comment on the line above
   the `className` prop:

   ```tsx
        // backdrop-filter is intentionally absent from this list: animating it
        // re-rasterises everything behind a full-width fixed bar, every frame,
        // on every scroll past 50px. It snaps; the background colour carries
        // the transition. Same reasoning as the quote modal's backdrop.
   ```

2. **`components/layout/Header.tsx:65`** (logo) — replace
   `transition-all duration-500` with `transition-[filter] duration-300 ease-out`.
   The only property changing is `filter` (`brightness-0 invert`).

3. **`components/ui/ServiceCard.tsx:121`** (icon `<img>`) — replace
   `transition-all duration-500` with `transition-[filter] duration-200 ease-out`.

4. **`components/ui/ServiceCard.tsx:138`** ("Learn More" reveal) — replace
   `transition-all duration-300` with
   `transition-[opacity,transform] duration-200 ease-out`.

5. **The six "→" links that animate `gap`.** Replace `transition-all` with
   `transition-[gap] duration-200 ease-out` at:

   | File | Line |
   | --- | --- |
   | `app/blog/[slug]/page.tsx` | 159 |
   | `app/lafayette/LafayetteContent.tsx` | 401 |
   | `app/services/[slug]/ServiceDetailContent.tsx` | 390 |
   | `components/sections/ServicesOverview.tsx` | 80 |
   | `components/sections/LatestGuides.tsx` | 42 |
   | `components/sections/FeaturedProjects.tsx` | 160 |

   `gap` is a layout property, so this is still not free — but these are small
   inline-flex elements with two children, so the reflow is trivial and naming
   the property stops the browser from also watching everything else. Converting
   them to a `translate-x` on the arrow would be strictly better and is
   explicitly **out of scope** here, because it requires markup changes.

### Group D — form inputs

All 15 sites share one class string ending `outline-none transition-all`. The
properties actually changing on focus are `border-color` and the focus ring
(which is a `box-shadow`). Replace `outline-none transition-all` with
`outline-none transition-[color,border-color,box-shadow] duration-150 ease-out`.

Focus feedback gets 150ms rather than 200ms — it answers a keystroke, and
keystroke-triggered feedback should be as close to instant as it can be while
still reading as a transition.

| File | Lines |
| --- | --- |
| `app/contact/ContactPageContent.tsx` | 195, 204, 245, 260, 274, 289 |
| `app/feedback/FeedbackPageContent.tsx` | 68 (module-level const — edit once) |
| `app/dashboard/(app)/AddRequestForm.tsx` | 18 (module-level const — edit once) |
| `app/dashboard/login/LoginForm.tsx` | 46 |
| `components/ui/QuoteModal.tsx` | 397, 406, 455, 472, 488, 505 |

## Boundaries

- Do NOT remove any `hover:` or `group-hover:` class. The visual end states stay
  exactly as they are; only which properties transition, and how fast.
- Do NOT touch `components/sections/Process.tsx:116` or `:221`. Those animate a
  progress dot's `width` — a real finding, but a different one, and the
  correct fix (transform-based) needs a markup change.
- Do NOT touch `components/sections/Testimonials.tsx:89`. Its width-animating
  dots are handled by plan 005.
- Do NOT touch `components/sections/FeaturedProjects.tsx:124` or
  `components/blog/BlogCard.tsx:24`. They already name their properties.
- Do NOT add `backdrop-filter` to any transition property list, anywhere.
- Do NOT change `.press` in `app/globals.css`. It already owns a correct,
  fully-named `transition` shorthand, and `globals.css` being unlayered is what
  makes it win — see `app/globals.css:144-148`.
- Do NOT add `transition-*` utilities to elements carrying `.press`; per that
  same comment, a Tailwind transition utility there gets clobbered or clobbers.
  If you find a `.press` element that also has `transition-all`, **remove the
  `transition-all` and add nothing**.
- Do NOT add dependencies or change markup structure.
- If a line number does not match, find the same class substring in that file
  and proceed. If the substring is absent, STOP and report.

## Verification

- **Mechanical**:
  - `npm run build` — zero TypeScript errors, all pages generate.
  - `grep -rn "transition-all" --include="*.tsx" app components` returns
    **nothing**.
  - `grep -rn "duration-500" --include="*.tsx" app components` should return only
    `components/sections/Process.tsx:116`, `:221`,
    `components/sections/FeaturedProjects.tsx:124`, and
    `components/ui/ServiceCard.tsx:110` — the four explicitly out of scope
    (the last two already name their transition property). Anything else means
    a site was missed.
  - Spot-check that no class has a space inside its brackets:
    `grep -rn "transition-\[[^]]* " --include="*.tsx" app components` returns nothing.
- **Feel check**: run `npm run dev`.
  - On `/services`, sweep the mouse quickly across the card grid. Cards should
    settle almost as fast as the cursor leaves them. Compare against `git stash`
    if unsure — the difference is obvious side by side.
  - Open DevTools → **Performance**, start recording, scroll `/` past the hero
    so the header switches to its solid state, stop. In the flame chart, the
    scroll-crossing frames should no longer show a long paint/composite block
    from the backdrop filter. The header's blur should appear at once rather
    than fading in.
  - On `/services/paver-driveways`, hover a related-service card and confirm the
    border and shadow still both animate — if the shadow snaps, `box-shadow` is
    missing from that class's property list.
  - Hover a "Learn more →" link and confirm the arrow still slides out.
  - Focus a field in the quote modal with the Tab key. The blue ring should
    still fade in, not snap.
  - Hover a service card on the homepage bento grid and confirm the icon still
    turns from white to red — that is the `filter` transition from Group C.
- **Done when**: `transition-all` appears nowhere in `app/` or `components/`;
  every hover on the site completes in 200ms or less; the header's blur snaps
  rather than interpolating; and `npm run build` passes.
