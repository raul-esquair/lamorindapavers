export interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  description?: string;
  images: string[];
  imagePosition?: string;
  featured: boolean;
}

// TODO: Replace with real project data and photos from Steve
export const projects: Project[] = [
  {
    id: "project-1",
    title: "Custom Spiral Paver Walkway",
    category: "Landscape Design",
    city: "Lafayette",
    description: "Hand-laid paver walkway featuring custom circular spiral medallion inlays with curvlinear edging and lush landscape borders.",
    images: ["/images/projects/spiral-walkway.jpg"],
    featured: true,
  },
  {
    id: "project-2",
    title: "Segmented Modern Entry Walkway",
    category: "Paver Driveways",
    city: "Orinda",
    description: "Contemporary paneled paver walkway with charcoal banding, river rock borders, and curated landscape plantings leading to a modern estate entry.",
    images: ["/images/projects/segmented-entry-walkway.jpg"],
    featured: true,
  },
  {
    id: "project-3",
    title: "Tiered Paver Entry & Landing Steps",
    category: "Paver Driveways",
    city: "Walnut Creek",
    description: "Multi-level paver entry with cascading landings, block retaining walls, and colorful landscape borders framing the front walkway.",
    images: ["/images/projects/tiered-entry-steps.jpg"],
    imagePosition: "center 35%",
    featured: true,
  },
  {
    id: "project-4",
    title: "Resort-Style Pool Deck",
    category: "Pool Decks",
    city: "Danville",
    description: "Slip-resistant paver pool deck with custom coping and integrated spa surround.",
    images: ["/images/projects/placeholder.jpg"],
    featured: true,
  },
  {
    id: "project-5",
    title: "Custom Outdoor Kitchen",
    category: "Outdoor Kitchens",
    city: "Moraga",
    description: "Full outdoor kitchen with built-in grill, granite countertops, and bar seating area.",
    images: ["/images/projects/placeholder.jpg"],
    featured: false,
  },
  {
    id: "project-6",
    title: "Backyard Putting Green",
    category: "Putting Greens",
    city: "Lafayette",
    description: "Professional-grade putting green with custom contours, fringe, and chipping area.",
    images: ["/images/projects/placeholder.jpg"],
    featured: false,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  return [...new Set(projects.map((p) => p.category))];
}
