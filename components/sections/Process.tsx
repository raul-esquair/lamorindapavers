"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollStagger from "@/components/animations/ScrollStagger";

const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "We visit your property, listen to your vision, assess the space, and provide a detailed free estimate — no pressure, no obligation.",
  },
  {
    number: "02",
    title: "Custom Design",
    description:
      "We create a custom design plan with material selections, layout options, and a clear project timeline tailored to your goals and budget.",
  },
  {
    number: "03",
    title: "Expert Installation",
    description:
      "Our experienced crews bring the design to life with precision craftsmanship. Steve personally oversees every project on-site.",
  },
  {
    number: "04",
    title: "Final Walkthrough",
    description:
      "We do a detailed walkthrough together to ensure every detail meets your expectations, backed by our 5-year workmanship warranty.",
  },
];

export default function Process() {
  return (
    <section className="py-20 md:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 mt-4 mb-6">
            Our Process
          </h2>
          <p className="text-lg text-warm-gray-500 font-sans max-w-2xl mx-auto">
            From first call to final walkthrough, we make the entire experience
            seamless and stress-free.
          </p>
        </ScrollReveal>

        <ScrollStagger
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-warm-gray-200 -translate-x-1/2" />
              )}

              <div className="relative">
                <span className="text-6xl font-serif font-bold text-brand-blue/10">
                  {step.number}
                </span>
                <h3 className="text-xl font-serif text-warm-gray-900 -mt-4 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm font-sans text-warm-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </ScrollStagger>
      </div>
    </section>
  );
}
