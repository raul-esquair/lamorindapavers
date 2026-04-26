import { company } from "@/lib/data/company";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: company.name,
    description: company.description,
    url: company.domain,
    telephone: company.phone,
    email: company.email,
    image: `${company.domain}/images/logo.png`,
    priceRange: "$$",
    areaServed: [
      ...company.serviceArea.primary,
      ...company.serviceArea.secondary,
      ...company.serviceArea.extended,
    ].map((city) => ({
        "@type": "City",
        name: `${city}, CA`,
      })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paver Installation Services",
      itemListElement: [
        "Paver Driveways",
        "Retaining Walls",
        "Patios",
        "Artificial Turf",
        "Landscape Design",
        "Fire Pits & Fire Features",
        "Outdoor Kitchens",
        "Pool Decks",
        "Putting Greens",
        "Water Features",
        "Arbors & Pergolas",
      ].map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ServiceJsonLd({
  serviceName,
  serviceType,
  description,
  cityName,
  url,
}: {
  serviceName: string;
  serviceType: string;
  description: string;
  cityName: string;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    serviceType,
    description,
    url,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: company.name,
      telephone: company.phone,
      url: company.domain,
    },
    areaServed: {
      "@type": "City",
      name: `${cityName}, CA`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
