import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/lib/data/cities";
import CityPageContent from "./CityPageContent";

interface Props {
  params: Promise<{ city: string }>;
}

// Lafayette, Moraga, and Orinda each have their own custom static route at
// /app/[slug] — exclude them here so the static route takes precedence and
// there's no build-time path collision.
const customRouteSlugs = new Set(["lafayette", "moraga", "orinda"]);
const dynamicCities = cities.filter((c) => !customRouteSlugs.has(c.slug));

export async function generateStaticParams() {
  return dynamicCities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (customRouteSlugs.has(city)) return {};
  const cityData = getCityBySlug(city);
  if (!cityData) return {};

  return {
    title: `Paver Installation in ${cityData.name}, CA`,
    description: cityData.metaDescription,
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  if (customRouteSlugs.has(city)) notFound();
  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  return <CityPageContent city={cityData} />;
}
