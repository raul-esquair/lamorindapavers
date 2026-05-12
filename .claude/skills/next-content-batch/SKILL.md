---
name: next-content-batch
description: Propose the next batch of blog post briefs to add to the content queue. Reads Google Search Console data, existing queue, published posts, and blog.config.ts (services, geography, voice). Calls Claude to generate the batch, writes to content/proposed-briefs.json, and opens a PR for review. Merging the PR moves the briefs into post-queue.json.
---

# Next Content Batch — Brief Generator

When the user invokes this skill, propose the next batch of blog briefs.

## Steps

1. **Verify required environment.** Must be set:
   - `ANTHROPIC_API_KEY` (Claude API)
   - `GSC_SERVICE_ACCOUNT_JSON_BASE64` (optional — graceful fallback if absent)

   Inside GitHub Actions these come from repo secrets. Locally the user needs to export them.

   **No email is sent** on manual invocation. The script only sends a review email when `SEND_PROPOSAL_EMAIL=true` is set (only the `auto-propose-batch.yml` workflow does this).

2. **Invoke the proposal script:**

   ```bash
   npx tsx scripts/propose-next-batch.ts
   ```

   The script:
   - Loads `blog.config.ts` for site/voice/services/geography context
   - Reads `content/post-queue.json` + `content/style-reference.md` + `lib/blog/data.ts`
   - Reads `content/keyword-plan.md` if present (additional keyword targets)
   - Fetches last 90 days of Search Console data (graceful fallback if site is new or API errors)
   - Calls Claude (default: Opus 4.7) with full context
   - Writes `content/proposed-briefs.json` + `content/proposed-briefs-summary.md`
   - Opens a PR on `proposals/content-batch-<date>` branch

3. **Report outcome to the user:**
   - Which briefs were proposed (titles + scheduled dates)
   - PR URL
   - Instruction to review, edit, or merge

4. **Do NOT modify `content/post-queue.json` directly.** The merge workflow (`.github/workflows/merge-proposed-briefs.yml`) handles that when the proposal PR merges to main.

## When to use

Typically monthly, when the queue is running low (e.g., 2-3 weeks of content left). Also useful after a Search Console data review when you want AI-assisted topic selection.

## Common variations

- Override batch size: `BATCH_SIZE=6 npx tsx scripts/propose-next-batch.ts`
- Cheaper model: `MODEL=claude-sonnet-4-6 npx tsx scripts/propose-next-batch.ts`
- Dry run (no PR, no writes): `npx tsx scripts/propose-next-batch.ts --dry-run`

## Troubleshooting

- **"GSC returned permission denied"** — verify both:
  (a) the Search Console API is enabled on the GCP project owning the service account, AND
  (b) the service account email is added as a user in Search Console for the site
- **"No data in GSC"** — normal for a new site; script falls back to cluster analysis from services + queue + published posts
- **PR create fails** — ensure "Allow GitHub Actions to create and approve pull requests" is enabled in repo settings

## Cost per run

~$0.50–$1.50 with Opus 4.7 (~15K input tokens with full context, ~8K output). About $0.20 with Sonnet 4.6. Worth Opus here — topic selection has multiplier effect on every downstream post.
