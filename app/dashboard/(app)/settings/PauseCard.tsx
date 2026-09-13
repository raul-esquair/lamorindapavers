"use client";

import { useState, useTransition } from "react";
import { setPaused } from "@/lib/actions/review-settings";
import { cn } from "@/lib/utils";
import { Switch } from "./controls";

function formatPausedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
  });
}

/**
 * The on/off switch for all review emails. Saves the moment it's flipped,
 * separately from the settings form — it's the emergency stop, so it must not
 * wait on a Save button or get discarded with unrelated edits.
 */
export default function PauseCard({
  paused: initialPaused,
  pausedAt,
  skipWeekends,
}: {
  paused: boolean;
  pausedAt: string | null;
  skipWeekends: boolean;
}) {
  const [paused, setLocalPaused] = useState(initialPaused);
  const [since, setSince] = useState(pausedAt);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(sending: boolean) {
    const nextPaused = !sending;
    setError(null);
    setLocalPaused(nextPaused);
    startTransition(async () => {
      const result = await setPaused(nextPaused);
      if (result.ok) {
        setSince(nextPaused ? new Date().toISOString() : null);
      } else {
        setLocalPaused(!nextPaused);
        setError(result.error);
      }
    });
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-5 sm:p-6 transition-[background-color,border-color] duration-200 ease-out",
        paused ? "border-brand-gold/50 bg-brand-gold/10" : "border-warm-gray-200 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <label htmlFor="sending-switch" className="font-serif text-xl text-warm-gray-900 cursor-pointer">
            {paused ? "Review emails are paused" : "Review emails are on"}
          </label>
          <p className="mt-1 font-sans text-sm text-warm-gray-500 max-w-2xl" aria-live="polite">
            {paused ? (
              <>
                {since && !pending ? `Paused since ${formatPausedAt(since)}. ` : ""}
                Nothing goes out. Emails that come due wait, and start again when you switch this back on
                &mdash; still spaced the way your schedule says.
              </>
            ) : (
              <>
                {`They go out ${skipWeekends ? "every weekday" : "every day"} at 10am. `}
                Switch this off if you&apos;re away and can&apos;t answer replies &mdash; nothing is
                skipped, only held.
              </>
            )}
          </p>
        </div>
        <Switch id="sending-switch" checked={!paused} onChange={toggle} disabled={pending} />
      </div>
      {error && (
        <p className="mt-3 font-sans text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
