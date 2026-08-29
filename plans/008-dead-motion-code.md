# 008 — Delete dead motion code

- **Status**: PARTIAL — PageTransition deleted, `once` prop removed, dead
  `.custom-cursor` CSS removed (by 004). See Execution note.

## Execution note (2026-08-28)

**This plan's Boundaries contained an error.** It states "Do NOT delete
`components/animations/ParallaxImage.tsx`. It is used." It is **not** used.
Verified:

```bash
$ grep -rn 'from "@/components/animations/' --include="*.tsx" app components \
    | sed 's|.*animations/||' | sort | uniq -c
  18 ScrollReveal";
   3 SmoothScroll";
   1 CustomCursor";
```

Only three animation components are imported anywhere. `ParallaxImage.tsx` and
`TextReveal.tsx` are both dead code, alongside the `PageTransition.tsx` this
plan deleted. (`ScrollStagger.tsx` was also unused, but plan 006 has since made
it live across 7 files, so it stays.)

Deleting two more components is a judgement call, not a mechanical step, so it
was left for the owner. Note this also invalidates a claim in the original
audit, which described `TextReveal` as "used site-wide" — it is used nowhere,
which makes plan 006's rationale for excluding it moot.
- **Commit**: 77e805a
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 3 files, 1 deletion + ~25 lines removed

## Problem

Three pieces of motion code exist but nothing uses them. The middle one is the
reason this is worth doing: it is a plausible-looking duplicate of live styling,
so the next person to adjust the cursor may well edit it and be confused when
nothing changes.

**1 — `.custom-cursor` CSS is an orphaned copy of the cursor component.**

```css
/* app/globals.css:91-110 — current, referenced by nothing */
/* Custom cursor styles */
.custom-cursor {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid var(--color-brand-blue);
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
}

.custom-cursor.hovering {
  width: 48px;
  height: 48px;
  background-color: rgba(59, 125, 216, 0.1);
  border-color: var(--color-brand-gold);
}
```

The real cursor is `components/animations/CustomCursor.tsx`, which renders
Tailwind classes and Framer values, and never applies the `custom-cursor` class:

```bash
$ grep -rn "custom-cursor" --include="*.tsx" --include="*.ts" app components
(no output)
```

**2 — `components/animations/PageTransition.tsx` is imported nowhere.**

```bash
$ grep -rn "PageTransition" --include="*.tsx" app components | grep -v "animations/PageTransition.tsx:"
(no output)
```

The whole file (25 lines) is unreachable.

**3 — `ScrollReveal`'s `once` prop is declared and never read.**

```tsx
// components/animations/ScrollReveal.tsx:6-19 — current
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  once?: boolean;          // <- declared
}

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {      // <- never destructured, never used
```

`once` is meaningless for a scroll-scrubbed component — progress is a function
of position, so there is nothing to "only do once." Its presence in the type
invites a caller to pass it and quietly get nothing.

## Target

All three gone. No behaviour changes anywhere on the site.

## Repo conventions to follow

- `app/globals.css` is unlayered on purpose so its rules beat Tailwind's
  `utilities` layer (`app/globals.css:144-148`). Deleting from it does not
  affect that.
- `TextReveal.tsx` also declares an `once` prop — but there it **is** used, at
  `components/animations/TextReveal.tsx:27` (`viewport={{ once, margin: "-50px" }}`).
  Do not touch it.

## Steps

1. **Confirm all three are still dead** before deleting anything. Run all four
   commands and confirm each produces no output:

   ```bash
   grep -rn "custom-cursor" --include="*.tsx" --include="*.ts" app components
   grep -rn "PageTransition" --include="*.tsx" --include="*.ts" app components | grep -v "animations/PageTransition.tsx"
   grep -rn "ScrollReveal" --include="*.tsx" app components | grep "once"
   grep -rn "once=" --include="*.tsx" app components | grep -i "scrollreveal"
   ```

   If any produces output, STOP and report — the premise of this plan has drifted.

2. **`app/globals.css`** — delete lines 91–110 inclusive: the
   `/* Custom cursor styles */` comment, the `.custom-cursor` rule, and the
   `.custom-cursor.hovering` rule. Leave the `/* Selection color */` block that
   follows and the `html.lenis` block that precedes it untouched.

   ⚠️ If plan 004 has already run, this deletion is already done and plan 004
   replaced the block with a `cursor: none` media query. In that case, verify the
   `.custom-cursor` rules are gone and move on — do not delete the new
   `cursor: none` block.

3. **Delete `components/animations/PageTransition.tsx`**:

   ```bash
   git rm components/animations/PageTransition.tsx
   ```

   Note: this file contains one of the 14 occurrences of the old
   `[0.25, 0.1, 0.25, 1]` curve that plan 001 sweeps. If 001 has already run and
   updated it, deleting is still correct — the file was dead either way.

4. **`components/animations/ScrollReveal.tsx`** — remove the `once` prop from
   the interface. Delete line 11:

   ```tsx
     once?: boolean;
   ```

   Add a short comment in its place explaining the absence, so it is not
   re-added:

   ```tsx
     // No `once` prop by design: progress here is a function of scroll
     // position, so there is no one-shot state to latch.
   ```

## Boundaries

- Do NOT delete `components/animations/ParallaxImage.tsx`. It is used — check
  with `grep -rn "ParallaxImage" --include="*.tsx" app components` before
  assuming anything about it.
- Do NOT remove the `once` prop from `components/animations/TextReveal.tsx`.
  It is used there, at line 27.
- Do NOT remove `CustomCursor.tsx` or unmount it from `ClientProviders`. Only the
  orphaned CSS goes.
- Do NOT remove anything else from `app/globals.css`. In particular leave
  `.press`, `.press-wide`, `.safe-area-bottom`, `.label-text`, the `html.lenis`
  rules, and `::selection` alone — `.safe-area-bottom` in particular *looks*
  dead (`env()` resolves to 0px today) but is deliberately retained, as its
  comment at `app/globals.css:182-185` explains.
- Do NOT delete other unused exports from `lib/animations.ts`. Several
  (`springTransition`, `scaleUp`, `imageReveal`) may currently be unreferenced,
  but that file is a shared preset library and pruning it is a separate decision.
- Do NOT add dependencies.

## Verification

- **Mechanical**:
  - `npm run lint` — zero new warnings.
  - `npm run build` — zero TypeScript errors, all pages generate. A build error
    naming `PageTransition` would mean step 1's grep was run wrong; restore the
    file and re-check.
  - `grep -rn "custom-cursor" app components` returns nothing.
  - `ls components/animations/PageTransition.tsx` reports no such file.
  - `grep -n "once" components/animations/ScrollReveal.tsx` returns only the new
    comment.
- **Feel check**: run `npm run dev`.
  - This plan must produce **zero** visible change. Load `/`, `/services`,
    `/about`, and `/projects` and confirm everything looks and moves exactly as
    before — the custom cursor still follows the mouse and still grows over
    links, scroll reveals still fire, page navigation still works.
  - Navigate between several pages. There was never a page transition, so there
    should still not be one; confirm no console errors about a missing module.
  - `git diff --stat` should show changes to exactly two files plus one deletion,
    and no `.tsx` file outside `components/animations/`.
- **Done when**: the three items are gone, `npm run build` passes, and the site
  is visually and behaviourally identical to before the change.
