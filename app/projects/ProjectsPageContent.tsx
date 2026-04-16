"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import { fadeUp } from "@/lib/animations";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import FinalCTA from "@/components/sections/FinalCTA";

interface Props {
  projects: Project[];
  categories: string[];
}

export default function ProjectsPageContent({ projects, categories }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Portfolio</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              Our Work
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              Every project tells a story. Browse our portfolio of transformations
              across the East Bay.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-12">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-brand-blue text-white"
                    : "bg-cream text-warm-gray-600 hover:bg-warm-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                  >
                    {/* Placeholder bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-gray-700 to-warm-gray-900" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/30 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content on hover */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="label-text text-brand-gold mb-1">
                        {project.category}
                      </span>
                      <h3 className="text-lg font-serif text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm font-sans text-warm-gray-300">
                        {project.city}, CA
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-warm-gray-400 font-sans">
                No projects found for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
