import type { Variants, Transition } from "framer-motion";

// Motion curves, mirroring the --ease-* custom properties in app/globals.css.
// Framer Motion cannot read a CSS custom property for `ease`, so the two
// definitions must be edited together. Keep the numbers identical.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

// Default transition presets
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: EASE_OUT,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

export const slowReveal: Transition = {
  duration: 1.2,
  ease: EASE_OUT,
};

// Fade up animation (most common scroll reveal)
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Fade in (no movement)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Scale up reveal
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

// Stagger children container.
// 60ms reads as a cascade; past ~80ms it reads as a queue the user is waiting
// on. Most scroll reveals now use ScrollStagger instead, which derives its
// cascade from each item's own scroll position rather than a timer — prefer
// that for anything tied to scrolling.
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

// Image reveal with mask
export const imageReveal: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 1.2,
      ease: EASE_OUT,
    },
  },
};

// Text line reveal (for split text)
export const textLineReveal: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
};

// Counter animation helper
export function animateCounter(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void
) {
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);

    onUpdate(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
