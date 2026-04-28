"use client";

import { type RefObject } from "react";
import Image from "next/image";
import {
  m,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { blurProps } from "@/lib/blur";
import { getLenis } from "@/components/animations/SmoothScroll";

interface Props {
  projects: Project[];
  stackRef: RefObject<HTMLElement | null>;
}

export default function ProjectShelf({ projects, stackRef }: Props) {
  // Two scroll subscriptions on the same target with different windows:
  //   1. enterProgress fades the shelf in/out as the stack enters/exits viewport.
  //   2. trackProgress drives the active-chapter highlight while inside the stack.
  const { scrollYProgress: enterProgress } = useScroll({
    target: stackRef,
    offset: ["start end", "start start"],
  });
  const { scrollYProgress: trackProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  // Each chapter occupies 1/N of the stack scroll, so flooring v*N gives the
  // active index. Clamp at the edges so we don't index out of range.
  const count = projects.length;
  const activeIndex = useTransform(trackProgress, (v: number) => {
    if (count <= 0) return 0;
    return Math.max(0, Math.min(count - 1, Math.floor(v * count)));
  });

  const shelfOpacity = useTransform(enterProgress, [0.4, 1], [0, 1]);
  const shelfY = useTransform(enterProgress, [0.4, 1], [80, 0]);

  const handleClick = (id: string) => {
    const target = document.getElementById(`chapter-${id}`);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (count === 0) return null;

  return (
    <m.nav
      // key forces remount when the filtered count changes so closures over
      // `count` don't go stale inside the useTransform calls below.
      key={count}
      aria-label="Project chapter navigator"
      style={{ opacity: shelfOpacity, y: shelfY }}
      className="fixed bottom-0 left-0 right-0 z-40 hidden lg:block bg-warm-white/85 backdrop-blur-md border-t border-warm-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <span className="label-text text-warm-gray-400 shrink-0">Chapters</span>
        <div className="flex items-center gap-2 overflow-x-auto flex-1 -mx-1 px-1">
          {projects.map((project, i) => (
            <ShelfThumb
              key={project.id}
              project={project}
              index={i}
              activeIndex={activeIndex}
              onClick={() => handleClick(project.id)}
            />
          ))}
        </div>
      </div>
    </m.nav>
  );
}

function ShelfThumb({
  project,
  index,
  activeIndex,
  onClick,
}: {
  project: Project;
  index: number;
  activeIndex: MotionValue<number>;
  onClick: () => void;
}) {
  const heroIdx = project.heroIndex ?? 0;
  const heroImage = project.images[heroIdx];
  const isPlaceholder = !heroImage || heroImage.includes("placeholder.jpg");

  const opacity = useTransform(activeIndex, (v) => (v === index ? 1 : 0.55));
  const scale = useTransform(activeIndex, (v) => (v === index ? 1 : 0.92));
  const ringOpacity = useTransform(activeIndex, (v) => (v === index ? 1 : 0));

  return (
    <m.button
      onClick={onClick}
      style={{ opacity, scale }}
      className="relative shrink-0 w-20 h-14 rounded-md overflow-hidden bg-warm-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
      aria-label={`Jump to ${project.title}`}
    >
      {isPlaceholder ? (
        <div className="absolute inset-0 bg-gradient-to-br from-warm-gray-300 to-warm-gray-500" />
      ) : (
        <Image
          src={heroImage}
          alt=""
          fill
          sizes="80px"
          style={{ objectPosition: project.imagePosition ?? "center" }}
          className="object-cover"
          {...blurProps(heroImage)}
        />
      )}
      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-warm-white/85 text-[10px] font-sans font-semibold tabular-nums text-warm-gray-700">
        {String(index + 1).padStart(2, "0")}
      </span>
      <m.div
        aria-hidden
        style={{ opacity: ringOpacity }}
        className="absolute inset-0 rounded-md ring-2 ring-brand-blue ring-inset pointer-events-none"
      />
    </m.button>
  );
}
