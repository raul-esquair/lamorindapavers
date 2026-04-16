"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });

  // Map scroll progress to animation values with optional delay
  const clampedProgress = useTransform(scrollYProgress, [delay, 1], [0, 1], {
    clamp: true,
  });

  const opacity = useTransform(clampedProgress, [0, 1], [0, 1]);

  const yOffset = direction === "up" ? 60 : 0;
  const xOffset = direction === "left" ? -60 : direction === "right" ? 60 : 0;

  const y = useTransform(clampedProgress, [0, 1], [yOffset, 0]);
  const x = useTransform(clampedProgress, [0, 1], [xOffset, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, x }} className={className}>
      {children}
    </motion.div>
  );
}
