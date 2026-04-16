export interface City {
  slug: string;
  name: string;
  county: string;
  description: string;
  metaDescription: string;
}

export const cities: City[] = [
  {
    slug: "lafayette",
    name: "Lafayette",
    county: "Contra Costa",
    description:
      "Lafayette homeowners trust Lamorinda Pavers for premium paver installations that complement the city's upscale character. From the hillside estates along Happy Valley Road to the charming downtown district, we've transformed outdoor spaces throughout Lafayette with custom driveways, patios, and outdoor living areas.",
    metaDescription:
      "Premium paver installation in Lafayette, CA. Custom driveways, patios, retaining walls & outdoor living. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "moraga",
    name: "Moraga",
    county: "Contra Costa",
    description:
      "Moraga's beautiful natural setting deserves outdoor spaces that match. Lamorinda Pavers has been serving Moraga homeowners for over a decade, creating stunning paver driveways, patios, and landscape features that enhance the community's natural beauty while adding lasting value to your home.",
    metaDescription:
      "Expert paver installation in Moraga, CA. Driveways, patios, retaining walls & outdoor kitchens. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "orinda",
    name: "Orinda",
    county: "Contra Costa",
    description:
      "Orinda's elegant homes deserve outdoor spaces to match. Lamorinda Pavers brings over a decade of expertise to Orinda properties, crafting custom paver installations that enhance curb appeal and create inviting outdoor living areas perfect for the community's active, outdoor lifestyle.",
    metaDescription:
      "Premium paver contractor in Orinda, CA. Custom driveways, patios, pool decks & outdoor living. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "walnut-creek",
    name: "Walnut Creek",
    county: "Contra Costa",
    description:
      "Walnut Creek's vibrant community and beautiful homes are the perfect canvas for premium outdoor living. From the neighborhoods around Mount Diablo to downtown living spaces, Lamorinda Pavers delivers custom paver installations that transform Walnut Creek properties into outdoor showcases.",
    metaDescription:
      "Professional paver installation in Walnut Creek, CA. Driveways, patios, retaining walls & more. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "pleasant-hill",
    name: "Pleasant Hill",
    county: "Contra Costa",
    description:
      "Pleasant Hill homeowners choose Lamorinda Pavers for quality craftsmanship and exceptional service. We've completed numerous projects throughout the city, from driveway replacements to complete backyard transformations, always delivering results that exceed expectations.",
    metaDescription:
      "Quality paver installation in Pleasant Hill, CA. Driveways, patios, outdoor kitchens & more. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "concord",
    name: "Concord",
    county: "Contra Costa",
    description:
      "Concord's diverse neighborhoods and warm climate make it ideal for outdoor living improvements. Lamorinda Pavers serves Concord homeowners with the same premium craftsmanship and attention to detail that has made us the East Bay's trusted paver contractor.",
    metaDescription:
      "Trusted paver contractor in Concord, CA. Driveways, patios, artificial turf & outdoor living. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "danville",
    name: "Danville",
    county: "Contra Costa",
    description:
      "Danville's upscale estates and family-friendly neighborhoods are a natural fit for our premium paver installations. We've completed stunning projects throughout Danville, from grand driveway entries to expansive outdoor entertainment areas that take advantage of the town's exceptional weather.",
    metaDescription:
      "Luxury paver installation in Danville, CA. Custom driveways, patios, pool decks & outdoor living. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "san-ramon",
    name: "San Ramon",
    county: "Contra Costa",
    description:
      "San Ramon homeowners rely on Lamorinda Pavers for outdoor transformations that match the city's high standards. From the communities along Crow Canyon to Dougherty Valley, we bring expert craftsmanship to every paver project in San Ramon.",
    metaDescription:
      "Expert paver contractor in San Ramon, CA. Driveways, patios, retaining walls & landscape design. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "dublin",
    name: "Dublin",
    county: "Alameda",
    description:
      "Dublin's growing community of new homes and established neighborhoods is a great fit for premium paver upgrades. Lamorinda Pavers serves Dublin homeowners with custom designs that add curb appeal, outdoor living space, and lasting value.",
    metaDescription:
      "Professional paver installation in Dublin, CA. Driveways, patios, fire pits & outdoor kitchens. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "martinez",
    name: "Martinez",
    county: "Contra Costa",
    description:
      "Martinez's charming character homes and waterfront properties deserve quality outdoor craftsmanship. Lamorinda Pavers brings expert paver installation to Martinez, creating beautiful driveways, patios, and outdoor living spaces that enhance the city's unique personality.",
    metaDescription:
      "Quality paver installation in Martinez, CA. Driveways, patios, retaining walls & more. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "berkeley",
    name: "Berkeley",
    county: "Alameda",
    description:
      "Berkeley's diverse architecture and creative homeowners inspire some of our most unique paver designs. From the Berkeley Hills to the flatlands, Lamorinda Pavers delivers custom installations that respect each property's character while adding modern outdoor living functionality.",
    metaDescription:
      "Creative paver installation in Berkeley, CA. Custom driveways, patios, walkways & landscape design. Licensed #1092749. Free estimates. 5-year warranty.",
  },
  {
    slug: "oakland",
    name: "Oakland",
    county: "Alameda",
    description:
      "Oakland homeowners choose Lamorinda Pavers for premium outdoor transformations that add beauty and value. From the hills to the lake, we bring the same expert craftsmanship and personal attention to every Oakland project.",
    metaDescription:
      "Premium paver contractor in Oakland, CA. Driveways, patios, retaining walls & outdoor living. Licensed #1092749. Free estimates. 5-year warranty.",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
