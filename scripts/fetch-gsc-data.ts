/**
 * Google Search Console API client.
 *
 * Pulls query + page performance data for the site configured in
 * blog.config.ts. Used by propose-next-batch.ts to inform content decisions
 * with real ranking data: what's getting impressions, what's close to page
 * 1, what's ranking poorly for valuable queries, etc.
 *
 * Auth: service account JSON, base64-encoded in GSC_SERVICE_ACCOUNT_JSON_BASE64
 *       env var. The service account must be added as a user in the Search
 *       Console property, AND the Search Console API must be enabled on the
 *       GCP project that owns the service account.
 *
 * Returns `{ summary, topQueries, topPages, opportunities, newSite }`.
 * Gracefully degrades when no data is available yet (site just launched).
 */

import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { loadBlogConfig } from "../lib/blog-config";

const LOOKBACK_DAYS = 90;
const MAX_ROWS = 100;

export interface GscQuery {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscReport {
  newSite: boolean;
  summary: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    dataStartDate: string;
    dataEndDate: string;
  };
  topQueries: GscQuery[];
  topPages: GscQuery[];
  opportunities: {
    /** Keywords ranking on page 2 or 3 (positions 11-30) with decent impressions — prime refresh candidates. */
    closeToPage1: GscQuery[];
    /** Keywords with high impressions but low CTR — candidates for title/meta rewrite. */
    lowCtr: GscQuery[];
    /** Pages getting impressions but no clicks at all — candidates for content refresh or supporting content. */
    impressionsNoClicks: GscQuery[];
  };
}

function getAuth(): JWT {
  const base64Key = process.env.GSC_SERVICE_ACCOUNT_JSON_BASE64;
  if (!base64Key) {
    throw new Error(
      "GSC_SERVICE_ACCOUNT_JSON_BASE64 environment variable is required",
    );
  }
  const decoded = Buffer.from(base64Key, "base64").toString("utf-8");
  const creds = JSON.parse(decoded);
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function queryGsc(
  siteUrl: string,
  dimensions: string[],
): Promise<
  Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>
> {
  const auth = getAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });
  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: isoDate(LOOKBACK_DAYS),
      endDate: isoDate(1),
      dimensions,
      rowLimit: MAX_ROWS,
    },
  });
  return (response.data.rows ?? []) as Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

function rowToQuery(
  row: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number },
  dimensions: string[],
): GscQuery {
  const map: Record<string, string> = {};
  dimensions.forEach((d, i) => (map[d] = row.keys[i]));
  return {
    query: map.query || "",
    page: map.page || "",
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  };
}

export async function fetchGscReport(): Promise<GscReport> {
  const config = await loadBlogConfig();
  // Property identifier for the Search Console API. Prefer an explicit override
  // (needed for Domain properties, which use the `sc-domain:example.com` form);
  // otherwise fall back to the URL-prefix form with trailing slash.
  const siteUrl =
    process.env.GSC_PROPERTY_URL ??
    (config.site.url.endsWith("/") ? config.site.url : `${config.site.url}/`);

  let queryRows: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> = [];
  let pageRows: typeof queryRows = [];
  let totalsRows: typeof queryRows = [];

  try {
    [queryRows, pageRows, totalsRows] = await Promise.all([
      queryGsc(siteUrl, ["query", "page"]),
      queryGsc(siteUrl, ["page"]),
      // Dimensionless query — the ONLY row that reflects true site totals.
      queryGsc(siteUrl, []),
    ]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found") || msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
      throw new Error(
        `Search Console returned permission denied. Verify (a) the Search Console API is enabled on the GCP project that owns the service account, and (b) the service account email has been added as a user in Search Console for ${siteUrl}. Original: ${msg}`,
      );
    }
    throw err;
  }

  const topQueries = queryRows.map((r) => rowToQuery(r, ["query", "page"]));
  const topPages = pageRows.map((r) => rowToQuery(r, ["page"]));

  const closeToPage1 = topQueries
    .filter((q) => q.position > 10 && q.position <= 30 && q.impressions >= 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  const lowCtr = topQueries
    .filter((q) => q.impressions >= 50 && q.position <= 10 && q.ctr < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  const impressionsNoClicks = topPages
    .filter((p) => p.impressions >= 10 && p.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  // Totals come from the dimensionless row, NOT from summing topQueries.
  // Summing query rows understates everything twice over: Search Console
  // withholds low-volume queries for privacy (they simply aren't in the
  // response), and MAX_ROWS truncates whatever survives. On the sibling
  // gadgetconstruction property this read as 13 clicks / 215 impressions
  // against a true 31 / 1,358 — a ~6x undercount, on the report that feeds
  // content planning. Averaging the per-row `position` field was wrong for
  // the same reason, and unweighted besides.
  const totals = totalsRows[0];
  const totalClicks = totals?.clicks ?? 0;
  const totalImpressions = totals?.impressions ?? 0;
  const avgCtr = totals?.ctr ?? 0;
  const avgPosition = totals?.position ?? 0;

  return {
    newSite: totalImpressions === 0,
    summary: {
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
      dataStartDate: isoDate(LOOKBACK_DAYS),
      dataEndDate: isoDate(1),
    },
    topQueries: topQueries.slice(0, 30),
    topPages: topPages.slice(0, 15),
    opportunities: {
      closeToPage1,
      lowCtr,
      impressionsNoClicks,
    },
  };
}

// Standalone invocation — print the report JSON
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchGscReport()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2));
    })
    .catch((err) => {
      console.error("FAILED:", err);
      process.exit(1);
    });
}
