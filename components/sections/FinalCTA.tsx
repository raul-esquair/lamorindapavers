"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { company } from "@/lib/data/company";
import Button from "@/components/ui/Button";
import QuoteButton from "@/components/ui/QuoteButton";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-blue-dark" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div style={{ opacity, y, scale }}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Ready to Transform Your
            <br />
            Outdoor Space?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Schedule your free consultation today. We&apos;ll visit your property, discuss
            your vision, and provide a detailed estimate — no obligation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <QuoteButton variant="secondary" size="lg" />
            <Button
              href={company.phoneHref}
              variant="outline"
              size="lg"
              external
              className="border-white text-white hover:bg-white hover:text-brand-blue"
            >
              Call {company.phone}
            </Button>
          </div>

          <p className="text-sm font-sans text-blue-200">
            Licensed #{company.license} &middot; {company.warranty} &middot; Free Estimates
          </p>
        </motion.div>
      </div>
    </section>
  );
}
