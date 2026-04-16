"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { City } from "@/lib/data/cities";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { staggerContainer, fadeUp } from "@/lib/animations";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import QuoteButton from "@/components/ui/QuoteButton";
import FinalCTA from "@/components/sections/FinalCTA";

export default function CityPageContent({ city }: { city: City }) {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Service Area</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              Paver Installation in{" "}
              <span className="text-brand-blue">{city.name}</span>, CA
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              {city.description}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Available */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12">
            <h2 className="text-3xl md:text-4xl text-warm-gray-900">
              Services in {city.name}
            </h2>
            <p className="text-warm-gray-500 font-sans mt-3">
              Full-service paver installation and outdoor living for {city.name} homeowners.
            </p>
          </ScrollReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.slug} variants={fadeUp}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-lg bg-cream border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-sm transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                  <span className="font-sans text-warm-gray-700 group-hover:text-brand-blue transition-colors">
                    {service.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us for This City */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl text-warm-gray-900 mb-6">
                Why {city.name} Homeowners Choose Us
              </h2>
              <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
                <p>
                  For over a decade, {company.name} has been the trusted paver contractor
                  for {city.name} and the surrounding East Bay communities. Owner Steve
                  Barsanti personally oversees every project, ensuring the highest
                  standards of craftsmanship.
                </p>
                <p>
                  We understand the unique characteristics of {city.name} properties —
                  from soil conditions to local regulations — and bring that expertise
                  to every installation.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <QuoteButton variant="secondary">
                  Get a Free Estimate in {city.name}
                </QuoteButton>
                <Button href={company.phoneHref} variant="outline" external>
                  Call {company.phone}
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-warm-white rounded-xl p-8 border border-warm-gray-200 space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-sans text-warm-gray-700">Licensed #{company.license}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-sans text-warm-gray-700">{company.warranty}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="font-sans text-warm-gray-700">Owner On-Site Every Project</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-sans text-warm-gray-700">10+ Years Serving {city.county} County</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
