"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects, type Project } from "@/lib/data/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";

// Alternating reveal directions for each card
const revealDirections: Array<"left" | "right" | "bottom" | "top"> = [
  "left",
  "right",
  "bottom",
  "left",
];

// Curtain colors cycling through the 3 logo colors
const curtainColors = [
  "bg-brand-blue",
  "bg-brand-red",
  "bg-brand-gold",
  "bg-brand-blue",
];

function ProjectRevealCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const direction = revealDirections[index % revealDirections.length];

  // Track this card's scroll position
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.9", "start 0.35"],
  });

  // Image reveal: clip-path goes from fully hidden to fully visible
  const revealProgress = useTransform(scrollYProgress, [0, 0.7], [0, 1], {
    clamp: true,
  });

  // Text content fades in after image is mostly revealed
  const textOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 1], {
    clamp: true,
  });
  const textY = useTransform(scrollYProgress, [0.5, 1], [20, 0], {
    clamp: true,
  });

  // Build clip-path based on direction
  const clipPath = useTransform(revealProgress, (v: number) => {
    switch (direction) {
      case "left":
        // Reveals from left to right
        return `inset(0 ${(1 - v) * 100}% 0 0)`;
      case "right":
        // Reveals from right to left
        return `inset(0 0 0 ${(1 - v) * 100}%)`;
      case "bottom":
        // Reveals from bottom to top
        return `inset(${(1 - v) * 100}% 0 0 0)`;
      case "top":
        // Reveals from top to bottom
        return `inset(0 0 ${(1 - v) * 100}% 0)`;
    }
  });

  // Subtle scale: image starts slightly zoomed and settles
  const imageScale = useTransform(revealProgress, [0, 1], [1.15, 1]);

  const hasImage =
    project.images[0] && !project.images[0].includes("placeholder");

  return (
    <div ref={cardRef} className="group relative overflow-hidden rounded-xl h-72 md:h-80">
      {/* Colored reveal bar that slides across before image appears */}
      <motion.div
        className={`absolute inset-0 z-10 ${curtainColors[index % curtainColors.length]}`}
        style={{
          clipPath,
          opacity: useTransform(revealProgress, [0, 0.4, 0.7, 1], [0, 1, 1, 0]),
        }}
      />

      {/* Image with clip-path reveal */}
      {hasImage ? (
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.div
            className="absolute inset-0"
            style={{ scale: imageScale }}
          >
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              style={{ objectPosition: project.imagePosition || "center" }}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-warm-gray-800 to-warm-gray-900"
          style={{ clipPath }}
        />
      )}

      {/* Gradient overlay — also reveals with clip-path */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/80 via-warm-gray-900/20 to-transparent"
        style={{ clipPath }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/20 transition-colors duration-500" />

      {/* Content — fades in after image reveals */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
        style={{ opacity: textOpacity, y: textY }}
      >
        <span className="label-text text-brand-gold mb-2">
          {project.category}
        </span>
        <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
          {project.title}
        </h3>
        <p className="text-sm font-sans text-warm-gray-300">
          {project.city}, CA
        </p>
      </motion.div>
    </div>
  );
}

export default function FeaturedProjects() {
  const projects = getFeaturedProjects();

  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="mb-16">
          <SectionLabel>Our Work</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-brand-blue font-sans font-semibold hover:gap-3 transition-all shrink-0"
            >
              View Full Portfolio
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Projects Grid with Clip-Path Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectRevealCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
