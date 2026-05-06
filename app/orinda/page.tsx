import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  ServiceJsonLd,
} from "@/components/seo/JsonLd";
import OrindaContent from "./OrindaContent";
import { orindaFaqs } from "./content";

export const metadata: Metadata = {
  title: "Paver Installation in Orinda, CA | Lamorinda Pavers",
  description:
    "Paver driveways, retaining walls, pool decks & water features in Orinda, CA. Hillside expertise, oak ordinance compliance, ridgeline overlay handling. Lic. #1092749, 5-yr warranty. 925-389-0119.",
  alternates: {
    canonical: `${company.domain}/orinda`,
  },
};

export default function OrindaPage() {
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
      <OrindaContent />
    </>
  );
}
