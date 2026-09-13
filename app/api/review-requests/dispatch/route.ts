import { NextResponse } from "next/server";
import { dispatchReviewEmails } from "@/lib/reviews/dispatch";
import { isCronAuthorized } from "@/lib/reviews/cron-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function run(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limitParam = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

  try {
    const result = await dispatchReviewEmails({ dryRun, limit });
    console.log("[review-dispatch]", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (err) {
    console.error("[review-dispatch] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Dispatch failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return run(request);
}

// GET is allowed so the run can be triggered by hand from a terminal.
export async function GET(request: Request) {
  return run(request);
}
