# 007 — Stop the FAQ accordion animating `height`

- **Status**: DONE (mechanical checks passed; feel-check pending human)
- **Commit**: 77e805a
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 1 file, ~25 lines changed
- **Depends on**: 001 (uses `EASE_OUT`)

## Problem

`components/ui/FAQAccordion.tsx` is rendered on every service detail page, every
city page, and the bespoke Lafayette/Moraga/Orinda pages — typically 6–8
instances per page. It animates `height` from `0` to `auto`:

```tsx
// components/ui/FAQAccordion.tsx:45-60 — current
          <AnimatePresence>
            {openIndex === i && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-5 pb-5">
                  <p className="text-warm-gray-500 font-sans text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </m.div>
            )}
          </AnimatePresence>
```

`height` is a layout property. Framer Motion measures the content and animates
to a pixel value, but the browser still runs layout → paint → composite on every
frame, and because the panel is in normal flow, everything below it on the page
reflows too — on a service page, that is the rest of the FAQ list plus the
footer.

Two smaller issues in the same block:

- `ease: "easeInOut"` is wrong for this. The panel is entering and leaving;
  entrances take `ease-out`.
- The `AnimatePresence` has no `initial={false}`, so on a page where a panel
  somehow mounts open, it would animate on first paint.

## Target

CSS Grid's `grid-template-rows: 0fr → 1fr` trick. It is still technically a
layout animation — there is no way to reveal variable-height content without
one — but it is the standard, well-optimised path: the browser interpolates a
single track size rather than Framer measuring, writing an inline pixel height
every frame from JavaScript, and re-measuring on resize. It also drops the
`AnimatePresence` mount/unmount cycle entirely, so the panel is interruptible:
clicking twice quickly retargets from wherever it is rather than restarting.

```tsx
/* target */
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5">
                <p className="text-warm-gray-500 font-sans text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
```

The `overflow-hidden` inner wrapper is required — it is what clips the content
while the track collapses. Without it the text spills out of the 0fr row.

## Repo conventions to follow

- Full-width rows answer a press in **colour**, not scale. This component
  already does it correctly and it must stay that way:

  ```tsx
  // components/ui/FAQAccordion.tsx:23 — keep as-is
  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream active:bg-warm-gray-100 active:duration-75 transition-colors"
  ```

  The reasoning is in `CLAUDE.md`: a 3% scale across a full-width bar reads as
  the layout lurching, not a button depressing. This is one of the two
  documented `.press` exceptions.
- Arbitrary transition-property syntax takes no spaces after commas:
  `transition-[grid-template-rows]`.
- `m.*`, never `motion.*` (`components/layout/ClientProviders.tsx:21`).

## Steps

1. **`components/ui/FAQAccordion.tsx`** — remove `AnimatePresence` from the
   import on line 4. It becomes unused. Change:

   ```tsx
   import { m, AnimatePresence } from "framer-motion";
   ```

   to:

   ```tsx
   import { m } from "framer-motion";
   ```

   `m` is still needed for the chevron on line 28.

2. **`components/ui/FAQAccordion.tsx`** — add the shared curve import:

   ```tsx
   import { EASE_OUT } from "@/lib/animations";
   ```

   (If plan 001 has not run and `EASE_OUT` does not exist, STOP and run 001 first.)

3. **`components/ui/FAQAccordion.tsx`** — replace the whole `AnimatePresence`
   block, lines 45–60 inclusive, with:

   ```tsx
           {/* grid-template-rows 0fr -> 1fr rather than height 0 -> auto.
               Height animation makes Framer measure the content and write an
               inline pixel height every frame; the grid track interpolates in
               the browser instead. It also stays mounted, so a double click
               retargets from wherever the panel is rather than restarting. The
               overflow-hidden wrapper is what clips the text while the track
               collapses — without it the answer spills out of the 0fr row. */}
           <div
             className="grid transition-[grid-template-rows] duration-300 ease-out"
             style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
           >
             <div className="overflow-hidden">
               <div className="px-5 pb-5">
                 <p className="text-warm-gray-500 font-sans text-sm leading-relaxed">
                   {faq.answer}
                 </p>
               </div>
             </div>
           </div>
   ```

4. **`components/ui/FAQAccordion.tsx`** — fix the chevron's curve and duration.
   Replace line 30:

   ```tsx
               transition={{ duration: 0.3 }}
   ```

   with:

   ```tsx
               transition={{ duration: 0.2, ease: EASE_OUT }}
   ```

5. **`components/ui/FAQAccordion.tsx`** — the answer panel is now always in the
   DOM, so it must be hidden from assistive technology and from keyboard
   navigation when collapsed, and the toggle must announce its state. Make three
   additions:

   a. Inside the `faqs.map` callback, before the `return`/JSX, derive stable ids.
      Add as the first lines of the map body (change
      `{faqs.map((faq, i) => (` to `{faqs.map((faq, i) => {` with a `return (`,
      and close with `);})}` — or, simpler and preferred, compute inline):

      ```tsx
      const isOpen = openIndex === i;
      ```

   b. On the `<button>` (line 21), add:

      ```tsx
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
      ```

   c. On the outer grid `<div>` from step 3, add:

      ```tsx
              id={`faq-answer-${i}`}
              role="region"
              aria-hidden={!isOpen}
      ```

      and on the `overflow-hidden` inner wrapper, add `inert={!isOpen || undefined}`
      so a collapsed answer's text is not a tab stop or a find-in-page hit.

      ⚠️ If `inert` produces a TypeScript error in this React version, use
      `{...(!isOpen && { inert: "" as unknown as boolean })}` rather than
      removing it — a collapsed panel that is still focusable is a real
      keyboard-navigation bug that the previous `AnimatePresence` version did
      not have, and this plan must not introduce it.

   Then replace `openIndex === i` with `isOpen` in the button's `onClick`
   ternary, the chevron's `animate`, and the grid's `style`.

## Boundaries

- Do NOT add `.press` or any scale transform to the accordion header. The
  colour-only press is a documented exception — see Repo conventions.
- Do NOT change `hover:bg-cream`, `active:bg-warm-gray-100`, or
  `active:duration-75` on the header button.
- Do NOT change the accordion's open/close logic (single-open, click-to-toggle).
- Do NOT change any copy, or the shape of the `FAQ` interface.
- Do NOT change how FAQ data reaches this component, and do not touch the
  `FAQJsonLd` structured data on any page — the answers must stay in the DOM,
  which this change preserves (and in fact improves: they are now always
  present, not conditionally mounted).
- Do NOT add dependencies.
- If a line number does not match, locate the same expression by content and
  proceed. If it is absent or differs, STOP and report.

## Verification

- **Mechanical**:
  - `npm run lint` — zero new warnings, and no unused-import warning for
    `AnimatePresence`.
  - `npm run build` — zero TypeScript errors.
  - `grep -n "AnimatePresence\|height: \"auto\"" components/ui/FAQAccordion.tsx`
    returns nothing.
- **Feel check**: run `npm run dev` and open `/services/paver-driveways`, then
  scroll to the FAQ section.
  - Open and close a panel. The motion should be indistinguishable from before —
    if the text visibly overflows the panel edge mid-animation, the
    `overflow-hidden` wrapper from step 3 is missing or on the wrong element.
  - **Click one question rapidly, four times.** The panel must smoothly reverse
    from wherever it is each time. It must never jump to fully-open or
    fully-closed and restart. This is the interruptibility win and the clearest
    proof the change worked.
  - Open a panel low in the list and confirm the page below it does not jump.
  - Tab through the FAQ list with the keyboard. Focus must land on each question
    button and must **not** enter a collapsed answer. Open one, then Tab — focus
    may now enter the open answer's links if it has any.
  - With a screen reader or DevTools' Accessibility pane, confirm each question
    reports `expanded: true/false` and that collapsed answers are hidden.
  - Use Cmd/Ctrl+F to search for a word that appears only in a *collapsed*
    answer. It should not be found, matching the previous behaviour.
  - Repeat on `/lafayette` and `/moraga`, which render the same component with
    8 FAQs each.
  - In DevTools → Performance, record an open/close. There will still be layout
    work — that is expected and unavoidable — but the per-frame JS from Framer's
    height measurement should be gone.
- **Done when**: no `height: "auto"` animation remains in the component; rapid
  clicking reverses smoothly rather than restarting; collapsed answers are not
  reachable by Tab or find-in-page; `aria-expanded` reflects state; and
  `npm run build` passes.
