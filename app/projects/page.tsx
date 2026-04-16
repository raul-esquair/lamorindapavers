import type { Metadata } from "next";
import { projects, getCategories } from "@/lib/data/projects";
import ProjectsPageContent from "./ProjectsPageContent";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse our portfolio of paver installation projects across the East Bay. Driveways, patios, retaining walls, outdoor kitchens, and more. Licensed #1092749.",
};

export default function ProjectsPage() {
  const categories = getCategories();
  return <ProjectsPageContent projects={projects} categories={categories} />;
}
