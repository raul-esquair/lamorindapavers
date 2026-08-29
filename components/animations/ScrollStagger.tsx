"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import React from "react";

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Render as a semantic list instead of divs. The container becomes `<ul>` and
   * each item `<li>` together — they cannot be chosen separately, because a
   * `<div>` sitting between `<ul>` and `<li>` is invalid HTML and breaks the
   * list for assistive technology. That constraint is the whole reason this
   * prop exists.
   */
  as?: "div" | "ul";
}

export default function ScrollStagger({
  children,
  className,
  as = "div",
}: ScrollStaggerProps) {
  const childArray = React.Children.toArray(children);
  const Container = as === "ul" ? "ul" : "div";
  const itemAs = as === "ul" ? "li" : "div";

  return (
    <Container className={className}>
      {childArray.map((child, i) => (
        <StaggerItem key={i} as={itemAs}>
          {child}
        </StaggerItem>
      ))}
    </Container>
  );
}

function StaggerItem({
  children,
  as,
}: {
  children: React.ReactNode;
  as: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [50, 0]);

  // `m.li` and `m.div` have identical props here bar the ref element type, and
  // the ref is only ever read by useScroll, which wants nothing more specific
  // than an HTMLElement. Narrowing to one signature keeps the call site clean.
  const Item = (as === "li" ? m.li : m.div) as typeof m.div;

  return (
    <Item ref={ref} style={{ opacity, y }}>
      {children}
    </Item>
  );
}
