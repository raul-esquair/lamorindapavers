import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "lp_dashboard";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const value = process.env.DASHBOARD_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "DASHBOARD_SESSION_SECRET is missing or too short (needs 32+ chars). Generate one with: openssl rand -hex 32",
    );
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * Compare two strings without leaking length or content through timing.
 * Both sides are hashed first so the buffers are always equal length —
 * timingSafeEqual throws on a length mismatch, which would itself be a
 * signal.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", secret()).update(a).digest();
  const hb = createHmac("sha256", secret()).update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    throw new Error("DASHBOARD_PASSWORD is not set.");
  }
  return safeEqual(candidate, expected);
}

/** Cookie value: "<expiresAt>.<nonce>.<hmac>". Stateless — no session table. */
export function createSessionToken(now: number = Date.now()): string {
  const expiresAt = now + SESSION_TTL_MS;
  const nonce = randomBytes(8).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAtRaw, nonce, signature] = parts;
  const payload = `${expiresAtRaw}.${nonce}`;

  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(expiresAtRaw);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
