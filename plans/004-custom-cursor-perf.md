# 004 — Stop the custom cursor animating layout properties; hide the native cursor

- **Status**: DONE (mechanical checks passed; feel-check pending human)
- **Commit**: 77e805a
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files, ~50 lines changed

## Problem

`components/animations/CustomCursor.tsx` renders a circle that follows the
mouse and grows when it is over a link or button. It is mounted globally at
`components/layout/ClientProviders.tsx:24`, so it is on screen on every desktop
page, constantly. Three defects.

**Defect 1 — it grows by animating `width` and `height`.**

```tsx
// components/animations/CustomCursor.tsx:94-103 — current
      animate={{
        width: isHovering ? 48 : 20,
        height: isHovering ? 48 : 20,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isHovering
          ? "rgba(59, 125, 216, 0.1)"
          : "rgba(59, 125, 216, 0)",
        borderColor: isHovering ? "#E8A83E" : "#3B7DD8",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
```

`width` and `height` are layout properties. Changing either forces the browser
through layout → paint → composite. `transform` and `opacity` skip straight to
composite and run on the GPU. This element also carries
`mix-blend-difference`, which forces a compositing pass against everything
behind it — so it is the worst possible element on which to trigger layout, and
it does so on every single link hover, for 300ms, at 60fps.

**Defect 2 — the native cursor is never hidden.** Nothing in the codebase sets
`cursor: none`:

```bash
$ grep -rn "cursor: none\|cursor-none" --include="*.tsx" --include="*.css" app components
(no output)
```

So on desktop the user sees the normal arrow *and* the blue circle, at once.

**Defect 3 — the event listeners are torn down and rebuilt on the first mouse
move.** `isVisible` is in the effect's dependency array, and the effect's own
handler sets it:

```tsx
// components/animations/CustomCursor.tsx:23-27, 71 — current
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    ...
  }, [cursorX, cursorY, isVisible]);
```

The first `mousemove` flips `isVisible`, which re-runs the whole effect,
removing and re-adding five listeners on `window`, `document`, and
`documentElement`.

**Alternative considered — deleting the cursor entirely.** A decorative element
seen on every page, every second, has to justify itself, and this one conveys no
state the native cursor doesn't. Removal is a legitimate and cheaper option. It
is a design call for the owner, not for the executor of this plan; **this plan
fixes the cursor rather than removing it.** If the owner decides to remove it,
that supersedes this plan entirely.

## Target

The circle is rendered once at its largest size as an inline SVG and **scaled**
between states. `vector-effect="non-scaling-stroke"` keeps the 1.5px ring
exactly 1.5px at every scale — which is why an SVG is used rather than a `div`
with a CSS border, where scaling would thin the border to 0.6px at rest.

```tsx
/* target — transform and opacity only; no layout property animates */
      <m.svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        animate={{
          scale: isHovering ? 1 : 20 / 48,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <m.circle
          cx="24"
          cy="24"
          r="23.25"
          vectorEffect="non-scaling-stroke"
          strokeWidth="1.5"
          animate={{
            fill: isHovering ? "rgba(59, 125, 216, 0.1)" : "rgba(59, 125, 216, 0)",
            stroke: isHovering ? "#E8A83E" : "#3B7DD8",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </m.svg>
```

Plus `cursor: none` on desktop pointers only, and a stable effect.

## Repo conventions to follow

- Every component uses `m.*`, never `motion.*` — `components/layout/ClientProviders.tsx:21`
  wraps the app in `<LazyMotion features={domAnimation}>` and `motion.*` would
  force the full bundle. `m.svg` and `m.circle` are both valid `m` elements.
- Colour values are the brand tokens: `#3B7DD8` (blue), `#E8A83E` (gold). They
  are listed at `app/globals.css:5-11`. Keep the literals here — Framer cannot
  interpolate a CSS custom property as a colour.
- The existing comment at `CustomCursor.tsx:84-86` explains why `initial` is
  stated explicitly (Framer cannot interpolate the keyword `transparent`).
  That constraint still applies to the SVG `fill`/`stroke`, so keep an explicit
  `initial` and keep a version of that comment.
- Media-query gating for pointer type: this file already uses
  `window.matchMedia("(pointer: coarse)")` at `CustomCursor.tsx:19`. The CSS
  half should mirror it with `@media (hover: hover) and (pointer: fine)`.
- `globals.css` is unlayered on purpose (`app/globals.css:144-148`). Do not wrap
  additions in `@layer`.

## Steps

1. **`app/globals.css`** — delete the dead `.custom-cursor` and
   `.custom-cursor.hovering` rules at lines 91–110 entirely. Verify first that
   nothing references them:

   ```bash
   grep -rn "custom-cursor" --include="*.tsx" --include="*.ts" app components
   ```

   Expected: no output. These rules are a leftover duplicate of the component's
   own styling; leaving them invites someone to edit the copy that does nothing.
   (Plan 008 also lists this deletion — whichever plan runs first performs it,
   and the other's step becomes a no-op. That is fine.)

2. **`app/globals.css`** — in the same place the deleted block occupied, add:

   ```css
   /* The custom cursor (components/animations/CustomCursor.tsx) draws its own
      pointer, so the native arrow must go or the user sees two. Gated to fine
      pointers: the component returns null on touch, and hiding the cursor on a
      device that has a real mouse plugged in alongside a touchscreen would
      leave that mouse invisible. */
   @media (hover: hover) and (pointer: fine) {
     html,
     html * {
       cursor: none;
     }
   }
   ```

   ⚠️ `html *` is deliberate: without it, every element that sets its own
   `cursor` (`cursor-pointer` on links and buttons, `cursor-grab` on the quote
   modal's drag handle at `components/ui/QuoteModal.tsx:265`, `cursor-not-allowed`
   on disabled buttons at `components/ui/Button.tsx:45`) would re-show the native
   arrow and reintroduce the double cursor on exactly the elements the user
   interacts with most.

3. **`components/animations/CustomCursor.tsx`** — fix the listener churn.
   Replace line 26 (`if (!isVisible) setIsVisible(true);`) with:

   ```tsx
         setIsVisible(true);
   ```

   React bails out of a re-render when the state value is unchanged, so the
   guard bought nothing and cost a full listener teardown. Then change the
   dependency array on line 71 from `[cursorX, cursorY, isVisible]` to:

   ```tsx
     }, [cursorX, cursorY]);
   ```

4. **`components/animations/CustomCursor.tsx`** — replace the entire returned
   JSX (lines 75–104, from `return (` through `);`) with:

   ```tsx
     return (
       <m.div
         className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
         style={{
           x,
           y,
           translateX: "-50%",
           translateY: "-50%",
         }}
       >
         {/* Rendered once at its largest size and scaled between states.
             Animating width/height would force layout on every hover — and this
             element carries mix-blend-difference, so a layout pass here also
             re-composites everything behind it. scale and opacity stay on the
             compositor.

             An SVG rather than a bordered div: `vector-effect` keeps the ring
             exactly 1.5px at every scale, where a CSS border would thin to
             0.6px at rest.

             `initial` is stated explicitly because framer-motion cannot
             interpolate the keyword `transparent` — only an alpha value. Same
             applies to the stroke. */}
         <m.svg
           width="48"
           height="48"
           viewBox="0 0 48 48"
           initial={{ scale: 20 / 48, opacity: 0 }}
           animate={{
             scale: isHovering ? 1 : 20 / 48,
             opacity: isVisible ? 1 : 0,
           }}
           transition={{ duration: 0.2, ease: "easeOut" }}
         >
           <m.circle
             cx="24"
             cy="24"
             r="23.25"
             strokeWidth="1.5"
             vectorEffect="non-scaling-stroke"
             initial={{
               fill: "rgba(59, 125, 216, 0)",
               stroke: "#3B7DD8",
             }}
             animate={{
               fill: isHovering
                 ? "rgba(59, 125, 216, 0.1)"
                 : "rgba(59, 125, 216, 0)",
               stroke: isHovering ? "#E8A83E" : "#3B7DD8",
             }}
             transition={{ duration: 0.2, ease: "easeOut" }}
           />
         </m.svg>
       </m.div>
     );
   ```

   The duration drops from 300ms to 200ms: this is a hover response, and the
   budget for one is 150–250ms.

5. **`components/animations/CustomCursor.tsx`** — confirm the import on line 4
   still reads `import { m, useMotionValue, useSpring } from "framer-motion";`.
   No import change is needed; `m.svg` and `m.circle` come from the same `m`.

## Boundaries

- Do NOT remove the `if (isMobile) return null;` guard at
  `CustomCursor.tsx:73`, and do NOT change the `(pointer: coarse)` detection at
  `:19`. Touch devices must continue to render nothing.
- Do NOT change the spring config on line 14
  (`{ damping: 25, stiffness: 300, mass: 0.5 }`) or the `useSpring` wiring. The
  follow behaviour is not what this plan is about.
- Do NOT remove `mix-blend-difference` — it is what keeps the cursor visible on
  both the cream and the dark-photo sections.
- Do NOT delete the component or unmount it from `ClientProviders`. Removal is
  the owner's call, not the executor's.
- Do NOT add a `cursor: none` rule outside the `(hover: hover) and (pointer: fine)`
  media query.
- Do NOT add dependencies.
- If a line number does not match, locate the same expression by content and
  proceed. If it is absent or differs, STOP and report.

## Verification

- **Mechanical**:
  - `npm run lint` — expect zero new warnings, and specifically no
    `react-hooks/exhaustive-deps` complaint about the shortened dependency array
    in step 3. (`setIsVisible` is a setState function and is stable, so it does
    not need to be listed.)
  - `npm run build` — zero TypeScript errors.
  - `grep -rn "custom-cursor" app components` returns nothing.
  - `grep -rn "width: isHovering\|height: isHovering" components` returns nothing.
- **Feel check**: run `npm run dev` and use a real mouse or trackpad (this
  component renders nothing on touch).
  - **Only one cursor is visible anywhere on the page.** Move over body text,
    over a link, over a button, over the quote modal's grab handle, and over a
    disabled button. The native arrow must not reappear on any of them.
  - Hover a nav link: the circle should grow smoothly and the ring should stay
    the same visual thickness throughout. If the ring thickens as it grows,
    `vector-effect="non-scaling-stroke"` is missing or misspelled — note it is
    `vectorEffect` in JSX.
  - The ring should turn gold and pick up a faint blue fill on hover, exactly as
    before.
  - Open DevTools → **Performance**, record while moving the mouse rapidly
    across a row of links on `/services`, and stop. In the flame chart the hover
    transitions should show **no "Layout" entries** attributable to the cursor.
    Before this change they appear on every hover.
  - Move the mouse out of the browser window and back: the cursor should fade
    out and back in.
  - Reload the page and move the mouse for the first time — the circle should
    fade in from its small resting size, not pop in at full size.
- **Done when**: no layout property is animated by this component; exactly one
  cursor renders on desktop across normal, link, button, grab, and disabled
  states; the ring stroke is visually constant at both sizes; and `npm run build`
  passes.
