import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Bearer-token check for the machine-only endpoints under
 * /api/review-requests (the Netlify cron and the GitHub health check).
 */
export function isCronAuthorized(request: Request): boolean {
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
