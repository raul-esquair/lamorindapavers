/**
 * Core types for the blog engine. Shared between renderer, data store,
 * and the AI pipeline.
 */

export interface BlogPostFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle?: string;
  excerpt: string;
  date: string; // ISO YYYY-MM-DD — controls publish gating
  /** ISO YYYY-MM-DD — set when a post is refreshed. Defaults to `date` in schema if absent. */
  dateModified?: string;
  readingTime: string; // e.g. "8 min read"
  category?: string;
  /** Optional: matches a slug from blogConfig.services for related-service linking. */
  relatedService?: string;
  featuredImage?: string; // path like /images/blog-<slug>.png
  content: string; // markdown body
  faqs?: BlogPostFAQ[];
}

export interface BlogBrief {
  slug: string;
  scheduledDate: string; // ISO YYYY-MM-DD
  status: "queued" | "drafted" | "published" | "proposed";
  title: string;
  metaTitle?: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  relatedService?: string;
  targetWordCount: number;
  /** Optional geographic scope, e.g. "Bay Area" or "Phoenix Metro". */
  geoFocus?: string;
  citiesReferenced?: string[];
  outline: Array<{
    h2: string;
    h3?: string[];
    notes?: string;
  }>;
  mustInclude?: string[];
  mustAvoid?: string[];
  internalLinks?: Array<{
    url: string;
    anchor: string;
  }>;
  cta?: string;
  // For proposals from /next-content-batch:
  action?: "new" | "refresh";
  refreshesSlug?: string;
  proposalRationale?: string;
}
