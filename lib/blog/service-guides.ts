/**
 * Curated internal-linking map: service slug → ordered blog-post slugs.
 *
 * Why curated (not auto-derived from `relatedService`): 11 of 14 posts tag
 * `patios`, so an auto list would dump every post onto one page. These lists
 * are hand-ordered COMMERCIAL-INTENT FIRST (cost / hiring / ROI / scope) — the
 * posts that attract buyers — and deliberately avoid pairing two posts that
 * cannibalize the same query. DIY/definitional posts are intentionally omitted
 * here; they earn authority via in-cluster cross-links, not from money pages.
 *
 * Ordering within each list is the priority order used for both the in-prose
 * links (top 2) and the "Guides" card module (top N).
 */
import { getPostBySlug } from "./data";
import type { BlogPost } from "./types";

export const SERVICE_GUIDES: Record<string, string[]> = {
  patios: [
    "budgeting-a-large-paver-patio-in-2026", // cost — commercial
    "do-paver-patios-increase-home-value-in-the-east-bay", // ROI — commercial
    "9-questions-to-vet-a-paver-installer-for-big-patios", // hiring — commercial
    "12-features-full-service-paver-patios-should-include", // scope — commercial
  ],
  "outdoor-kitchens": [
    "outdoor-paver-kitchen-cost-overruns-in-2026", // cost (canonical) — commercial
    "13-hidden-outdoor-paver-kitchen-costs-in-2026", // cost checklist — commercial
    "hiring-contractors-for-paver-kitchens-and-fire-pits", // hiring — commercial
  ],
};

/**
 * Shared guide set for the generic `[city]` template (Martinez, Walnut Creek,
 * Danville, and the other templated cities). These pages are templated by
 * design and have no per-city lead hook, so a single commercial/process set is
 * appropriate — unlike the bespoke city pages, which each get a distinct set.
 * Uses the canonical coordination post only (not its cannibalizing sibling).
 */
export const CITY_TEMPLATE_GUIDE_SLUGS = [
  "how-to-coordinate-an-outdoor-living-build-in-2026", // process (canonical)
  "budgeting-a-large-paver-patio-in-2026", // cost — commercial
  "paver-outdoor-living-roi-for-home-resale-in-2026", // ROI — commercial
];

function resolveGuides(slugs: string[], limit: number): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const slug of slugs) {
    const post = getPostBySlug(slug);
    if (post) posts.push(post);
    if (posts.length >= limit) break;
  }
  return posts;
}

/**
 * Resolve a service's curated guide slugs to published posts, preserving the
 * curated order. Unpublished/missing slugs are dropped silently.
 */
export function getServiceGuides(serviceSlug: string, limit = 4): BlogPost[] {
  return resolveGuides(SERVICE_GUIDES[serviceSlug] ?? [], limit);
}

/** Resolve the shared templated-city guide set. */
export function getCityTemplateGuides(limit = 3): BlogPost[] {
  return resolveGuides(CITY_TEMPLATE_GUIDE_SLUGS, limit);
}
