import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, getCityBySlug } from "@/lib/data/cities";
import CityPageContent from "./CityPageContent";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const cityData = getCityBySlug(city);
  if (!cityData) return {};

  return {
    title: `Paver Installation in ${cityData.name}, CA`,
    description: cityData.metaDescription,
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const cityData = getCityBySlug(city);
  if (!cityData) notFound();

  return <CityPageContent city={cityData} />;
}
