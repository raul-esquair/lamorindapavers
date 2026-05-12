/**
 * Copy this file to `blog.config.ts` and fill in the fields for your site.
 * `blog.config.ts` is gitignored — it's the single source of per-site variability.
 *
 * Quick start: run `npm run setup` and the wizard will create blog.config.ts
 * for you interactively. Or copy this file and edit by hand.
 */
import type { BlogConfig } from "@/lib/blog-config";

export const blogConfig: BlogConfig = {
  site: {
    url: "https://example.com",
    name: "Example Co",
    brand: {
      full: "Example Construction Inc.",
      short: "Example",
    },
    locale: "en-US",
  },

  // Voice profile — feeds the system prompt for AI drafting.
  // Be specific. "Direct, pain-point-first, no fluff" beats "professional".
  voice: {
    audience:
      "Homeowners researching X, Y, Z. Cost-conscious but not cheap; want quality.",
    tone: "Direct, specific, second-person. Short sentences. No filler adjectives.",
    mustAvoid: [
      "generic contractor language",
      "phrases like 'rest assured' or 'industry-leading'",
      "fluff adjectives (premier, top-tier, world-class)",
    ],
    mustInclude: [
      "specific neighborhoods or landmarks",
      "real numbers (cost ranges, timelines, percentages)",
      "second person — 'you/your', not 'our clients'",
    ],
    anchorPosts: 2, // Most recent N published posts pulled in as voice anchors during drafting
  },

  // Services drive related-service linking on blog posts AND seed the
  // site inventory the SEO critique pass uses for internal linking.
  services: [
    {
      slug: "service-a",
      name: "Service A",
      summary: "One-sentence description of Service A and who it's for.",
    },
    // Add more services...
  ],

  // OPTIONAL: city/region pages. Omit if the site doesn't have geography pages.
  // When present, the SEO pipeline will weave in city-specific internal links.
  geography: [
    {
      slug: "city-a",
      name: "City A",
      region: "Region 1",
      tier: 1, // 1=flagship, 2=market, 3=presence. Affects link weighting.
    },
    // Add more cities...
  ],

  // Drives CSS custom properties on blog UI. Override globally in app/globals.css
  // for more granular control.
  branding: {
    accentColor: "#CC0000",
    primaryDark: "#222222",
    fontHeading: "Inter",
    fontBody: "Inter",
  },

  email: {
    // Must be verified in Resend dashboard for sending to work.
    resendDomain: "example.com",
    fromAddress: "Drafts <drafts@example.com>",
    reviewRecipients: ["admin@example.com"],
  },

  // SEO tuning — defaults are sane, change only if you know why.
  seo: {
    internalLinksPerPost: { min: 12, max: 20 },
    exactMatchAnchorMaxPct: 25,
    faqsPerPost: { min: 5, max: 7 },
  },
};
