"use client";

import { useState, useTransition } from "react";
import type { RequestWithTouches } from "@/lib/reviews/queries";
import { stopFollowUps } from "@/lib/actions/review-requests";
import { touchDueDate, TOUCH_NUMBERS, type TouchNumber } from "@/lib/reviews/schedule";

const RATING_LABELS: Record<number, string> = {
  1: "Not happy",
  2: "Could be better",
  3: "Happy",
  4: "Delighted",
};

const RATING_COLOR: Record<number, string> = {
  1: "text-brand-red",
  2: "text-[#D98C4A]",
  3: "text-brand-gold",
  4: "text-brand-blue",
};

function statusChip(r: RequestWithTouches) {
  if (r.respondedAt) {
    return { label: "Responded", className: "bg-brand-blue/10 text-brand-blue" };
  }
  if (r.status === "active") {
    return { label: "Active", className: "bg-brand-gold/15 text-[#8a6416]" };
  }
  const map: Record<string, string> = {
    complete: "All 3 sent",
    manual: "Stopped",
    unsubscribed: "Unsubscribed",
    bounced: "Bounced",
  };
  return {
    label: map[r.stoppedReason ?? ""] ?? "Stopped",
    className: "bg-warm-gray-100 text-warm-gray-500",
  };
}

/** Next touch that hasn't been sent, based on how many have gone out. */
function nextTouchDate(r: RequestWithTouches): string | null {
  if (r.status !== "active") return null;
  const next = TOUCH_NUMBERS.find((n) => n > r.touchCount) as TouchNumber | undefined;
  return next ? touchDueDate(r.startAt, next) : null;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return `${Number(m)}/${Number(d)}/${y.slice(2)}`;
}

export default function RequestsTable({
  requests,
  siteUrl,
}: {
  requests: RequestWithTouches[];
  siteUrl: string;
}) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function copyLink(token: string) {
    const url = `${siteUrl}/feedback?t=${token}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(token);
        setTimeout(() => setCopied((c) => (c === token ? null : c)), 2000);
      },
      () => setError("Couldn't copy to clipboard."),
    );
  }

  function stop(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await stopFollowUps(id);
      if (!result.ok) setError(result.error);
    });
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-warm-gray-200 bg-white/50 px-6 py-14 text-center">
        <p className="font-serif text-lg text-warm-gray-700">No requests yet</p>
        <p className="mt-1 font-sans text-sm text-warm-gray-500">
          Add a customer after their job wraps and the sequence starts on its own.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="font-sans text-sm text-brand-red">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-warm-gray-200 bg-white">
        <table className="w-full min-w-[46rem] text-left">
          <thead>
            <tr className="border-b border-warm-gray-200 font-sans text-xs uppercase tracking-wider text-warm-gray-400">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Sent</th>
              <th className="px-4 py-3 font-medium">Next</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm">
            {requests.map((r) => {
              const chip = statusChip(r);
              const next = nextTouchDate(r);
              return (
                <tr key={r.id} className="border-b border-warm-gray-100 last:border-0">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-warm-gray-900">{r.name}</p>
                    <p className="text-xs text-warm-gray-400">{r.email}</p>
                    {r.rating !== null && (
                      <p className={`text-xs font-medium ${RATING_COLOR[r.rating] ?? ""}`}>
                        {RATING_LABELS[r.rating] ?? `Rated ${r.rating}`}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-warm-gray-600">
                    <p>{r.projectType ?? "—"}</p>
                    <p className="text-xs text-warm-gray-400">
                      done {formatDate(r.completedAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top text-warm-gray-600">{r.touchCount} of 3</td>
                  <td className="px-4 py-3 align-top text-warm-gray-600">
                    {next ? formatDate(next) : "—"}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${chip.className}`}
                    >
                      {chip.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => copyLink(r.token)}
                        className="text-xs text-brand-blue hover:underline"
                      >
                        {copied === r.token ? "Copied" : "Copy link"}
                      </button>
                      {r.status === "active" && (
                        <button
                          type="button"
                          onClick={() => stop(r.id)}
                          disabled={pending}
                          className="text-xs text-warm-gray-400 hover:text-brand-red transition-colors disabled:opacity-50"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="font-sans text-xs text-warm-gray-400">
        &ldquo;Copy link&rdquo; gives you that customer&apos;s personal feedback link — useful for
        texting it at the final walkthrough instead of waiting for the first email.
      </p>
    </div>
  );
}
