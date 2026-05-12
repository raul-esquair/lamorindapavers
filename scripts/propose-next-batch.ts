/**
 * Propose the next batch of blog briefs for the content queue.
 *
 * Reads:
 *   - content/post-queue.json          (what's already planned)
 *   - lib/blog/data.ts                 (what's published)
 *   - blog.config.ts                   (services, geography, site, voice, email)
 *   - content/style-reference.md       (voice anchors)
 *   - content/keyword-plan.md          (optional — additional keyword targets)
 *   - Google Search Console            (real ranking data — graceful fallback)
 *
 * Writes:
 *   - content/proposed-briefs.json     (the batch for your review)
 *   - content/proposed-briefs-summary.md
 *
 * Opens: a PR. Merging triggers merge-proposed-briefs.yml which moves the
 * briefs into post-queue.json with status: "queued".
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... GSC_SERVICE_ACCOUNT_JSON_BASE64=... npx tsx scripts/propose-next-batch.ts
 *   npx tsx scripts/propose-next-batch.ts --dry-run
 */

import Anthropic from "@anthropic-ai/sdk";
import { marked } from "marked";
import { Resend } from "resend";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchGscReport, type GscReport } from "./fetch-gsc-data.js";
import { loadBlogConfig, type BlogConfig } from "../lib/blog-config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const QUEUE_PATH = resolve(REPO_ROOT, "content/post-queue.json");
const STYLE_PATH = resolve(REPO_ROOT, "content/style-reference.md");
const KEYWORD_PLAN_PATH = resolve(REPO_ROOT, "content/keyword-plan.md");
const BLOG_DATA_PATH = resolve(REPO_ROOT, "lib/blog/data.ts");
const PROPOSAL_PATH = resolve(REPO_ROOT, "content/proposed-briefs.json");
const SUMMARY_PATH = resolve(REPO_ROOT, "content/proposed-briefs-summary.md");

const MODEL = process.env.MODEL || "claude-opus-4-7";
const IS_DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = Number(process.env.BATCH_SIZE) || 4;

function run(cmd: string): string {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
}

function nextMondayAfter(dateIso: string): string {
  const d = new Date(dateIso);
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY required");
    process.exit(1);
  }

  const config = await loadBlogConfig();

  console.log("Loading current state...");
  const queue = JSON.parse(readFileSync(QUEUE_PATH, "utf8"));
  const style = readFileSync(STYLE_PATH, "utf8");
  const keywordPlan = existsSync(KEYWORD_PLAN_PATH)
    ? readFileSync(KEYWORD_PLAN_PATH, "utf8")
    : null;

  const blogMod = await import(BLOG_DATA_PATH);
  const publishedPosts = (blogMod.BLOG_POSTS as Array<{
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    relatedService?: string;
  }>).map(({ slug, title, excerpt, date, relatedService }) => ({
    slug,
    title,
    excerpt,
    date,
    relatedService,
  }));

  let gscReport: GscReport | { newSite: true; error?: string } = { newSite: true };
  try {
    console.log("Fetching Google Search Console data (last 90 days)...");
    gscReport = await fetchGscReport();
    console.log(
      `GSC: ${gscReport.summary.totalImpressions} impressions, ${gscReport.summary.totalClicks} clicks | ${gscReport.opportunities.closeToPage1.length} close-to-page-1 opportunities`,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`GSC fetch failed — proceeding without it. Reason: ${msg}`);
    gscReport = { newSite: true, error: msg };
  }

  const lastDate =
    queue.length > 0
      ? queue
          .map((b: { scheduledDate: string }) => b.scheduledDate)
          .sort()
          .at(-1)!
      : todayIso();

  const scheduledDates: string[] = [];
  let cursor = lastDate;
  for (let i = 0; i < BATCH_SIZE; i++) {
    cursor = nextMondayAfter(cursor);
    scheduledDates.push(cursor);
  }
  console.log(`Proposing ${BATCH_SIZE} briefs scheduled: ${scheduledDates.join(", ")}`);

  const proposal = await callClaudeForProposal({
    config,
    queue,
    publishedPosts,
    keywordPlan,
    style,
    gscReport,
    scheduledDates,
  });

  if (IS_DRY_RUN) {
    console.log("\n──────────── DRY RUN ────────────\n");
    console.log(proposal.summaryMarkdown);
    console.log("\n──────────── PROPOSED BRIEFS ────────────\n");
    console.log(JSON.stringify(proposal.briefs, null, 2));
    return;
  }

  writeFileSync(PROPOSAL_PATH, JSON.stringify(proposal.briefs, null, 2) + "\n");
  writeFileSync(SUMMARY_PATH, proposal.summaryMarkdown);
  console.log(`Wrote ${proposal.briefs.length} briefs to ${PROPOSAL_PATH}`);

  const prUrl = openReviewPR(proposal.briefs, proposal.summaryMarkdown, config);

  if (process.env.SEND_PROPOSAL_EMAIL === "true") {
    try {
      await sendProposalEmail(proposal.briefs, proposal.summaryMarkdown, prUrl, config);
    } catch (err) {
      console.error("Proposal email failed but PR is live:", err);
    }
  } else {
    console.log(
      "SEND_PROPOSAL_EMAIL not set — skipping email (manual invocation mode).",
    );
  }
}

interface ProposedBrief {
  slug: string;
  scheduledDate: string;
  status: "proposed";
  action: "new" | "refresh";
  refreshesSlug?: string;
  title: string;
  metaTitle: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  relatedService: string;
  targetWordCount: number;
  geoFocus?: string;
  citiesReferenced?: string[];
  outline: Array<{ h2: string; h3?: string[]; notes?: string }>;
  mustInclude?: string[];
  mustAvoid?: string[];
  internalLinks?: Array<{ url: string; anchor: string }>;
  cta: string;
  proposalRationale: string;
}

interface Proposal {
  briefs: ProposedBrief[];
  summaryMarkdown: string;
}

async function callClaudeForProposal(ctx: {
  config: BlogConfig;
  queue: unknown[];
  publishedPosts: unknown[];
  keywordPlan: string | null;
  style: string;
  gscReport: GscReport | { newSite: true; error?: string };
  scheduledDates: string[];
}): Promise<Proposal> {
  const services = ctx.config.services.map((s) => ({
    slug: s.slug,
    name: s.name,
    summary: s.summary,
  }));
  const geoCount = ctx.config.geography?.length ?? 0;
  const geoRegions = ctx.config.geography
    ? Array.from(new Set(ctx.config.geography.map((g) => g.region)))
    : [];

  const system = `You are a senior SEO content strategist proposing the next batch of blog posts for ${ctx.config.site.brand.full}. Your job: propose ${BATCH_SIZE} blog briefs that will maximize organic traffic and lead generation.

# Voice + audience

Audience: ${ctx.config.voice.audience}
Tone: ${ctx.config.voice.tone}
${ctx.config.voice.mustInclude.length > 0 ? `Always include: ${ctx.config.voice.mustInclude.join("; ")}` : ""}
${ctx.config.voice.mustAvoid.length > 0 ? `Never include: ${ctx.config.voice.mustAvoid.join("; ")}` : ""}

<style_guide>
${ctx.style}
</style_guide>

# Decision framework

Consider in order of importance:

1. **Real GSC data** (if the site has impressions). If pages are ranking page 2-3 for valuable keywords, propose a refresh (action: "refresh") rather than a new post. If existing posts have high impressions but near-zero clicks, propose a refresh to fix title/meta. If queries are getting impressions but have no dedicated landing page, propose a new post.

2. **Topic cluster completion.** Every existing post is part of a cluster around a service. Look at what's covered vs. what's missing. Propose supporting posts that fill gaps and strengthen topical authority for the site's services.

3. **Keyword plan** (if provided) as a secondary source of keyword targets with search-volume + commercial-intent signal.

4. **Seasonal / timely angles.** Consider today's date and surface topics that win in the current season.

5. **Action mix:** Aim for roughly 3 new posts + 1 refresh per batch if GSC data shows refresh opportunities. If site is brand new with no GSC data, all ${BATCH_SIZE} can be new.

# Constraints

- Each brief must match the existing post-queue.json schema (see the live queue in the user message for examples).
- Assign scheduled dates from the list provided (one per brief, in order).
- For "refresh" action briefs, include refreshesSlug pointing to the existing post.
- Do NOT duplicate keywords or angles already covered in queue or published posts.
- Include a "proposalRationale" field explaining WHY this post wins — cite GSC data, keyword volume, or cluster logic.
- targetWordCount typical range: 2000-3000. Cost guides 2200-2500. Comparisons 2500-3000. Symptom/troubleshooting guides 2500-2800.
- Internal links: propose 3-5 per brief from real URLs that exist in the site (service pages, geography pages if any, published posts, other queued briefs).
- Must-includes: reference specific facts to cover (real numbers, named locations, materials, jurisdictions, eras — whatever applies to this business).
- relatedService: must be a slug that exists in the services list.

# Output format

Respond with exactly two XML-tagged blocks in order:

<briefs>
[ { ...brief 1... }, ... ${BATCH_SIZE} total ]
</briefs>

<summary>
# Proposed Content Batch

## Selection rationale
(3-5 sentences explaining the overall strategy of this batch.)

## Briefs

### 1. [Title]
- **Publishing:** [date] ([day])
- **Primary keyword:** \`[keyword]\`
- **Action:** new | refresh (and which slug if refresh)
- **Why:** [2-3 sentences]

### 2. ...

## GSC signals used
(Brief bullet points on which real ranking data shaped this batch, if any.)
</summary>`;

  const user = `# Current content state

## Already-queued briefs (do NOT duplicate)
${JSON.stringify(ctx.queue, null, 2)}

## Already-published posts (candidates for refresh if GSC data supports)
${JSON.stringify(ctx.publishedPosts, null, 2)}

## Services offered (use slug as relatedService field)
${JSON.stringify(services, null, 2)}

## Geographic coverage
${
  geoCount > 0
    ? `${geoCount} locations across ${geoRegions.length} regions: ${geoRegions.join(", ")}. Available URLs under /service-areas/<slug>.`
    : "No geography pages on this site — skip city-specific angles."
}

${
  ctx.keywordPlan
    ? `## Keyword plan (additional keyword targets with search volume + CPC)
${ctx.keywordPlan}`
    : ""
}

## Google Search Console — last 90 days
${JSON.stringify(ctx.gscReport, null, 2)}

## Scheduled dates for this batch (assign one per brief, in order)
${JSON.stringify(ctx.scheduledDates)}

## Today's date
${todayIso()}

---

Generate the batch of ${BATCH_SIZE} briefs plus the human summary. Follow the output format exactly.`;

  console.log(`Calling Claude (${MODEL})...`);
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16_000,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  const cost =
    (response.usage.input_tokens * 15 + response.usage.output_tokens * 75) /
    1_000_000;
  console.log(
    `Proposal done. Input: ${response.usage.input_tokens} | Output: ${response.usage.output_tokens} | ~$${cost.toFixed(3)}`,
  );

  return parseProposal(textBlock.text);
}

function parseProposal(raw: string): Proposal {
  const briefsMatch = raw.match(/<briefs>([\s\S]*?)<\/briefs>/);
  const summaryMatch = raw.match(/<summary>([\s\S]*?)<\/summary>/);
  if (!briefsMatch) {
    throw new Error(
      "Proposal missing <briefs> block. Raw:\n" + raw.slice(0, 500),
    );
  }
  let briefs: ProposedBrief[];
  try {
    briefs = JSON.parse(briefsMatch[1].trim());
  } catch (err) {
    throw new Error(
      `Failed to parse <briefs> JSON: ${err}\n\nRaw:\n${briefsMatch[1].slice(0, 800)}`,
    );
  }
  return {
    briefs,
    summaryMarkdown:
      summaryMatch?.[1]?.trim() ?? "(no summary generated)",
  };
}

function openReviewPR(briefs: ProposedBrief[], summary: string, config: BlogConfig): string {
  const branch = `proposals/content-batch-${todayIso()}`;
  const botEmail = `noreply@${new URL(config.site.url).hostname}`;
  const botName = `${config.site.brand.short} Bot`;

  try {
    run("git config user.email");
  } catch {
    run(`git config user.email "${botEmail}"`);
    run(`git config user.name "${botName}"`);
  }

  try {
    run(`git branch -D ${branch}`);
  } catch { /* branch didn't exist locally */ }
  run(`git checkout -b ${branch}`);
  run(`git add content/proposed-briefs.json content/proposed-briefs-summary.md`);

  const commitMsg = `Propose next content batch — ${briefs.length} briefs

Auto-generated via /next-content-batch skill.
Scheduled dates: ${briefs.map((b) => b.scheduledDate).join(", ")}

Merging this PR moves these briefs into post-queue.json via the
merge-proposed-briefs workflow. Edit content/proposed-briefs.json in
this PR to revise before merging, or close the PR to reject.
`;
  writeFileSync("/tmp/proposal-commit-msg.txt", commitMsg);
  run(`git commit -F /tmp/proposal-commit-msg.txt`);
  run(`git push --force origin ${branch}`);

  const prBody = `## Proposed content batch for your review

${summary}

---

## Next steps

1. **Review** the proposed briefs in \`content/proposed-briefs.json\`
2. **Edit** any brief inline if you want to adjust title, outline, keywords, etc.
3. **Merge** this PR → the \`merge-proposed-briefs\` workflow automatically moves the briefs into \`post-queue.json\` with \`status: "queued"\` so the Friday automation picks them up.
4. **Close** this PR (without merging) to reject the batch.
`;
  writeFileSync("/tmp/proposal-pr-body.md", prBody);
  const prUrl = run(
    `gh pr create --title "Next content batch (${briefs.length} briefs) — review for approval" --body-file /tmp/proposal-pr-body.md`,
  );
  console.log(`PR created: ${prUrl}`);
  return prUrl;
}

async function sendProposalEmail(
  briefs: ProposedBrief[],
  summaryMarkdown: string,
  prUrl: string,
  config: BlogConfig,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set — skipping proposal email.");
    return;
  }

  const recipientsRaw = process.env.DRAFT_REVIEW_EMAILS;
  const recipients = recipientsRaw
    ? recipientsRaw.split(",").map((e) => e.trim()).filter(Boolean)
    : config.email.reviewRecipients;

  if (recipients.length === 0) {
    console.log("No recipients configured — skipping proposal email.");
    return;
  }

  const summaryHtml = await marked.parse(summaryMarkdown);
  const accent = config.branding.accentColor;
  const dark = config.branding.primaryDark;

  const briefRows = briefs
    .map((b, i) => {
      const actionBadge =
        b.action === "refresh"
          ? `<span style="display:inline-block; background:${accent}; color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius: 999px; margin-left: 8px; vertical-align: middle;">REFRESH</span>`
          : `<span style="display:inline-block; background:#444444; color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius: 999px; margin-left: 8px; vertical-align: middle;">NEW</span>`;
      const scheduled = new Date(b.scheduledDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; vertical-align: top;">
            <div style="font-size: 11px; color: #6b7280; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px;">Week ${i + 1} — ${escapeHtml(scheduled)}</div>
            <div style="font-size: 15px; font-weight: 700; color: ${dark}; line-height: 1.3; margin-bottom: 4px;">
              ${escapeHtml(b.title)}${actionBadge}
            </div>
            <div style="font-size: 13px; color: #444444; margin-bottom: 6px;">
              <code style="background: #fafafa; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${escapeHtml(b.primaryKeyword)}</code>
              <span style="color: #9ca3af; margin: 0 4px;">·</span>
              /services/${escapeHtml(b.relatedService)}
              <span style="color: #9ca3af; margin: 0 4px;">·</span>
              ${b.targetWordCount.toLocaleString()} words
            </div>
            <div style="font-size: 13px; color: #6b7280; line-height: 1.5;">
              ${escapeHtml(b.proposalRationale ?? "")}
            </div>
          </td>
        </tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Content batch proposed</title>
<style>
  body { margin:0; padding:0; background:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color:${dark}; line-height:1.6; }
  .wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 48px; }
  .header { background:${dark}; color:#ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; }
  .badge { display:inline-block; background:${accent}; color:#fff; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:4px 10px; border-radius: 999px; }
  .header h2 { margin: 12px 0 0; font-size: 20px; font-weight: 700; color:#ffffff; }
  .header p { margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; }
  .actions { background:#ffffff; padding: 20px 24px; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; }
  .btn-primary { display:inline-block; background:${accent}; color:#ffffff !important; text-decoration:none; padding: 12px 22px; border-radius: 8px; font-weight:700; font-size: 14px; }
  .briefs { background:#ffffff; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; border-radius: 0 0 12px 12px; }
  .summary { background:#ffffff; margin-top: 24px; padding: 28px; border: 1px solid #e5e5e5; border-radius: 12px; }
  .summary h1, .summary h2, .summary h3 { color: ${dark}; }
  .summary h1 { font-size: 22px; margin: 0 0 16px; }
  .summary h2 { font-size: 17px; margin: 24px 0 10px; border-bottom: 2px solid #f4f4f5; padding-bottom: 6px; }
  .summary h3 { font-size: 15px; margin: 16px 0 6px; }
  .summary p { margin: 0 0 12px; color: #444444; font-size: 14px; }
  .summary ul { margin: 0 0 14px; padding-left: 22px; color: #444444; font-size: 14px; }
  .summary strong { color: ${dark}; }
  .summary code { background: #fafafa; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  .footer { text-align:center; color:#9ca3af; font-size: 12px; margin-top: 32px; line-height: 1.6; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <span class="badge">Content batch proposed</span>
      <h2>${briefs.length} briefs ready for your approval</h2>
      <p>Scheduled: ${briefs[0] ? escapeHtml(briefs[0].scheduledDate) : "?"} through ${briefs[briefs.length - 1] ? escapeHtml(briefs[briefs.length - 1].scheduledDate) : "?"}</p>
    </div>
    <div class="actions">
      <a class="btn-primary" href="${escapeHtml(prUrl)}">Review &amp; approve on GitHub</a>
    </div>
    <div class="briefs">
      <table style="width:100%; border-collapse: collapse;">
        ${briefRows}
      </table>
    </div>
    <div class="summary">
      ${summaryHtml}
    </div>
    <div class="footer">
      Merging the PR moves these briefs into <code>post-queue.json</code>. The Friday draft automation picks them up on their scheduled dates.<br>
      Close the PR without merging to reject the batch.
    </div>
  </div>
</body>
</html>`;

  const resend = new Resend(apiKey);
  const fromAddress = process.env.DRAFT_FROM_EMAIL || config.email.fromAddress;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: recipients,
    subject: `${briefs.length} new blog briefs proposed — review for approval`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
  console.log(`Proposal email sent to ${recipients.join(", ")} (id: ${data?.id})`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
