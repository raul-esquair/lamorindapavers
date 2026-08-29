# 002 — Honour `prefers-reduced-motion` site-wide

- **Status**: DONE (mechanical checks passed; feel-check pending human)
- **Commit**: 77e805a
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 8 files, ~90 lines changed
- **Depends on**: none (independent of 001, but read 001's token names if it has landed)

## Problem

Operating systems expose a "Reduce Motion" accessibility setting. Users with
vestibular disorders turn it on because animated movement — especially looping
movement and hijacked scrolling — causes real, physical nausea and headaches.
The browser forwards that setting as the `prefers-reduced-motion: reduce` media
query. This site never reads it.

Evidence — the entire codebase contains **one** honouring of the setting:

```bash
$ grep -rn "prefers-reduced-motion\|useReducedMotion" --include="*.tsx" --include="*.ts" --include="*.css" app components lib
app/globals.css:151:   settle. Deliberately kept under `prefers-reduced-motion`: a 3% scale caused
app/projects/components/ProjectChapter.tsx:10:  useReducedMotion,
app/projects/components/ProjectChapter.tsx:35:  const reducedMotion = useReducedMotion();
```

The `globals.css` hit is a **comment**, not a rule. `app/globals.css` contains
no `@media (prefers-reduced-motion)` block at all. So for a user who has asked
for reduced motion, this site currently delivers:

**A full-viewport background image that zooms forever.**

```tsx
// components/sections/Hero.tsx:14-19 — current
        <div
          className="absolute inset-0 scale-105"
          style={{
            animation: "kenBurns 20s ease-in-out infinite alternate",
          }}
        >
```

```tsx
// components/sections/Hero.tsx:93-102 — current
      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1.05) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-1%, -1%);
          }
        }
      `}</style>
```

**A scroll arrow that bobs forever.**

```tsx
// components/sections/Hero.tsx:81-85 — current
        <m.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
```

**Hijacked scrolling.** Lenis replaces the browser's native scroll with an
eased, decelerating one, unconditionally:

```tsx
// components/animations/SmoothScroll.tsx:23-30 — current
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = lenis;
```

**Every scroll reveal, stagger, text reveal, and parallax still translates.**
`ScrollReveal.tsx:36-37`, `ScrollStagger.tsx:36`, `TextReveal.tsx:44-46`,
`ParallaxImage.tsx:29`, `ServiceCard.tsx:27`, `TrustBar.tsx:51`.

## Target

Reduced motion means **fewer and gentler** animations, not zero. Opacity and
colour changes stay — they aid comprehension and are not vestibular. Position
changes, scale changes, looping animations, and scroll hijacking go.

Three layers:

1. A CSS safety net that neutralises looping `animation`s globally.
2. `useReducedMotion()` branches that collapse transform ranges to identity in
   the six motion components.
3. Lenis not initialising at all.

**`.press` is a documented exception and must survive all three.** A 3% depress
caused directly by the user's own finger is direct feedback, not ambient
motion; removing it takes the feedback away rather than gentling it. The
reasoning is at `app/globals.css:150-153`.

## Repo conventions to follow

- The exemplar for the JS half is `app/projects/components/ProjectChapter.tsx`.
  It imports `useReducedMotion` from `framer-motion`, calls it once at the top
  of the component, and collapses each `useTransform` output range to an
  identity pair. Copy this shape exactly:

  ```tsx
  // app/projects/components/ProjectChapter.tsx:35 and :62-77 — exemplar
  const reducedMotion = useReducedMotion();

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? [1, 1] : [1.06, 1.0],
  );
  const metadataOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? [1, 1] : [0, 1],
  );
  ```

  Note what it does **not** do: it does not remove the `useTransform` call or
  branch the JSX. Same hooks run in the same order either way. Preserve that.
- Note that in the exemplar even *opacity* is collapsed to `[1, 1]`, because
  there the fade is bound to a pinned-chapter transform. In this plan, keep
  opacity fades animating — they are the part that stays.
- `globals.css` is unlayered on purpose (`app/globals.css:144-148`). Do not wrap
  additions in `@layer`.
- Comments explain *why*. Match that register.

## Steps

1. **`app/globals.css`** — append this block at the end of the file, after the
   `.safe-area-bottom` rule (currently ends line 188):

   ```css

   /* ---------------------------------------------------------------------------
      Reduced motion

      A user who turns on "Reduce Motion" is reporting a physical symptom, not a
      preference. Looping and self-starting animation is the category that
      causes it, so that is what this block removes.

      Transitions are deliberately left alone. This site's transitions are
      colour, shadow, and opacity — comprehension aids, not vestibular motion —
      and `.press` is a documented exception (see the Press feedback block
      above): a 3% depress caused by the user's own finger is feedback, and
      removing it would leave the button silent rather than calm.
   --------------------------------------------------------------------------- */
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
     }

     html {
       scroll-behavior: auto !important;
     }
   }
   ```

   This alone stops the Ken Burns loop. Step 2 removes it properly so the hero
   is not left frozen at an arbitrary keyframe.

2. **`components/sections/Hero.tsx`** — add the reduced-motion branch.

   a. Change the import on line 3 from `import { m } from "framer-motion";` to:

   ```tsx
   import { m, useReducedMotion } from "framer-motion";
   ```

   b. Immediately after `export default function Hero() {` (line 9), add:

   ```tsx
     const reducedMotion = useReducedMotion();
   ```

   c. Replace the Ken Burns wrapper (lines 14–19) with:

   ```tsx
           <div
             className="absolute inset-0 scale-105"
             style={
               reducedMotion
                 ? undefined
                 : { animation: "kenBurns 20s ease-in-out infinite alternate" }
             }
           >
   ```

   d. Replace the bobbing scroll indicator (lines 81–85) with:

   ```tsx
           <m.div
             animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
             transition={
               reducedMotion
                 ? undefined
                 : { duration: 2, repeat: Infinity, ease: "easeInOut" }
             }
             className="flex flex-col items-center gap-2"
           >
   ```

   e. Leave the four staggered entrance animations on lines 36–71 running. They
      play once on load, carry meaning (they establish reading order), and are
      handled by step 8's shared treatment. Do **not** branch them here.

3. **`components/animations/SmoothScroll.tsx`** — do not start Lenis when the
   user has asked for reduced motion. Replace the effect body (lines 23–44) with:

   ```tsx
     useEffect(() => {
       // Lenis replaces native scrolling with an eased, decelerating one. That
       // is precisely the sensation reduced-motion users are asking to avoid,
       // and unlike a decorative animation it cannot be gentled — so the whole
       // instance is skipped. getLenis() then returns null, which every caller
       // already handles, and the browser's own scrolling takes over.
       if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
         return;
       }

       const lenis = new Lenis({
         duration: 1.2,
         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
         touchMultiplier: 2,
       });

       lenisInstance = lenis;

       let frame: number;
       function raf(time: number) {
         lenis.raf(time);
         frame = requestAnimationFrame(raf);
       }
       frame = requestAnimationFrame(raf);

       return () => {
         cancelAnimationFrame(frame);
         lenis.destroy();
         lenisInstance = null;
       };
     }, []);
   ```

   Before proceeding, confirm every `getLenis()` caller already null-checks:

   ```bash
   grep -rn -A3 "getLenis()" --include="*.tsx" app components
   ```

   If any call site dereferences the result without a null guard or optional
   chaining, add `?.` there. Do not restructure the call sites beyond that.

4. **`components/animations/ScrollReveal.tsx`** — collapse the translate ranges.

   a. Line 4: `import { m, useScroll, useTransform } from "framer-motion";` →
      `import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";`

   b. After `const ref = useRef<HTMLDivElement>(null);` (line 20), add:

   ```tsx
     const reducedMotion = useReducedMotion();
   ```

   c. Replace lines 33–37 with:

   ```tsx
     // Movement is dropped under reduced motion; the opacity fade above stays,
     // because it is what tells the reader new content has arrived.
     const yOffset = reducedMotion ? 0 : direction === "up" ? 60 : 0;
     const xOffset = reducedMotion
       ? 0
       : direction === "left"
         ? -60
         : direction === "right"
           ? 60
           : 0;

     const y = useTransform(clampedProgress, [0, 1], [yOffset, 0]);
     const x = useTransform(clampedProgress, [0, 1], [xOffset, 0]);
   ```

5. **`components/animations/ScrollStagger.tsx`** — same treatment in `StaggerItem`.

   a. Line 4 → `import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";`

   b. After `const ref = useRef<HTMLDivElement>(null);` (line 28), add
      `const reducedMotion = useReducedMotion();`

   c. Replace line 36 with:

   ```tsx
     const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [50, 0]);
   ```

6. **`components/animations/TextReveal.tsx`** — the words currently rise from
   `y: "100%"` behind an `overflow-hidden` clip, so under reduced motion they
   must fade in place instead.

   a. Line 3: `import { m } from "framer-motion";` →
      `import { m, useReducedMotion } from "framer-motion";`

   b. After `const words = children.split(" ");` (line 20), add
      `const reducedMotion = useReducedMotion();`

   c. Replace the `hidden` variant on line 44 with:

   ```tsx
                 hidden: { y: reducedMotion ? "0%" : "100%", opacity: 0 },
   ```

   d. On line 32, reduce the stagger under reduced motion — a long cascade is
      itself motion. Replace `staggerChildren: 0.05,` with:

   ```tsx
                 staggerChildren: reducedMotion ? 0 : 0.05,
   ```

7. **`components/animations/ParallaxImage.tsx`** — parallax is pure decoration
   and is one of the strongest triggers, since it moves against the scroll.

   a. Line 3 → `import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";`

   b. After `const ref = useRef<HTMLDivElement>(null);` (line 23), add
      `const reducedMotion = useReducedMotion();`

   c. Replace line 29 with:

   ```tsx
     const y = useTransform(
       scrollYProgress,
       [0, 1],
       reducedMotion
         ? ["0%", "0%"]
         : [`-${speed * 100}%`, `${speed * 100}%`],
     );
   ```

8. **`components/ui/ServiceCard.tsx`** — drop the image parallax and the 3D tilt.
   Keep the press scale: it is the `.press` exception in component form.

   a. Line 4 → `import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";`

   b. After `const [isPressed, setIsPressed] = useState(false);` (line 20), add
      `const reducedMotion = useReducedMotion();`

   c. Replace line 27 with:

   ```tsx
     const imageY = useTransform(
       scrollYProgress,
       [0, 1],
       reducedMotion ? ["0%", "0%"] : ["-8%", "8%"],
     );
   ```

   d. In `handleMouseMove` (lines 30–36), add an early return as the first
      statement inside the function, before `if (!cardRef.current) return;`:

   ```tsx
       if (reducedMotion) return;
   ```

   e. Leave the `animate` object on lines 52–56 as-is. With tilt pinned at 0 by
      (d), `rotateX`/`rotateY` stay at 0 and only `scale: isPressed ? 0.98 : 1`
      remains — which is the intended press feedback.

9. **`components/sections/TrustBar.tsx`** — the counters run a 2-second
   rAF-driven count-up and the section slides up 30px.

   a. Line 4 → `import { m, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";`

   b. In `AnimatedStat` (line 21), after `const [count, setCount] = useState(0);`
      (line 24), add `const reducedMotion = useReducedMotion();`

   c. Replace the effect on lines 26–30 with:

   ```tsx
     useEffect(() => {
       if (!isInView) return;
       // Under reduced motion the number is set once. The count-up is a flourish;
       // the information is the final value.
       if (reducedMotion) {
         setCount(stat.value);
         return;
       }
       animateCounter(0, stat.value, 2, setCount);
     }, [isInView, stat.value, reducedMotion]);
   ```

   d. In `TrustBar` (line 43), after `const ref = useRef<HTMLElement>(null);`
      (line 44), add `const reducedMotion = useReducedMotion();`

   e. Replace line 51 with:

   ```tsx
     const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [30, 0]);
   ```

## Boundaries

- Do NOT remove or weaken `.press` or `.press-wide` in `app/globals.css`, and do
  NOT add `transition-duration` or `transform` overrides to the reduced-motion
  media block. The exception is deliberate and documented at
  `app/globals.css:150-153`.
- Do NOT add the common `transition-duration: 0.01ms !important` blanket to the
  media query. It would silently kill `.press`, every colour transition, and the
  focus rings' transitions.
- Do NOT touch `app/projects/components/ProjectChapter.tsx` — it already handles
  this correctly and is the exemplar.
- Do NOT touch `components/ui/QuoteModal.tsx` or `lib/hooks/use-drag-dismiss.ts`
  in this plan. Modal and gesture reduced-motion handling is a separate concern
  and the springs there are precisely tuned.
- Do NOT change any markup, class names, copy, or component structure. Motion
  values and the new hook calls only.
- Do NOT move a `useTransform`, `useScroll`, `useInView`, or `useReducedMotion`
  call inside a conditional or early return. All hooks must run unconditionally
  in the same order on every render, exactly as the `ProjectChapter` exemplar does.
- Do NOT add dependencies. `useReducedMotion` ships with `framer-motion` and
  works under `LazyMotion` — it is a hook, not a motion feature, so it does not
  affect the `domAnimation` bundle.
- If a line number does not match, locate the same expression by content and
  proceed. If the expression itself is absent or differs, STOP and report.

## Verification

- **Mechanical**:
  - `npm run lint` — expect zero new warnings. In particular, expect no
    `react-hooks/exhaustive-deps` warning from step 9c; `reducedMotion` is in
    the dependency array.
  - `npm run build` — zero TypeScript errors, all pages generate.
  - `grep -rc "useReducedMotion" --include="*.tsx" components app | grep -v ":0"`
    should now list at least: `Hero`, `ScrollReveal`, `ScrollStagger`,
    `TextReveal`, `ParallaxImage`, `ServiceCard`, `TrustBar`, `ProjectChapter`.
- **Feel check**: run `npm run dev`. In Chrome DevTools open the **Rendering**
  panel (⋮ → More tools → Rendering) and set
  **Emulate CSS media feature prefers-reduced-motion** to `reduce`. Then, with
  it ON, load `/` and confirm:
  - The hero background photo is **completely still**. Watch it for a full 20
    seconds — the Ken Burns cycle is 20s, so a short glance can miss it.
  - The "Scroll" indicator at the bottom does not bob.
  - Scrolling with the mouse wheel feels like a **normal web page** — it stops
    when you stop. No glide, no deceleration tail. This is the single most
    important check in this plan.
  - Section headings and cards **fade in** as you scroll, but do not slide up.
    The fade must still be present — if content appears instantly with no fade,
    step 4/5 over-corrected.
  - Service card images do not drift as you scroll past them; hovering a service
    card does not tilt it.
  - The Trust Bar numbers show their final values (10+, 500+, 5-Year, 100%)
    without counting up.
  - **Press and hold any "Get a Free Estimate" button — it must still depress by
    3%.** If it does not, the media block is over-broad; re-check step 1.
  - Visit `/projects` and confirm chapters render as normal stacked blocks.
- Then set the emulation back to `no-preference` and confirm **every** behaviour
  above returns: Ken Burns zooming, indicator bobbing, smooth Lenis scroll,
  slide-up reveals, parallax, card tilt, counting numbers.
- **Done when**: with `prefers-reduced-motion: reduce` emulated, no element on
  `/`, `/services`, `/about`, or `/projects` changes position or scale as a
  result of scrolling, hovering, or the passage of time — while opacity fades,
  colour transitions, and `.press` feedback all still work; and both `npm run
  lint` and `npm run build` pass.
