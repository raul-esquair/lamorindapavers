"use client";

import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollStagger from "@/components/animations/ScrollStagger";

const featuredServices = services.slice(0, 8);

export default function ServicesOverview() {
  return (
    <section className="py-20 md:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 mt-4 mb-6">
            Our Services
          </h2>
          <p className="text-lg text-warm-gray-500 font-sans max-w-2xl mx-auto">
            From stunning driveways to complete outdoor living spaces, we bring
            craftsmanship and creativity to every project.
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <ScrollStagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredServices.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group block relative bg-cream rounded-xl overflow-hidden h-64 md:h-72"
            >
              {/* Background */}
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  style={{ objectPosition: service.imagePosition || "center" }}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-brand-gold/10 group-hover:from-brand-blue/20 group-hover:to-brand-gold/20 transition-all duration-500" />
              )}

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/80 via-warm-gray-900/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-serif text-white group-hover:text-brand-gold transition-colors mb-2">
                  {service.name}
                </h3>
                <p className="text-sm font-sans text-warm-gray-300 line-clamp-2">
                  {service.shortDescription}
                </p>

                <div className="flex items-center gap-1 mt-3 text-brand-gold text-sm font-sans font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </ScrollStagger>

        {/* View All Link */}
        <ScrollReveal className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-blue font-sans font-semibold hover:gap-3 transition-all"
          >
            View All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
