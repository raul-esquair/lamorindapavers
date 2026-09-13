import {
  DEFAULT_TEMPLATES,
  isDefaultTemplate,
  normalizeTemplate,
  templateProblems,
  type EmailTemplate,
} from "./emails";
import {
  DEFAULT_CADENCE,
  MAX_GAP_DAYS,
  MIN_GAP_DAYS,
  TOUCH_NUMBERS,
  type Cadence,
  type TouchNumber,
} from "./schedule";

/**
 * Everything Steve can change from /dashboard/settings. Pure — no database —
 * so the settings page validates with exactly the rules the server applies.
 *
 * Storage (lib/reviews/queries.ts) keeps one row where a null column means
 * "use the default here", so defaults live in code only and a fresh database
 * and a missing row behave identically.
 */
export interface ReviewSettings extends Cadence {
  paused: boolean;
  /** ISO timestamps. */
  pausedAt: string | null;
  resumedAt: string | null;
  /** Don't start a new sequence for someone emailed within this many days. 0 = off. */
  repeatWindowDays: number;
  templates: Record<TouchNumber, EmailTemplate>;
  /** Where replies to review emails go. Null = DEFAULT_REPLY_TO in dispatch.ts. */
  replyTo: string | null;
  /** Who gets unhappy-customer alerts from /feedback. Empty = DEFAULT_ALERT_TO in submit-feedback.ts. */
  alertEmails: string[];
}

/** 6 months — what Jobber and NiceJob both use. */
export const DEFAULT_REPEAT_WINDOW_DAYS = 180;

export const REPEAT_WINDOW_OPTIONS = [
  { days: 0, label: "Always ask (no limit)" },
  { days: 90, label: "3 months" },
  { days: 180, label: "6 months" },
  { days: 365, label: "1 year" },
] as const;

export const MAX_ALERT_EMAILS = 3;

export const DEFAULT_SETTINGS: ReviewSettings = {
  ...DEFAULT_CADENCE,
  paused: false,
  pausedAt: null,
  resumedAt: null,
  repeatWindowDays: DEFAULT_REPEAT_WINDOW_DAYS,
  templates: DEFAULT_TEMPLATES,
  replyTo: null,
  alertEmails: [],
};

/** The fields the settings form saves. Pausing has its own switch and action. */
export type EditableSettings = Pick<
  ReviewSettings,
  "emailCount" | "gapDays" | "skipWeekends" | "repeatWindowDays" | "templates" | "replyTo" | "alertEmails"
>;

export type SettingsField =
  | "emailCount"
  | "gap2"
  | "gap3"
  | "repeatWindowDays"
  | "template1"
  | "template2"
  | "template3"
  | "replyTo"
  | "alertEmails";

export type SettingsErrors = Partial<Record<SettingsField, string>>;

const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** "a@x.com, b@y.com" → ["a@x.com", "b@y.com"], lowercased and de-duplicated. */
export function parseEmailList(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[\s,;]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function isWholeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

/**
 * Validate and normalise what the form sent. Runs in the browser for inline
 * errors and again in the Server Action, which never trusts the browser.
 */
export function validateSettings(
  input: EditableSettings,
): { ok: true; value: EditableSettings } | { ok: false; errors: SettingsErrors } {
  const errors: SettingsErrors = {};

  const emailCount = input.emailCount;
  if (!TOUCH_NUMBERS.includes(emailCount)) errors.emailCount = "Choose 1, 2 or 3 emails.";

  const gapError = `Pick a whole number from ${MIN_GAP_DAYS} to ${MAX_GAP_DAYS} days.`;
  const gapOk = (g: unknown) => isWholeNumber(g) && g >= MIN_GAP_DAYS && g <= MAX_GAP_DAYS;
  // A gap only matters if that email is sent; an unused one keeps its value.
  if (emailCount >= 2 && !gapOk(input.gapDays?.[2])) errors.gap2 = gapError;
  if (emailCount >= 3 && !gapOk(input.gapDays?.[3])) errors.gap3 = gapError;
  const gapDays = {
    2: gapOk(input.gapDays?.[2]) ? input.gapDays[2] : DEFAULT_CADENCE.gapDays[2],
    3: gapOk(input.gapDays?.[3]) ? input.gapDays[3] : DEFAULT_CADENCE.gapDays[3],
  };

  const repeatWindowDays = input.repeatWindowDays;
  if (!isWholeNumber(repeatWindowDays) || repeatWindowDays < 0 || repeatWindowDays > 730) {
    errors.repeatWindowDays = "Choose how long to wait before asking the same customer again.";
  }

  const templates = {} as Record<TouchNumber, EmailTemplate>;
  for (const n of TOUCH_NUMBERS) {
    const t = input.templates?.[n];
    if (!t || typeof t.subject !== "string" || typeof t.body !== "string") {
      templates[n] = DEFAULT_TEMPLATES[n];
      continue;
    }
    const problems = templateProblems(t);
    if (problems.length > 0) errors[`template${n}`] = problems.join(" ");
    templates[n] = normalizeTemplate(t);
  }

  const replyTo = input.replyTo?.trim().toLowerCase() || null;
  if (replyTo && !isEmail(replyTo)) errors.replyTo = "That doesn't look like an email address.";

  const alertEmails = Array.isArray(input.alertEmails) ? input.alertEmails : [];
  const badAlert = alertEmails.find((e) => !isEmail(e));
  if (badAlert) errors.alertEmails = `“${badAlert}” doesn't look like an email address.`;
  else if (alertEmails.length > MAX_ALERT_EMAILS) {
    errors.alertEmails = `Up to ${MAX_ALERT_EMAILS} addresses.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { emailCount, gapDays, skipWeekends: !!input.skipWeekends, repeatWindowDays, templates, replyTo, alertEmails },
  };
}

/** Templates to store: only the ones that differ from the default. */
export function customizedTemplates(
  templates: Record<TouchNumber, EmailTemplate>,
): Partial<Record<TouchNumber, EmailTemplate>> {
  const out: Partial<Record<TouchNumber, EmailTemplate>> = {};
  for (const n of TOUCH_NUMBERS) {
    if (!isDefaultTemplate(n, templates[n])) out[n] = normalizeTemplate(templates[n]);
  }
  return out;
}
