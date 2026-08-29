"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { EASE_OUT } from "@/lib/animations";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={i}
            className="border border-warm-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-cream active:bg-warm-gray-100 active:duration-75 transition-colors"
            >
              <span className="font-sans font-medium text-warm-gray-800 pr-4">
                {faq.question}
              </span>
              <m.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="w-5 h-5 text-warm-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </m.svg>
            </button>

            {/* grid-template-rows 0fr -> 1fr rather than height 0 -> auto.
                Height animation makes Framer measure the content and write an
                inline pixel height every frame; the grid track interpolates in
                the browser instead. It also stays mounted, so a double click
                retargets from wherever the panel is rather than restarting. The
                overflow-hidden wrapper is what clips the text while the track
                collapses — without it the answer spills out of the 0fr row. */}
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-hidden={!isOpen}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="px-5 pb-5">
                  <p className="text-warm-gray-500 font-sans text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
