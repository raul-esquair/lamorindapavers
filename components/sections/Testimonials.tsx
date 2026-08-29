"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/data/testimonials";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { EASE_OUT } from "@/lib/animations";

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

function TestimonialBody({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <>
      <StarRating rating={testimonial.rating} />
      <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif text-warm-gray-100 mt-6 mb-8 leading-relaxed">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>
      <div>
        <p className="font-sans font-semibold text-white">{testimonial.name}</p>
        <p className="text-sm font-sans text-warm-gray-400">
          {testimonial.city} &middot; {testimonial.service}
        </p>
      </div>
    </>
  );
}

// A quote enters from the side it is travelling from and leaves toward the
// side it is travelling to, so Previous reads as the inverse of Next rather
// than an identical slide. Same pattern as the quote modal's form steps.
const testimonialVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -40 }),
};

const testimonialTransition = { duration: 0.25, ease: EASE_OUT } as const;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextTestimonial = () => {
    setDirection(1);
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
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
          {/* The stage is a 1x1 grid and every child sits in that one cell,
              so they stack. The invisible copies below reserve the height of
              the tallest quote at the current width, which is what keeps the
              section from resizing as quotes change — and, unlike a hand-tuned
              min-height, it stays correct when a quote is edited or the text
              rewraps at a different breakpoint. */}
          <div className="relative grid">
            {testimonials.map((t, i) => (
              <div
                key={`spacer-${i}`}
                aria-hidden
                className="col-start-1 row-start-1 invisible text-center"
              >
                <TestimonialBody testimonial={t} />
              </div>
            ))}

            {/* No `mode="wait"`: holding the incoming quote until the outgoing
                one has fully left creates a window where the arrows look
                clickable and do nothing. Both occupy the same grid cell, so
                they cross over in place and a second click is answered
                immediately. */}
            <AnimatePresence custom={direction} initial={false}>
              <m.div
                key={active}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={testimonialTransition}
                className="col-start-1 row-start-1 text-center"
              >
                <TestimonialBody testimonial={testimonials[active]} />
              </m.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prevTestimonial}
              className="press w-12 h-12 rounded-full border border-warm-gray-600 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold"
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
                  onClick={() => goTo(i)}
                  className="press w-6 h-2 flex items-center"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                >
                  {/* The pill is always 24px wide and scaled down when
                      inactive, rather than resized. Animating `width` on a flex
                      row reflows every sibling dot on every change. */}
                  <span
                    className={`h-2 w-6 rounded-full origin-left transition-[transform,background-color] duration-200 ease-out ${
                      i === active
                        ? "bg-brand-gold scale-x-100"
                        : "bg-warm-gray-600 scale-x-[0.3333]"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="press w-12 h-12 rounded-full border border-warm-gray-600 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold"
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
