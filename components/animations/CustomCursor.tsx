"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isTouchDevice);
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      ) {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

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

          An SVG rather than a bordered div: `vectorEffect` keeps the ring
          exactly 1.5px at every scale, where a CSS border would thin to
          0.6px at rest.

          `initial` is stated explicitly because framer-motion cannot
          interpolate the keyword `transparent` — only an alpha value. The same
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
}
