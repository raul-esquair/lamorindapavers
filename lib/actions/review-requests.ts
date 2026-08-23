"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth/guard";
import {
  createReviewRequest,
  stopRequest,
  suppressEmail,
  type CreateRequestInput,
} from "@/lib/reviews/queries";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Server Actions are publicly reachable endpoints — the layout gate protects
 * the *page*, not the action. Every mutation re-checks the session itself.
 */
async function requireAuth(): Promise<string | null> {
  return (await isAuthenticated()) ? null : "Your session expired. Please sign in again.";
}

export async function addReviewRequest(input: CreateRequestInput): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return { ok: false, error: denied };

  const name = input.name?.trim();
  const email = input.email?.trim();

  if (!name) return { ok: false, error: "Customer name is required." };
  if (!email) return { ok: false, error: "Email is required — that's where the request is sent." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That doesn't look like a valid email address." };
  }

  try {
    await createReviewRequest({ ...input, name, email });
  } catch (err) {
    console.error("addReviewRequest failed:", err);
    return { ok: false, error: "Could not save. Please try again." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function stopFollowUps(id: string): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return { ok: false, error: denied };

  try {
    await stopRequest(id, "manual");
  } catch (err) {
    console.error("stopFollowUps failed:", err);
    return { ok: false, error: "Could not stop follow-ups. Please try again." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function unsubscribeCustomer(email: string): Promise<ActionResult> {
  const denied = await requireAuth();
  if (denied) return { ok: false, error: denied };

  try {
    await suppressEmail(email, "manual");
  } catch (err) {
    console.error("unsubscribeCustomer failed:", err);
    return { ok: false, error: "Could not suppress this address. Please try again." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
