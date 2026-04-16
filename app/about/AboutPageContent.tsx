"use client";

import { motion } from "framer-motion";
import { company } from "@/lib/data/company";
import { staggerContainer, fadeUp, slideInLeft, slideInRight } from "@/lib/animations";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import FinalCTA from "@/components/sections/FinalCTA";

const values = [
  {
    title: "Craftsmanship First",
    description:
      "Every paver, every joint, every edge — we obsess over the details because the details are what separate good work from exceptional work.",
  },
  {
    title: "Owner Accountability",
    description:
      "Steve Barsanti is on-site for every project. When the owner's name is on the line, the quality speaks for itself.",
  },
  {
    title: "Honest Communication",
    description:
      "No surprises, no hidden costs. We set clear expectations from day one and keep you informed throughout the entire process.",
  },
  {
    title: "Built to Last",
    description:
      "We use only premium materials and proven installation techniques. Every project is backed by our 5-year workmanship warranty.",
  },
];

export default function AboutPageContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Our Story</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              About Lamorinda Pavers
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              Built on trust, driven by craft — for over a decade.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Steve's Story */}
      <section className="py-16 md:py-24 bg-warm-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-warm-gray-200 to-warm-gray-300">
                <div className="w-full h-full flex items-center justify-center text-warm-gray-400 font-sans text-lg">
                  Steve Barsanti
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
            >
              <SectionLabel>Meet the Owner</SectionLabel>
              <h2 className="text-4xl md:text-5xl text-warm-gray-900 mt-4 mb-6">
                Steve Barsanti
              </h2>
              <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
                <p>
                  Steve Barsanti founded {company.name} with a simple belief: that outdoor
                  spaces should be crafted with the same care and attention as the homes
                  they surround. Over a decade later, that belief hasn&apos;t changed.
                </p>
                <p>
                  What started as a passion for transforming outdoor spaces has grown into
                  the East Bay&apos;s most trusted paving company — built almost entirely on
                  word-of-mouth referrals from satisfied homeowners.
                </p>
                <p>
                  Steve personally oversees every project from start to finish. When you
                  choose {company.name}, you&apos;re not handed off to a crew you&apos;ve never met.
                  Steve is on-site, making sure every detail meets his standards — and yours.
                </p>
                <p>
                  With two experienced crews and a commitment to using only premium materials,
                  {company.name} delivers results that stand the test of time. Every project
                  is backed by our {company.warranty.toLowerCase()}, because we stand behind
                  every inch of our work.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <SectionLabel>Our Values</SectionLabel>
            <h2 className="text-4xl md:text-5xl text-warm-gray-900 mt-4">
              What Drives Us
            </h2>
          </ScrollReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                className="bg-warm-white rounded-xl p-8 border border-warm-gray-200"
              >
                <h3 className="text-xl font-serif text-warm-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-warm-gray-500 font-sans leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-warm-gray-900">
              Our Credentials
            </h2>
          </ScrollReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-warm-gray-900 mb-1">Licensed</h3>
              <p className="text-sm font-sans text-warm-gray-500">CA License #{company.license}</p>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-warm-gray-900 mb-1">Warranted</h3>
              <p className="text-sm font-sans text-warm-gray-500">{company.warranty}</p>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-sans font-semibold text-warm-gray-900 mb-1">Insured</h3>
              <p className="text-sm font-sans text-warm-gray-500">Fully Insured &amp; Bonded</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
