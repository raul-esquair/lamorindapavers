import { randomBytes } from "node:crypto";
import { and, desc, eq, inArray, lte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  emailSuppressions,
  leads,
  reviewRequests,
  reviewTouches,
  type LeadStatus,
  type NewLead,
  type ReviewRequest,
  type StoppedReason,
  type SuppressionReason,
} from "@/lib/db/schema";
import { todayInBusinessTz } from "./dates";
import { isSequenceComplete, nextDueTouch, resolveStartAt, type TouchNumber } from "./schedule";

/** 16 URL-safe chars from 12 random bytes. Unguessable, carries no PII. */
export function generateToken(): string {
  return randomBytes(12).toString("base64url");
}

export interface CreateRequestInput {
  name: string;
  email: string;
  phone?: string | null;
  projectType?: string | null;
  completedAt?: string | null;
  /** Override the computed first-send date. */
  startAt?: string | null;
  notes?: string | null;
}

export async function createReviewRequest(input: CreateRequestInput): Promise<ReviewRequest> {
  const db = getDb();
  const today = todayInBusinessTz();
  const completedAt = input.completedAt || null;

  const [row] = await db
    .insert(reviewRequests)
    .values({
      token: generateToken(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      projectType: input.projectType?.trim() || null,
      completedAt,
      startAt: input.startAt || resolveStartAt(completedAt, today),
      notes: input.notes?.trim() || null,
    })
    .returning();

  return row;
}

export async function getRequestByToken(token: string): Promise<ReviewRequest | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(reviewRequests)
    .where(eq(reviewRequests.token, token))
    .limit(1);
  return row ?? null;
}

/**
 * The kill switch. Called the moment a customer picks a face on /feedback —
 * deliberately not on form submit, because most people who pick a positive
 * face go straight to Google and never come back to the page.
 *
 * Idempotent: a second click won't overwrite the original response.
 */
export async function markResponded(token: string, rating: number): Promise<boolean> {
  const db = getDb();
  const result = await db
    .update(reviewRequests)
    .set({
      respondedAt: new Date(),
      rating,
      status: "stopped",
      stoppedReason: "responded",
      stoppedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(reviewRequests.token, token), sql`${reviewRequests.respondedAt} is null`))
    .returning({ id: reviewRequests.id });

  return result.length > 0;
}

export async function stopRequest(id: string, reason: StoppedReason): Promise<void> {
  const db = getDb();
  await db
    .update(reviewRequests)
    .set({ status: "stopped", stoppedReason: reason, stoppedAt: new Date(), updatedAt: new Date() })
    .where(eq(reviewRequests.id, id));
}

/**
 * Record a send. Relies on the unique index on (request_id, n) — a concurrent
 * or repeated call inserts nothing rather than sending twice. Returns false
 * if this touch had already been recorded.
 */
export async function recordTouch(
  requestId: string,
  n: TouchNumber,
  providerId?: string,
): Promise<boolean> {
  const db = getDb();
  const inserted = await db
    .insert(reviewTouches)
    .values({ requestId, n, providerId: providerId ?? null })
    .onConflictDoNothing()
    .returning({ id: reviewTouches.id });

  return inserted.length > 0;
}

/**
 * Fill in the provider's message id after a successful send.
 *
 * The touch row is written *before* the send (see dispatch.ts) so a crash
 * can't cause a duplicate — which means the id isn't known yet at insert
 * time. This backfills it so a specific email can be traced in Resend.
 * Best-effort: a failure here must never fail the send.
 */
export async function attachProviderId(
  requestId: string,
  n: TouchNumber,
  providerId: string,
): Promise<void> {
  const db = getDb();
  await db
    .update(reviewTouches)
    .set({ providerId })
    .where(and(eq(reviewTouches.requestId, requestId), eq(reviewTouches.n, n)));
}

export interface DueRequest {
  request: ReviewRequest;
  touch: TouchNumber;
}

/**
 * Requests with a touch due today, capped. The cap is a deliberate
 * deliverability guard: importing 40 past customers should drain over days
 * rather than emit 40 emails from a domain that normally sends a handful.
 */
export async function findDueRequests(limit: number): Promise<DueRequest[]> {
  const db = getDb();
  const today = todayInBusinessTz();

  const candidates = await db
    .select()
    .from(reviewRequests)
    .where(and(eq(reviewRequests.status, "active"), lte(reviewRequests.startAt, today)))
    .orderBy(reviewRequests.startAt);

  if (candidates.length === 0) return [];

  const sent = await db
    .select({ requestId: reviewTouches.requestId, n: reviewTouches.n })
    .from(reviewTouches)
    .where(
      inArray(
        reviewTouches.requestId,
        candidates.map((c) => c.id),
      ),
    );

  const byRequest = new Map<string, number[]>();
  for (const t of sent) {
    byRequest.set(t.requestId, [...(byRequest.get(t.requestId) ?? []), t.n]);
  }

  const suppressed = await suppressedEmails(candidates.map((c) => c.email));

  const due: DueRequest[] = [];
  for (const request of candidates) {
    if (suppressed.has(request.email)) continue;

    const already = byRequest.get(request.id) ?? [];
    const touch = nextDueTouch(request.startAt, already, today);
    if (touch === null) continue;

    due.push({ request, touch });
    if (due.length >= limit) break;
  }

  return due;
}

/** Close out sequences whose third touch has been sent. */
export async function closeCompletedSequences(): Promise<number> {
  const db = getDb();
  const active = await db
    .select({ id: reviewRequests.id })
    .from(reviewRequests)
    .where(eq(reviewRequests.status, "active"));

  if (active.length === 0) return 0;

  const sent = await db
    .select({ requestId: reviewTouches.requestId, n: reviewTouches.n })
    .from(reviewTouches)
    .where(
      inArray(
        reviewTouches.requestId,
        active.map((a) => a.id),
      ),
    );

  const byRequest = new Map<string, number[]>();
  for (const t of sent) {
    byRequest.set(t.requestId, [...(byRequest.get(t.requestId) ?? []), t.n]);
  }

  const done = active.filter((a) => isSequenceComplete(byRequest.get(a.id) ?? []));
  if (done.length === 0) return 0;

  await db
    .update(reviewRequests)
    .set({
      status: "stopped",
      stoppedReason: "complete",
      stoppedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      inArray(
        reviewRequests.id,
        done.map((d) => d.id),
      ),
    );

  return done.length;
}

export interface RequestWithTouches extends ReviewRequest {
  touchCount: number;
  lastSentAt: Date | null;
}

/** Dashboard list view. */
export async function listRequests(): Promise<RequestWithTouches[]> {
  const db = getDb();
  const rows = await db
    .select({
      request: reviewRequests,
      touchCount: sql<number>`count(${reviewTouches.id})::int`,
      lastSentAt: sql<Date | null>`max(${reviewTouches.sentAt})`,
    })
    .from(reviewRequests)
    .leftJoin(reviewTouches, eq(reviewTouches.requestId, reviewRequests.id))
    .groupBy(reviewRequests.id)
    .orderBy(desc(reviewRequests.createdAt));

  return rows.map((r) => ({ ...r.request, touchCount: r.touchCount, lastSentAt: r.lastSentAt }));
}

export async function suppressEmail(email: string, reason: SuppressionReason): Promise<void> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();

  await db
    .insert(emailSuppressions)
    .values({ email: normalized, reason })
    .onConflictDoNothing();

  await db
    .update(reviewRequests)
    .set({
      status: "stopped",
      stoppedReason: reason === "bounced" ? "bounced" : "unsubscribed",
      stoppedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(reviewRequests.email, normalized), eq(reviewRequests.status, "active")));
}

async function suppressedEmails(emails: string[]): Promise<Set<string>> {
  if (emails.length === 0) return new Set();
  const db = getDb();
  const rows = await db
    .select({ email: emailSuppressions.email })
    .from(emailSuppressions)
    .where(inArray(emailSuppressions.email, emails));
  return new Set(rows.map((r) => r.email));
}

export async function createLead(input: NewLead) {
  const db = getDb();
  const [row] = await db
    .insert(leads)
    .values({ ...input, email: input.email.trim().toLowerCase() })
    .returning();
  return row;
}

export async function listLeads(status?: LeadStatus) {
  const db = getDb();
  const query = db.select().from(leads).orderBy(desc(leads.createdAt));
  return status ? query.where(eq(leads.status, status)) : query;
}
