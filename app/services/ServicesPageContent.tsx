"use client";

import Image from "next/image";
import Link from "next/link";
import { blurProps } from "@/lib/blur";
import type { Service } from "@/lib/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollStagger from "@/components/animations/ScrollStagger";
import FinalCTA from "@/components/sections/FinalCTA";

const HERO_IMAGE = "/images/services-hero.jpg";

export default function ServicesPageContent({ services }: { services: Service[] }) {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end min-h-[60vh] md:min-h-[70vh] pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Curved paver retaining wall around a raised patio, with lit steps and a stacked-stone accent wall"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 25%" }}
            sizes="100vw"
            {...blurProps(HERO_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-gray-900/60 via-warm-gray-900/35 to-warm-gray-900/75" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel className="text-brand-gold">Our Services</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
              What We Build
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-100 font-sans">
              From stunning paver driveways to complete outdoor living transformations,
              every project is crafted with precision and built to last.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block bg-cream rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-[color,background-color,border-color,box-shadow] duration-200 ease-out h-full"
                >
                  {service.image ? (
                    <div className="relative h-48 bg-warm-gray-200">
                      {/* alt="" — the card's heading already names the service,
                          and the whole card is one link. */}
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: service.imagePosition || "center" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        {...blurProps(service.image)}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-brand-blue/10 to-brand-gold/10 group-hover:from-brand-blue/20 group-hover:to-brand-gold/20 transition-[color,background-color,border-color,box-shadow] duration-200 ease-out" />
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-2">
                      {service.name}
                    </h2>
                    <p className="text-sm font-sans text-warm-gray-500 line-clamp-2 mb-4">
                      {service.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-brand-blue text-sm font-sans font-medium">
                      Learn More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </ScrollStagger>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
