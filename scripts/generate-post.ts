/**
 * Auto-generate the next queued blog post using Claude + GPT-image-1.
 *
 * Reads content/post-queue.json to find the next post with status="queued",
 * runs a two-pass generation:
 *   Pass 1 (Sonnet): draft from brief + style guide + 2 most-recent published posts
 *   Pass 2 (Sonnet): SEO critique → revised post + FAQ section + SEO notes
 * Then generates a featured image (Haiku image prompt + gpt-image-1), inserts
 * the post into lib/blog/data.ts, flips brief status queued→drafted, opens a
 * draft PR, and emails a review copy.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... OPENAI_API_KEY=... npx tsx scripts/generate-post.ts
 *   npx tsx scripts/generate-post.ts --dry-run
 *
 * Environment:
 *   ANTHROPIC_API_KEY     required
 *   OPENAI_API_KEY        required for image generation (image step is non-fatal if missing)
 *   RESEND_API_KEY        required for review email (also non-fatal)
 *   MODEL                 optional, defaults to claude-sonnet-4-6
 *   GH_TOKEN              required in CI for gh pr create
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { marked } from "marked";
import { Resend } from "resend";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { loadBlogConfig, type BlogConfig } from "../lib/blog-config";
import type { BlogBrief } from "../lib/blog/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const QUEUE_PATH = resolve(REPO_ROOT, "content/post-queue.json");
const STYLE_PATH = resolve(REPO_ROOT, "content/style-reference.md");
const INVENTORY_PATH = resolve(REPO_ROOT, "content/site-inventory.json");
const BLOG_DATA_PATH = resolve(REPO_ROOT, "lib/blog/data.ts");

const MODEL = process.env.MODEL || "claude-sonnet-4-6";
const IS_DRY_RUN = process.argv.includes("--dry-run");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
  process.exit(1);
}

type Brief = BlogBrief;

function loadQueue(): Brief[] {
  return JSON.parse(readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(queue: Brief[]): void {
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n");
}

function findNextQueued(queue: Brief[]): Brief | null {
  return queue.find((b) => b.status === "queued") ?? null;
}

async function loadVoiceAnchors(count: number): Promise<{ title: string; content: string }[]> {
  const mod = await import(BLOG_DATA_PATH);
  const posts: Array<{ title: string; date: string; content: string }> =
    mod.BLOG_POSTS ?? [];
  return posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, count)
    .map((p) => ({ title: p.title, content: p.content }));
}

// ──────────── Drafting prompt ────────────

function buildSystemPrompt(config: BlogConfig, styleGuide: string): string {
  const mustInclude = config.voice.mustInclude.length > 0
    ? `\nAlways include in posts: ${config.voice.mustInclude.join("; ")}.`
    : "";
  const mustAvoid = config.voice.mustAvoid.length > 0
    ? `\nNever include: ${config.voice.mustAvoid.join("; ")}.`
    : "";

  return `You are a blog post writer for ${config.site.brand.full}.

Audience: ${config.voice.audience}
Tone: ${config.voice.tone}${mustInclude}${mustAvoid}

You must follow the style guide below EXACTLY. It is not a suggestion — it is the lock. Voice, structure, formatting, banned phrases — all of it. A post that violates the style guide will be rejected.

<style_guide>
${styleGuide}
</style_guide>`;
}

function buildUserPrompt(
  brief: Brief,
  anchors: { title: string; content: string }[],
): string {
  const refs = anchors
    .map(
      (a, i) =>
        `<reference_post_${i + 1}>\nTitle: ${a.title}\n\n${a.content}\n</reference_post_${i + 1}>`,
    )
    .join("\n\n");

  return `Write the full blog post body for the brief below. Match the voice, structure, and formatting of the reference posts.

${refs || "(No reference posts available — this is one of the first posts on this site. Lean on the style guide.)"}

<brief>
${JSON.stringify(brief, null, 2)}
</brief>

Output requirements:
1. Return ONLY the markdown body — no H1 title, no frontmatter, no metadata, no preamble, no commentary after.
2. Start with "## The Short Answer" followed by 2-4 sentences delivering the conclusion upfront.
3. Proceed through every H2 section listed in the brief's outline, in order.
4. Include every H3 subsection listed under each H2.
5. Include every item from mustInclude. Exclude everything from mustAvoid.
6. Weave internalLinks naturally into the body using the specified anchor text — format them as markdown links: [anchor text](url).
7. End with a CTA section based on the brief's "cta" field.
8. Target word count: ${brief.targetWordCount} words (plus or minus 15%).
9. Use markdown tables where the brief calls for comparisons of 3+ things with 3+ attributes.
10. Use H3 subsections (###) inside H2 sections (##) — do not nest tables inside H3s unless necessary.

Do not wrap the output in backticks. Do not include a title line. Begin with "## The Short Answer".`;
}

// ──────────── SEO critique pass ────────────

interface SiteInventoryEntry {
  url: string;
  type: "service" | "city" | "blog" | "static";
  title: string;
  summary: string;
  tags?: string[];
}

interface RevisionResult {
  revisedPost: string;
  faqs: Array<{ question: string; answer: string }>;
  seoNotes: string;
}

function buildCritiqueSystemPrompt(config: BlogConfig, styleGuide: string): string {
  const linkMin = config.seo.internalLinksPerPost.min;
  const linkMax = config.seo.internalLinksPerPost.max;
  const faqMin = config.seo.faqsPerPost.min;
  const faqMax = config.seo.faqsPerPost.max;
  const anchorMaxPct = config.seo.exactMatchAnchorMaxPct;
  const eeAtSignals = config.voice.mustInclude.length > 0
    ? config.voice.mustInclude.map((m) => `- ${m}`).join("\n")
    : "- Specific local or domain detail that proves first-hand knowledge\n- Concrete examples or named entities (not generic categories)";

  return `You are an SEO editor for ${config.site.brand.full}'s blog. Your job is to take a draft blog post and return a revised version that is measurably better for SEO — specifically targeting Google's 2026 ranking signals and AI answer-engine citation (ChatGPT, Perplexity, Google AI Overviews).

You do NOT rewrite for voice — the draft's voice is already locked by the style guide below. You edit for SEO structure, internal linking, passage-level self-containment, and you ADD a FAQ section.

<style_guide>
${styleGuide}
</style_guide>

# SEO Critique Checklist — apply ALL of these

## Keyword integration
- Primary keyword appears in the first 100 words of the post
- Primary keyword appears in at least 2 H2 headings (or close semantic variants)
- Primary keyword appears in the final/CTA section
- Every secondary keyword from the brief appears at least twice in the body
- LSI keywords and semantic variations are present (synonyms, related terms that humans actually use)
- No keyword stuffing — density stays under 2% for primary keyword

## Passage-level self-containment (critical for LLM retrieval)
- Every H2 section begins with a direct-answer sentence that resolves its own heading as a standalone statement
- No references to "as mentioned above," "earlier in this post," or similar
- Each H2 can be pulled out and read independently by an LLM and still make sense
- Paragraphs are concrete, not vague

## Internal linking (THIS IS THE BIGGEST LEVER)
- The post must have ${linkMin}–${linkMax} contextual internal links for a ~2,500-word post (scale for length)
- Include EVERY link specified in the brief's internalLinks array AS A MINIMUM
- Then select additional links from the site inventory provided below, choosing the most contextually relevant targets for the specific topic mentioned in the post
- Place at least 3 of these internal links in the top 30% of the post (opening paragraphs and first 2 H2 sections)
- Vary anchor text: less than ${anchorMaxPct}% exact-match keyword anchors, use a mix of partial-match, LSI variations, branded, and natural-language anchors
- Never use "click here" or generic anchors
- Every URL you link must appear in the site inventory — do NOT invent URLs

## FAQ section (append to post before final CTA)
- Add a new ## Frequently Asked Questions section
- ${faqMin}–${faqMax} questions formatted as ### question? headers
- Each answer 40–60 words, starting with a direct-answer sentence
- Questions should mirror how real people in the target audience phrase their queries to Google or ChatGPT
- Cover diverse dimensions appropriate to the topic (cost, timeline, materials, process, risks, etc.)
- Include primary keyword naturally in at least 2 answers
- The FAQ section is in addition to the brief's outline, not replacing any existing section

## E-E-A-T signals (proves first-hand knowledge)
${eeAtSignals}

## Voice guardrails
- No banned phrases from the style guide
- Contractions preserved
- Short sentences — most under 20 words
- Pain-first framing somewhere in the opening

# Output format — this is strict

Respond with EXACTLY three XML-tagged blocks, in order. No preamble, no commentary between them.

<revised_post>
(the full revised markdown of the post, including the new FAQ section before the CTA)
</revised_post>

<faqs>
[
  { "question": "How much does X cost?", "answer": "..." },
  ...
]
</faqs>

<seo_notes>
(short bulleted list of specific SEO improvements: keyword additions, links added from inventory, self-containment fixes, FAQ decisions. 5-10 bullets max. Goes in the PR body for debugging.)
</seo_notes>`;
}

function buildCritiqueUserPrompt(
  brief: Brief,
  draft: string,
  inventory: SiteInventoryEntry[],
): string {
  return `Review and revise the draft below.

<brief>
${JSON.stringify(brief, null, 2)}
</brief>

<draft>
${draft}
</draft>

<site_inventory>
${JSON.stringify(inventory, null, 2)}
</site_inventory>

Apply the full SEO critique checklist. Return the three XML-tagged blocks per the output format.`;
}

async function critiqueAndRevise(
  config: BlogConfig,
  brief: Brief,
  draft: string,
): Promise<RevisionResult> {
  const styleGuide = readFileSync(STYLE_PATH, "utf8");
  const inventory: SiteInventoryEntry[] = JSON.parse(
    readFileSync(INVENTORY_PATH, "utf8"),
  );

  console.log(
    `Running SEO critique pass (inventory: ${inventory.length} URLs)...`,
  );

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16_000,
    system: buildCritiqueSystemPrompt(config, styleGuide),
    messages: [
      { role: "user", content: buildCritiqueUserPrompt(brief, draft, inventory) },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("No text in critique response");
  }

  const usage = response.usage;
  const approxCost = (usage.input_tokens * 3 + usage.output_tokens * 15) / 1_000_000;
  console.log(
    `Critique done. Input: ${usage.input_tokens} | Output: ${usage.output_tokens} | ~$${approxCost.toFixed(3)}`,
  );

  return parseCritiqueResponse(text.text);
}

function parseCritiqueResponse(raw: string): RevisionResult {
  const postMatch = raw.match(/<revised_post>([\s\S]*?)<\/revised_post>/);
  const faqsMatch = raw.match(/<faqs>([\s\S]*?)<\/faqs>/);
  const notesMatch = raw.match(/<seo_notes>([\s\S]*?)<\/seo_notes>/);

  if (!postMatch) {
    throw new Error(
      "Critique response missing <revised_post> block. Raw:\n" + raw.slice(0, 400),
    );
  }

  let faqs: Array<{ question: string; answer: string }> = [];
  if (faqsMatch) {
    try {
      faqs = JSON.parse(faqsMatch[1].trim());
    } catch (err) {
      console.warn("Failed to parse FAQ JSON — continuing without structured FAQs:", err);
    }
  }

  return {
    revisedPost: postMatch[1].trim(),
    faqs,
    seoNotes: notesMatch?.[1]?.trim() ?? "",
  };
}

// ──────────── Pass 1 Claude call ────────────

async function generatePost(config: BlogConfig, brief: Brief): Promise<string> {
  const styleGuide = readFileSync(STYLE_PATH, "utf8");
  const anchors = await loadVoiceAnchors(config.voice.anchorPosts);

  console.log(
    `Loading voice anchors: ${anchors.map((a) => a.title.slice(0, 40)).join(" | ") || "(none yet)"}`,
  );
  console.log(`Calling Claude (${MODEL}) for: ${brief.title}`);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: buildSystemPrompt(config, styleGuide),
    messages: [{ role: "user", content: buildUserPrompt(brief, anchors) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  const usage = response.usage;
  const approxCost = (usage.input_tokens * 3 + usage.output_tokens * 15) / 1_000_000;
  console.log(
    `Done. Input: ${usage.input_tokens} | Output: ${usage.output_tokens} | ~$${approxCost.toFixed(3)}`,
  );

  return textBlock.text.trim();
}

// ──────────── Insert into lib/blog/data.ts ────────────

function insertPostIntoBlogData(
  brief: Brief,
  content: string,
  faqs: Array<{ question: string; answer: string }> = [],
): void {
  const file = readFileSync(BLOG_DATA_PATH, "utf8");

  const escapedContent = content.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

  const faqsField =
    faqs.length > 0
      ? `    faqs: ${JSON.stringify(faqs, null, 2).replace(/\n/g, "\n    ")},\n`
      : "";

  const relatedServiceField = brief.relatedService
    ? `    relatedService: "${brief.relatedService}",\n`
    : "";

  const newEntry = `  {
    slug: "${brief.slug}",
    title: ${JSON.stringify(brief.title)},
    excerpt:
      ${JSON.stringify(brief.excerpt)},
    date: "${brief.scheduledDate}",
    readingTime: "${Math.max(1, Math.round(brief.targetWordCount / 250))} min read",
${relatedServiceField}${faqsField}    content: \`
${escapedContent}
    \`.trim(),
  },
`;

  const marker = "export const BLOG_POSTS: BlogPost[] = [";
  const markerIdx = file.indexOf(marker);
  if (markerIdx === -1) {
    throw new Error(`Could not find BLOG_POSTS array in ${BLOG_DATA_PATH}`);
  }
  const insertAt = markerIdx + marker.length;
  const updated = file.slice(0, insertAt) + "\n" + newEntry + file.slice(insertAt);

  writeFileSync(BLOG_DATA_PATH, updated);
  console.log(`Inserted post into ${BLOG_DATA_PATH}`);
}

// ──────────── Featured image generation ────────────

function buildImagePromptSystem(config: BlogConfig): string {
  const services = config.services.map((s) => s.name).join(", ");
  return `# Role
You are an expert image prompt generator for blog featured images on ${config.site.brand.full}'s website${services ? ` — services: ${services}` : ""}.

# Task
Read the title and excerpt of the blog post supplied below. Identify the central idea, insight, or stat the post is built around, then produce a single text-to-image prompt for a featured image that visually represents that idea on-brand.

# Output Rules
- Output ONLY the final image prompt — one paragraph, no quotation marks around the whole prompt, no preamble, no explanation.
- Do NOT repeat, paraphrase, or quote the blog title inside the prompt.
- Do NOT include placeholder phrases like "header area reserved for callout text," "title goes here," or anything asking the image tool to leave room for text overlays. The image stands on its own.
- Avoid stock-photo cliches and identifiable faces. Avoid generic illustrations.

# Hero Stat / Number Rendering Rules (critical — image models hallucinate ranges)

When the post has a headline number, pick ONE single memorable number to render as the visual hero element. Image models (including gpt-image-1) can reliably render a single number but frequently corrupt multi-number ranges with currency symbols.

**Rules for the hero stat:**

1. PREFER a single headline number over a range. From a range, pick the upper bound, lower bound, or a representative midpoint — whichever is most memorable for the post's angle.
2. If a range is truly needed, NEVER use the format \`$XK-$YK\` with two dollar signs. Acceptable formats: \`$15K-60K\` (single dollar sign), \`30-60%\` (percent, no dollar), \`1900-1950\` (years), \`$200-450/sf\` (unit suffix).
3. NEVER include a trailing \`+\` on numbers — image models render it as extra digits.
4. Always quote the EXACT rendered text inside single quotes in the prompt so the image model treats it as literal text. Example: \`a large stylized '$60K' rendered in bold modern sans-serif\`.
5. If the post has no single clear number, use a thematic text fragment instead — a short label like 'HARDIE' or 'DRY ROT' in all caps.

# Brand & Visual Style (apply to every prompt)
- Background: deep ${config.branding.primaryDark} base, optionally with subtle texture, grid lines, or gradient. Pure black and pure white are acceptable secondary backgrounds when composition calls for it.
- Accent color: ${config.branding.accentColor} used sparingly and with intent — a single bold accent line, callout, dimension marker, isolated element, or data highlight. Never washed across the whole image.
- Supporting palette: warm metallic silvers and cool grays. Occasional muted off-white. No teals, lavenders, or pastels.
- Typography (when used): clean modern sans-serif fragments only — bold geometric numerals, labels, percentage marks, unit callouts.
- Aesthetic options to draw from:
  - Architectural blueprint / technical drawing style (linework, dimension markers, grid overlay)
  - Isometric cutaway diagrams
  - Editorial photography mood — strong directional light, high contrast, raw materials in focus
  - Exploded-view technical illustration
  - Data-driven editorial (large stylized stat as the hero with supporting graphics)
- Composition: intentional negative space, single clear focal point, balanced for use as a 16:9 blog hero card.
- Mood: serious, professional, premium. Think New York Times editorial or Dwell magazine cover — not Pinterest infographic.`;
}

async function generateImagePrompt(config: BlogConfig, brief: Brief): Promise<string> {
  const client = new Anthropic();
  const userMessage = `Blog post details:

Title: ${brief.title}
Excerpt: ${brief.excerpt}
Primary keyword: ${brief.primaryKeyword}
${brief.relatedService ? `Target service: ${brief.relatedService}` : ""}

Generate the image prompt per the output rules.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: buildImagePromptSystem(config),
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in image prompt response");
  }
  const prompt = textBlock.text.trim();
  const cost =
    (response.usage.input_tokens * 0.25 + response.usage.output_tokens * 1.25) / 1_000_000;
  console.log(`Image prompt generated (Haiku): ~$${cost.toFixed(4)}`);
  return prompt;
}

async function generateFeaturedImage(
  config: BlogConfig,
  brief: Brief,
): Promise<{ imagePath: string; localPath: string; prompt: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for image generation");
  }

  console.log("Generating image prompt...");
  const prompt = await generateImagePrompt(config, brief);
  console.log(`Prompt: ${prompt.slice(0, 160)}...`);

  console.log("Calling OpenAI gpt-image-1...");
  const openai = new OpenAI();
  const imageResponse = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1536x1024",
    quality: "medium",
    n: 1,
  });

  const b64 = imageResponse.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("No b64_json in OpenAI response");
  }

  const filename = `blog-${brief.slug}.png`;
  const localPath = resolve(REPO_ROOT, "public/images", filename);
  const publicPath = `/images/${filename}`;

  writeFileSync(localPath, Buffer.from(b64, "base64"));
  console.log(`Image saved: ${localPath}`);

  return { imagePath: publicPath, localPath, prompt };
}

function addFeaturedImageToBlogData(slug: string, imagePath: string): void {
  const file = readFileSync(BLOG_DATA_PATH, "utf8");
  const pattern = new RegExp(`(\\s+)(slug: "${slug.replace(/-/g, "\\-")}",)`, "m");
  const match = file.match(pattern);
  if (!match) {
    console.warn(`Could not locate slug line for ${slug}; featuredImage not added`);
    return;
  }
  const indent = match[1];
  const replacement = `${indent}${match[2]}${indent}featuredImage: "${imagePath}",`;
  const updated = file.replace(pattern, replacement);
  writeFileSync(BLOG_DATA_PATH, updated);
  console.log(`featuredImage field added to ${BLOG_DATA_PATH}`);
}

// ──────────── Email draft for review ────────────

function getRepoSlugFromGit(): string | null {
  try {
    const url = execSync("git config --get remote.origin.url", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
    const m = url.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    return m ? `${m[1]}/${m[2]}` : null;
  } catch {
    return null;
  }
}

async function sendDraftEmail(
  config: BlogConfig,
  brief: Brief,
  markdownContent: string,
  prUrl: string,
  imagePath: string | null,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set — skipping email.");
    return;
  }

  const recipientsRaw = process.env.DRAFT_REVIEW_EMAILS;
  const recipients = recipientsRaw
    ? recipientsRaw.split(",").map((e) => e.trim()).filter(Boolean)
    : config.email.reviewRecipients;
  if (recipients.length === 0) {
    console.log("No recipients configured — skipping email.");
    return;
  }

  const renderedBody = await marked.parse(markdownContent);
  const accent = config.branding.accentColor;
  const dark = config.branding.primaryDark;
  const repoSlug = getRepoSlugFromGit();

  const readingTime = Math.max(1, Math.round(brief.targetWordCount / 250));
  const wordCount = brief.targetWordCount.toLocaleString();
  const scheduledLabel = new Date(brief.scheduledDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const inlineImageSrc = imagePath && repoSlug
    ? `https://raw.githubusercontent.com/${repoSlug}/drafts/${brief.slug}/public${imagePath}`
    : null;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(brief.title)}</title>
<style>
  body { margin:0; padding:0; background:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color:${dark}; line-height:1.6; }
  .wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 48px; }
  .header { background:${dark}; color:#ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0; }
  .badge { display:inline-block; background:${accent}; color:#fff; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:4px 10px; border-radius: 999px; }
  .header h2 { margin: 12px 0 0; font-size: 20px; font-weight: 700; color:#ffffff; }
  .meta-grid { background: #ffffff; padding: 20px 24px; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; }
  .meta-row { display:flex; font-size: 13px; margin-bottom: 8px; }
  .meta-label { width: 140px; color:#6b7280; font-weight:600; }
  .meta-value { color:${dark}; }
  .actions { background:#ffffff; padding: 16px 24px 24px; border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; border-radius: 0 0 12px 12px; }
  .btn-primary { display:inline-block; background:${accent}; color:#ffffff !important; text-decoration:none; padding: 12px 22px; border-radius: 8px; font-weight:700; font-size: 14px; }
  .btn-secondary { display:inline-block; margin-left: 8px; color:${dark} !important; text-decoration:none; padding: 12px 22px; border-radius: 8px; border:1px solid #d4d4d8; font-weight:600; font-size: 14px; }
  .article { background:#ffffff; margin-top: 24px; padding: 32px 28px; border: 1px solid #e5e5e5; border-radius: 12px; }
  .article h1 { font-size: 28px; line-height: 1.2; margin: 0 0 16px; color:${dark}; }
  .article h2 { font-size: 22px; line-height: 1.25; margin: 32px 0 12px; color:${dark}; border-bottom: 2px solid #f4f4f5; padding-bottom: 8px; }
  .article h3 { font-size: 17px; line-height: 1.3; margin: 22px 0 8px; color:${dark}; }
  .article p { margin: 0 0 14px; color: #444444; font-size: 15px; }
  .article ul, .article ol { margin: 0 0 14px; padding-left: 22px; color:#444444; }
  .article li { margin-bottom: 6px; }
  .article a { color: ${accent}; text-decoration: underline; }
  .article strong { color: ${dark}; }
  .article table { width:100%; border-collapse: collapse; margin: 14px 0 18px; }
  .article th, .article td { border: 1px solid #e5e5e5; padding: 8px 10px; text-align: left; font-size: 14px; vertical-align: top; }
  .article th { background:#fafafa; font-weight:700; }
  .article blockquote { margin: 14px 0; padding: 10px 16px; border-left: 3px solid ${accent}; background: #fafafa; color:#444444; }
  .footer { text-align:center; color:#9ca3af; font-size: 12px; margin-top: 32px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <span class="badge">Draft for review</span>
      <h2>${escapeHtml(brief.title)}</h2>
    </div>
    ${inlineImageSrc ? `<img src="${inlineImageSrc}" alt="Featured image" style="width:100%; display:block; border-left:1px solid #e5e5e5; border-right:1px solid #e5e5e5;">` : ""}
    <div class="meta-grid">
      <div class="meta-row"><div class="meta-label">Scheduled to publish</div><div class="meta-value">${escapeHtml(scheduledLabel)}</div></div>
      <div class="meta-row"><div class="meta-label">Primary keyword</div><div class="meta-value"><code>${escapeHtml(brief.primaryKeyword)}</code></div></div>
      ${brief.relatedService ? `<div class="meta-row"><div class="meta-label">Target service</div><div class="meta-value">/services/${escapeHtml(brief.relatedService)}</div></div>` : ""}
      <div class="meta-row"><div class="meta-label">Word count</div><div class="meta-value">${wordCount} words — ~${readingTime} min read</div></div>
      ${brief.geoFocus ? `<div class="meta-row"><div class="meta-label">Geographic focus</div><div class="meta-value">${escapeHtml(brief.geoFocus)}</div></div>` : ""}
    </div>
    <div class="actions">
      <a class="btn-primary" href="${prUrl}">Review &amp; merge on GitHub</a>
      <a class="btn-secondary" href="${prUrl}">Open PR in browser</a>
    </div>
    <div class="article">
      ${renderedBody}
    </div>
    <div class="footer">
      Auto-generated by ${escapeHtml(config.site.brand.short)}'s weekly blog pipeline. Close the PR to reject this draft.<br>
      Merging publishes the post on ${escapeHtml(scheduledLabel)}.
    </div>
  </div>
</body>
</html>`;

  let attachments: Array<{ filename: string; content: string }> | undefined;
  if (imagePath) {
    const localPath = resolve(REPO_ROOT, "public" + imagePath);
    if (existsSync(localPath)) {
      const buf = readFileSync(localPath);
      attachments = [
        {
          filename: `blog-${brief.slug}.png`,
          content: buf.toString("base64"),
        },
      ];
      console.log(`Attaching ${localPath} (${buf.length} bytes) to email`);
    }
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.DRAFT_FROM_EMAIL || config.email.fromAddress;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: recipients,
    subject: `New blog draft ready: ${brief.title}`,
    html,
    ...(attachments && { attachments }),
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Failed to send draft email: ${JSON.stringify(error)}`);
  }
  console.log(`Draft email sent to ${recipients.join(", ")} (id: ${data?.id})`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ──────────── Git / PR ────────────

function run(cmd: string): string {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
}

function createDraftPR(
  config: BlogConfig,
  brief: Brief,
  imagePath: string | null,
  seoNotes: string,
  faqCount: number,
): string {
  const branch = `drafts/${brief.slug}`;
  const botEmail = `noreply@${new URL(config.site.url).hostname}`;
  const botName = `${config.site.brand.short} Bot`;

  try {
    run("git config user.email");
  } catch {
    run(`git config user.email "${botEmail}"`);
    run(`git config user.name "${botName}"`);
  }

  console.log(`Creating branch ${branch}`);
  try { run(`git branch -D ${branch}`); } catch { /* branch didn't exist */ }
  run(`git checkout -b ${branch}`);
  const pathsToAdd = ["lib/blog/data.ts", "content/post-queue.json"];
  if (imagePath) {
    pathsToAdd.push(`public${imagePath}`);
  }
  run(`git add ${pathsToAdd.join(" ")}`);

  const commitMsg = `Draft: ${brief.title}

Auto-generated blog post for ${brief.scheduledDate}.
Primary keyword: ${brief.primaryKeyword}
Model: ${MODEL}

This post is scheduled to auto-publish on ${brief.scheduledDate}.
Review, edit inline, and merge this PR before the scheduled date.
`;
  const commitMsgPath = "/tmp/draft-commit-msg.txt";
  writeFileSync(commitMsgPath, commitMsg);
  run(`git commit -F ${commitMsgPath}`);
  run(`git push --force origin ${branch}`);

  const repoSlug = getRepoSlugFromGit();
  const imageSection = imagePath && repoSlug
    ? `## Featured image

![Featured image](https://raw.githubusercontent.com/${repoSlug}/${branch}/public${imagePath})

Saved as \`public${imagePath}\` and wired to the post's \`featuredImage\` field.

`
    : "";

  const prBody = `## Auto-generated draft for ${brief.scheduledDate}

**Title:** ${brief.title}
**Primary keyword:** \`${brief.primaryKeyword}\`
${brief.relatedService ? `**Target service:** \`/services/${brief.relatedService}\`\n` : ""}**Target word count:** ${brief.targetWordCount}
**Generated with:** ${MODEL}

${imageSection}${seoNotes ? `## SEO Critique Pass Notes

${seoNotes}

**FAQs generated:** ${faqCount}

` : ""}## Review checklist

- [ ] Numbers are accurate
- [ ] Local references are correct (if applicable)
- [ ] Voice matches existing posts (second person, short sentences, specific)
- [ ] Internal links resolve to real URLs on the site
- [ ] CTA matches the brief
- [ ] No banned phrases from the style guide
- [ ] Headline and excerpt read well

## How to edit

- **Inline via GitHub UI:** click any line in the diff and choose "Edit file"
- **Locally:** \`git fetch && git checkout ${branch}\` then edit \`lib/blog/data.ts\`

## When to merge

Merge anytime before **${brief.scheduledDate}**. The post stays hidden on the site until its scheduled date arrives, then the Monday scheduled rebuild makes it live.

If the draft is bad, close this PR without merging. The brief stays in the queue for next week.
`;
  const prBodyPath = "/tmp/draft-pr-body.md";
  writeFileSync(prBodyPath, prBody);

  let prUrl: string;
  const existingPr = (() => {
    try {
      return run(`gh pr list --head ${branch} --json url -q '.[0].url'`);
    } catch {
      return "";
    }
  })();

  if (existingPr) {
    console.log(`PR already exists at ${existingPr} — updating body instead of creating`);
    run(`gh pr edit ${existingPr} --body-file ${prBodyPath}`);
    prUrl = existingPr;
  } else {
    prUrl = run(
      `gh pr create --title "Draft: ${brief.title.slice(0, 80)}" --body-file ${prBodyPath}`,
    );
    console.log(`PR created: ${prUrl}`);
  }
  return prUrl;
}

// ──────────── Main ────────────

async function main(): Promise<void> {
  const config = await loadBlogConfig();

  console.log("Building site inventory...");
  execSync("npx tsx scripts/build-site-inventory.ts", {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });

  const queue = loadQueue();
  const next = findNextQueued(queue);

  if (!next) {
    console.log("No queued posts remaining. Nothing to draft.");
    return;
  }

  console.log(`Next post: ${next.title}`);
  console.log(`Scheduled: ${next.scheduledDate}`);
  console.log(`Status: ${next.status}`);
  console.log("");

  const draft = await generatePost(config, next);
  const { revisedPost, faqs, seoNotes } = await critiqueAndRevise(config, next, draft);

  console.log(`FAQs generated: ${faqs.length}`);
  if (seoNotes) {
    console.log("\nSEO notes from critique pass:\n" + seoNotes);
  }

  const finalContent = revisedPost;

  if (IS_DRY_RUN) {
    console.log("\n──────────── DRY RUN — final content ────────────\n");
    console.log(finalContent);
    console.log("\n──────────── FAQs ────────────\n");
    console.log(JSON.stringify(faqs, null, 2));
    console.log("\n──────────── END DRY RUN ────────────\n");
    return;
  }

  insertPostIntoBlogData(next, finalContent, faqs);

  let imagePath: string | null = null;
  try {
    const imgResult = await generateFeaturedImage(config, next);
    imagePath = imgResult.imagePath;
    addFeaturedImageToBlogData(next.slug, imagePath);
  } catch (err) {
    console.error("Featured image generation failed — proceeding without image:", err);
  }

  const updatedQueue = queue.map((b) =>
    b.slug === next.slug ? { ...b, status: "drafted" as const } : b,
  );
  saveQueue(updatedQueue);
  console.log(`Updated ${next.slug} status: queued → drafted`);

  const prUrl = createDraftPR(config, next, imagePath, seoNotes, faqs.length);

  try {
    await sendDraftEmail(config, next, finalContent, prUrl, imagePath);
  } catch (err) {
    console.error("Draft email failed but PR is live:", err);
  }

  console.log("\nDone. Review and merge the PR before the scheduled publish date.");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
