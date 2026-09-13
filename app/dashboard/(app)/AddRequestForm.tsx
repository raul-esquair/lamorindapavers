"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { addReviewRequest } from "@/lib/actions/review-requests";
import { services } from "@/lib/data/services";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  completedAt: string;
  notes: string;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-warm-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-[color,border-color,box-shadow] duration-150 ease-out font-sans text-sm text-warm-gray-800 placeholder:text-warm-gray-400 bg-white";
const labelClass = "block font-sans text-xs font-medium text-warm-gray-600 mb-1.5";

export default function AddRequestForm({ today }: { today: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the error is a repeat-customer warning Steve may override.
  const [canOverride, setCanOverride] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { completedAt: today } });

  async function submit(values: FormValues, allowRepeat: boolean) {
    setSubmitting(true);
    setError(null);
    setCanOverride(false);
    setSaved(null);

    const result = await addReviewRequest(
      {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        projectType: values.projectType || null,
        completedAt: values.completedAt || null,
        notes: values.notes || null,
      },
      { allowRepeat },
    );

    setSubmitting(false);

    if (result.ok) {
      setSaved(`${values.name.trim()} added.`);
      reset({ completedAt: today });
      return;
    }
    setError(result.error);
    setCanOverride(!!result.canOverride);
  }

  if (!open) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark"
        >
          <span aria-hidden="true">+</span> Add customer
        </button>
        {saved && <p className="font-sans text-sm text-warm-gray-500">{saved}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-warm-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl text-warm-gray-900">Add customer</h2>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
            setCanOverride(false);
          }}
          className="font-sans text-sm text-warm-gray-400 hover:text-warm-gray-700 transition-colors"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit((values) => submit(values, false))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ar-name" className={labelClass}>
              Name *
            </label>
            <input
              id="ar-name"
              {...register("name", { required: "Required" })}
              placeholder="Jane Doe"
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 font-sans text-xs text-brand-red">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="ar-email" className={labelClass}>
              Email *
            </label>
            <input
              id="ar-email"
              type="email"
              {...register("email", {
                required: "Required",
                // A warning about one address doesn't apply to another.
                onChange: () => setCanOverride(false),
              })}
              placeholder="jane@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 font-sans text-xs text-brand-red">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ar-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="ar-phone"
              type="tel"
              {...register("phone")}
              placeholder="(925) 555-0000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="ar-project" className={labelClass}>
              Project
            </label>
            <select id="ar-project" {...register("projectType")} className={inputClass}>
              <option value="">Select…</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ar-completed" className={labelClass}>
              Job completed
            </label>
            <input
              id="ar-completed"
              type="date"
              {...register("completedAt")}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ar-notes" className={labelClass}>
            Notes (internal only)
          </label>
          <input
            id="ar-notes"
            {...register("notes")}
            placeholder="Anything worth remembering"
            className={inputClass}
          />
        </div>

        <p className="font-sans text-xs text-warm-gray-400">
          A job finished today gets its first email at the next 10am send; otherwise two days
          after it finished. Jobs over two weeks old start tomorrow instead, so a batch of past
          customers doesn&apos;t all send at once.
        </p>

        {error && (
          <div role="alert" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className={`font-sans text-sm ${canOverride ? "text-[#6b4d12]" : "text-brand-red"}`}>
              {error}
            </p>
            {canOverride && (
              <button
                type="button"
                onClick={handleSubmit((values) => submit(values, true))}
                disabled={submitting}
                className="press font-sans text-sm font-semibold text-brand-blue underline underline-offset-2 hover:text-brand-blue-dark disabled:opacity-50"
              >
                Add anyway
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Add customer"}
          </button>
          {saved && <p className="font-sans text-sm text-warm-gray-500">{saved}</p>}
        </div>
      </form>
    </div>
  );
}
