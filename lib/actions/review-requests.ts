"use server";

import { revalidatePath } from "next/cache";
import { dashboardAuthError as requireAuth } from "@/lib/auth/guard";
import {
  createReviewRequest,
  getReviewSettings,
  getSuppression,
  lastContact,
  stopRequest,
  suppressEmail,
  type CreateRequestInput,
} from "@/lib/reviews/queries";

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * `canOverride` marks a repeat-customer warning: the form offers "Add anyway".
 * An unsubscribe is never overridable.
 */
export type AddResult = { ok: true } | { ok: false; error: string; canOverride?: boolean };

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

function windowLabel(days: number): string {
  if (days % 365 === 0) return days === 365 ? "year" : `${days / 365} years`;
  if (days % 30 === 0) return `${days / 30} months`;
  return `${days} days`;
}

/**
 * Server Actions are publicly reachable endpoints — the layout gate protects
 * the *page*, not the action. Every mutation re-checks the session itself
 * (requireAuth, from lib/auth/guard.ts).
 */
export async function addReviewRequest(
  input: CreateRequestInput,
  options: { allowRepeat?: boolean } = {},
): Promise<AddResult> {
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
    const firstName = name.split(/\s+/)[0];

    // An unsubscribe outlives the request it came from. Adding them anyway
    // would create a row that sits "Active" forever and never sends.
    const suppression = await getSuppression(email);
    if (suppression) {
      return {
        ok: false,
        error: `${firstName} unsubscribed from these emails on ${shortDate(suppression.createdAt)}, so they can't be asked again.`,
      };
    }

    if (!options.allowRepeat) {
      const { repeatWindowDays } = await getReviewSettings();
      const contact = await lastContact(email);

      if (contact.activeSince) {
        return {
          ok: false,
          canOverride: true,
          error: `${firstName} already has review emails going out (added ${shortDate(contact.activeSince)}). Adding them again starts a second set.`,
        };
      }

      const windowMs = repeatWindowDays * 86_400_000;
      if (
        repeatWindowDays > 0 &&
        contact.lastEmailedAt &&
        Date.now() - contact.lastEmailedAt.getTime() < windowMs
      ) {
        return {
          ok: false,
          canOverride: true,
          error: `${firstName} was last asked on ${shortDate(contact.lastEmailedAt)}. Your settings skip anyone asked in the last ${windowLabel(repeatWindowDays)}.`,
        };
      }
    }

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
