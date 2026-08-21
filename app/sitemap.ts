import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { cities } from "@/lib/data/cities";
import { getPublishedPosts } from "@/lib/blog/data";

const BASE_URL = "https://lamorindapaving.com";

// Stable last-content-update date for pages without a tracked per-page date.
// Using build-time `new Date()` here churns every URL's <lastmod> on every
// deploy, which teaches Google to ignore the signal entirely. Bump this only
// when the static/service/city page content materially changes.
const LAST_CONTENT_UPDATE = new Date("2026-08-21");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/areas`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 0.6 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Per-post accurate <lastmod>: reflects a refresh when dateModified is set,
  // otherwise the publish date. This is the one lastmod signal Google can trust.
  const blogPages: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...cityPages, ...blogPages];
}
