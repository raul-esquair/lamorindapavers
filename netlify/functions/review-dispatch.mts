import type { Config } from "@netlify/functions";

/**
 * Scheduled functions can't be invoked by URL and time out at 30s, so this
 * is a thin trigger: all the work happens in the app's own route handler,
 * where it can use the normal database and email modules. That route is also
 * reachable by hand for testing, which a scheduled function is not.
 */
const handler = async () => {
  const base = process.env.URL ?? process.env.DEPLOY_PRIME_URL;
  const secret = process.env.CRON_SECRET;

  if (!base || !secret) {
    console.error("[review-dispatch] missing URL or CRON_SECRET");
    return new Response("Not configured", { status: 500 });
  }

  const res = await fetch(`${base}/api/review-requests/dispatch`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });

  const body = await res.text();
  console.log(`[review-dispatch] ${res.status} ${body}`);

  return new Response(body, { status: res.status });
};

export default handler;

// 17:00 UTC — 10am Pacific in summer, 9am in winter. Deliberately mid-morning
// local: review requests sent overnight get buried by the morning's inbox.
export const config: Config = { schedule: "0 17 * * *" };
