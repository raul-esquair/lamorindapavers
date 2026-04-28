"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";
import { blurProps } from "@/lib/blur";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Props {
  project: Project;
  index: number;
  total: number;
}

export default function ProjectChapterMobile({ project, index, total }: Props) {
  const heroIdx = project.heroIndex ?? 0;
  const heroImage = project.images[heroIdx];
  const isPlaceholderImage = !heroImage || heroImage.includes("placeholder.jpg");
  const chapterNum = String(index + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");

  return (
    <article
      id={`chapter-mobile-${project.id}`}
      aria-labelledby={`chapter-mobile-${project.id}-title`}
      className="border-b border-warm-gray-200 last:border-b-0"
    >
      <ScrollReveal direction="up">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-warm-gray-200">
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
              sizes="(min-width: 1024px) 1px, 100vw"
              style={{ objectPosition: project.imagePosition ?? "center" }}
              className="object-cover"
              priority={index === 0}
              {...blurProps(heroImage)}
            />
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up">
        <div className="px-6 sm:px-10 py-12">
          <div className="flex items-center justify-between mb-5">
            <span className="label-text text-brand-blue">
              {project.category}
            </span>
            <span className="label-text text-warm-gray-300 tabular-nums">
              {chapterNum} / {totalNum}
            </span>
          </div>

          <h2
            id={`chapter-mobile-${project.id}-title`}
            className="text-3xl sm:text-4xl text-warm-gray-900 mb-3 font-serif"
          >
            {project.title}
          </h2>

          <p className="text-warm-gray-500 font-sans text-base mb-6">
            {project.city}, CA
            {project.year ? ` · ${project.year}` : ""}
          </p>

          {project.description && (
            <p className="text-warm-gray-700 font-sans text-base leading-relaxed mb-8">
              {project.description}
            </p>
          )}

          {(project.scope || project.duration) && (
            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8">
              {project.scope && (
                <div className="flex flex-col gap-1">
                  <dt className="label-text text-warm-gray-400">Scope</dt>
                  <dd className="font-sans text-warm-gray-700 text-sm">
                    {project.scope}
                  </dd>
                </div>
              )}
              {project.duration && (
                <div className="flex flex-col gap-1">
                  <dt className="label-text text-warm-gray-400">Duration</dt>
                  <dd className="font-sans text-warm-gray-700 text-sm">
                    {project.duration}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {project.materials && project.materials.length > 0 && (
            <div className="mb-8">
              <span className="label-text text-warm-gray-400 block mb-3">
                Materials
              </span>
              <ul className="space-y-1.5">
                {project.materials.map((material) => (
                  <li
                    key={material}
                    className="font-sans text-warm-gray-700 text-sm leading-snug"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.services && project.services.length > 0 && (
            <div>
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
        </div>
      </ScrollReveal>
    </article>
  );
}
