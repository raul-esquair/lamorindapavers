"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollStagger({
  children,
  className,
}: ScrollStaggerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, i) => (
        <StaggerItem key={i}>{child}</StaggerItem>
      ))}
    </div>
  );
}

function StaggerItem({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
