"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Service } from "@/lib/data/services";
import { staggerContainer, fadeUp } from "@/lib/animations";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import FinalCTA from "@/components/sections/FinalCTA";

export default function ServicesPageContent({ services }: { services: Service[] }) {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Our Services</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              What We Build
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              From stunning paver driveways to complete outdoor living transformations,
              every project is crafted with precision and built to last.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div key={service.slug} variants={fadeUp}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block bg-cream rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-brand-blue/10 to-brand-gold/10 group-hover:from-brand-blue/20 group-hover:to-brand-gold/20 transition-all duration-500" />

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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
