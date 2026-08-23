"use server";

import { getRequestByToken, suppressEmail } from "@/lib/reviews/queries";

export type UnsubscribeResult = { ok: true } | { ok: false; error: string };

/**
 * Deliberately a POST-only action behind a confirmation button rather than
 * acting on page load. Corporate mail scanners (Outlook Safe Links and
 * friends) follow every URL in an email — a GET that unsubscribed on sight
 * would silently opt people out who never clicked anything.
 */
export async function confirmUnsubscribe(token: string): Promise<UnsubscribeResult> {
  if (!token) return { ok: false, error: "This link is missing its code." };

  try {
    const request = await getRequestByToken(token);
    if (!request) return { ok: false, error: "This link is no longer valid." };

    await suppressEmail(request.email, "unsubscribed");
    return { ok: true };
  } catch (err) {
    console.error("confirmUnsubscribe failed:", err);
    return { ok: false, error: "Something went wrong. Please reply to the email instead." };
  }
}
