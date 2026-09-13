"use client";

import { cn } from "@/lib/utils";

/**
 * Same field look as AddRequestForm's inputs. `text-base` below sm so iOS
 * doesn't zoom the page when a field is focused (it does under 16px).
 *
 * A function rather than a class string to extend: `cn` here is plain clsx
 * with no tailwind-merge, so a second border colour or width wouldn't
 * override the first — whichever Tailwind emits later would win.
 */
export function fieldClass({ invalid = false, width = "w-full" }: { invalid?: boolean; width?: string } = {}) {
  return cn(
    width,
    "px-3 py-2.5 rounded-lg border bg-white font-sans text-base sm:text-sm text-warm-gray-800 placeholder:text-warm-gray-400 outline-none transition-[color,border-color,box-shadow] duration-150 ease-out focus:ring-2",
    invalid
      ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
      : "border-warm-gray-200 focus:border-brand-blue focus:ring-brand-blue/20",
  );
}

export const labelClass = "block font-sans text-sm font-medium text-warm-gray-700";

/** Soft gold for warnings — brand-gold itself is too light to read as text. */
export const warnText = "text-[#6b4d12]";

/**
 * A settings row: what it is on the left at lg+, the controls on the right.
 * Stacks below lg.
 */
export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-4 lg:gap-10">
      <div>
        <h2 className="font-serif text-xl text-warm-gray-900">{title}</h2>
        <div className="mt-1 font-sans text-sm text-warm-gray-500 space-y-2">{description}</div>
      </div>
      <div className="min-w-0 rounded-xl border border-warm-gray-200 bg-white p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function Switch({
  checked,
  onChange,
  disabled,
  label,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** Accessible name when there's no visible <label htmlFor>. */
  label?: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "press relative inline-flex h-7 w-12 shrink-0 items-center rounded-full",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand-blue" : "bg-warm-gray-300",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 font-sans text-sm text-brand-red" role="alert">
      {children}
    </p>
  );
}
