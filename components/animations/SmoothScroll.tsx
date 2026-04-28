"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Module-level singleton so any component can call getLenis() and reach the
// active instance without prop-drilling or wrapping the tree in another context.
// Lenis is a global page-scroll controller — having one instance is correct.
// This is a live getter (not a hook) so callers always read the current value
// at the moment of invocation — important for click handlers whose render-time
// closure may have captured `null` before SmoothScroll's effect ran.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
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

  return <>{children}</>;
}
