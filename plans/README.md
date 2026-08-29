# Animation improvement plans

Produced by `improve-animations` against commit `77e805a` on 2026-08-28.

Each plan is self-contained: exact file paths, current-code excerpts, exact
target values, and a feel-check section. They are written to be executed by an
agent with no context from the audit conversation — including a cheaper model.
Nothing here has been implemented.

## Plans

| # | Title | Severity | Category | Scope | Status |
| --- | --- | --- | --- | --- | --- |
| [001](001-motion-tokens.md) | Establish motion tokens and adopt them on entrances | MEDIUM | Cohesion / Easing | 6 files, ~45 lines | **DONE** |
| [002](002-reduced-motion.md) | Honour `prefers-reduced-motion` site-wide | **HIGH** | Accessibility | 8 files, ~90 lines | **DONE** |
| [003](003-transition-all-sweep.md) | Replace `transition: all`, halve hover durations | **HIGH** | Performance / Duration | 15 files, ~40 edits | **DONE** |
| [004](004-custom-cursor-perf.md) | Fix cursor layout thrash; hide the native cursor | **HIGH** | Performance | 2 files, ~50 lines | **DONE** |
| [005](005-testimonials-direction.md) | Direction-aware, interruptible testimonials carousel | MEDIUM | Interruptibility | 1 file, ~35 lines | **DONE** |
| [006](006-scroll-scrubbed-reveals.md) | Convert 16 `whileInView` reveals to scroll-scrubbed | MEDIUM | Purpose / Cohesion | 7 files, 16 sites | **DONE**¹ |
| [007](007-faq-accordion-height.md) | Stop the FAQ accordion animating `height` | LOW | Performance | 1 file, ~25 lines | **DONE** |
| [008](008-dead-motion-code.md) | Delete dead motion code | LOW | Cohesion | 3 files | PARTIAL² |

¹ 14 of 15 sites; `ServiceDetailContent.tsx:120` is an `<m.ul>`/`<m.li>` list
that `ScrollStagger` cannot wrap without emitting invalid HTML. See that plan's
Execution note.
² `ParallaxImage.tsx` and `TextReveal.tsx` turned out to also be dead code —
left for the owner to decide. See that plan's Execution note.

**All plans executed 2026-08-28. Every mechanical gate passed** (`npm run
build` clean, `npm run lint` at its pre-existing baseline of 8 problems).
**No feel-check has been run** — those need a human with a browser.

## Recommended execution order

**001 → 002 → 003 → 004 → 008 → 005 → 007 → 006**

Rationale for the ordering, which is not strictly by severity:

1. **001 first, always.** It is only MEDIUM on its own, but it creates the
   `--ease-out` / `EASE_OUT` tokens that 003, 005, and 007 reference. Running
   any of those first means hardcoding a curve and then coming back to
   de-duplicate it.
2. **002 next.** It is the one finding with a correctness argument rather than a
   taste argument — the site currently ignores an accessibility setting that
   exists because motion makes some people physically unwell. It is also the
   largest single plan, and it touches `ScrollReveal`/`ScrollStagger`, which 006
   later routes 16 more call sites through. Doing 002 first means those 16 sites
   inherit reduced-motion support for free.
3. **003 and 004** are the two highest-impact performance fixes and are fully
   independent of each other. They can run in parallel if you have two agents.
4. **008 before 005/007/006** because it is trivial, mechanical, and removes a
   file (`PageTransition.tsx`) that 001's verification grep otherwise trips over.
5. **005 and 007** are small, self-contained, single-file changes. Good work to
   hand to a cheap model once the tokens exist.
6. **006 last.** It is the largest mechanical refactor (16 call sites across 7
   files) and carries the highest regression risk — grid card heights. Doing it
   after everything else means a layout bug found later is unambiguously from
   this plan.

## Dependency graph

```
001 (tokens) ──┬──> 003 (transition-all sweep)
               ├──> 005 (testimonials)
               └──> 007 (FAQ accordion)

002 (reduced motion) ──> 006 (scroll-scrubbed reveals)   [soft: 006 works
                                                          either way, but
                                                          inherits a11y if 002
                                                          lands first]

004 (cursor) ── independent, but shares one deletion with 008
008 (dead code) ── independent; shares the .custom-cursor deletion with 004
```

**Overlaps to know about**, both already handled inside the plans themselves:

- 004 step 1 and 008 step 2 both delete the dead `.custom-cursor` CSS from
  `app/globals.css`. Whichever runs first performs it; the other's step becomes
  a no-op and says so.
- 001 step 9c updates the curve inside `PageTransition.tsx`, which 008 step 3
  deletes outright. Either order is fine.

## Two open questions for the owner

These are decisions, not defects — no plan makes them, and each would change or
supersede a plan above.

1. **Should the custom cursor exist at all?** Plan 004 fixes it properly. But a
   decorative element that is on screen every second of every desktop session
   has to earn that, and this one conveys nothing the native cursor does not.
   Deleting it would be cheaper than 004 and would remove the site's only
   spring-driven element outside the quote modal. If you want it gone, say so
   and 004 becomes a three-line deletion instead.

2. **Should `TextReveal`'s word-by-word reveal be converted too?** Plan 006
   deliberately leaves it as the site's one remaining `whileInView`, and the plan
   explains why: scrubbing a per-word cascade to scroll position makes individual
   words slide in and out of their clip boxes as the user scrolls up and down,
   which reads as jitter. Converting it properly means revealing whole lines
   rather than words — a different technique and a separate plan.

## Not covered by any plan

Findings that were verified but deliberately left out, so they are not lost:

- **`components/sections/Process.tsx:116` and `:221`** — progress dots animate
  `width` under `transition-all duration-500`. Same class of defect as the
  testimonial dots in 005, but the correct fix needs a markup change to the
  sticky-scroll section, which is the most intricate component on the site.
- **`components/ui/ServiceCard.tsx:110`** — the hover shine fades over 500ms,
  double the hover budget. Left alone by plan 003 because it already names its
  transition property (`transition-opacity`), which put it in the same
  "don't touch" category as `FeaturedProjects.tsx:124`. Worth revisiting.
- **The seven "Learn more →" links animate `gap`.** Plan 003 names the property and
  shortens the duration, but leaves it a layout animation. Converting to a
  `translate-x` on the arrow would be strictly better and needs markup changes.
- **`ServiceCard`'s tilt spring** (`stiffness: 200, damping: 20`) is bouncier
  than anything else on the site, and on touch — where there is no tilt — the
  card's press reads mushier than a `.press` button next to it.
- **`/contact`'s form steps do not animate** while the quote modal's identical
  steps do. Same markup, two different experiences depending on how the user got
  there. `QuoteModal`'s `stepVariants` would drop straight in.
- **`TrustBar`'s counters run a hand-rolled rAF loop** (`lib/animations.ts:123`).
  Plan 002 gives it reduced-motion handling; replacing the loop itself with a
  spring or CSS is untouched.
- **No swipe gesture on the testimonials carousel.** Deliberately excluded from
  005: drag here must be built on `lib/hooks/use-drag-dismiss.ts` and raw Pointer
  Events, because framer's `drag` requires `domMax` and forfeits the LazyMotion
  bundle saving the whole app is built around.

## Already correct — do not "fix"

Verified during the audit and deliberately not reported. Several are documented
tradeoffs in `CLAUDE.md`; changing them would be a regression.

- `components/ui/QuoteModal.tsx` — critically-damped springs derived from stated
  damping-ratio maths, static backdrop blur with only opacity animating,
  presence and drag layers kept on separate elements, full focus trap.
- `lib/hooks/use-drag-dismiss.ts` — velocity windowing, momentum projection,
  rubber-banding, release-velocity handoff into the spring.
- `.press` in `app/globals.css` — the 80ms-in / 180ms-out asymmetry is correct,
  and it is deliberately kept under `prefers-reduced-motion`.
- `FAQAccordion`'s colour-only press feedback — a scale on a full-width row reads
  as the layout lurching. One of the two documented `.press` exceptions.
- `app/projects/components/ProjectChapter.tsx` — the reduced-motion exemplar the
  rest of the site should imitate, and the curtain-handoff geometry.
- Per-element scroll tracking throughout (`ScrollStagger`, `ProjectChapter`,
  `ServiceCard`, mobile `Process` cards) rather than a shared parent progress.
