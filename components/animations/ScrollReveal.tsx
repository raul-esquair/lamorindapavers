"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  // No `once` prop by design: progress here is a function of scroll position,
  // so there is no one-shot state to latch.
}

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });

  // Map scroll progress to animation values with optional delay
  const clampedProgress = useTransform(scrollYProgress, [delay, 1], [0, 1], {
    clamp: true,
  });

  const opacity = useTransform(clampedProgress, [0, 1], [0, 1]);

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

  return (
    <m.div ref={ref} style={{ opacity, y, x }} className={className}>
      {children}
    </m.div>
  );
}
