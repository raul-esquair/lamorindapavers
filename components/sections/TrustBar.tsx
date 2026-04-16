"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { company } from "@/lib/data/company";
import { animateCounter } from "@/lib/animations";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 5, suffix: "-Year", label: "Workmanship Warranty" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

function AnimatedStat({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      animateCounter(0, stat.value, 2, setCount);
    }
  }, [isInView, stat.value]);

  return (
    <div className="flex flex-col items-center text-center px-4">
      <span ref={ref} className="text-3xl md:text-4xl font-serif text-brand-blue font-bold">
        {count}
        {stat.suffix}
      </span>
      <span className="text-sm font-sans text-warm-gray-500 mt-1">{stat.label}</span>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <section ref={ref} className="py-12 md:py-16 bg-cream border-y border-warm-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ opacity, y }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} />
          ))}
        </motion.div>

        <motion.div
          style={{ opacity }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-warm-gray-200"
        >
          <div className="flex items-center gap-2 text-sm font-sans text-warm-gray-500">
            <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Licensed #{company.license}
          </div>
          <div className="flex items-center gap-2 text-sm font-sans text-warm-gray-500">
            <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
            </svg>
            Yelp Reviewed
          </div>
          <div className="flex items-center gap-2 text-sm font-sans text-warm-gray-500">
            <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fully Insured
          </div>
        </motion.div>
      </div>
    </section>
  );
}
