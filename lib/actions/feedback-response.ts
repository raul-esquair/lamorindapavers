"use server";

import { getRequestByToken, markResponded } from "@/lib/reviews/queries";

/**
 * The kill switch. Called the instant a customer picks a face — deliberately
 * not on form submit, because most people who choose a positive face go
 * straight to Google and never come back to the page.
 *
 * Never throws and returns nothing useful to the caller: this must not be
 * able to block or break the customer's flow. A failure here costs an extra
 * email, which is far cheaper than a broken feedback page.
 */
export async function recordFeedbackResponse(token: string, rating: number): Promise<void> {
  if (!token || !Number.isInteger(rating) || rating < 1 || rating > 4) return;

  try {
    await markResponded(token, rating);
  } catch (err) {
    console.error("recordFeedbackResponse failed:", err);
  }
}

export interface FeedbackPrefill {
  name: string;
  email: string;
}

/**
 * Name and email for a known review request, so the private-feedback form can
 * be prefilled. Returns null for an unknown token or any failure — the page
 * must work identically without it.
 */
export async function getFeedbackPrefill(token: string): Promise<FeedbackPrefill | null> {
  if (!token) return null;

  try {
    const request = await getRequestByToken(token);
    return request ? { name: request.name, email: request.email } : null;
  } catch (err) {
    console.error("getFeedbackPrefill failed:", err);
    return null;
  }
}
