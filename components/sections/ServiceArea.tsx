"use client";

import Link from "next/link";
import { company } from "@/lib/data/company";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ServiceArea() {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel>Where We Work</SectionLabel>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 mt-4 mb-6">
            Serving the East Bay
          </h2>
          <p className="text-lg text-warm-gray-500 font-sans max-w-2xl mx-auto">
            From Lamorinda to the greater East Bay, we bring premium paver installations
            to communities across Contra Costa and Alameda counties.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Core Lamorinda */}
          <ScrollReveal>
            <div className="bg-warm-white rounded-xl p-8 border border-warm-gray-200">
              <h3 className="font-serif text-xl text-warm-gray-900 mb-1">Lamorinda</h3>
              <p className="text-xs font-sans text-brand-blue uppercase tracking-wider mb-4">Core Service Area</p>
              <ul className="space-y-2">
                {company.serviceArea.primary.map((city) => (
                  <li key={city}>
                    <Link
                      href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-warm-gray-600 hover:text-brand-blue transition-colors font-sans text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      {city}, CA
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Contra Costa */}
          <ScrollReveal delay={0.15}>
            <div className="bg-warm-white rounded-xl p-8 border border-warm-gray-200">
              <h3 className="font-serif text-xl text-warm-gray-900 mb-1">Contra Costa County</h3>
              <p className="text-xs font-sans text-brand-blue uppercase tracking-wider mb-4">Extended Area</p>
              <ul className="space-y-2">
                {[...company.serviceArea.secondary, "Danville", "San Ramon", "Martinez"].map((city) => (
                  <li key={city}>
                    <Link
                      href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-warm-gray-600 hover:text-brand-blue transition-colors font-sans text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/40" />
                      {city}, CA
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Alameda */}
          <ScrollReveal delay={0.3}>
            <div className="bg-warm-white rounded-xl p-8 border border-warm-gray-200">
              <h3 className="font-serif text-xl text-warm-gray-900 mb-1">Alameda County</h3>
              <p className="text-xs font-sans text-brand-blue uppercase tracking-wider mb-4">Extended Area</p>
              <ul className="space-y-2">
                {["Dublin", "Berkeley", "Oakland"].map((city) => (
                  <li key={city}>
                    <Link
                      href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-warm-gray-600 hover:text-brand-blue transition-colors font-sans text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/40" />
                      {city}, CA
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
