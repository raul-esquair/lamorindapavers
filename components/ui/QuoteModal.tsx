"use client";

import { useState, useEffect, useRef, useId, createContext, useContext, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { submitQuote } from "@/lib/actions/submit-quote";
import { useDragDismiss } from "@/lib/hooks/use-drag-dismiss";

// Everything inside the dialog that can hold keyboard focus. Radio inputs are
// included deliberately: the service picker's inputs are `sr-only`, but they
// are still how a keyboard user chooses a service.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

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
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    // Captured at open time rather than on unmount: by then the trigger may be
    // gone. The mobile menu closes itself when its CTA is tapped, taking the
    // button with it.
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  // Send focus home when the dialog closes, so the user resumes where they
  // were instead of being dropped back at the top of the document.
  useEffect(() => {
    if (isOpen) return;
    const trigger = triggerRef.current;
    triggerRef.current = null;
    // `isConnected` guards the case above, where the trigger no longer exists.
    if (trigger?.isConnected) trigger.focus();
  }, [isOpen]);

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

// Steps enter from the side they are travelling from and leave toward the side
// they are travelling to, so Back reads as the inverse of Continue instead of
// an identical slide. Direction is the only thing that tells the user whether
// they moved forward or backward through the form.
const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
};

const stepTransition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } as const;

function QuoteModalContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
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

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const { y: dragY, handlers: dragHandlers } = useDragDismiss({ onDismiss: onClose });

  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  // Move focus into the dialog, then keep Tab inside it.
  //
  // Without this the dialog is only visually modal: Tab walks straight out into
  // the header and page behind the backdrop, where a user can activate a link
  // they can barely see and lose everything they typed. `aria-modal` tells
  // assistive tech to ignore the outside; this handles the keyboard.
  //
  // Focus lands on the panel itself rather than the close button, so a screen
  // reader announces the dialog before the first control, and the first Tab
  // moves forward through the form in DOM order.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    panel.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.getClientRects().length > 0);

      if (focusable.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);

      // Only intervene at the two ends. Everywhere in between, the browser's
      // own tab order is already correct — and better than a reimplementation
      // of it (radio groups, for one, are a single stop, not eleven).
      if (e.shiftKey) {
        if (!inside || active === first || active === panel) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Capture phase, so the trap still holds if focus has escaped the panel and
    // the keydown is therefore firing somewhere else entirely.
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop. The blur is a static class and only opacity animates:
          transitioning `backdrop-filter` from 0px to 12px re-rasterises the
          whole viewport every frame, on the one interaction where
          responsiveness matters most. Opacity stays on the compositor. */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 bg-warm-gray-900/60 backdrop-blur-[12px]"
        onClick={onClose}
      />

      {/* Presence layer, kept separate from the drag layer below so framer's
          enter/exit animation and the gesture's motion value never write to the
          same transform. */}
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        // Critically damped (ratio 1.0, response 0.35s). The modal is opened by
        // a click, which carries no momentum, so overshoot here would be motion
        // the user never put there:
        //   k = (2pi / 0.35)^2 ~= 322,  c = 2 * 1.0 * (2pi / 0.35) ~= 35.9
        transition={{ type: "spring", stiffness: 322, damping: 35.9 }}
        className="relative w-full max-w-xl"
      >
        <m.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          // Focusable only programmatically — this is where focus lands on
          // open. No ring: the panel is not a control, so a ring around the
          // whole dialog would say nothing.
          tabIndex={-1}
          style={{ y: dragY }}
          className="relative bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden focus:outline-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="press absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-warm-gray-400 hover:text-warm-gray-600 hover:bg-warm-gray-100 z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Grab handle. The drag surface is this strip rather than the whole
              panel so it can never compete with the body's own scrolling. */}
          <div
            {...dragHandlers}
            className="shrink-0 flex justify-center pt-3 pb-1 touch-none cursor-grab active:cursor-grabbing sm:hidden"
            role="presentation"
          >
            <span className="h-1 w-9 rounded-full bg-warm-gray-200" aria-hidden />
          </div>

          {/* `data-lenis-prevent` hands the wheel back to this element — Lenis
              intercepts wheel events globally, so without it a trackpad cannot
              scroll the modal body. */}
          <div className="overflow-y-auto" data-lenis-prevent>
            <div className="p-6 sm:p-8">
              {submitted ? (
                <m.div
                  // The submit button unmounts with the form, so focus falls to
                  // the body and nothing would otherwise tell a screen reader
                  // the request went through. `status` announces it politely,
                  // without stealing focus.
                  role="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 id={headingId} className="text-2xl font-serif text-warm-gray-900 mb-2">
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
                    <h2 id={headingId} className="text-2xl md:text-3xl font-serif text-warm-gray-900">
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
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                      {/* Step 1: Service Selection */}
                      {step === 1 && (
                        <m.div
                          key="step1"
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={stepTransition}
                        >
                          <p className="text-sm font-sans font-medium text-warm-gray-700 mb-3">
                            What service are you interested in?
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {services.map((service) => (
                              <label
                                key={service.slug}
                                className={`press has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-blue has-[:focus-visible]:ring-offset-2 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer text-center text-sm font-sans ${
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
                              className="press px-6 py-2.5 bg-brand-blue text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-blue-dark"
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
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={stepTransition}
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
                              className="press px-4 py-2.5 text-sm font-sans font-medium text-warm-gray-500 hover:text-warm-gray-700"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={nextStep}
                              className="press px-6 py-2.5 bg-brand-blue text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-blue-dark"
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
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={stepTransition}
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
                              className="press px-4 py-2.5 text-sm font-sans font-medium text-warm-gray-500 hover:text-warm-gray-700 disabled:opacity-50"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="press px-6 py-2.5 bg-brand-gold text-white text-sm font-sans font-semibold rounded-lg hover:bg-brand-gold-dark disabled:opacity-60 disabled:cursor-not-allowed"
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
          </div>
        </m.div>
      </m.div>
    </div>
  );
}
