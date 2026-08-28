"use client";

import { useCallback, useRef } from "react";
import { animate, useMotionValue, type AnimationPlaybackControls } from "framer-motion";

/**
 * Drag-to-dismiss for a sheet, built on Pointer Events rather than framer's
 * `drag` prop.
 *
 * The app is wrapped in `<LazyMotion features={domAnimation}>` (see
 * ClientProviders), and `domAnimation` does not include the drag gesture —
 * enabling it would mean switching to `domMax` and giving back the bundle
 * saving the whole codebase is written around. Pointer Events cost nothing and
 * give finer control over the parts that actually matter here: the grab offset,
 * the release velocity, and the momentum projection.
 */

/** Milliseconds of pointer history used to compute release velocity. */
const VELOCITY_WINDOW_MS = 80;

/**
 * Where a flick would come to rest, from Apple's `Designing Fluid Interfaces`
 * sample code. Exponential decay, NOT the textbook v²/(2a) — the two disagree
 * noticeably at the velocities a thumb actually produces.
 */
export function projectMomentum(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Progressive resistance past a boundary. A hard stop reads as frozen; this
 * reads as "responsive, but there's nothing more this way."
 */
function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

interface Sample {
  y: number;
  t: number;
}

function releaseVelocity(history: Sample[]): number {
  if (history.length < 2) return 0;
  const last = history[history.length - 1];

  // Walk back to the oldest sample still inside the window. Using only the
  // final two events makes velocity extremely noisy at high frame rates.
  let first = history[0];
  for (let i = history.length - 1; i >= 0; i--) {
    if (last.t - history[i].t > VELOCITY_WINDOW_MS) break;
    first = history[i];
  }

  const dt = last.t - first.t;
  if (dt <= 0) return 0;
  return ((last.y - first.y) / dt) * 1000; // px/s
}

interface Options {
  onDismiss: () => void;
  /** How far the *projected* resting point must travel to commit to a dismiss. */
  threshold?: number;
  /** When false the handlers no-op, leaving the sheet fixed. */
  enabled?: boolean;
}

export function useDragDismiss({ onDismiss, threshold = 120, enabled = true }: Options) {
  const y = useMotionValue(0);
  const running = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef({ active: false, grabOffset: 0, history: [] as Sample[] });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      // Start from the presentation value, not the target: grabbing a sheet
      // that is still settling must continue from where it visibly is.
      running.current?.stop();
      running.current = null;

      e.currentTarget.setPointerCapture(e.pointerId);

      // Preserve where along the sheet the user actually grabbed, so the sheet
      // never snaps to meet the finger.
      drag.current.active = true;
      drag.current.grabOffset = e.clientY - y.get();
      drag.current.history = [{ y: e.clientY, t: performance.now() }];
    },
    [enabled, y],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!drag.current.active) return;

      const raw = e.clientY - drag.current.grabOffset;
      // Downward tracks the finger 1:1. Upward is a boundary — there is no
      // "more sheet" above — so it resists instead of stopping dead.
      const next =
        raw < 0 ? -rubberband(-raw, window.innerHeight) : raw;

      y.set(next);

      const history = drag.current.history;
      history.push({ y: e.clientY, t: performance.now() });
      if (history.length > 12) history.shift();
    },
    [y],
  );

  const end = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!drag.current.active) return;
      drag.current.active = false;

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      const velocity = releaseVelocity(drag.current.history);
      const current = y.get();
      const projected = current + projectMomentum(velocity);

      // Decide on where the gesture was *going*, not where the finger stopped.
      // A short fast flick dismisses; a long slow drag that was already easing
      // back does not.
      if (projected > threshold) {
        // Hand the finger's velocity straight to the animation so there is no
        // seam between dragging and animating.
        running.current = animate(y, window.innerHeight, {
          type: "spring",
          stiffness: 300,
          damping: 40,
          velocity,
        });
        // Called immediately, not on completion, so the backdrop and panel fade
        // runs concurrently with the throw rather than after it.
        onDismiss();
        return;
      }

      // Settling back. A gesture with momentum preceded this, so a little
      // overshoot is correct here (damping ratio 0.8, response 0.3s):
      //   k = (2pi / 0.3)^2 ~= 438,  c = 2 * 0.8 * (2pi / 0.3) ~= 33.5
      running.current = animate(y, 0, {
        type: "spring",
        stiffness: 438,
        damping: 33.5,
        velocity,
      });
    },
    [onDismiss, threshold, y],
  );

  return {
    y,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
    },
  };
}
