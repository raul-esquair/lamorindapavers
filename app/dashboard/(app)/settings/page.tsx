import type { Metadata } from "next";
import { todayInBusinessTz } from "@/lib/reviews/dates";
import { getReviewSettings } from "@/lib/reviews/queries";
import { DEFAULT_ALERT_TO, DEFAULT_REPLY_TO } from "@/lib/reviews/recipients";
import type { ReviewSettings } from "@/lib/reviews/settings";
import PauseCard from "./PauseCard";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Review Settings",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let settings: ReviewSettings | null = null;
  try {
    settings = await getReviewSettings();
  } catch (err) {
    console.error("Settings load failed:", err);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif text-warm-gray-900">Settings</h1>
        <p className="mt-2 font-sans text-warm-gray-500">How your review emails go out, and what they say.</p>
      </div>

      {settings ? (
        <>
          <PauseCard paused={settings.paused} pausedAt={settings.pausedAt} skipWeekends={settings.skipWeekends} />
          <SettingsForm
            initial={settings}
            today={todayInBusinessTz()}
            defaultReplyTo={DEFAULT_REPLY_TO}
            defaultAlertEmail={DEFAULT_ALERT_TO}
            phoneAlerts={!!process.env.NTFY_TOPIC}
          />
        </>
      ) : (
        // No form without the real values: saving defaults over settings we
        // couldn't read would silently undo Steve's changes.
        <p className="rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-sans text-sm text-brand-red">
          Could not load your settings from the database. Nothing has changed &mdash; try again in a minute.
        </p>
      )}
    </div>
  );
}
