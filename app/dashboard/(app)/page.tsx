import type { Metadata } from "next";
import Link from "next/link";
import { getReviewSettings, listRequests } from "@/lib/reviews/queries";
import { DEFAULT_SETTINGS } from "@/lib/reviews/settings";
import { company } from "@/lib/data/company";
import AddRequestForm from "./AddRequestForm";
import RequestsTable from "./RequestsTable";
import { todayInBusinessTz } from "@/lib/reviews/dates";

export const metadata: Metadata = {
  title: "Review Requests",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let requests: Awaited<ReturnType<typeof listRequests>> = [];
  let settings = DEFAULT_SETTINGS;
  let loadError: string | null = null;

  try {
    [requests, settings] = await Promise.all([listRequests(), getReviewSettings()]);
  } catch (err) {
    console.error("Dashboard load failed:", err);
    loadError = "Could not reach the database. Check DATABASE_URL on the server.";
  }

  const active = requests.filter((r) => r.status === "active").length;
  const responded = requests.filter((r) => r.respondedAt !== null).length;
  const sent = requests.filter((r) => r.touches.length > 0).length;
  const responseRate = sent > 0 ? Math.round((responded / sent) * 100) : null;

  const stats = [
    { label: "Active sequences", value: String(active) },
    { label: "Contacted", value: String(sent) },
    { label: "Responded", value: String(responded) },
    { label: "Response rate", value: responseRate === null ? "—" : `${responseRate}%` },
  ];

  const count = { 1: "one email", 2: "up to two emails", 3: "up to three emails" }[settings.emailCount];
  const cadence = {
    emailCount: settings.emailCount,
    gapDays: settings.gapDays,
    skipWeekends: settings.skipWeekends,
  };
  const today = todayInBusinessTz();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif text-warm-gray-900">Review Requests</h1>
        <p className="mt-2 font-sans text-warm-gray-500">
          Add a customer after a job wraps. They get {count} from {company.owner.split(" ")[0]}, and
          any response stops the rest automatically.
        </p>
      </div>

      {settings.paused && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-brand-gold/50 bg-brand-gold/10 px-4 py-3">
          <p className="font-sans text-sm text-[#6b4d12]">
            <span className="font-semibold">Sending is paused.</span> No review emails go out until
            you resume. Customers you add now wait their turn.
          </p>
          <Link
            href="/dashboard/settings"
            className="press shrink-0 font-sans text-sm font-semibold text-[#6b4d12] underline underline-offset-2 hover:text-brand-blue"
          >
            Resume in Settings
          </Link>
        </div>
      )}

      {loadError && (
        <p className="rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-sans text-sm text-brand-red">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-warm-gray-200 bg-white px-4 py-4">
            <p className="font-sans text-xs uppercase tracking-wider text-warm-gray-400">
              {s.label}
            </p>
            <p className="mt-1 font-serif text-2xl text-warm-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <AddRequestForm today={today} />

      <RequestsTable
        requests={requests}
        siteUrl={company.domain}
        cadence={cadence}
        paused={settings.paused}
        today={today}
      />
    </div>
  );
}
