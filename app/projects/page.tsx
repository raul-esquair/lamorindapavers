import { Suspense } from "react";
import type { Metadata } from "next";
import { projects, getCategories } from "@/lib/data/projects";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse our portfolio of paver installation projects across the East Bay. Driveways, patios, retaining walls, outdoor kitchens, and more. Licensed #1092749.",
};

export default function ProjectsPage() {
  const categories = getCategories();
  return (
    // Suspense boundary required because ProjectsClient calls useSearchParams,
    // which opts the subtree into dynamic rendering.
    <Suspense fallback={null}>
      <ProjectsClient projects={projects} categories={categories} />
    </Suspense>
  );
}
