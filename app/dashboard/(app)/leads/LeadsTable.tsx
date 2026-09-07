import Link from "next/link";
import type { Lead } from "@/lib/db/schema";
import { services } from "@/lib/data/services";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function serviceName(slug: string | null) {
  if (!slug) return "Not sure yet";
  return services.find((s) => s.slug === slug)?.name ?? slug;
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <p className="rounded-lg border border-warm-gray-200 bg-warm-white px-4 py-8 text-center font-sans text-sm text-warm-gray-500">
        No leads yet. They appear here the moment someone submits the quote form.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-gray-200 bg-warm-white">
      <table className="w-full min-w-[46rem] text-left font-sans text-sm">
        <thead className="border-b border-warm-gray-200 text-xs uppercase tracking-wider text-warm-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Received</th>
            <th scope="col" className="px-4 py-3 font-medium">Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Contact</th>
            <th scope="col" className="px-4 py-3 font-medium">Service</th>
            <th scope="col" className="px-4 py-3 font-medium">Location</th>
            <th scope="col" className="px-4 py-3 font-medium">Came from</th>
            <th scope="col" className="px-4 py-3 font-medium">Texts OK</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top">
              <td className="whitespace-nowrap px-4 py-3 text-warm-gray-500">
                {DATE_FMT.format(lead.createdAt)}
              </td>
              <td className="px-4 py-3 font-medium text-warm-gray-900">{lead.name}</td>
              <td className="px-4 py-3">
                {lead.phone && (
                  <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="block text-brand-blue hover:underline">
                    {lead.phone}
                  </a>
                )}
                <a href={`mailto:${lead.email}`} className="block text-warm-gray-500 hover:underline">
                  {lead.email}
                </a>
              </td>
              <td className="px-4 py-3 text-warm-gray-700">{serviceName(lead.service)}</td>
              <td className="px-4 py-3 text-warm-gray-700">
                {lead.address ?? lead.city ?? <span className="text-warm-gray-400">—</span>}
              </td>
              <td className="px-4 py-3">
                {lead.sourcePath ? (
                  <Link href={lead.sourcePath} className="text-warm-gray-500 hover:text-brand-blue hover:underline">
                    {lead.sourcePath}
                  </Link>
                ) : (
                  <span className="text-warm-gray-400">—</span>
                )}
                {lead.sourceKind && (
                  <span className="block text-xs text-warm-gray-400">{lead.sourceKind}</span>
                )}
              </td>
              <td className="px-4 py-3">
                {lead.smsConsentAt ? (
                  <span className="inline-flex rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-medium text-brand-blue">
                    Yes
                  </span>
                ) : (
                  <span className="text-xs text-warm-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
