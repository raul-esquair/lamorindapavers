"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { blurProps } from "@/lib/blur";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.3,
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.div style={{ y }} className="relative h-[120%] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          {...blurProps(src)}
        />
      </m.div>
    </div>
  );
}
