---
name: monthly-seo-doc
description: Generate a client-facing Word doc covering the next month of scheduled blog posts. Reads content/post-queue.json, picks the next 4 unpublished posts, writes custom client-facing rationale and target audience for each, and produces a polished .docx in the repo root. Brand context (name, color, license, etc.) comes from blog.config.ts.
---

# Monthly SEO Content Plan — Client Doc Generator

When the user invokes this skill, generate a client-ready Word document for the next month of blog publishing.

## Steps

### 1. Load brand context

Read `blog.config.ts`. Extract: `site.brand.full`, `site.brand.short`, `site.url`, `branding.accentColor`, `branding.primaryDark`. Optional: any `license` / `tagline` field the consumer added.

### 2. Read the queue

Read `content/post-queue.json`. Structure: array of brief objects with `slug`, `scheduledDate`, `status`, `title`, `primaryKeyword`, `outline`, etc.

### 3. Pick the posts for this month

Find all briefs where `status === "queued"` AND `scheduledDate >= today`, sorted ascending. Take the next 4.

- If fewer than 4 queued posts remain, use whatever's left.
- If 0 remain, tell the user all planned posts are covered and exit.

### 4. Figure out the month number

Count briefs with `status === "published"`, divide by 4, round up, add 1. Or honor an explicit user request ("generate month 3" → posts 9-12).

### 5. Write custom client copy for each post

For each selected post, compose two short paragraphs in the voice the consumer site uses (read `content/style-reference.md` for the lock):

**`clientRationale`** (3-4 sentences) — why this post wins. Touch on:
- Search intent of the primary keyword
- Competitive landscape (who else ranks)
- Specific business value (high CPC, low competition, cluster authority)
- What makes this site's version better than what's ranking

**`targetAudience`** (3-4 sentences) — who's reading:
- Typical neighborhood or region (use `citiesReferenced` if present)
- Income bracket / home value / project budget tier
- Project stage (researching, budgeting, comparing, urgent)
- Approximate ticket size

### 6. Assemble the payload JSON

Write to `/tmp/skill-monthly-seo-payload.json`:

```json
{
  "brand": {
    "full": "Example Construction Inc.",
    "short": "Example",
    "url": "https://example.com",
    "license": "CA Lic #1132983",
    "accentColor": "#CC0000",
    "primaryDark": "#222222"
  },
  "monthNumber": 2,
  "dateRangeLabel": "May 4 – May 25, 2026",
  "posts": [
    {
      "brief": { ...full brief from post-queue.json... },
      "clientRationale": "...",
      "targetAudience": "..."
    }
  ]
}
```

`license` is optional — only include if the consumer has one configured.

### 7. Run the generator

```bash
python3 .claude/skills/monthly-seo-doc/generate.py \
  --payload /tmp/skill-monthly-seo-payload.json \
  --output ./SEO-Plan-Month-N.docx
```

Replace `N` with the month number. Output filename can be customized — including the brand short name is a nice touch (e.g., `Example-SEO-Month-2.docx`).

### 8. Confirm to the user

Report month number, date range, the post titles included, output file path. Suggest `open <path>`.

## Notes

- The Python script does all formatting — produce the payload, don't hand-format
- Don't modify `content/post-queue.json` — read-only here
- If the user gives extra guidance ("emphasize budget concerns", "client is worried about timing"), fold it into the rationale paragraphs
