/**
 * Build content/site-inventory.json — a flat list of every linkable URL
 * on the site with a title and short summary. Used by the blog generator's
 * critique pass to pick contextually relevant internal links.
 *
 * Sources:
 *   - Hardcoded blog-engine pages (/, /blog, /contact)
 *   - blogConfig.services (each gets /services/<slug>)
 *   - blogConfig.geography (optional, each gets /service-areas/<slug>)
 *   - lib/blog/data.ts BLOG_POSTS (published + scheduled posts)
 *
 * Consumer sites with additional static pages (gallery, about, etc.) can
 * extend the inventory by editing content/site-inventory.extras.json —
 * any entries there get merged in.
 */

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadBlogConfig } from "../lib/blog-config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(REPO_ROOT, "content/site-inventory.json");
const EXTRAS_PATH = resolve(REPO_ROOT, "content/site-inventory.extras.json");

interface InventoryEntry {
  url: string;
  type: "service" | "city" | "blog" | "static";
  title: string;
  summary: string;
  tags?: string[];
}

async function main() {
  const config = await loadBlogConfig();
  const entries: InventoryEntry[] = [];

  // Universal pages that every consumer site has.
  entries.push(
    {
      url: "/",
      type: "static",
      title: "Homepage",
      summary: `${config.site.brand.full} — ${config.site.name}.`,
    },
    {
      url: "/blog",
      type: "static",
      title: "Blog",
      summary: `Insights and guides from ${config.site.brand.short}.`,
    },
    {
      url: "/contact",
      type: "static",
      title: "Contact",
      summary: `Contact ${config.site.brand.short}.`,
    },
  );

  // Service pages — driven entirely by blog.config.ts
  for (const s of config.services) {
    entries.push({
      url: `/services/${s.slug}`,
      type: "service",
      title: s.name,
      summary: s.summary,
      tags: [s.slug],
    });
  }
  if (config.services.length > 0) {
    entries.push({
      url: "/services",
      type: "static",
      title: "All Services",
      summary: `All services offered by ${config.site.brand.short}.`,
    });
  }

  // Geography pages — only if config.geography is populated
  if (config.geography && config.geography.length > 0) {
    for (const g of config.geography) {
      entries.push({
        url: `/${g.slug}`,
        type: "city",
        title: `${g.name}, ${g.region}`,
        summary: `${config.site.brand.short} services in ${g.name}, ${g.region}.`,
        tags: [
          "city",
          g.region.toLowerCase().replace(/ /g, "-"),
          g.tier ? `tier-${g.tier}` : "tier-unset",
        ],
      });
    }
    entries.push({
      url: "/areas",
      type: "static",
      title: "Service Areas",
      summary: `All ${config.geography.length} cities served by ${config.site.brand.short}.`,
    });
  }

  // Blog posts — all of them, published and scheduled
  const { BLOG_POSTS } = await import(resolve(REPO_ROOT, "lib/blog/data.ts"));
  for (const p of BLOG_POSTS as Array<{
    slug: string;
    title: string;
    excerpt: string;
    relatedService?: string;
  }>) {
    entries.push({
      url: `/blog/${p.slug}`,
      type: "blog",
      title: p.title,
      summary: p.excerpt,
      tags: p.relatedService ? [p.relatedService, "blog"] : ["blog"],
    });
  }

  // Consumer-provided extras (custom static pages: gallery, about, FAQs, etc.)
  if (existsSync(EXTRAS_PATH)) {
    const extras = JSON.parse(readFileSync(EXTRAS_PATH, "utf-8")) as InventoryEntry[];
    entries.push(...extras);
  }

  writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Wrote ${entries.length} entries to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
