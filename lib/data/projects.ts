export interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  description?: string;
  images: string[];
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
    title: "Hillside Retaining Wall System",
    category: "Retaining Walls",
    city: "Orinda",
    description: "Multi-tiered retaining wall system transforming a steep hillside into terraced garden space.",
    images: ["/images/projects/placeholder.jpg"],
    featured: true,
  },
  {
    id: "project-3",
    title: "Outdoor Living Retreat",
    category: "Patios",
    city: "Walnut Creek",
    description: "Expansive paver patio with integrated fire pit, seating walls, and outdoor kitchen area.",
    images: ["/images/projects/placeholder.jpg"],
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
