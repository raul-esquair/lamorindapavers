# 005 — Make the testimonials carousel direction-aware and interruptible

- **Status**: DONE — with a correction, see Execution note

## Execution note (2026-08-28)

**Steps 5 and 6 as written were wrong and broke the section.** They positioned
the quotes absolutely inside a stage with a hand-tuned
`min-h-[24rem] sm:min-h-[20rem] md:min-h-[18rem]`. The quotes are 311, 310,
201, and 287 characters; at phone width the longest wraps to roughly 480px
against a 384px floor, so the text overflowed the stage and collided with the
arrows and pagination dots.

The root error was using a guessed pixel height at all. Replaced with a stage
that measures itself:

- The stage is `relative grid`, and every child is placed in the same cell with
  `col-start-1 row-start-1`, so they stack rather than flow.
- An invisible, `aria-hidden` copy of **every** testimonial sits in that cell.
  The grid sizes to the tallest of them at whatever the current width is, so the
  section height is stable across quotes and correct at every breakpoint —
  and stays correct if a quote is edited later.
- The quote markup was extracted into a `TestimonialBody` component so the
  visible quote and the height spacers cannot drift apart.
- `mode="wait"` is still absent, so rapid clicking still works.

Cost: four extra hidden copies of the quote text in the DOM. They are
`aria-hidden`, so assistive technology ignores them.
- **Commit**: 77e805a
- **Severity**: MEDIUM
- **Category**: Interruptibility / Purpose
- **Estimated scope**: 1 file, ~35 lines changed
- **Depends on**: 001 (uses `EASE_OUT`)

## Problem

The homepage testimonials carousel has three defects, all in one file.

**Defect 1 — prev and next produce identical motion.** The quote always exits
upward and enters from below, whichever button was pressed:

```tsx
// components/sections/Testimonials.tsx:48-56 — current
          <AnimatePresence mode="wait">
            <m.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
```

Direction is free information about what the user just did, and it is discarded.
Pressing "previous" should look like the inverse of "next", not like a repeat of it.

**Defect 2 — `mode="wait"` creates a dead window.** `mode="wait"` holds the
incoming quote until the outgoing one has fully left. At `duration: 0.5` that is
0.5s out plus 0.5s in — roughly a second during which the arrows look clickable
and do nothing. Users read that as broken and click again. 0.5s is also double
the budget for a click response.

**Defect 3 — the pagination dots animate `width`.** `w-2` → `w-6` under
`transition-all`:

```tsx
// components/sections/Testimonials.tsx:88-93 — current
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === active ? "bg-brand-gold w-6" : "bg-warm-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
```

`width` is a layout property, so each dot change forces a layout pass — and
because the dots sit in a flex row, changing one reflows its siblings.

## Target

The exact pattern this codebase already uses for the quote modal's form steps,
applied to the carousel: a `direction` state set by each control, a `custom`
prop threaded into variants, and no `mode="wait"`.

```tsx
/* target */
const testimonialVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};
```

Dots scale instead of resizing, with `transform-origin` at the left edge so the
pill still grows rightward rather than from its middle.

## Repo conventions to follow

- The exemplar is `components/ui/QuoteModal.tsx`. Copy its shape closely — it
  already solves this exact problem, and the comment there states the rule:

  ```tsx
  // components/ui/QuoteModal.tsx:102-112 — exemplar
  // Steps enter from the side they are travelling from and leave toward the side
  // they are travelling to, so Back reads as the inverse of Continue instead of
  // an identical slide. Direction is the only thing that tells the user whether
  // they moved forward or backward through the form.
  const stepVariants = {
    enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
  };

  const stepTransition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } as const;
  ```

  Its usage, at `components/ui/QuoteModal.tsx:330-341`, threads `custom` onto
  **both** the `AnimatePresence` and each child.
- Direction state, at `components/ui/QuoteModal.tsx:116`, is a plain
  `useState(1)` set to `1` for forward and `-1` for backward before the index
  changes (`:142`, `:146`).
- Variants and transition constants are declared at module scope, above the
  component, not inside it.
- Every tappable surface carries `.press` (`app/globals.css:155`). The two arrow
  buttons already do; the dots do not.

## Steps

1. **`components/sections/Testimonials.tsx`** — add the import for the shared
   curve. Change line 5's neighbourhood so the imports include:

   ```tsx
   import { EASE_OUT } from "@/lib/animations";
   ```

   (If plan 001 has not run and `EASE_OUT` does not exist, STOP and run plan 001
   first — this plan depends on it.)

2. **`components/sections/Testimonials.tsx`** — at module scope, immediately
   after the `StarRating` function closes (currently line 24) and before
   `export default function Testimonials()` on line 26, add:

   ```tsx

   // A quote enters from the side it is travelling from and leaves toward the
   // side it is travelling to, so Previous reads as the inverse of Next rather
   // than an identical slide. Same pattern as the quote modal's form steps.
   const testimonialVariants = {
     enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
     center: { opacity: 1, x: 0 },
     exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
   };

   const testimonialTransition = { duration: 0.25, ease: EASE_OUT } as const;
   ```

3. **`components/sections/Testimonials.tsx`** — add direction state and set it
   in the three handlers. Replace lines 27–35 with:

   ```tsx
     const [active, setActive] = useState(0);
     const [direction, setDirection] = useState(1);

     const nextTestimonial = () => {
       setDirection(1);
       setActive((prev) => (prev + 1) % testimonials.length);
     };

     const prevTestimonial = () => {
       setDirection(-1);
       setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
     };

     const goTo = (i: number) => {
       setDirection(i > active ? 1 : -1);
       setActive(i);
     };
   ```

4. **`components/sections/Testimonials.tsx`** — rewrite the presence block.
   Replace lines 48–56 (from `<AnimatePresence mode="wait">` through the opening
   `>` of the `m.div`) with:

   ```tsx
             {/* No `mode="wait"`: holding the incoming quote until the outgoing
                 one has fully left creates a window where the arrows look
                 clickable and do nothing. The two quotes cross-fade in place
                 instead, so a second click is answered immediately. */}
             <AnimatePresence custom={direction} initial={false}>
               <m.div
                 key={active}
                 custom={direction}
                 variants={testimonialVariants}
                 initial="enter"
                 animate="center"
                 exit="exit"
                 transition={testimonialTransition}
                 className="absolute inset-x-0 top-0 text-center"
               >
   ```

   ⚠️ `className` changes from `"text-center"` to
   `"absolute inset-x-0 top-0 text-center"`. Without `mode="wait"` both quotes
   are mounted at once, and two in-flow siblings would stack vertically and
   shove the page around. Step 5 adds the sized stage that makes this work.
   `top-0` rather than `inset-0` so a long quote grows downward from the top
   instead of being stretched to the stage's full height.

5. **`components/sections/Testimonials.tsx`** — wrap the presence block in a
   sized "stage" so the two overlapping quotes have somewhere to live and the
   navigation row below stays in normal flow.

   The current structure is:

   ```tsx
           <div className="relative">          {/* line 47 */}
             <AnimatePresence ...>             {/* the quote */}
             </AnimatePresence>

             {/* Navigation */}
             <div className="flex items-center justify-center gap-4 mt-10">
   ```

   Insert one new wrapper around the `AnimatePresence` only, leaving line 47's
   `<div className="relative">` and the navigation row exactly as they are:

   ```tsx
           <div className="relative">
             {/* Both the outgoing and incoming quote are absolutely positioned
                 during a transition, so this stage is what holds the section's
                 height. min-height is sized to the longest quote; the nav row
                 below stays in normal flow underneath it. */}
             <div className="relative min-h-[24rem] sm:min-h-[20rem] md:min-h-[18rem]">
               <AnimatePresence custom={direction} initial={false}>
                 ...
               </AnimatePresence>
             </div>

             {/* Navigation */}
             <div className="flex items-center justify-center gap-4 mt-10">
   ```

   Remember to add the matching `</div>` after the `</AnimatePresence>` closing
   tag (currently line 70) and to re-indent the block inside it.

6. **`components/sections/Testimonials.tsx`** — leave the navigation row on line
   73 exactly as it is:

   ```tsx
           <div className="flex items-center justify-center gap-4 mt-10">
   ```

   It stays in normal flow below the stage. Do **not** position it absolutely —
   with the quotes absolute and the nav absolute, nothing would establish the
   container's height.

7. **`components/sections/Testimonials.tsx`** — wire the dots to `goTo` and stop
   them animating `width`. Replace lines 85–94 with:

   ```tsx
                 {testimonials.map((_, i) => (
                   <button
                     key={i}
                     onClick={() => goTo(i)}
                     className="press w-6 h-2 flex items-center"
                     aria-label={`Go to testimonial ${i + 1}`}
                     aria-current={i === active ? "true" : undefined}
                   >
                     {/* The pill is always 24px wide and scaled down when
                         inactive, rather than resized. Animating `width` on a
                         flex row reflows every sibling dot on every change. */}
                     <span
                       className={`h-2 w-6 rounded-full origin-left transition-[transform,background-color] duration-200 ease-out ${
                         i === active
                           ? "bg-brand-gold scale-x-100"
                           : "bg-warm-gray-600 scale-x-[0.3333]"
                       }`}
                     />
                   </button>
                 ))}
   ```

   The hit target stays 24×8px in both states, which is better than the previous
   8px-wide target for inactive dots. `origin-left` keeps the pill growing
   rightward, matching the old look.

8. **`components/sections/Testimonials.tsx`** — the two arrow buttons on lines
   74–82 and 97–105 keep `onClick={prevTestimonial}` / `{nextTestimonial}` and
   their existing `press` class. Change nothing about them.

## Boundaries

- Do NOT add a swipe gesture. It would be a genuine improvement, but drag in
  this codebase must be built on `lib/hooks/use-drag-dismiss.ts` and raw Pointer
  Events — framer's `drag` requires `domMax` and forfeits the LazyMotion bundle
  saving the whole app is written around. That is its own plan.
- Do NOT add autoplay.
- Do NOT change `lib/data/testimonials.ts` or any quote text.
- Do NOT change the `StarRating` component.
- Do NOT remove the `aria-label`s on the navigation buttons.
- Do NOT touch `components/ui/QuoteModal.tsx` — it is the exemplar here, read-only.
- Do NOT add dependencies.
- If a line number does not match, locate the same expression by content and
  proceed. If it is absent or differs, STOP and report.

## Verification

- **Mechanical**:
  - `npm run lint` — zero new warnings.
  - `npm run build` — zero TypeScript errors. Note the `custom` prop is typed
    `any` by Framer, so the `(direction: number)` variant signatures are what
    give this type safety; if TS complains, do not cast — re-check that
    `testimonialVariants` is declared at module scope.
  - `grep -n "transition-all\|mode=\"wait\"" components/sections/Testimonials.tsx`
    returns nothing.
- **Feel check**: run `npm run dev` and scroll `/` to the dark testimonials
  section.
  - Click **next**: the quote should leave to the left and the new one arrive
    from the right. Click **previous**: exactly the reverse. If both look the
    same, `custom` is missing from either the `AnimatePresence` or the child.
  - **Click next four times rapidly.** Every click must register and advance.
    Before this change roughly every other one was swallowed.
  - Watch the section's height while cycling through all four quotes. It must
    not jump. If it does, raise the `min-h-*` values in step 5 — the longest
    quote sets the floor, and the longest one is different at each breakpoint
    because the text rewraps.
  - Confirm the navigation row never overlaps the quote text and never drifts
    far below it. Check at **375px, 768px, and 1280px** wide, on **every one of
    the four quotes** — a `min-h` that works for the shortest quote at desktop
    can still be overrun by the longest at mobile.
  - Click a pagination dot to the right of the active one, then one to the left,
    and confirm the slide direction matches each time.
  - The active dot should still read as a gold pill roughly three times the
    width of the inactive dots.
  - In DevTools → Animations, set playback to 10% and click next: both quotes
    should be visible and moving simultaneously, crossing over. That is the
    intended behaviour, not a bug.
  - With DevTools → Rendering → **Layout Shift Regions** enabled, cycle the
    carousel. There should be no highlighted shift regions.
- **Done when**: previous and next are visibly mirror images; four rapid clicks
  advance four quotes; the section height is stable across all four; the dots no
  longer animate `width`; and `npm run build` passes.
