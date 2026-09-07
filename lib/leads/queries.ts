import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, type Lead, type NewLead } from "@/lib/db/schema";

/**
 * Persist a quote submission.
 *
 * Returns `null` instead of throwing. The caller is a form submission whose
 * critical path is the email to Steve — a lead lost because Neon was briefly
 * unreachable is a worse outcome than every failure mode this table exists to
 * fix. Swallowing here rather than at the call site keeps that guarantee in
 * one place instead of relying on every future caller to remember it.
 */
export async function createLead(input: NewLead): Promise<Lead | null> {
  try {
    const db = getDb();
    const [row] = await db.insert(leads).values(input).returning();
    return row ?? null;
  } catch (err) {
    console.error("createLead failed:", err);
    return null;
  }
}

/** Newest first, for the dashboard. */
export async function listLeads(limit = 100): Promise<Lead[]> {
  const db = getDb();
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}
