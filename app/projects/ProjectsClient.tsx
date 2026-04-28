"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { type Project, getCategorySlug } from "@/lib/data/projects";
import { blurProps } from "@/lib/blur";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import FinalCTA from "@/components/sections/FinalCTA";
import { getLenis } from "@/components/animations/SmoothScroll";
import ProjectChapter from "./components/ProjectChapter";
import ProjectChapterMobile from "./components/ProjectChapterMobile";
import FilterBar from "./components/FilterBar";
import ProjectShelf from "./components/ProjectShelf";

const HERO_IMAGE = "/images/projects/gallery-hero.webp";

interface Props {
  projects: Project[];
  categories: string[];
}

export default function ProjectsClient({ projects, categories }: Props) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("service");
  const stackRef = useRef<HTMLElement>(null);

  const filteredProjects = activeSlug
    ? projects.filter((p) => getCategorySlug(p.category) === activeSlug)
    : projects;

  // After filter change, scroll the chapter stack into view so the user doesn't
  // land mid-air if they were several chapters deep when filtering. Use Lenis
  // when available (so the smooth motion isn't double-applied with native smooth).
  const handleFilterChange = () => {
    requestAnimationFrame(() => {
      const target = stackRef.current;
      if (!target) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  return (
    <>
      <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-end overflow-hidden">
        {/* Background — bottom-half-priority crop emphasizes the paver detail */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Detailed view of a custom paver driveway laid in a herringbone pattern"
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: "center 70%" }}
            className="object-cover"
            {...blurProps(HERO_IMAGE)}
          />
          {/* Dark gradient — strongest at the bottom where the headline sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/85 via-warm-gray-900/40 to-warm-gray-900/15" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 md:pb-20 w-full">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel className="text-brand-gold">Portfolio</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
              Selected Work
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-200 font-sans">
              Each project is a story of transformation — hand-built across the
              East Bay by Steve Barsanti and the Lamorinda Pavers crew.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <FilterBar
        categories={categories}
        filteredCount={filteredProjects.length}
        totalCount={projects.length}
        onFilterChange={handleFilterChange}
      />

      <main ref={stackRef} className="bg-warm-white">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredProjects.map((project, i) => (
            <m.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Fragment>
                <div className="hidden lg:block">
                  <ProjectChapter
                    project={project}
                    nextProject={filteredProjects[i + 1] ?? null}
                    index={i}
                    total={filteredProjects.length}
                  />
                </div>
                <div className="lg:hidden">
                  <ProjectChapterMobile
                    project={project}
                    index={i}
                    total={filteredProjects.length}
                  />
                </div>
              </Fragment>
            </m.div>
          ))}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="py-32 px-6 text-center">
            <p className="text-warm-gray-500 font-sans text-lg">
              No projects in this category yet.
            </p>
            <p className="text-warm-gray-400 font-sans text-sm mt-2">
              Try a different filter, or check back soon.
            </p>
          </div>
        )}
      </main>

      <ProjectShelf projects={filteredProjects} stackRef={stackRef} />

      <FinalCTA />
    </>
  );
}
