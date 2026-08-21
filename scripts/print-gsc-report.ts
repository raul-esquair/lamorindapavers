/**
 * Read-only: fetch the GSC report and print a human-readable summary.
 * Run with the key loaded: `set -a; source .env; set +a; npx tsx scripts/print-gsc-report.ts`
 */
import { fetchGscReport } from "./fetch-gsc-data";

async function main() {
  const r = await fetchGscReport();
  if (r.newSite) {
    console.log("GSC reports NEW SITE / no data yet for the property.");
    return;
  }
  const s = r.summary;
  console.log(`\n=== SUMMARY (${s.dataStartDate} → ${s.dataEndDate}) ===`);
  console.log(`Clicks: ${s.totalClicks} | Impressions: ${s.totalImpressions} | CTR: ${(s.avgCtr * 100).toFixed(2)}% | Avg pos: ${s.avgPosition.toFixed(1)}`);

  console.log(`\n=== TOP QUERIES ===`);
  for (const q of r.topQueries.slice(0, 15)) {
    console.log(`${q.clicks}c ${q.impressions}i pos${q.position.toFixed(1)}  "${q.query}"`);
  }

  console.log(`\n=== TOP PAGES ===`);
  for (const p of r.topPages.slice(0, 10)) {
    console.log(`${p.clicks}c ${p.impressions}i pos${p.position.toFixed(1)}  ${p.page}`);
  }

  console.log(`\n=== OPPORTUNITIES: close to page 1 (pos 11–30) ===`);
  for (const q of r.opportunities.closeToPage1.slice(0, 10)) {
    console.log(`pos${q.position.toFixed(1)} ${q.impressions}i  "${q.query}"`);
  }
  console.log(`\n=== OPPORTUNITIES: high impressions, low CTR ===`);
  for (const q of r.opportunities.lowCtr.slice(0, 10)) {
    console.log(`${q.impressions}i ${(q.ctr * 100).toFixed(1)}%CTR pos${q.position.toFixed(1)}  "${q.query}"`);
  }
}

main().catch((e) => {
  console.error("FETCH FAILED:", e?.message || e);
  process.exit(1);
});
