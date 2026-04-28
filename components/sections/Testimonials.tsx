"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/data/testimonials";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-brand-gold" : "text-warm-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const nextTestimonial = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-32 bg-warm-gray-900 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <SectionLabel className="text-brand-gold">Testimonials</SectionLabel>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mt-4">
            What Our Clients Say
          </h2>
        </ScrollReveal>

        <div className="relative">
          <AnimatePresence mode="wait">
            <m.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <StarRating rating={testimonials[active].rating} />
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif text-warm-gray-100 mt-6 mb-8 leading-relaxed">
                &ldquo;{testimonials[active].text}&rdquo;
              </blockquote>
              <div>
                <p className="font-sans font-semibold text-white">
                  {testimonials[active].name}
                </p>
                <p className="text-sm font-sans text-warm-gray-400">
                  {testimonials[active].city} &middot; {testimonials[active].service}
                </p>
              </div>
            </m.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-warm-gray-600 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === active ? "bg-brand-gold w-6" : "bg-warm-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-warm-gray-600 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
