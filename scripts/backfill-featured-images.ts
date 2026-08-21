/**
 * One-time backfill: generate featured images for already-published blog posts
 * that shipped without one (the weekly-draft job silently skipped the image step
 * while the OpenAI account was out of credits — the failure is non-fatal, so the
 * posts published text-only).
 *
 * It reuses the exact image pipeline from generate-post.ts (Haiku brand prompt →
 * gpt-image-1) so backfilled images match the look of the automated ones. Briefs
 * are read from content/post-queue.json (they carry title/excerpt/primaryKeyword).
 *
 * Idempotent: skips any post that already has a featuredImage in lib/blog/data.ts.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... OPENAI_API_KEY=... npx tsx scripts/backfill-featured-images.ts
 *
 * After it runs: `npm run blur:gen` to add blur placeholders, then commit the
 * new PNGs + the lib/blog/data.ts edits.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { loadBlogConfig } from "../lib/blog-config";
import type { BlogBrief } from "../lib/blog/types";
import {
  generateFeaturedImage,
  addFeaturedImageToBlogData,
} from "./generate-post";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QUEUE_PATH = resolve(REPO_ROOT, "content/post-queue.json");
const BLOG_DATA_PATH = resolve(REPO_ROOT, "lib/blog/data.ts");

/** Slugs of published posts that already have an image — parsed live so the run
 *  is idempotent and never regenerates (or double-charges for) an existing one. */
function slugsWithImage(): Set<string> {
  const data = readFileSync(BLOG_DATA_PATH, "utf8");
  const withImage = new Set<string>();
  // Each post block is `slug: "x",` immediately followed by `featuredImage: "..."`
  // (that's the exact shape addFeaturedImageToBlogData writes). Match that pair.
  const re = /slug:\s*"([^"]+)",\s*\n\s*featuredImage:/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(data)) !== null) withImage.add(m[1]);
  return withImage;
}

/** Slugs that exist as published posts in data.ts (any post, image or not). */
function publishedSlugs(): Set<string> {
  const data = readFileSync(BLOG_DATA_PATH, "utf8");
  const slugs = new Set<string>();
  const re = /slug:\s*"([^"]+)",/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(data)) !== null) slugs.add(m[1]);
  return slugs;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY is required (Haiku image-prompt step).");
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY is required (gpt-image-1 step).");
    process.exit(1);
  }

  const config = await loadBlogConfig();
  const queue: BlogBrief[] = JSON.parse(readFileSync(QUEUE_PATH, "utf8"));
  const bySlug = new Map(queue.map((b) => [b.slug, b]));

  const published = publishedSlugs();
  const haveImage = slugsWithImage();

  // Targets: posts that are live but imageless. Preserve data.ts order (newest first).
  const targets = [...published].filter((s) => !haveImage.has(s) && bySlug.has(s));

  if (targets.length === 0) {
    console.log("Nothing to backfill — every published post already has a featured image.");
    return;
  }

  console.log(`Backfilling ${targets.length} post(s):`);
  targets.forEach((s) => console.log(`  · ${s}`));
  console.log("");

  const failures: string[] = [];
  for (const slug of targets) {
    const brief = bySlug.get(slug)!;
    console.log(`\n─── ${brief.title} ───`);
    try {
      const { imagePath } = await generateFeaturedImage(config, brief);
      addFeaturedImageToBlogData(slug, imagePath);
      console.log(`✓ ${slug} → ${imagePath}`);
    } catch (err) {
      console.error(`✗ ${slug} — image generation failed:`, err);
      failures.push(slug);
    }
  }

  console.log("\n────────────────────────────");
  console.log(`Done: ${targets.length - failures.length} succeeded, ${failures.length} failed.`);
  if (failures.length) {
    console.log("Failed slugs (re-run to retry — succeeded ones are skipped):");
    failures.forEach((s) => console.log(`  · ${s}`));
    process.exit(1);
  }
  console.log("\nNext: `npm run blur:gen`, then commit the new PNGs + lib/blog/data.ts.");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
