import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  ServiceJsonLd,
} from "@/components/seo/JsonLd";
import LafayetteContent from "./LafayetteContent";
import { lafayetteFaqs } from "./content";

export const metadata: Metadata = {
  title: "Paver Installation in Lafayette, CA | Lamorinda Pavers",
  description:
    "Paver driveways, patios & retaining walls in Lafayette, CA. Owner Steve Barsanti on every job. Lic. #1092749, 5-yr warranty. Free estimate: 925-389-0119.",
  alternates: {
    canonical: `${company.domain}/lafayette`,
  },
};

export default function LafayettePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: company.domain },
          { name: "Service Areas", url: `${company.domain}/areas` },
          { name: "Lafayette, CA", url: `${company.domain}/lafayette` },
        ]}
      />
      <ServiceJsonLd
        serviceName="Paver Installation in Lafayette, CA"
        serviceType="Paver Installation"
        description="Custom paver driveways, patios, retaining walls, pool decks, and outdoor living installation for Lafayette, CA homeowners."
        cityName="Lafayette"
        url={`${company.domain}/lafayette`}
      />
      <FAQJsonLd faqs={lafayetteFaqs} />
      <LafayetteContent />
    </>
  );
}
