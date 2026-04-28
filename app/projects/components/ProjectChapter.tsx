"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  m,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";
import { blurProps } from "@/lib/blur";
import {
  revealDirections,
  curtainColors,
  curtainClipPathFor,
} from "../lib/chapter-config";

interface Props {
  project: Project;
  nextProject: Project | null;
  index: number;
  total: number;
}

export default function ProjectChapter({
  project,
  nextProject,
  index,
  total,
}: Props) {
  const chapterRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const heroIdx = project.heroIndex ?? 0;
  const heroImage = project.images[heroIdx];
  const isPlaceholderImage = !heroImage || heroImage.includes("placeholder.jpg");
  const chapterNum = String(index + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");

  // Next-chapter under-layer for the curtain handoff.
  const nextHeroIdx = nextProject?.heroIndex ?? 0;
  const nextHeroImage = nextProject?.images[nextHeroIdx];
  const nextIsPlaceholder =
    !nextHeroImage || nextHeroImage.includes("placeholder.jpg");

  const direction = revealDirections[index % revealDirections.length];
  const curtainColor = curtainColors[index % curtainColors.length];

  // Per-chapter scroll progress (decision #5: never share with parent / siblings).
  // 0 = chapter top hits viewport top (pin begins). 1 = chapter bottom hits viewport top.
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start start", "end start"],
  });

  // Entry: image settles from a slight zoom, metadata column slides + fades in.
  // Identity ranges in reduced-motion mode so the chapter just renders flat.
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? [1, 1] : [1.06, 1.0],
  );
  const metadataX = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? [0, 0] : [40, 0],
  );
  const metadataOpacity = useTransform(
    scrollYProgress,
    [0, 0.15],
    reducedMotion ? [1, 1] : [0, 1],
  );

  // Curtain sweep: chapter progress [0.55, 0.95] maps to sweep [0, 1].
  // After 0.95, sweep stays at 1 for ~5% of pin (50px-ish at 1080p) so the user
  // briefly rests on the next chapter's image before pin handoff.
  const curtainSweep = useTransform(
    scrollYProgress,
    [0.55, 0.95],
    [0, 1],
    { clamp: true },
  );
  const curtainClipPath = useTransform(curtainSweep, (v: number) =>
    curtainClipPathFor(direction, v),
  );
  // Panel holds full color through the sweep, then fades out to reveal the next image.
  const panelOpacity = useTransform(curtainSweep, [0, 0.05, 0.6, 1], [0, 1, 1, 0]);

  // Outer / inner classes change in reduced-motion mode: no pinning, just a static stack.
  const outerClass = reducedMotion ? "relative" : "relative lg:h-[200vh]";
  const innerClass = reducedMotion
    ? ""
    : "lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden";

  return (
    <article
      ref={chapterRef}
      id={`chapter-${project.id}`}
      aria-labelledby={`chapter-${project.id}-title`}
      className={outerClass}
    >
      <div className={innerClass}>
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] min-h-screen lg:min-h-0 lg:h-screen">
          {/* Image side (z-10) */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-warm-gray-200 z-10">
            <m.div
              className="absolute inset-0"
              style={{ scale: imageScale }}
            >
              {isPlaceholderImage ? (
                <div className="absolute inset-0 bg-gradient-to-br from-warm-gray-300 via-warm-gray-400 to-warm-gray-600 flex items-center justify-center">
                  <span className="label-text text-white/70">
                    Photo coming soon
                  </span>
                </div>
              ) : (
                <Image
                  src={heroImage}
                  alt={`${project.title} — ${project.category} in ${project.city}`}
                  fill
                  sizes="(max-width: 1023px) 1px, 60vw"
                  style={{ objectPosition: project.imagePosition ?? "center" }}
                  className="object-cover"
                  priority={index === 0}
                  {...blurProps(heroImage)}
                />
              )}
            </m.div>
          </div>

          {/* Metadata side (z-20) */}
          <m.div
            style={{ x: metadataX, opacity: metadataOpacity }}
            className="relative z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-20 bg-warm-white"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="label-text text-brand-blue">
                {project.category}
              </span>
              <span className="label-text text-warm-gray-300 tabular-nums">
                {chapterNum} / {totalNum}
              </span>
            </div>

            <h2
              id={`chapter-${project.id}-title`}
              className="text-3xl md:text-4xl lg:text-5xl text-warm-gray-900 mb-4 font-serif"
            >
              {project.title}
            </h2>

            <p className="text-warm-gray-500 font-sans text-base md:text-lg mb-8">
              {project.city}, CA
              {project.year ? ` · ${project.year}` : ""}
            </p>

            {project.description && (
              <p className="text-warm-gray-700 font-sans text-base md:text-lg leading-relaxed mb-10 max-w-prose">
                {project.description}
              </p>
            )}

            {(project.scope || project.duration) && (
              <dl className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 max-w-md">
                {project.scope && (
                  <div className="flex flex-col gap-1">
                    <dt className="label-text text-warm-gray-400">Scope</dt>
                    <dd className="font-sans text-warm-gray-700">
                      {project.scope}
                    </dd>
                  </div>
                )}
                {project.duration && (
                  <div className="flex flex-col gap-1">
                    <dt className="label-text text-warm-gray-400">Duration</dt>
                    <dd className="font-sans text-warm-gray-700">
                      {project.duration}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {project.materials && project.materials.length > 0 && (
              <div className="mb-10 max-w-md">
                <span className="label-text text-warm-gray-400 block mb-3">
                  Materials
                </span>
                <ul className="space-y-1.5">
                  {project.materials.map((material) => (
                    <li
                      key={material}
                      className="font-sans text-warm-gray-700 leading-snug"
                    >
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.services && project.services.length > 0 && (
              <div className="max-w-md">
                <span className="label-text text-warm-gray-400 block mb-3">
                  Services
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((slug) => {
                    const svc = getServiceBySlug(slug);
                    if (!svc) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/services/${svc.slug}`}
                        className="px-3 py-1.5 rounded-full bg-cream hover:bg-warm-gray-100 text-warm-gray-700 text-sm font-sans transition-colors"
                      >
                        {svc.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </m.div>

          {/* Curtain layer (desktop, non-reduced-motion only). Last chapter has no curtain. */}
          {nextProject && !reducedMotion && (
            <>
              {/* Under-layer: mirrors the next chapter's start state — image left 60%,
                  warm-white right 40%. Image is held at scale 1.06 so the visual lines up
                  with the next chapter's entry-zoom origin (no pop at pin handoff). */}
              <m.div
                aria-hidden
                className="absolute inset-0 z-30 hidden lg:block pointer-events-none"
                style={{ clipPath: curtainClipPath }}
              >
                <div className="grid grid-cols-[1.6fr_1fr] h-full">
                  <div className="relative overflow-hidden bg-warm-gray-200">
                    {nextIsPlaceholder ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-warm-gray-300 via-warm-gray-400 to-warm-gray-600 flex items-center justify-center">
                        <span className="label-text text-white/70">
                          Photo coming soon
                        </span>
                      </div>
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ transform: "scale(1.06)" }}
                      >
                        <Image
                          src={nextHeroImage!}
                          alt=""
                          fill
                          sizes="(max-width: 1023px) 1px, 60vw"
                          style={{
                            objectPosition:
                              nextProject.imagePosition ?? "center",
                          }}
                          className="object-cover"
                          {...blurProps(nextHeroImage!)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-warm-white" />
                </div>
              </m.div>

              {/* Colored panel on top — same clip-path so it sweeps with the under-layer,
                  then fades out at the end of the sweep to reveal the next image. */}
              <m.div
                aria-hidden
                className={`absolute inset-0 z-30 hidden lg:block pointer-events-none ${curtainColor}`}
                style={{ clipPath: curtainClipPath, opacity: panelOpacity }}
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
