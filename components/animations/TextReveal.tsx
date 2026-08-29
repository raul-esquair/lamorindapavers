"use client";

import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/animations";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function TextReveal({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  once = true,
}: TextRevealProps) {
  const words = children.split(" ");
  const reducedMotion = useReducedMotion();

  return (
    <Tag className={className}>
      <m.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reducedMotion ? 0 : 0.05,
              delayChildren: delay,
            },
          },
        }}
        className="inline"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <m.span
              className="inline-block"
              variants={{
                hidden: { y: reducedMotion ? "0%" : "100%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: EASE_OUT,
                  },
                },
              }}
            >
              {word}
            </m.span>
            {i < words.length - 1 && "\u00A0"}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
