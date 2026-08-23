import type { Config } from "drizzle-kit";

// `drizzle-kit generate` reads only `schema` and `out` — it diffs against the
// committed migration history, so it needs no database connection. `migrate`
// and `studio` do need DATABASE_URL.
export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL ?? "",
  },
} satisfies Config;
