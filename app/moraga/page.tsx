import type { Metadata } from "next";
import { company } from "@/lib/data/company";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  ServiceJsonLd,
} from "@/components/seo/JsonLd";
import MoragaContent from "./MoragaContent";
import { moragaFaqs } from "./content";

export const metadata: Metadata = {
  title: "Paver Installation in Moraga, CA | Lamorinda Pavers",
  description:
    "Paver driveways, retaining walls & patios in Moraga, CA. Pervious-paving expertise, GHAD coordination, hillside permitting. Lic. #1092749, 5-yr warranty. Free estimate: 925-389-0119.",
  alternates: {
    canonical: `${company.domain}/moraga`,
  },
};

export default function MoragaPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: company.domain },
          { name: "Service Areas", url: `${company.domain}/areas` },
          { name: "Moraga, CA", url: `${company.domain}/moraga` },
        ]}
      />
      <ServiceJsonLd
        serviceName="Paver Installation in Moraga, CA"
        serviceType="Paver Installation"
        description="Custom paver driveways, retaining walls, patios, fire features, and outdoor living installation for Moraga, CA homeowners — engineered for the town's expansive clay, hillside grades, GHAD parcels, and pervious-paving code."
        cityName="Moraga"
        url={`${company.domain}/moraga`}
      />
      <FAQJsonLd faqs={moragaFaqs} />
      <MoragaContent />
    </>
  );
}
