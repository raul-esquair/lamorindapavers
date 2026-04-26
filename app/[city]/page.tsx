import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/lib/data/cities";
import CityPageContent from "./CityPageContent";

interface Props {
  params: Promise<{ city: string }>;
}

// Lafayette has its own custom static route at /app/lafayette — exclude it here
// so the static route takes precedence and there's no build-time path collision.
const dynamicCities = cities.filter((c) => c.slug !== "lafayette");

export async function generateStaticParams() {
  return dynamicCities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  if (city === "lafayette") return {};
  const cityData = getCityBySlug(city);
  if (!cityData) return {};

  return {
    title: `Paver Installation in ${cityData.name}, CA`,
    description: cityData.metaDescription,
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  if (city === "lafayette") notFound();
  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  return <CityPageContent city={cityData} />;
}
