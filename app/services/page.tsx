import type { Metadata } from "next";
import { services } from "@/lib/data/services";
import ServicesPageContent from "./ServicesPageContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our full range of paver installation and outdoor living services. Driveways, patios, retaining walls, outdoor kitchens, and more. Licensed #1092749.",
};

export default function ServicesPage() {
  return <ServicesPageContent services={services} />;
}
