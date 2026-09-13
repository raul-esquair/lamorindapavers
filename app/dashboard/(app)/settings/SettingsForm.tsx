"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { saveSettings } from "@/lib/actions/review-settings";
import type { EmailTemplate } from "@/lib/reviews/emails";
import {
  exampleSchedule,
  MAX_GAP_DAYS,
  MIN_GAP_DAYS,
  TOUCH_NUMBERS,
  type Cadence,
  type TouchNumber,
} from "@/lib/reviews/schedule";
import {
  parseEmailList,
  REPEAT_WINDOW_OPTIONS,
  validateSettings,
  type EditableSettings,
  type SettingsErrors,
} from "@/lib/reviews/settings";
import { cn } from "@/lib/utils";
import EmailEditor from "./EmailEditor";
import { fieldClass, FieldError, labelClass, Section, Switch } from "./controls";

/** What the inputs hold — gaps and addresses as typed, converted on save. */
interface FormState {
  emailCount: TouchNumber;
  gap2: string;
  gap3: string;
  skipWeekends: boolean;
  repeatWindowDays: number;
  templates: Record<TouchNumber, EmailTemplate>;
  replyTo: string;
  alertEmails: string;
}

function toFormState(s: EditableSettings): FormState {
  return {
    emailCount: s.emailCount,
    gap2: String(s.gapDays[2]),
    gap3: String(s.gapDays[3]),
    skipWeekends: s.skipWeekends,
    repeatWindowDays: s.repeatWindowDays,
    templates: s.templates,
    replyTo: s.replyTo ?? "",
    alertEmails: s.alertEmails.join(", "),
  };
}

function toSettings(f: FormState): EditableSettings {
  return {
    emailCount: f.emailCount,
    gapDays: { 2: Number(f.gap2), 3: Number(f.gap3) },
    skipWeekends: f.skipWeekends,
    repeatWindowDays: f.repeatWindowDays,
    templates: f.templates,
    replyTo: f.replyTo.trim() || null,
    alertEmails: parseEmailList(f.alertEmails),
  };
}

function weekdayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const EMAIL_COUNT_LABEL: Record<TouchNumber, string> = { 1: "1 email", 2: "2 emails", 3: "3 emails" };

export default function SettingsForm({
  initial,
  today,
  defaultReplyTo,
  defaultAlertEmail,
  phoneAlerts,
}: {
  initial: EditableSettings;
  today: string;
  /** Where replies go when the field is left blank. */
  defaultReplyTo: string;
  /** Where alerts go when the field is left blank. */
  defaultAlertEmail: string;
  /** Whether an ntfy topic is configured, so unhappy customers also push to phones. */
  phoneAlerts: boolean;
}) {
  const [saved, setSaved] = useState<FormState>(() => toFormState(initial));
  const [form, setForm] = useState<FormState>(saved);
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string }>({
    kind: "idle",
  });
  const [activeEmail, setActiveEmail] = useState<TouchNumber>(1);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  // Warn before closing the tab on unsaved edits — the email copy especially
  // is easy to lose.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // "Settings saved" shows briefly, then the bar slides away.
  useEffect(() => {
    if (status.kind !== "saved") return;
    const t = setTimeout(() => setStatus((s) => (s.kind === "saved" ? { kind: "idle" } : s)), 3000);
    return () => clearTimeout(t);
  }, [status.kind]);

  function update<K extends keyof FormState>(key: K, value: FormState[K], clear?: keyof SettingsErrors) {
    setForm((f) => ({ ...f, [key]: value }));
    if (status.kind !== "saving") setStatus({ kind: "idle" });
    if (clear) setErrors((e) => ({ ...e, [clear]: undefined }));
  }

  function updateTemplate(n: TouchNumber, t: EmailTemplate) {
    update("templates", { ...form.templates, [n]: t }, `template${n}`);
  }

  // The timeline previews the schedule as typed, as long as it's valid.
  const timeline = useMemo(() => {
    const g2 = Number(form.gap2);
    const g3 = Number(form.gap3);
    const ok = (g: number) => Number.isInteger(g) && g >= MIN_GAP_DAYS && g <= MAX_GAP_DAYS;
    if ((form.emailCount >= 2 && !ok(g2)) || (form.emailCount >= 3 && !ok(g3))) return null;
    const cadence: Cadence = {
      emailCount: form.emailCount,
      gapDays: { 2: ok(g2) ? g2 : 5, 3: ok(g3) ? g3 : 9 },
      skipWeekends: form.skipWeekends,
    };
    return exampleSchedule(today, cadence);
  }, [form.emailCount, form.gap2, form.gap3, form.skipWeekends, today]);

  async function onSave() {
    const input = toSettings(form);
    const check = validateSettings(input);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus({ kind: "error", message: "Some settings need fixing." });
      const bad = TOUCH_NUMBERS.find((n) => check.errors[`template${n}`]);
      if (bad) setActiveEmail(bad);
      return;
    }

    setStatus({ kind: "saving" });
    const result = await saveSettings(input);
    if (!result.ok) {
      setErrors(result.errors ?? {});
      setStatus({ kind: "error", message: result.error });
      return;
    }

    // What the server stored, normalised the same way — so trimming a stray
    // space doesn't leave the form looking unsaved.
    const normalized = toFormState(check.value);
    setSaved(normalized);
    setForm(normalized);
    setErrors({});
    setStatus({ kind: "saved" });
  }

  function onDiscard() {
    setForm(saved);
    setErrors({});
    setStatus({ kind: "idle" });
  }

  const barVisible = dirty || status.kind === "saved" || status.kind === "error";

  const gapInput = (key: "gap2" | "gap3", label: string) => (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <label htmlFor={key} className="font-sans text-sm text-warm-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={key}
          type="number"
          inputMode="numeric"
          min={MIN_GAP_DAYS}
          max={MAX_GAP_DAYS}
          value={form[key]}
          onChange={(e) => update(key, e.target.value, key)}
          className={cn(fieldClass({ invalid: !!errors[key], width: "w-20" }), "text-center tabular-nums")}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        <span className="font-sans text-sm text-warm-gray-500">days later</span>
      </div>
      {errors[key] && (
        <div className="basis-full">
          <FieldError id={`${key}-error`}>{errors[key]}</FieldError>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-10 pb-24">
      <Section
        title="Schedule"
        description={
          <>
            <p>How many emails each customer gets, and how long to wait between them.</p>
            <p>
              Changes apply from the next send, including customers already partway through. Each wait
              counts from the day the previous email actually went out.
            </p>
          </>
        }
      >
        <div className="space-y-6">
          <fieldset>
            <legend className={cn(labelClass, "mb-2")}>Emails per customer</legend>
            <div className="inline-flex rounded-lg border border-warm-gray-200 p-1 bg-cream" role="radiogroup">
              {TOUCH_NUMBERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={form.emailCount === n}
                  onClick={() => update("emailCount", n, "emailCount")}
                  className={cn(
                    "press rounded-md px-4 py-2 font-sans text-sm font-medium",
                    form.emailCount === n
                      ? "bg-white text-warm-gray-900 shadow-sm"
                      : "text-warm-gray-500 hover:text-brand-blue",
                  )}
                >
                  {EMAIL_COUNT_LABEL[n]}
                </button>
              ))}
            </div>
            <p className="mt-2 font-sans text-xs text-warm-gray-500">
              {form.emailCount === 1
                ? "One email, no reminders."
                : `The first email, then ${form.emailCount === 2 ? "one reminder" : "two reminders"} if they haven't responded.`}
            </p>
          </fieldset>

          {form.emailCount >= 2 && (
            <div className="space-y-3">
              {gapInput("gap2", "Email 2 goes out")}
              {form.emailCount >= 3 && gapInput("gap3", "Email 3 goes out")}
              <p className="font-sans text-xs text-warm-gray-500">
                Anywhere from {MIN_GAP_DAYS} to {MAX_GAP_DAYS} days. Two emails on back-to-back days start
                to read as automated.
              </p>
            </div>
          )}

          <div className="flex items-start justify-between gap-6 border-t border-warm-gray-100 pt-5">
            <div>
              <label htmlFor="skip-weekends" className={cn(labelClass, "cursor-pointer")}>
                Skip weekends
              </label>
              <p className="mt-0.5 font-sans text-xs text-warm-gray-500">
                Nothing goes out on Saturday or Sunday. Anything due then waits for Monday.
              </p>
            </div>
            <Switch
              id="skip-weekends"
              checked={form.skipWeekends}
              onChange={(v) => update("skipWeekends", v)}
            />
          </div>

          <div className="rounded-lg bg-cream px-4 py-4">
            <p className="font-sans text-xs font-medium uppercase tracking-wider text-warm-gray-400 mb-3">
              Example &mdash; a job you mark finished today
            </p>
            {timeline ? (
              <ol className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3">
                {timeline.map((t, i) => (
                  <li key={t.n} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden="true" className="hidden sm:inline text-warm-gray-300">
                        &rarr;
                      </span>
                    )}
                    <span className="rounded-md border border-warm-gray-200 bg-white px-3 py-1.5 font-sans text-sm">
                      <span className="font-semibold text-warm-gray-900">Email {t.n}</span>{" "}
                      <span className="text-warm-gray-500">{weekdayDate(t.date)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="font-sans text-sm text-warm-gray-500">Fix the number of days above to see the timeline.</p>
            )}
            <p className="mt-3 font-sans text-xs text-warm-gray-500">
              Emails go out at the daily 10am send. A job finished today goes out at the next one; a job
              you add later goes out two days after it finished (or tomorrow, for jobs over two weeks old).
              That first-email timing is fixed.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Email wording"
        description={
          <>
            <p>
              What each email says, in your voice. They go out from you, as plain emails &mdash; no logo or
              buttons, which is what gets them read.
            </p>
            <p>
              Every email ends with the customer&apos;s feedback link, your signature, and an unsubscribe
              line. Those can&apos;t be edited.
            </p>
          </>
        }
      >
        <div
          role="tablist"
          aria-label="Email"
          className="flex gap-1 border-b border-warm-gray-200 -mx-5 sm:-mx-6 px-5 sm:px-6 mb-6 overflow-x-auto"
        >
          {TOUCH_NUMBERS.map((n) => {
            const selected = activeEmail === n;
            return (
              <button
                key={n}
                id={`email-tab-${n}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`email-panel-${n}`}
                onClick={() => setActiveEmail(n)}
                className={cn(
                  "press relative -mb-px whitespace-nowrap border-b-2 px-3 py-2.5 font-sans text-sm font-medium",
                  selected
                    ? "border-brand-blue text-warm-gray-900"
                    : "border-transparent text-warm-gray-500 hover:text-brand-blue",
                )}
              >
                Email {n}
                {n > form.emailCount && <span className="ml-1.5 text-xs text-warm-gray-400">(off)</span>}
                {errors[`template${n}`] && (
                  <span
                    className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-red align-middle"
                    aria-label="has an error"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div id={`email-panel-${activeEmail}`} role="tabpanel" aria-labelledby={`email-tab-${activeEmail}`}>
          <EmailEditor
            key={activeEmail}
            n={activeEmail}
            template={form.templates[activeEmail]}
            onChange={(t) => updateTemplate(activeEmail, t)}
            error={errors[`template${activeEmail}`]}
            inUse={activeEmail <= form.emailCount}
            today={today}
            testTo={form.replyTo.trim() || defaultReplyTo}
          />
        </div>
      </Section>

      <Section
        title="Repeat customers"
        description={<p>Someone who hires you twice shouldn&apos;t get a second round of review emails right away.</p>}
      >
        <label htmlFor="repeat-window" className={cn(labelClass, "mb-1.5")}>
          Don&apos;t ask the same customer again within
        </label>
        <select
          id="repeat-window"
          value={form.repeatWindowDays}
          onChange={(e) => update("repeatWindowDays", Number(e.target.value), "repeatWindowDays")}
          className={cn(fieldClass({ invalid: !!errors.repeatWindowDays }), "sm:max-w-xs")}
        >
          {REPEAT_WINDOW_OPTIONS.map((o) => (
            <option key={o.days} value={o.days}>
              {o.label}
            </option>
          ))}
          {!REPEAT_WINDOW_OPTIONS.some((o) => o.days === form.repeatWindowDays) && (
            <option value={form.repeatWindowDays}>{form.repeatWindowDays} days</option>
          )}
        </select>
        {errors.repeatWindowDays && <FieldError id="repeat-window-error">{errors.repeatWindowDays}</FieldError>}
        <p className="mt-2 font-sans text-xs text-warm-gray-500">
          When you add someone who was emailed inside this window, you&apos;ll get a warning and can add
          them anyway. People who unsubscribed are never emailed again, whatever this says.
        </p>
      </Section>

      <Section
        title="Replies & alerts"
        description={<p>Where customer replies land, and who hears about it when someone isn&apos;t happy.</p>}
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="reply-to" className={cn(labelClass, "mb-1.5")}>
              When a customer replies to an email, send it to
            </label>
            <input
              id="reply-to"
              type="email"
              value={form.replyTo}
              onChange={(e) => update("replyTo", e.target.value, "replyTo")}
              placeholder={defaultReplyTo}
              className={fieldClass({ invalid: !!errors.replyTo })}
              aria-invalid={!!errors.replyTo}
              aria-describedby={errors.replyTo ? "reply-to-error" : "reply-to-hint"}
            />
            {errors.replyTo ? (
              <FieldError id="reply-to-error">{errors.replyTo}</FieldError>
            ) : (
              <p id="reply-to-hint" className="mt-1.5 font-sans text-xs text-warm-gray-500">
                Leave blank to use {defaultReplyTo}. Use an inbox you check &mdash; some customers answer
                the email instead of clicking the link.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="alert-emails" className={cn(labelClass, "mb-1.5")}>
              Email unhappy-customer alerts to
            </label>
            <input
              id="alert-emails"
              type="text"
              inputMode="email"
              value={form.alertEmails}
              onChange={(e) => update("alertEmails", e.target.value, "alertEmails")}
              placeholder={defaultAlertEmail}
              className={fieldClass({ invalid: !!errors.alertEmails })}
              aria-invalid={!!errors.alertEmails}
              aria-describedby={errors.alertEmails ? "alert-emails-error" : "alert-emails-hint"}
            />
            {errors.alertEmails ? (
              <FieldError id="alert-emails-error">{errors.alertEmails}</FieldError>
            ) : (
              <p id="alert-emails-hint" className="mt-1.5 font-sans text-xs text-warm-gray-500">
                Up to 3 addresses, separated by commas. Leave blank to use {defaultAlertEmail}. When a
                customer picks an unhappy face and writes to you, it goes here
                {phoneAlerts ? ", and to every phone subscribed to the alert notifications" : ""}.
              </p>
            )}
          </div>
        </div>
      </Section>

      <div
        // Hidden means hidden to the keyboard and screen readers too.
        inert={!barVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-warm-gray-200 bg-warm-white/95",
          // Reduced motion keeps the fade and drops the slide.
          "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-opacity",
          barVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <p className="font-sans text-sm" role="status" aria-live="polite">
            {status.kind === "saved" && !dirty && <span className="text-brand-blue font-medium">Settings saved.</span>}
            {status.kind === "error" && <span className="text-brand-red">{status.message}</span>}
            {status.kind !== "error" && dirty && <span className="text-warm-gray-600">You have unsaved changes.</span>}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {dirty && (
              <Button variant="ghost" size="sm" onClick={onDiscard} disabled={status.kind === "saving"}>
                Discard
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={onSave} disabled={!dirty || status.kind === "saving"}>
              {status.kind === "saving" ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
