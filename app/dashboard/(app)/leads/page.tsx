import type { Metadata } from "next";
import Link from "next/link";
import { listLeads } from "@/lib/leads/queries";
import LeadsTable from "./LeadsTable";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let loadError: string | null = null;

  try {
    leads = await listLeads();
  } catch (err) {
    console.error("Leads load failed:", err);
    loadError = "Could not reach the database. Check DATABASE_URL on the server.";
  }

  /**
   * Which pages produce work — the question the site could not answer before
   * leads were persisted. Sorted by volume, not alphabetically.
   */
  const bySource = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      const key = l.sourcePath ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: "Total leads", value: String(leads.length) },
    { label: "Source pages", value: String(bySource.length) },
  ];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-serif text-warm-gray-900">Leads</h1>
          <Link
            href="/dashboard"
            className="font-sans text-sm text-warm-gray-500 hover:text-brand-blue transition-colors duration-200"
          >
            Review requests →
          </Link>
        </div>
        <p className="mt-2 font-sans text-warm-gray-500">
          Every quote form submission, newest first — including which page it came from.
        </p>
      </div>

      {loadError && (
        <p className="rounded-lg border border-brand-red/30 bg-brand-red/5 px-4 py-3 font-sans text-sm text-brand-red">
          {loadError}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-warm-gray-200 bg-warm-white px-4 py-3">
            <dt className="font-sans text-xs uppercase tracking-wider text-warm-gray-500">{s.label}</dt>
            <dd className="mt-1 font-serif text-2xl text-warm-gray-900">{s.value}</dd>
          </div>
        ))}
      </dl>

      <LeadsTable leads={leads} />

      {bySource.length > 0 && (
        <section>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-warm-gray-500">
            Leads by page
          </h2>
          <ul className="mt-3 divide-y divide-warm-gray-100 rounded-lg border border-warm-gray-200 bg-warm-white">
            {bySource.map(([path, count]) => (
              <li key={path} className="flex items-center justify-between gap-4 px-4 py-2.5 font-sans text-sm">
                <span className="truncate text-warm-gray-700">{path}</span>
                <span className="shrink-0 tabular-nums text-warm-gray-500">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
