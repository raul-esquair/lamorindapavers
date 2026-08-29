# 001 — Establish motion tokens (easing curves) and adopt them on entrances

- **Status**: DONE (mechanical checks passed; feel-check pending human)
- **Commit**: 77e805a
- **Severity**: MEDIUM (prerequisite for 002 and 003)
- **Category**: Cohesion & tokens / Easing & duration
- **Estimated scope**: 4 files, ~40 lines changed

## Problem

This codebase defines 30+ **color** tokens in one place but **zero motion tokens**.
Every animation curve is hand-typed at its call site. There is exactly one curve
in use across the whole site — `[0.25, 0.1, 0.25, 1]` — and it is repeated at 9
locations plus once in CSS.

That curve is a problem on two levels.

**Level 1 — it is the browser default.** `cubic-bezier(0.25, 0.1, 0.25, 1)` is
the exact definition of the CSS `ease` keyword. It is a slow-start,
slow-end curve. The site's entire motion personality is therefore "the default",
which is too weak for deliberate motion.

**Level 2 — it is the wrong shape for what it is used on.** Almost every use is
an *entrance* (something arriving on screen). Entrances must use **ease-out** —
fast at the start, settling at the end — because the user's attention is on the
first moment. A slow-start curve spends that moment doing nothing.

Current occurrences:

```ts
// lib/animations.ts:4-18 — current
export const defaultTransition: Transition = {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for luxury feel
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const slowReveal: Transition = {
  duration: 1.2,
  ease: [0.25, 0.1, 0.25, 1],
};
```

```ts
// lib/animations.ts:99-102 — current (imageReveal)
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
```

```ts
// lib/animations.ts:115-118 — current (textLineReveal)
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
```

```tsx
// components/sections/Hero.tsx:39, 49, 57, 67 — current (4 occurrences)
transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
```

```tsx
// components/animations/TextReveal.tsx:48-51 — current
                  transition: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
```

```tsx
// components/layout/Header.tsx:48 — current (header drop-in)
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
```

```tsx
// components/layout/Header.tsx:152-156 — current (mobile menu links)
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
```

```tsx
// components/ui/QuoteModal.tsx:112 — current (form step slide)
const stepTransition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } as const;
```

```tsx
// components/animations/PageTransition.tsx:16-19 — current (dead file, see plan 008)
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        }}
```

```css
/* app/globals.css:155-167 — current */
.press {
  transition:
    transform 180ms cubic-bezier(0.25, 0.1, 0.25, 1),
    background-color 300ms ease,
    border-color 300ms ease,
    color 300ms ease,
    opacity 300ms ease;
}

.press:active {
  transform: scale(0.97);
  transition-duration: 80ms;
}
```

## Target

Two curves, defined once in CSS, mirrored once in TypeScript, referenced
everywhere else.

**CSS tokens** — added to `app/globals.css`:

```css
/* target — inside :root, after the "Semantic tokens" group */
  /* Motion curves */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

```css
/* target — inside @theme inline, so Tailwind emits ease-out / ease-in-out utilities */
  /* Motion */
  --ease-out: var(--ease-out);
  --ease-in-out: var(--ease-in-out);
```

**TypeScript mirror** — added to `lib/animations.ts`:

```ts
/* target */
// Motion curves, mirroring the --ease-* custom properties in app/globals.css.
// Framer Motion cannot read a CSS custom property for `ease`, so the two
// definitions must be edited together. Keep the numbers identical.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
```

**Adoption** — every entrance switches to `EASE_OUT`; `.press` switches its
transform to `var(--ease-out)`.

## Repo conventions to follow

- All design tokens live in `app/globals.css`, declared twice: as a real custom
  property under `:root` (lines 3–31), then re-exported inside `@theme inline`
  (lines 33–64) so Tailwind emits utilities for it. Follow that two-step pattern
  exactly — see `--color-brand-blue` at `app/globals.css:5` and `:40`.
- Shared Framer Motion presets live in `lib/animations.ts` as named exports and
  are imported by page content files. Exemplar: `defaultTransition` at
  `lib/animations.ts:4`, consumed by `fadeUp` at `:29`.
- `globals.css` is deliberately **unlayered** so its rules beat Tailwind's
  `utilities` layer. Do not wrap anything you add in `@layer`. The reasoning is
  documented at `app/globals.css:144-148`.
- Comments in this codebase explain *why*, not *what*. Match that register.

## Steps

1. **`app/globals.css`** — inside the `:root` block, immediately after the
   `--border: var(--color-warm-gray-200);` line (currently line 30) and before
   the closing `}` on line 31, add:

   ```css

   /* Motion curves. Strong ease-out for anything arriving on screen — the
      user's attention is on the first frame, so that is where the speed
      belongs. Strong ease-in-out only for things moving between two on-screen
      positions. These replace the site's former single curve,
      cubic-bezier(0.25, 0.1, 0.25, 1), which is the CSS `ease` keyword
      verbatim: a slow-start curve, wrong for entrances. */
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   ```

2. **`app/globals.css`** — inside the `@theme inline` block, after the `/* Fonts */`
   group (currently lines 61–63) and before the closing `}` on line 64, add:

   ```css

   /* Motion. These names shadow Tailwind's built-in `ease-out` /
      `ease-in-out` utilities on purpose: nothing in this codebase used the
      built-in versions, and having `ease-out` mean one thing in CSS and
      another in a class name would be worse than overriding. */
   --ease-out: var(--ease-out);
   --ease-in-out: var(--ease-in-out);
   ```

3. **`app/globals.css`** — in the `.press` rule (currently line 156–162), replace
   the hardcoded transform curve. Change:

   ```css
    transform 180ms cubic-bezier(0.25, 0.1, 0.25, 1),
   ```

   to:

   ```css
    transform 180ms var(--ease-out),
   ```

   Leave the four `300ms ease` colour transitions and the `:active` block
   exactly as they are — `ease` is the correct curve for a colour change, and
   the 80ms/180ms asymmetry is deliberate (documented at `app/globals.css:150-153`).

4. **`lib/animations.ts`** — at the top of the file, immediately after the
   `import type` line (line 1) and before the `// Default transition presets`
   comment on line 3, add the `EASE_OUT` / `EASE_IN_OUT` block from the Target
   section above.

5. **`lib/animations.ts`** — replace all four hardcoded curve arrays with the
   constant:
   - Line 6: `ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for luxury feel` → `ease: EASE_OUT,`
   - Line 17 (inside `slowReveal`): `ease: [0.25, 0.1, 0.25, 1],` → `ease: EASE_OUT,`
   - Line 101 (inside `imageReveal`): `ease: [0.25, 0.1, 0.25, 1],` → `ease: EASE_OUT,`
   - Line 117 (inside `textLineReveal`): `ease: [0.25, 0.1, 0.25, 1],` → `ease: EASE_OUT,`

6. **`lib/animations.ts`** — reduce `defaultTransition.duration` from `0.8` to
   `0.6`. With a real ease-out the motion reads as finished well before the
   tween ends, so 0.8s now feels padded. Leave `slowReveal` (1.2) and
   `imageReveal` (1.2) alone — those are deliberate marketing-pace reveals.

7. **`components/sections/Hero.tsx`** — add the import and replace all four
   curve literals:
   - Add to the imports at the top: `import { EASE_OUT } from "@/lib/animations";`
   - Line 39: `ease: [0.25, 0.1, 0.25, 1]` → `ease: EASE_OUT`
   - Line 49: `ease: [0.25, 0.1, 0.25, 1]` → `ease: EASE_OUT`
   - Line 57: `ease: [0.25, 0.1, 0.25, 1]` → `ease: EASE_OUT`
   - Line 67: `ease: [0.25, 0.1, 0.25, 1]` → `ease: EASE_OUT`

   Do not change the `duration` or `delay` values on these four — the staggered
   hero entrance timing is intentional.

8. **`components/animations/TextReveal.tsx`** — add
   `import { EASE_OUT } from "@/lib/animations";` and change line 50 from
   `ease: [0.25, 0.1, 0.25, 1],` to `ease: EASE_OUT,`.

9. **`components/layout/Header.tsx`** — add
   `import { EASE_OUT } from "@/lib/animations";`, then make two changes:

   a. Line 48: `transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}` →
      `transition={{ duration: 0.5, ease: EASE_OUT }}`. The header drop-in is a
      page-load entrance; 0.8s at the top of every navigation is longer than it
      needs to be.

   b. Line 155 (inside the mobile menu link stagger):
      `ease: [0.25, 0.1, 0.25, 1],` → `ease: EASE_OUT,`. Leave the
      `duration: 0.4` and `delay: i * 0.08` alone.

9b. **`components/ui/QuoteModal.tsx`** — line 112 only. Add
   `EASE_OUT` to the existing `@/lib/animations` import if the file already
   imports from there, otherwise add
   `import { EASE_OUT } from "@/lib/animations";`. Then change:

   ```ts
   const stepTransition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } as const;
   ```

   to:

   ```ts
   const stepTransition = { duration: 0.18, ease: EASE_OUT } as const;
   ```

   This is the **only** line you may change in `QuoteModal.tsx`. The step slide
   is an entrance and belongs on the shared ease-out curve. Everything else in
   that file — the two springs, the backdrop, the drag layer — is precisely
   tuned and out of bounds; see Boundaries.

9c. **`components/animations/PageTransition.tsx`** — this file is dead code
   (imported nowhere) and plan 008 deletes it. If plan 008 has already run, this
   step is a no-op. If the file still exists, change line 18 from
   `ease: [0.25, 0.1, 0.25, 1],` to a literal `ease: EASE_OUT,` with the matching
   import, so the step-10 grep comes back clean either way.

10. **Verify no stragglers.** Run:

    ```bash
    grep -rn "0.25, 0.1, 0.25, 1" --include="*.tsx" --include="*.ts" --include="*.css" app components lib
    ```

    Expected output: **nothing**. Before this plan there are 14 occurrences,
    across `app/globals.css`, `lib/animations.ts` (4), `Hero.tsx` (4),
    `Header.tsx` (2), `TextReveal.tsx`, `QuoteModal.tsx`, and
    `PageTransition.tsx`. If any remain, replace with `EASE_OUT` (TS) or
    `var(--ease-out)` (CSS) following the same pattern.

## Boundaries

- In `components/ui/QuoteModal.tsx`, change **line 112 and nothing else**. The
  two spring transitions (`:235` enter/exit, and the drag-release spring in
  `lib/hooks/use-drag-dismiss.ts`) are derived from documented damping-ratio
  maths and must not be replaced with curve tokens. Do not touch
  `lib/hooks/use-drag-dismiss.ts` or
  `app/projects/components/ProjectChapter.tsx` at all.
- Do NOT change any `"easeOut"` / `"easeInOut"` string values in this pass.
  Those are Framer's own named curves and are handled where relevant by other
  plans.
- Do NOT change markup, class names, or component structure. Motion values only.
- Do NOT add dependencies.
- Do NOT introduce `--duration-*` tokens. Tailwind v4 already accepts bare
  numeric durations (`duration-200`), so a duration token layer would add
  indirection without adding meaning.
- If a line number in these steps does not match the code you find, locate the
  same expression by its content and proceed. If the expression itself is absent
  or differs, STOP and report rather than improvising.

## Verification

- **Mechanical**:
  - `npm run lint` — expect zero new warnings.
  - `npm run build` — expect zero TypeScript errors and successful static
    generation of all pages. This is the real gate; CI skips the build check on
    non-`drafts/` branches.
  - The `grep` in step 10 returns no matches.
  - `grep -n "ease-out" app/globals.css` shows the token defined in both `:root`
    and `@theme inline`.
- **Feel check**: run `npm run dev` and load `/`.
  - The hero headline, eyebrow, paragraph, and button should now *launch* and
    settle, rather than easing in from a standstill. The difference is most
    obvious on the h1.
  - Open DevTools → Animations panel, set playback speed to 10%, and reload.
    Confirm each hero element covers most of its distance in the first third of
    its duration. If it is still moving at a constant-ish rate through the
    middle, the token did not take effect.
  - Press and hold any "Get a Free Estimate" button. The 3% depress must still
    happen instantly on finger/mouse down, and the release must still be the
    slower of the two.
  - Navigate between `/` and `/services`. The header should drop in and stop
    cleanly, with no lingering drift at the end.
- **Done when**: no hardcoded `[0.25, 0.1, 0.25, 1]` or
  `cubic-bezier(0.25, 0.1, 0.25, 1)` remains anywhere in `app/`, `components/`,
  or `lib/`; `EASE_OUT` and `EASE_IN_OUT` are exported from `lib/animations.ts`;
  `--ease-out` and `--ease-in-out` resolve in the browser (check in DevTools:
  `getComputedStyle(document.documentElement).getPropertyValue('--ease-out')`
  returns `cubic-bezier(0.23, 1, 0.32, 1)`); and `npm run build` passes.
