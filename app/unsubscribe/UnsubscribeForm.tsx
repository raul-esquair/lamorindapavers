"use client";

import { useState } from "react";
import { company } from "@/lib/data/company";
import { confirmUnsubscribe } from "@/lib/actions/unsubscribe";

export default function UnsubscribeForm({
  token,
  email,
}: {
  token: string;
  email: string | null;
}) {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-warm-gray-900 mb-3">You&apos;re unsubscribed.</h1>
        <p className="font-sans text-warm-gray-500">
          We won&apos;t email you again. If you ever need us, you can still reach Steve at{" "}
          <a href={company.phoneHref} className="text-brand-blue font-semibold">
            {company.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-warm-gray-900 mb-3">Link not recognized</h1>
        <p className="font-sans text-warm-gray-500">
          This unsubscribe link is missing or no longer valid. Reply to any of our emails and
          we&apos;ll take you off the list by hand.
        </p>
      </div>
    );
  }

  async function onConfirm() {
    setSubmitting(true);
    setError(null);
    const result = await confirmUnsubscribe(token);
    setSubmitting(false);
    if (result.ok) setDone(true);
    else setError(result.error);
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-warm-gray-900 mb-3">Unsubscribe?</h1>
      <p className="font-sans text-warm-gray-500 mb-8">
        We&apos;ll stop emailing <span className="text-warm-gray-800">{email}</span> about how your
        project went.
      </p>

      {error && <p className="mb-4 font-sans text-sm text-brand-red">{error}</p>}

      <button
        type="button"
        onClick={onConfirm}
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Updating…" : "Yes, unsubscribe me"}
      </button>
    </div>
  );
}
