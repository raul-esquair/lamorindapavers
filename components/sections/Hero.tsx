"use client";

import { m } from "framer-motion";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import QuoteButton from "@/components/ui/QuoteButton";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 scale-105"
          style={{
            animation: "kenBurns 20s ease-in-out infinite alternate",
          }}
        >
          <Image
            src="/images/hero-bg.jpg"
            alt="Beautiful landscaped backyard with retaining walls, water feature, and lush greenery by Lamorinda Pavers"
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="100vw"
            {...blurProps("/images/hero-bg.jpg")}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-warm-gray-900/60 via-warm-gray-900/40 to-warm-gray-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="label-text text-brand-gold mb-6"
        >
          Premium Paver Installations &middot; East Bay, CA
        </m.p>

        <m.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.05]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {company.tagline}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg md:text-xl text-warm-gray-200 max-w-2xl mx-auto mb-10 font-sans"
        >
          Transforming outdoor spaces across the East Bay with expert craftsmanship,
          premium materials, and over a decade of experience.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center"
        >
          <QuoteButton variant="secondary" size="lg" />
        </m.div>
      </div>

      {/* Scroll Indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <m.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-sans text-warm-gray-300 tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-warm-gray-300 to-transparent" />
        </m.div>
      </m.div>

      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1.05) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-1%, -1%);
          }
        }
      `}</style>
    </section>
  );
}
