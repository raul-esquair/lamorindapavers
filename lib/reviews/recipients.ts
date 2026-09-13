/**
 * Where review-email replies and unhappy-customer alerts go when the fields
 * on /dashboard/settings are left blank — Steve's own inbox, where he
 * actually reads mail.
 *
 * Kept out of submit-feedback.ts because a "use server" module may only
 * export async functions.
 */
export const DEFAULT_REPLY_TO = "stevebarsanti@icloud.com";
export const DEFAULT_ALERT_TO = "stevebarsanti@icloud.com";
