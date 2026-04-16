"use client";

import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollStagger from "@/components/animations/ScrollStagger";

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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {/* Projects Grid */}
        <ScrollStagger
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-xl ${
                i === 0 ? "md:row-span-2 h-80 md:h-full" : "h-64 md:h-72"
              }`}
            >
              {/* Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-warm-gray-800 to-warm-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/80 via-transparent to-transparent" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/20 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="label-text text-brand-gold mb-2">{project.category}</span>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1">
                  {project.title}
                </h3>
                <p className="text-sm font-sans text-warm-gray-300">
                  {project.city}, CA
                </p>
              </div>
            </div>
          ))}
        </ScrollStagger>
      </div>
    </section>
  );
}
