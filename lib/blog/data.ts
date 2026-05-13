/**
 * Blog post data store + publish-gating helpers.
 *
 * The AI pipeline inserts new posts at the top of BLOG_POSTS. Consumer sites
 * shouldn't edit this file directly (other than seed posts on first install)
 * — the generate-post pipeline owns writes here.
 *
 * Publish gating: a post is "published" once its `date` is on or before
 * today (UTC). Future-dated posts exist in the array but are filtered out
 * of the listing route, detail route, and sitemap. This enables pre-writing
 * + scheduled releases.
 */
import type { BlogPost } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  // Seed posts go here, or remove this comment and start with an empty array.
];

export function isPublished(post: BlogPost): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return post.date <= today;
}

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(isPublished).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post || !isPublished(post)) return undefined;
  return post;
}

export function getRelatedPosts(
  currentSlug: string,
  relatedService: string | undefined,
  limit = 3,
): BlogPost[] {
  if (!relatedService) return [];
  return getPublishedPosts()
    .filter((p) => p.slug !== currentSlug && p.relatedService === relatedService)
    .slice(0, limit);
}
