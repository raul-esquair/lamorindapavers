import { company } from "@/lib/data/company";
import { BUSINESS_ID, STEVE_ID, stevePerson } from "@/lib/seo/entities";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: company.name,
    founder: stevePerson,
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

export function ArticleJsonLd({
  title,
  description,
  date,
  dateModified,
  url,
  image,
}: {
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: dateModified ?? date,
    // Reference the canonical Steve entity by @id — the full Person is defined
    // on the same page via LocalBusinessJsonLd.founder, so Google resolves the
    // author to the business's founder rather than an orphan name.
    author: { "@id": STEVE_ID },
    publisher: {
      "@type": "Organization",
      "@id": BUSINESS_ID,
      name: company.name,
      url: company.domain,
      logo: { "@type": "ImageObject", url: `${company.domain}/images/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  if (image) {
    jsonLd.image = { "@type": "ImageObject", url: image };
  }

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
