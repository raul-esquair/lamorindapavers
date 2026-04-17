"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Service } from "@/lib/data/services";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { staggerContainer, fadeUp } from "@/lib/animations";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import QuoteButton from "@/components/ui/QuoteButton";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { FAQJsonLd } from "@/components/seo/JsonLd";

interface Props {
  service: Service;
  relatedServices: Service[];
}

export default function ServiceDetailContent({ service, relatedServices }: Props) {
  return (
    <>
      {service.faqs.length > 0 && <FAQJsonLd faqs={service.faqs} />}
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Background image or fallback */}
        {service.image ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                className="object-cover"
                style={{ objectPosition: service.imagePosition || "center" }}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-warm-gray-900/60 via-warm-gray-900/50 to-warm-gray-900/70" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="max-w-3xl">
                {service.icon && (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
                    <img
                      src={service.icon}
                      alt=""
                      className="w-8 h-8 md:w-9 md:h-9 brightness-0 invert"
                    />
                  </div>
                )}
                <SectionLabel className="text-brand-gold">{service.name}</SectionLabel>
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
                  {service.name}
                </h1>
                <p className="text-lg md:text-xl text-warm-gray-200 font-sans">
                  {service.shortDescription}
                </p>
              </ScrollReveal>
            </div>
          </>
        ) : (
          <div className="bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal className="max-w-3xl">
                {service.icon && (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5">
                    <img
                      src={service.icon}
                      alt=""
                      className="w-8 h-8 md:w-9 md:h-9"
                    />
                  </div>
                )}
                <SectionLabel>{service.name}</SectionLabel>
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
                  {service.name}
                </h1>
                <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
                  {service.shortDescription}
                </p>
              </ScrollReveal>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Content */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p className="text-lg text-warm-gray-600 font-sans leading-relaxed mb-8">
                  {service.description}
                </p>
              </ScrollReveal>

              {/* Features */}
              <ScrollReveal>
                <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-6">
                  What&apos;s Included
                </h2>
                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="space-y-4 mb-12"
                >
                  {service.features.map((feature) => (
                    <motion.li
                      key={feature}
                      variants={fadeUp}
                      className="flex items-start gap-3"
                    >
                      <svg className="w-5 h-5 text-brand-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-warm-gray-600 font-sans">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </ScrollReveal>

              {/* FAQ */}
              {service.faqs.length > 0 && (
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <FAQAccordion faqs={service.faqs} />
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* CTA Card */}
                <ScrollReveal>
                  <div className="bg-cream rounded-xl p-8 border border-warm-gray-200">
                    <h3 className="text-xl font-serif text-warm-gray-900 mb-3">
                      Get a Free Estimate
                    </h3>
                    <p className="text-sm font-sans text-warm-gray-500 mb-6">
                      Ready to get started with your {service.name.toLowerCase()} project?
                      Contact us for a free, no-obligation consultation.
                    </p>
                    <div className="flex flex-col gap-3">
                      <QuoteButton variant="secondary" className="w-full">
                        Request Estimate
                      </QuoteButton>
                      <Button href={company.phoneHref} variant="outline" external className="w-full">
                        Call {company.phone}
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Trust Card */}
                <ScrollReveal delay={0.1}>
                  <div className="bg-warm-gray-900 rounded-xl p-8 text-white">
                    <h3 className="text-lg font-serif mb-4">Why Choose Us</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-sans text-warm-gray-300">
                        <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Licensed #{company.license}
                      </li>
                      <li className="flex items-center gap-3 text-sm font-sans text-warm-gray-300">
                        <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                        </svg>
                        {company.warranty}
                      </li>
                      <li className="flex items-center gap-3 text-sm font-sans text-warm-gray-300">
                        <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        Owner On-Site Every Project
                      </li>
                      <li className="flex items-center gap-3 text-sm font-sans text-warm-gray-300">
                        <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        10+ Years Experience
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="mb-12">
              <h2 className="text-3xl md:text-4xl text-warm-gray-900">
                Related Services
              </h2>
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {relatedServices.map((related) => (
                <motion.div key={related.slug} variants={fadeUp}>
                  <Link
                    href={`/services/${related.slug}`}
                    className="group block bg-warm-white rounded-xl p-6 border border-warm-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-500"
                  >
                    <h3 className="text-lg font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-2">
                      {related.name}
                    </h3>
                    <p className="text-sm font-sans text-warm-gray-500 line-clamp-2">
                      {related.shortDescription}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
