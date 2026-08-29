"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { company } from "@/lib/data/company";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { submitFeedback } from "@/lib/actions/submit-feedback";
import { recordFeedbackResponse, getFeedbackPrefill } from "@/lib/actions/feedback-response";
import { blurProps } from "@/lib/blur";

type Mode = "pick" | "review" | "form" | "done";
type FaceVariant = "sad" | "meh" | "happy" | "delighted";

interface FormData {
  name: string;
  phone: string;
  email: string;
  details: string;
}

const OPTIONS: { rating: number; label: string; color: string; face: FaceVariant }[] = [
  { rating: 1, label: "Not happy", color: "#C94141", face: "sad" },
  { rating: 2, label: "Could be better", color: "#D98C4A", face: "meh" },
  { rating: 3, label: "Happy", color: "#E8A83E", face: "happy" },
  { rating: 4, label: "Delighted", color: "#3B7DD8", face: "delighted" },
];

const MOUTHS: Record<FaceVariant, string> = {
  sad: "M15 34 Q24 25 33 34",
  meh: "M15 31.5 Q24 27.5 33 31.5",
  happy: "M15 28 Q24 34 33 28",
  delighted: "M14 27 Q24 38 34 27",
};

function Face({ variant }: { variant: FaceVariant }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="w-14 h-14 md:w-16 md:h-16"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" />
      {variant === "delighted" ? (
        <>
          <path d="M14 20 Q17.5 16.5 21 20" />
          <path d="M27 20 Q30.5 16.5 34 20" />
        </>
      ) : (
        <>
          <circle cx="17.5" cy="19.5" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="30.5" cy="19.5" r="1.6" fill="currentColor" stroke="none" />
        </>
      )}
      <path d={MOUTHS[variant]} />
    </svg>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-[color,border-color,box-shadow] duration-150 ease-out font-sans text-warm-gray-800 placeholder:text-warm-gray-400 bg-white";
const labelClass = "block text-sm font-sans font-medium text-warm-gray-700 mb-2";

export default function FeedbackPageContent() {
  const [mode, setMode] = useState<Mode>("pick");
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  /**
   * Present when the customer arrived from a tracked review-request email.
   * Read client-side so the page itself stays static.
   */
  const token = useSearchParams().get("t");

  // Prefill name and email when we already know who this is — fewer fields to
  // retype on a phone means more completed forms. Deliberately after mount and
  // non-blocking: the form isn't shown until a face is picked, so there is
  // plenty of headroom, and a slow or failed lookup costs nothing.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getFeedbackPrefill(token).then((prefill) => {
      if (cancelled || !prefill) return;
      reset({ name: prefill.name, email: prefill.email, phone: "", details: "" });
    });
    return () => {
      cancelled = true;
    };
  }, [token, reset]);

  const choose = (value: number) => {
    setRating(value);
    setMode(value >= 3 ? "review" : "form");

    // Fire and forget. Deliberately not awaited — the customer's next screen
    // must never wait on a database write, and the action swallows its own
    // errors. Worst case they receive one more email than they should.
    if (token) void recordFeedbackResponse(token, value);
  };

  const restart = () => {
    setRating(null);
    setSubmitError(null);
    setMode("pick");
  };

  const onSubmit = async (data: FormData) => {
    if (rating === null) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitFeedback({ ...data, rating, token });
    setSubmitting(false);
    if (result.ok) {
      setMode("done");
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <section className="min-h-screen bg-cream flex flex-col items-center justify-center py-16 md:py-20">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12 md:mb-16"
        >
          <Image
            src="/images/logo.png"
            alt={company.name}
            width={2649}
            height={676}
            priority
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 440px, 600px"
            className="w-full max-w-[440px] md:max-w-[540px] lg:max-w-[600px] h-auto"
            {...blurProps("/images/logo.png")}
          />
        </m.div>

        <AnimatePresence mode="wait">
          {mode === "pick" && (
            <m.div
              key="pick"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <SectionLabel>Your Experience</SectionLabel>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-warm-gray-900 mt-4 mb-5">
                How did we do?
              </h1>
              <p className="text-lg text-warm-gray-500 font-sans max-w-lg mx-auto mb-12">
                {company.owner} reads every one of these personally. It takes about
                thirty seconds.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {OPTIONS.map((option, index) => (
                  <m.button
                    key={option.rating}
                    type="button"
                    onClick={() => choose(option.rating)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * index }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.96 }}
                    className="group flex flex-col items-center gap-3 rounded-2xl bg-white border border-warm-gray-200 px-4 py-7 transition-colors duration-300 hover:border-transparent hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                    style={{ ["--face" as string]: option.color }}
                    aria-label={option.label}
                  >
                    <span className="text-warm-gray-300 transition-colors duration-300 group-hover:text-[var(--face)] group-focus-visible:text-[var(--face)]">
                      <Face variant={option.face} />
                    </span>
                    <span className="font-sans text-sm font-medium text-warm-gray-600 transition-colors duration-300 group-hover:text-warm-gray-900">
                      {option.label}
                    </span>
                  </m.button>
                ))}
              </div>
            </m.div>
          )}

          {mode === "review" && (
            <m.div
              key="review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <span className="inline-flex text-brand-gold mb-6">
                <Face variant={rating === 4 ? "delighted" : "happy"} />
              </span>
              <h1 className="text-4xl md:text-5xl text-warm-gray-900 mb-5">
                That means a lot.
              </h1>
              <p className="text-lg text-warm-gray-500 font-sans max-w-lg mx-auto mb-10">
                Would you take a minute to say it on Google? Word of mouth is how
                a small crew like ours keeps working — and it helps the next
                neighbor decide who to trust with their driveway.
              </p>

              <Button
                href={company.social.googleReview}
                external
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Leave a Google Review
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>

              <p className="mx-auto mt-6 max-w-md text-sm font-sans text-warm-gray-500">
                If you can mention what we built and where &mdash; and add a photo &mdash;
                it helps the next neighbor find us.
              </p>

              <p className="mt-6 text-sm font-sans text-warm-gray-500">
                Prefer Yelp?{" "}
                <a
                  href={company.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline"
                >
                  You can review us there instead.
                </a>
              </p>

              <div className="mt-10 pt-8 border-t border-warm-gray-200">
                <p className="text-sm font-sans text-warm-gray-500">
                  Something we could have done better?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("form")}
                    className="text-brand-blue hover:underline"
                  >
                    Tell {company.owner.split(" ")[0]} privately.
                  </button>
                </p>
              </div>
            </m.div>
          )}

          {mode === "form" && (
            <m.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-warm-gray-900 mb-5">
                  Tell us what went wrong.
                </h1>
                <p className="text-lg text-warm-gray-500 font-sans mb-10">
                  This goes straight to {company.owner} — not to a form inbox
                  nobody checks. He&apos;ll call you back himself.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <div>
                  <label htmlFor="fb-name" className={labelClass}>
                    Your Name *
                  </label>
                  <input
                    id="fb-name"
                    type="text"
                    {...register("name", { required: "Please tell us your name" })}
                    placeholder="Your name"
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="text-brand-red text-sm mt-1 font-sans">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fb-phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="fb-phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="(925) 555-0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="fb-email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="fb-email"
                      type="email"
                      {...register("email")}
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <p className="text-xs font-sans text-warm-gray-400 -mt-3">
                  Add at least one so {company.owner.split(" ")[0]} can reach you.
                </p>

                <div>
                  <label htmlFor="fb-details" className={labelClass}>
                    What happened? *
                  </label>
                  <textarea
                    id="fb-details"
                    rows={6}
                    {...register("details", {
                      required: "Please tell us what happened",
                      minLength: { value: 10, message: "A little more detail helps us fix it" },
                    })}
                    placeholder="Tell us as much as you'd like — what you expected, what actually happened, and what would make it right."
                    className={`${inputClass} resize-none`}
                  />
                  {errors.details && (
                    <p className="text-brand-red text-sm mt-1 font-sans">{errors.details.message}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-brand-red text-sm font-sans">{submitError}</p>
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <Button onClick={restart} variant="ghost" disabled={submitting}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Sending…" : "Send to " + company.owner.split(" ")[0]}
                  </Button>
                </div>
              </form>
            </m.div>
          )}

          {mode === "done" && (
            <m.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl text-warm-gray-900 mb-5">
                Thank you — we got it.
              </h1>
              <p className="text-lg text-warm-gray-500 font-sans mb-8">
                {company.owner} has been notified and will reach out personally.
                If you&apos;d rather talk right now, call him at{" "}
                <a href={company.phoneHref} className="text-brand-blue font-semibold">
                  {company.phone}
                </a>
                .
              </p>
              <Button href="/" variant="primary">
                Back to Home
              </Button>
            </m.div>
          )}
        </AnimatePresence>

        <p className="mt-16 md:mt-20 text-center text-xs font-sans text-warm-gray-400">
          {company.name} &middot; CA Lic. #{company.license} &middot;{" "}
          <a href={company.phoneHref} className="hover:text-brand-blue transition-colors">
            {company.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
