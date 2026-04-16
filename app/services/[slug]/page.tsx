import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug, getRelatedServices } from "@/lib/data/services";
import ServiceDetailContent from "./ServiceDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: `${service.shortDescription} Expert ${service.name.toLowerCase()} installation in the East Bay. Licensed #1092749. Free estimates. 5-year warranty.`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.relatedSlugs);

  return <ServiceDetailContent service={service} relatedServices={related} />;
}
