/**
 * The SMS opt-in wording shown on the quote forms.
 *
 * This exact string is stored on every lead row that ticks the box —
 * `leads.sms_consent_text`, not a version number. The wording will be edited;
 * rows written before an edit must keep what was actually on screen at the
 * time, because in a dispute a stored boolean proves nothing. What matters is
 * what they agreed to and when.
 *
 * ⚠️ It is also submitted to the carriers during A2P 10DLC registration
 * (phase 002), which asks to see the opt-in flow. Changing it after
 * registration means the live site no longer matches what was filed.
 */
export const SMS_CONSENT_TEXT =
  "Text me about scheduling my estimate. Message and data rates may apply. " +
  "Reply STOP to opt out. Consent is not a condition of purchase.";

/** Shown under the checkbox — shorter, for the label itself. */
export const SMS_CONSENT_LABEL = "Text me about scheduling my estimate";
