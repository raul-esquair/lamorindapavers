export const company = {
  name: "Lamorinda Pavers",
  owner: "Steve Barsanti",
  phone: "925-389-0119",
  phoneHref: "tel:+19253890119",
  email: "steve@lamorindapaving.com",
  license: "1092749",
  warranty: "5-Year Workmanship Warranty",
  yearsInBusiness: "10+",
  domain: "https://lamorindapaving.com",
  tagline: "Crafting Outdoor Elegance",
  description:
    "Lamorinda Pavers is the East Bay's premier paver installation and outdoor living company. Owner Steve Barsanti personally oversees every project, ensuring exceptional craftsmanship and attention to detail.",
  serviceArea: {
    primary: ["Lafayette", "Moraga", "Orinda"],
    secondary: ["Walnut Creek", "Pleasant Hill", "Concord"],
    extended: [
      "Danville",
      "San Ramon",
      "Dublin",
      "Martinez",
      "Pittsburg",
      "Antioch",
      "Berkeley",
      "Oakland",
    ],
  },
  allCities(): string[] {
    return [
      ...this.serviceArea.primary,
      ...this.serviceArea.secondary,
      ...this.serviceArea.extended,
    ];
  },
  social: {
    yelp: "", // TODO: add Yelp URL
  },
} as const;
