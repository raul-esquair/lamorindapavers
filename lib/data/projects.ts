import { services } from "./services";

export interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  description?: string;
  images: string[];
  imagePosition?: string;
  featured: boolean;

  // Editorial fields for the /projects gallery chapters.
  // All optional — chapters render the rows that are present and skip the rest.
  scope?: string;          // e.g. "1,400 sq ft"
  duration?: string;       // e.g. "3 weeks"
  year?: number;
  materials?: string[];
  services?: string[];     // service slugs for cross-linking to /services/[slug]
  challenge?: string;
  solution?: string;
  slug?: string;           // for future /projects/[slug] detail pages
  heroIndex?: number;      // which entry of `images` is the chapter hero (default 0)
}

// TODO: Replace with real project data and photos from Steve.
//
// ⚠️ PLACEHOLDER EDITORIAL DATA — confirm with Steve before launch.
// On the 4 real projects (project-1 through project-4), the following fields are
// reasonable estimates inferred from the project descriptions, NOT verified facts:
//   - scope (sq ft)
//   - duration
//   - year
//   - materials
// These exist so the /projects gallery chapter layout has real-feeling content to
// render during development. Replace with verified values before the gallery page
// goes live. (`services` slugs and `slug` are derivable structural fields and fine to keep.)
export const projects: Project[] = [
  {
    id: "project-1",
    title: "Custom Spiral Paver Walkway",
    category: "Landscape Design",
    city: "Lafayette",
    description: "Hand-laid paver walkway featuring custom circular spiral medallion inlays with curvlinear edging and lush landscape borders.",
    images: ["/images/projects/spiral-walkway.jpg"],
    featured: true,
    scope: "~700 sq ft",
    duration: "2–3 weeks",
    year: 2024,
    materials: [
      "Custom paver medallion inlays",
      "Curvilinear paver edging",
      "River rock and landscape borders",
    ],
    services: ["landscape-design", "patios"],
    slug: "spiral-paver-walkway",
  },
  {
    id: "project-2",
    title: "Segmented Modern Entry Walkway",
    category: "Paver Driveways",
    city: "Orinda",
    description: "Contemporary paneled paver walkway with charcoal banding, river rock borders, and curated landscape plantings leading to a modern estate entry.",
    images: ["/images/projects/segmented-entry-walkway.jpg"],
    featured: true,
    scope: "~500 sq ft",
    duration: "2 weeks",
    year: 2024,
    materials: [
      "Modern format pavers",
      "Charcoal banding accents",
      "River rock borders",
    ],
    services: ["paver-driveways", "landscape-design"],
    slug: "segmented-entry-walkway",
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
    scope: "~900 sq ft (multi-level)",
    duration: "3–4 weeks",
    year: 2023,
    materials: [
      "Interlocking pavers",
      "Block retaining walls",
      "Cascading landings",
    ],
    services: ["paver-driveways", "retaining-walls", "landscape-design"],
    slug: "tiered-entry-steps",
  },
  {
    id: "project-4",
    title: "Hillside Estate Motor Court",
    category: "Paver Driveways",
    city: "Orinda",
    description: "Expansive circular paver motor court with radial pattern design, set against a stunning hillside backdrop of redwoods and manicured hedges.",
    images: ["/images/projects/hillside-estate-motor-court.jpg"],
    featured: true,
    scope: "~3,000 sq ft motor court",
    duration: "5–6 weeks",
    year: 2024,
    materials: [
      "Radial pattern pavers",
      "Custom edge banding",
    ],
    services: ["paver-driveways", "landscape-design"],
    slug: "hillside-motor-court",
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

// Maps a project category (display name) to a URL slug.
// Prefers the matching service slug for consistency with /services/[slug].
// Falls back to a sane default for categories that don't match a service name.
export function getCategorySlug(category: string): string {
  const match = services.find((s) => s.name === category);
  if (match) return match.slug;
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
