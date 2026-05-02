"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { submitQuote } from "@/lib/actions/submit-quote";

// Context so any component can open the modal
const QuoteModalContext = createContext<{
  open: () => void;
  close: () => void;
  isOpen: boolean;
}>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}

interface FormData {
  service: string;
  details: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  city: string;
}

export function QuoteModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  return (
    <QuoteModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && <QuoteModalContent onClose={close} />}
      </AnimatePresence>
    </QuoteModalContext.Provider>
  );
}

function QuoteModalContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const selectedService = watch("service");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitQuote(data);
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <m.div
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(12px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-warm-gray-900/60"
        onClick={onClose}
      />

      {/* Modal */}
      <m.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-warm-gray-400 hover:text-warm-gray-600 hover:bg-warm-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-warm-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-warm-gray-500 font-sans mb-1">
                We&apos;ll get back to you within 24 hours.
              </p>
              <p className="text-sm text-warm-gray-400 font-sans">
                Need immediate help? Call{" "}
                <a href={company.phoneHref} className="text-brand-blue font-semibold">
                  {company.phone}
                </a>
              </p>
            </m.div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6 pr-8">
                <h2 className="text-2xl md:text-3xl font-serif text-warm-gray-900">
                  Get a Free Estimate
                </h2>
                <p className="text-sm text-warm-gray-500 font-sans mt-1">
                  No obligation — we&apos;ll respond within 24 hours.
                </p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-1 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      step >= s ? "bg-brand-blue" : "bg-warm-gray-200"
                    }`}
                  />
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Service Selection */}
                  {step === 1 && (
                    <m.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="text-sm font-sans font-medium text-warm-gray-700 mb-3">
                        What service are you interested in?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {services.map((service) => (
                          <label
                            key={service.slug}
                            className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all text-center text-sm font-sans ${
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
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2.5 bg-brand-blue text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
                        >
                          Continue
                        </button>
                      </div>
                    </m.div>
                  )}

                  {/* Step 2: Project Details */}
                  {step === 2 && (
                    <m.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                            Tell us about your project
                          </label>
                          <textarea
                            {...register("details")}
                            rows={3}
                            placeholder="Size, current condition, ideas you have in mind..."
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                            Timeline
                          </label>
                          <select
                            {...register("timeline")}
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 bg-white"
                          >
                            <option value="">When are you looking to start?</option>
                            <option value="asap">As soon as possible</option>
                            <option value="1-3months">1-3 months</option>
                            <option value="3-6months">3-6 months</option>
                            <option value="planning">Just getting quotes</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-4 py-2.5 text-sm font-sans font-medium text-warm-gray-500 hover:text-warm-gray-700 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2.5 bg-brand-blue text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors"
                        >
                          Continue
                        </button>
                      </div>
                    </m.div>
                  )}

                  {/* Step 3: Contact Info */}
                  {step === 3 && (
                    <m.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                          {errors.name && (
                            <p className="text-brand-red text-xs mt-1 font-sans">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              {...register("phone", { required: "Phone is required" })}
                              placeholder="(925) 555-0000"
                              className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                            />
                            {errors.phone && (
                              <p className="text-brand-red text-xs mt-1 font-sans">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                              Email *
                            </label>
                            <input
                              type="email"
                              {...register("email", { required: "Email is required" })}
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                            />
                            {errors.email && (
                              <p className="text-brand-red text-xs mt-1 font-sans">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-sans font-medium text-warm-gray-700 mb-1.5">
                            City
                          </label>
                          <input
                            type="text"
                            {...register("city")}
                            placeholder="e.g., Lafayette, Walnut Creek"
                            className="w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white"
                          />
                        </div>
                      </div>
                      {submitError && (
                        <p className="text-brand-red text-sm mt-4 font-sans">
                          {submitError}
                        </p>
                      )}
                      <div className="mt-6 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={submitting}
                          className="px-4 py-2.5 text-sm font-sans font-medium text-warm-gray-500 hover:text-warm-gray-700 transition-colors disabled:opacity-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 bg-brand-gold text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Sending…" : "Submit Request"}
                        </button>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          )}
        </div>
      </m.div>
    </m.div>
  );
}
