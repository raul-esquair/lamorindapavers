"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "We visit your property, listen to your vision, assess the space, and provide a detailed free estimate — no pressure, no obligation.",
    image: "/images/hero-bg.jpg",
  },
  {
    number: "02",
    title: "Custom Design",
    description:
      "We create a custom design plan with material selections, layout options, and a clear project timeline tailored to your goals and budget.",
    image: "/images/services/landscape-design.jpg",
  },
  {
    number: "03",
    title: "Expert Installation",
    description:
      "Our experienced crews bring the design to life with precision craftsmanship. Steve personally oversees every project on-site.",
    image: "/images/services/paver-driveways.jpg",
  },
  {
    number: "04",
    title: "Final Walkthrough",
    description:
      "We do a detailed walkthrough together to ensure every detail meets your expectations, backed by our 5-year workmanship warranty.",
    image: "/images/projects/hillside-estate-motor-court.jpg",
  },
];

function StepImageLayer({
  src,
  index,
  activeIndex,
}: {
  src: string;
  index: number;
  activeIndex: MotionValue<number>;
}) {
  // Hard switch — no cross-fade blending. Active step = 1, everything else = 0.
  const opacity = useTransform(activeIndex, (latest: number) => {
    return Math.round(latest) === index ? 1 : 0;
  });

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden"
      style={{ opacity }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-warm-gray-900/20" />
    </motion.div>
  );
}

function StepContent({
  step,
  index,
  total,
}: {
  step: (typeof steps)[0];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="min-h-[300px] flex items-center"
    >
      <div className="flex items-start gap-6">
        <span className="text-6xl md:text-7xl font-serif font-bold text-brand-blue/15 leading-none shrink-0">
          {step.number}
        </span>
        <div>
          <h3 className="text-2xl md:text-3xl font-serif text-warm-gray-900 mb-3">
            {step.title}
          </h3>
          <p className="text-warm-gray-500 font-sans leading-relaxed max-w-md">
            {step.description}
          </p>
          <div className="flex items-center gap-2 mt-6">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= index
                    ? "w-8 bg-brand-blue"
                    : "w-4 bg-warm-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DesktopProcess() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });

  const activeIndex = useTransform(scrollYProgress, (v: number): number => {
    if (v < 0.35) return 0;
    if (v < 0.58) return 1;
    if (v < 0.8) return 2;
    return 3;
  });

  return (
    <div className="hidden lg:grid grid-cols-2 gap-16">
      <div className="relative">
        <div className="sticky top-32 h-[500px] rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <StepImageLayer
              key={step.number}
              src={step.image}
              index={i}
              activeIndex={activeIndex}
            />
          ))}
        </div>
      </div>
      <div ref={stepsRef} className="pt-[140px]">
        {steps.map((step, i) => (
          <StepContent key={step.number} step={step} index={i} total={steps.length} />
        ))}
      </div>
    </div>
  );
}

function MobileStepCard({
  step,
  index,
  total,
}: {
  step: (typeof steps)[0];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.5"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, x }}>
      <div className="bg-warm-white/95 backdrop-blur-sm rounded-xl p-6 border border-warm-gray-200 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="text-5xl font-serif font-bold text-brand-blue/15 leading-none shrink-0">
            {step.number}
          </span>
          <div>
            <h3 className="text-xl font-serif text-warm-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-warm-gray-500 font-sans leading-relaxed">
              {step.description}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {Array.from({ length: total }).map((_, j) => (
                <div
                  key={j}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    j <= index ? "w-6 bg-brand-blue" : "w-3 bg-warm-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MobileProcess() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start start", "end end"],
  });

  // Image switches when each card clears the image and becomes readable
  const activeIndex = useTransform(scrollYProgress, (v: number): number => {
    if (v < 0.28) return 0;
    if (v < 0.52) return 1;
    if (v < 0.76) return 2;
    return 3;
  });

  return (
    <div ref={stepsRef} className="lg:hidden">
      {/* Sticky image at top */}
      <div className="sticky top-20 z-20 mx-auto rounded-xl overflow-hidden h-56 sm:h-64 mb-6">
        {steps.map((step, i) => (
          <StepImageLayer
            key={step.number}
            src={step.image}
            index={i}
            activeIndex={activeIndex}
          />
        ))}
      </div>

      {/* Scrolling step cards — pass behind image, last card stays visible */}
      <div className="relative z-10 space-y-6 pt-4 pb-[calc(100vh-22rem)]">
        {steps.map((step, i) => (
          <MobileStepCard key={step.number} step={step} index={i} total={steps.length} />
        ))}
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section className="py-20 md:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16 md:mb-24">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 mt-4 mb-6">
            Our Process
          </h2>
          <p className="text-lg text-warm-gray-500 font-sans max-w-2xl mx-auto">
            From first call to final walkthrough, we make the entire experience
            seamless and stress-free.
          </p>
        </ScrollReveal>

        <DesktopProcess />
        <MobileProcess />
      </div>
    </section>
  );
}
