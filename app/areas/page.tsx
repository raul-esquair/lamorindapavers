import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/lib/data/cities";
import { services } from "@/lib/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Premium paver installation across the East Bay. Serving Lafayette, Moraga, Orinda, Walnut Creek, and all of Contra Costa and Alameda counties. Licensed #1092749.",
};

export default function AreasPage() {
  const contraCosta = cities.filter((c) => c.county === "Contra Costa");
  const alameda = cities.filter((c) => c.county === "Alameda");

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Service Areas</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              Where We Work
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              From the hills of Lamorinda to the wider East Bay, we bring premium
              paver craftsmanship to homes throughout Contra Costa and Alameda counties.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contra Costa */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-warm-gray-900 mb-2">
              Contra Costa County
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Our home turf — from Lamorinda to the edges of the Delta.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contraCosta.map((city) => (
              <ScrollReveal key={city.slug}>
                <Link
                  href={`/${city.slug}`}
                  className="group block bg-cream rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 p-6 h-full"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <p className="text-xs font-sans text-brand-blue uppercase tracking-wider">
                      {city.county} County
                    </p>
                  </div>
                  <h3 className="text-xl font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-3">
                    {city.name}, CA
                  </h3>
                  <p className="text-sm font-sans text-warm-gray-500 line-clamp-3 mb-4">
                    {city.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-blue text-sm font-sans font-medium">
                    View {city.name} Services
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Alameda */}
      {alameda.length > 0 && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-warm-gray-900 mb-2">
                Alameda County
              </h2>
              <p className="text-warm-gray-500 font-sans">
                Extending premium paver work into the East Bay flats and hills.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alameda.map((city) => (
                <ScrollReveal key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="group block bg-warm-white rounded-xl overflow-hidden border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500 p-6 h-full"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60" />
                      <p className="text-xs font-sans text-brand-blue uppercase tracking-wider">
                        {city.county} County
                      </p>
                    </div>
                    <h3 className="text-xl font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-3">
                      {city.name}, CA
                    </h3>
                    <p className="text-sm font-sans text-warm-gray-500 line-clamp-3 mb-4">
                      {city.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-brand-blue text-sm font-sans font-medium">
                      View {city.name} Services
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-2xl">
            <SectionLabel>What We Build</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif text-warm-gray-900 mt-3 mb-4">
              Services Across Every Area
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Whatever East Bay neighborhood you call home, we bring the same
              full-service paver and outdoor living craftsmanship to every project.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ScrollReveal key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-lg bg-cream border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-sm transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                  <span className="font-sans text-warm-gray-700 group-hover:text-brand-blue transition-colors">
                    {service.name}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
