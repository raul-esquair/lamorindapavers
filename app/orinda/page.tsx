import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  ServiceJsonLd,
} from "@/components/seo/JsonLd";
import { getPostBySlug } from "@/lib/blog/data";
import type { BlogPost } from "@/lib/blog/types";
import OrindaContent from "./OrindaContent";
import { orindaFaqs, orindaGuideSlugs } from "./content";

export const metadata: Metadata = {
  // The root layout appends " | Lamorinda Pavers" via `template` — do NOT
  // repeat the brand here (it rendered twice, at 70 chars, until Sep 2026).
  // Keep this <= 41 chars so the templated title lands under Google's ~60.
  // Targets the two highest-impression Orinda queries, "paver contractor
  // orinda" and "paver installer orinda" — the old title matched neither.
  title: "Orinda Paver Contractor & Installer",
  // Kept near ~155 chars so Google shows the whole line. The old one ran 191
  // and truncated mid-feature-list. Leads with the two things no competing
  // Orinda page can claim: the clay spec and the permits we actually pull.
  description:
    "Paver driveways, patios and pool decks built for Orinda's hillside grades and clay. We pull the tree, grading and ridgeline permits. CA Lic. #1092749.",
  alternates: {
    canonical: `${company.domain}/orinda`,
  },
};

export default function OrindaPage() {
  const guides = orindaGuideSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => Boolean(p));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: company.domain },
          { name: "Service Areas", url: `${company.domain}/areas` },
          { name: "Orinda, CA", url: `${company.domain}/orinda` },
        ]}
      />
      <ServiceJsonLd
        serviceName="Paver Installation in Orinda, CA"
        serviceType="Paver Installation"
        description="Custom paver driveways, retaining walls, pool decks, water features, and outdoor living installation for Orinda, CA homeowners — engineered for steep terrain, expansive Orinda Formation clay, and the city's tree and ridgeline ordinances."
        cityName="Orinda"
        url={`${company.domain}/orinda`}
      />
      <FAQJsonLd faqs={orindaFaqs} />
      <OrindaContent guides={guides} />
    </>
  );
}
