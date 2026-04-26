"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { services } from "@/lib/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ServiceCard from "@/components/ui/ServiceCard";

const featuredServices = services.slice(0, 8);

// Bento layout config
// At lg (4-col grid), index 0 is a tall hero (2w x 2h), index 7 spans 2 cols.
// Below lg, they just span the 2-col grid like before.
const bentoConfig: Record<number, { gridClass: string; sizes: string }> = {
  0: {
    gridClass: "sm:col-span-2 lg:row-span-2 h-72 md:h-80 lg:h-full",
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
  7: {
    gridClass: "sm:col-span-2 h-72 md:h-80 lg:h-full",
    sizes: "(max-width: 640px) 100vw, 50vw",
  },
};

const defaultConfig = {
  gridClass: "h-64 md:h-72 lg:h-full",
  sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
};

function BentoItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.45"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

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

        {/* Bento Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:auto-rows-[18rem]">
          {featuredServices.map((service, i) => {
            const config = bentoConfig[i] || defaultConfig;
            return (
              <BentoItem key={service.slug} className={config.gridClass}>
                <ServiceCard service={service} sizes={config.sizes} />
              </BentoItem>
            );
          })}
        </div>

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
