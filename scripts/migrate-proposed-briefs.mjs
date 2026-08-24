#!/usr/bin/env node
/**
 * Migrate content/proposed-briefs.json into content/post-queue.json.
 *
 * Shared by two callers so the logic can't drift:
 *   - .github/workflows/merge-proposed-briefs.yml   (push trigger — human merges)
 *   - .github/workflows/auto-merge-proposals.yml    (after the bot squash-merges)
 *
 * The auto-merge path exists because a push made with the default GITHUB_TOKEN
 * does NOT fire push-triggered workflows. On the sibling gadgetconstruction
 * repo that silently starved the queue for eight weeks: the bot merged six
 * proposal PRs, none of them ever migrated, and weekly-draft.yml skipped every
 * Friday while still reporting success. This repo has the same wiring and has
 * only been spared because proposals were being merged by hand. The auto-merge
 * workflow now runs the migration itself instead of relying on the push event.
 *
 * Behavior:
 *   - Skips briefs whose slug is already in the queue (idempotent — safe to
 *     re-run, and safe if both callers ever fire for the same batch).
 *   - Quarantines refresh briefs into content/refresh-briefs.json. generate-post.ts
 *     has no refresh path: it would publish the brief as a brand-new post at a
 *     new URL, cannibalizing the very page the refresh was meant to update.
 *   - Reassigns every migrated brief to a consecutive Monday slot starting at
 *     least a week out, so a batch that sat unmerged can't land with scheduled
 *     dates already in the past (a past date publishes the instant it merges).
 *
 * No dependencies — runs on a bare runner with `node scripts/migrate-proposed-briefs.mjs`.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const QUEUE_PATH = "content/post-queue.json";
const PROPOSED_PATH = "content/proposed-briefs.json";
const REFRESH_PATH = "content/refresh-briefs.json";

/** Lead time before the first available slot: drafting happens the Friday before publish. */
const MIN_LEAD_DAYS = 6;

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  const raw = readFileSync(path, "utf-8").trim();
  if (!raw) return fallback;
  return JSON.parse(raw);
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** First Monday strictly after `iso`. */
function nextMonday(iso) {
  let d = new Date(`${iso}T00:00:00Z`);
  do {
    d.setUTCDate(d.getUTCDate() + 1);
  } while (d.getUTCDay() !== 1);
  return d.toISOString().slice(0, 10);
}

function main() {
  const proposed = readJson(PROPOSED_PATH, []);
  if (!Array.isArray(proposed) || proposed.length === 0) {
    console.log("No proposed briefs to migrate — nothing to do.");
    return;
  }

  const queue = readJson(QUEUE_PATH, []);
  const queuedSlugs = new Set(queue.map((b) => b.slug));

  const migrated = [];
  const quarantined = [];
  const duplicates = [];

  for (const brief of proposed) {
    if (queuedSlugs.has(brief.slug)) {
      duplicates.push(brief.slug);
      continue;
    }
    if (brief.action === "refresh" || brief.refreshesSlug) {
      quarantined.push(brief);
      continue;
    }
    migrated.push(brief);
    queuedSlugs.add(brief.slug);
  }

  // Consecutive Monday slots after the last date already on the books, never
  // sooner than MIN_LEAD_DAYS from today.
  const lastQueuedDate = queue.map((b) => b.scheduledDate).sort().at(-1) ?? todayIso();
  const earliest = addDays(todayIso(), MIN_LEAD_DAYS);
  let cursor = lastQueuedDate > earliest ? lastQueuedDate : earliest;

  for (const brief of migrated) {
    cursor = nextMonday(cursor);
    if (brief.scheduledDate !== cursor) {
      console.log(`  rescheduled ${brief.slug}: ${brief.scheduledDate} → ${cursor}`);
    }
    brief.scheduledDate = cursor;
    brief.status = "queued";
  }

  if (migrated.length > 0) {
    writeJson(QUEUE_PATH, [...queue, ...migrated]);
  }

  if (quarantined.length > 0) {
    const existingRefresh = readJson(REFRESH_PATH, []);
    const refreshSlugs = new Set(existingRefresh.map((b) => b.slug));
    const newRefresh = quarantined.filter((b) => !refreshSlugs.has(b.slug));
    writeJson(REFRESH_PATH, [...existingRefresh, ...newRefresh]);
  }

  writeJson(PROPOSED_PATH, []);

  console.log("");
  console.log(`Migrated ${migrated.length} brief(s) into ${QUEUE_PATH}:`);
  for (const b of migrated) console.log(`  ✓ ${b.scheduledDate}  ${b.slug}`);

  if (quarantined.length > 0) {
    console.log("");
    console.log(`::warning::${quarantined.length} refresh brief(s) held back — generate-post.ts cannot draft a refresh in place.`);
    for (const b of quarantined) {
      console.log(`  ⏸ ${b.slug} (refreshes ${b.refreshesSlug}) → parked in ${REFRESH_PATH}`);
    }
  }

  if (duplicates.length > 0) {
    console.log("");
    console.log(`Skipped ${duplicates.length} brief(s) already in the queue: ${duplicates.join(", ")}`);
  }
}

main();
