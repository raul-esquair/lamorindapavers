"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";

interface FormData {
  service: string;
  details: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  city: string;
}

export default function ContactPageContent() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const selectedService = watch("service");

  const onSubmit = (data: FormData) => {
    // TODO: Wire to server action or form service
    console.log("Form submitted:", data);
    setSubmitted(true);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <>
        <section className="pt-32 pb-32 md:pt-40 min-h-screen flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl text-warm-gray-900 mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-warm-gray-500 font-sans mb-8">
                We&apos;ve received your request and will get back to you within 24 hours.
                If you need immediate assistance, call us at{" "}
                <a href={company.phoneHref} className="text-brand-blue font-semibold">
                  {company.phone}
                </a>
                .
              </p>
              <Button href="/" variant="primary">
                Back to Home
              </Button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Contact Us</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              Get a Free Estimate
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              Tell us about your project and we&apos;ll provide a free, no-obligation estimate.
              We respond within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Multi-Step Form */}
            <div className="lg:col-span-2">
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-semibold transition-colors ${
                        step >= s
                          ? "bg-brand-blue text-white"
                          : "bg-warm-gray-200 text-warm-gray-400"
                      }`}
                    >
                      {s}
                    </div>
                    <span className="text-sm font-sans text-warm-gray-500 hidden sm:block">
                      {s === 1 ? "Service" : s === 2 ? "Details" : "Contact"}
                    </span>
                    {s < 3 && (
                      <div
                        className={`flex-1 h-px transition-colors ${
                          step > s ? "bg-brand-blue" : "bg-warm-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-6">
                        What service do you need?
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {services.map((service) => (
                          <label
                            key={service.slug}
                            className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all text-center text-sm font-sans ${
                              selectedService === service.slug
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold"
                                : "border-warm-gray-200 hover:border-warm-gray-300 text-warm-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              value={service.slug}
                              {...register("service", { required: true })}
                              className="sr-only"
                            />
                            {service.name}
                          </label>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-end">
                        <Button onClick={nextStep} variant="primary">
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-6">
                        Tell us about your project
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                            Project Details
                          </label>
                          <textarea
                            {...register("details")}
                            rows={4}
                            placeholder="Describe your project — size, current condition, any specific ideas or materials you have in mind..."
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                            Preferred Timeline
                          </label>
                          <select
                            {...register("timeline")}
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 bg-white"
                          >
                            <option value="">Select timeline...</option>
                            <option value="asap">As soon as possible</option>
                            <option value="1-3months">1-3 months</option>
                            <option value="3-6months">3-6 months</option>
                            <option value="planning">Just planning / getting quotes</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-8 flex justify-between">
                        <Button onClick={prevStep} variant="ghost">
                          Back
                        </Button>
                        <Button onClick={nextStep} variant="primary">
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-6">
                        Your contact information
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                          {errors.name && (
                            <p className="text-brand-red text-sm mt-1 font-sans">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              {...register("phone", { required: "Phone is required" })}
                              placeholder="(925) 555-0000"
                              className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                            />
                            {errors.phone && (
                              <p className="text-brand-red text-sm mt-1 font-sans">{errors.phone.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              {...register("email", { required: "Email is required" })}
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                            />
                            {errors.email && (
                              <p className="text-brand-red text-sm mt-1 font-sans">{errors.email.message}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            {...register("city")}
                            placeholder="e.g., Lafayette, Walnut Creek"
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                        </div>
                      </div>
                      <div className="mt-8 flex justify-between">
                        <Button onClick={prevStep} variant="ghost">
                          Back
                        </Button>
                        <Button type="submit" variant="secondary" onClick={() => {}}>
                          Submit Request
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <ScrollReveal>
                  <div className="bg-cream rounded-xl p-8 border border-warm-gray-200">
                    <h3 className="text-xl font-serif text-warm-gray-900 mb-6">
                      Contact Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="font-sans font-medium text-warm-gray-800 text-sm">Phone</p>
                          <a href={company.phoneHref} className="text-brand-blue font-sans text-sm hover:underline">
                            {company.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-sans font-medium text-warm-gray-800 text-sm">Email</p>
                          <a href={`mailto:${company.email}`} className="text-brand-blue font-sans text-sm hover:underline">
                            {company.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="font-sans font-medium text-warm-gray-800 text-sm">Service Area</p>
                          <p className="text-warm-gray-500 font-sans text-sm">
                            East Bay — Contra Costa &amp; Alameda Counties
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <div className="bg-warm-gray-900 rounded-xl p-8 text-white">
                    <h3 className="text-lg font-serif mb-3">Prefer to talk?</h3>
                    <p className="text-sm font-sans text-warm-gray-400 mb-4">
                      Call us directly and speak with Steve about your project.
                    </p>
                    <Button href={company.phoneHref} variant="secondary" external className="w-full">
                      Call {company.phone}
                    </Button>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <div className="bg-cream rounded-xl p-6 border border-warm-gray-200 text-center">
                    <p className="text-sm font-sans text-warm-gray-500">
                      We respond to all inquiries within <strong className="text-warm-gray-800">24 hours</strong>
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
