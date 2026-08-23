import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";
import { dispatchReviewEmails } from "@/lib/reviews/dispatch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!presented) return false;

  // Hash both sides so the buffers are equal length — timingSafeEqual throws
  // on a length mismatch, which would itself leak the secret's length.
  const a = createHash("sha256").update(presented).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}

async function run(request: Request) {
  if (!authorized(request)) {
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
