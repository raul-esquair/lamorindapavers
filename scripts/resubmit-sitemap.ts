/**
 * Nudge Google to re-fetch the sitemap after a publish. This is the only
 * legitimate "re-crawl" signal available via API — the old anonymous sitemap
 * ping was removed by Google in 2023, and there is no public request-indexing
 * API. Authenticated sitemaps.submit still works and re-queues the sitemap.
 *
 * Needs (already used elsewhere in CI):
 *   GSC_SERVICE_ACCOUNT_JSON_BASE64 — service-account key (Full user on property)
 *   GSC_PROPERTY_URL                — e.g. sc-domain:lamorindapaving.com
 *
 * Best-effort: exits non-zero on failure so the workflow can continue-on-error.
 */
import { google } from "googleapis";

const SITEMAP_URL = "https://lamorindapaving.com/sitemap.xml";

async function main() {
  const base64 = process.env.GSC_SERVICE_ACCOUNT_JSON_BASE64;
  const siteUrl = process.env.GSC_PROPERTY_URL;
  if (!base64 || !siteUrl) {
    throw new Error(
      "GSC_SERVICE_ACCOUNT_JSON_BASE64 and GSC_PROPERTY_URL are required",
    );
  }
  const creds = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });
  const sc = google.webmasters({ version: "v3", auth });
  await sc.sitemaps.submit({ siteUrl, feedpath: SITEMAP_URL });
  console.log(`Resubmitted ${SITEMAP_URL} to ${siteUrl}`);
}

main().catch((e) => {
  console.error("resubmit-sitemap failed:", e?.message || e);
  process.exit(1);
});
