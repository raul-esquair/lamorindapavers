/**
 * Blog config loader + validator.
 *
 * The consumer site provides blog.config.ts at the repo root. This module
 * imports it, validates the shape with zod, and re-exports a typed config
 * object that the rest of the blog engine consumes.
 *
 * Why zod: a typo in blog.config.ts shouldn't silently produce a broken
 * site. We want a friendly error message at startup time pointing at the
 * exact field that's wrong.
 */
import { z } from "zod";

const ServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase + dashes only"),
  name: z.string().min(1),
  summary: z.string().min(1),
});

const GeographySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase + dashes only"),
  name: z.string().min(1),
  region: z.string().min(1),
  tier: z.number().int().min(1).max(3).optional(),
});

export const BlogConfigSchema = z.object({
  site: z.object({
    url: z.string().url(),
    name: z.string().min(1),
    brand: z.object({
      full: z.string().min(1),
      short: z.string().min(1),
    }),
    locale: z.string().default("en-US"),
  }),

  voice: z.object({
    audience: z.string().min(1),
    tone: z.string().min(1),
    mustAvoid: z.array(z.string()).default([]),
    mustInclude: z.array(z.string()).default([]),
    anchorPosts: z.number().int().min(0).max(5).default(2),
  }),

  services: z.array(ServiceSchema).default([]),
  geography: z.array(GeographySchema).optional(),

  branding: z.object({
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex like #CC0000"),
    primaryDark: z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex like #222222"),
    fontHeading: z.string().default("Inter"),
    fontBody: z.string().default("Inter"),
  }),

  email: z.object({
    resendDomain: z.string().min(1, "must be verified in Resend"),
    fromAddress: z.string().min(1),
    reviewRecipients: z.array(z.string().email()).min(1),
  }),

  seo: z
    .object({
      internalLinksPerPost: z
        .object({
          min: z.number().int().default(12),
          max: z.number().int().default(20),
        })
        .default({ min: 12, max: 20 }),
      exactMatchAnchorMaxPct: z.number().min(0).max(100).default(25),
      faqsPerPost: z
        .object({
          min: z.number().int().default(5),
          max: z.number().int().default(7),
        })
        .default({ min: 5, max: 7 }),
    })
    .default({
      internalLinksPerPost: { min: 12, max: 20 },
      exactMatchAnchorMaxPct: 25,
      faqsPerPost: { min: 5, max: 7 },
    }),
});

export type BlogConfig = z.infer<typeof BlogConfigSchema>;

let cached: BlogConfig | null = null;

export async function loadBlogConfig(): Promise<BlogConfig> {
  if (cached) return cached;
  try {
    // Dynamic import via string so TS doesn't resolve statically — the file
    // is consumer-provided and may or may not exist at typecheck time.
    const modulePath = "@/blog.config";
    const mod = (await import(modulePath)) as {
      blogConfig?: unknown;
      default?: unknown;
    };
    const parsed = BlogConfigSchema.safeParse(mod.blogConfig ?? mod.default);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid blog.config.ts:\n${issues}\n\nSee blog.config.example.ts for the expected shape.`,
      );
    }
    cached = parsed.data;
    return cached;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Invalid blog.config")) {
      throw err;
    }
    throw new Error(
      "blog.config.ts not found at repo root. Copy blog.config.example.ts → blog.config.ts and fill in the fields. Or run `npm run setup`.",
    );
  }
}
