"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { dashboardAuthError } from "@/lib/auth/guard";
import { todayInBusinessTz } from "@/lib/reviews/dates";
import { FROM } from "@/lib/reviews/dispatch";
import { renderReviewEmail, sampleCustomer, templateProblems, type EmailTemplate } from "@/lib/reviews/emails";
import { saveReviewSettings, setSendingPaused } from "@/lib/reviews/queries";
import { TOUCH_NUMBERS, type TouchNumber } from "@/lib/reviews/schedule";
import { isEmail, validateSettings, type EditableSettings, type SettingsErrors } from "@/lib/reviews/settings";

export type SaveSettingsResult = { ok: true } | { ok: false; error: string; errors?: SettingsErrors };

export async function saveSettings(input: EditableSettings): Promise<SaveSettingsResult> {
  const denied = await dashboardAuthError();
  if (denied) return { ok: false, error: denied };

  const result = validateSettings(input);
  if (!result.ok) return { ok: false, error: "Some settings need fixing.", errors: result.errors };

  try {
    await saveReviewSettings(result.value);
  } catch (err) {
    console.error("saveSettings failed:", err);
    return { ok: false, error: "Could not save. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function setPaused(paused: boolean): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await dashboardAuthError();
  if (denied) return { ok: false, error: denied };

  try {
    await setSendingPaused(paused);
  } catch (err) {
    console.error("setPaused failed:", err);
    return { ok: false, error: "Could not change sending. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

/**
 * Send one email, as currently typed on the settings page (saved or not), to
 * an address Steve chooses. A made-up customer fills in the fields, and the
 * empty token makes its links point at the bare /feedback and /unsubscribe
 * pages, so clicking through records nothing against a real customer.
 */
export async function sendTestEmail(input: {
  touch: TouchNumber;
  template: EmailTemplate;
  to: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const denied = await dashboardAuthError();
  if (denied) return { ok: false, error: denied };

  const to = input.to?.trim().toLowerCase();
  if (!to || !isEmail(to)) return { ok: false, error: "Enter the email address to send the test to." };
  if (!TOUCH_NUMBERS.includes(input.touch)) return { ok: false, error: "Unknown email." };

  const problems = templateProblems(input.template);
  if (problems.length > 0) return { ok: false, error: problems.join(" ") };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Email sending isn't set up on this server (RESEND_API_KEY)." };

  const today = todayInBusinessTz();
  const email = renderReviewEmail(sampleCustomer(today), input.touch, today, input.template);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to,
      subject: `[Test] ${email.subject}`,
      text: email.text,
      html: email.html,
    });
    if (error) {
      console.error("sendTestEmail rejected:", error);
      return { ok: false, error: "The email service rejected the test. Please try again." };
    }
  } catch (err) {
    console.error("sendTestEmail failed:", err);
    return { ok: false, error: "Could not send the test. Please try again." };
  }

  return { ok: true };
}
