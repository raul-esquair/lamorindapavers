import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export * from "./schema";

/**
 * Netlify's Neon integration injects NETLIFY_DATABASE_URL. DATABASE_URL is
 * honoured first so a local .env can point at a scratch database.
 *
 * Both are pooled HTTP endpoints — the Neon serverless driver talks over
 * HTTP rather than holding a TCP connection, which is why this is safe to
 * call from serverless functions without a connection pool.
 */
function connectionString(): string {
  const url = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;
  if (!url) {
    throw new Error(
      "No database URL. Set DATABASE_URL locally, or enable the Neon integration on Netlify (which sets NETLIFY_DATABASE_URL).",
    );
  }
  return url;
}

let cached: ReturnType<typeof createClient> | undefined;

function createClient() {
  return drizzle(neon(connectionString()), { schema });
}

/**
 * Lazy on purpose. The site prerenders 50+ static pages at build time and
 * most of them never touch the database — resolving the connection at
 * import time would fail those builds whenever the env var is absent.
 */
export function getDb() {
  cached ??= createClient();
  return cached;
}
