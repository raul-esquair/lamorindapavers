"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { services } from "@/lib/data/services";
import { cityFromAddress } from "@/lib/appointments/availability";
import { createLead } from "@/lib/leads/queries";
import { SMS_CONSENT_TEXT } from "@/lib/leads/consent";
import { SERVICE_UNSURE } from "@/lib/leads/form";

export interface QuoteSubmission {
  service: string;
  details: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  /** Street address of the project. Optional — the SMS flow collects it if missing. */
  address?: string;
  /** Whether the SMS opt-in box was ticked. */
  smsConsent?: boolean;
  /** Page the form was submitted from, for attribution. */
  sourcePath?: string;
  /** "modal" | "contact-page" — which surface produced it. */
  sourceKind?: string;
}

export type QuoteResult = { ok: true } | { ok: false; error: string };

const FROM = "Lamorinda Pavers <quotes@lamorindapaving.com>";
const TO = "stevebarsanti@icloud.com";

const TIMELINE_LABELS: Record<string, string> = {
  asap: "As soon as possible",
  "1-3months": "1–3 months",
  "3-6months": "3–6 months",
  planning: "Just getting quotes",
};

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitQuote(data: QuoteSubmission): Promise<QuoteResult> {
  const name = data.name?.trim();
  const phone = data.phone?.trim();
  const email = data.email?.trim();
  const service = data.service?.trim();

  if (!name || !phone || !email || !service) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const address = data.address?.trim() || null;

  /**
   * Persist BEFORE the RESEND_API_KEY check, not after.
   *
   * A misconfigured deploy must not also lose the lead — the row is the only
   * durable record, and "we couldn't email you and also forgot you existed" is
   * strictly worse than "we couldn't email you". The write never throws
   * (createLead swallows), so this is safe to start and settle later.
   */
  const leadPromise = persistLead({ data, name, phone, email, service, address });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    await leadPromise;
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);

  const serviceName =
    service === SERVICE_UNSURE
      ? "Not sure yet"
      : services.find((s) => s.slug === service)?.name ?? service;
  const timelineLabel = data.timeline ? TIMELINE_LABELS[data.timeline] ?? data.timeline : "Not specified";
  const city = address ? cityFromAddress(address) ?? "Not specified" : "Not specified";
  const location = address || city;
  const details = data.details?.trim() || "No additional details provided";

  const subject = `New quote request — ${serviceName} — ${name}`;

  const text = [
    `New quote request from the website.`,
    ``,
    `Service: ${serviceName}`,
    `Timeline: ${timelineLabel}`,
    `Location: ${location}`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    ``,
    `Project details:`,
    details,
    ``,
    `Reply directly to this email to respond to ${name}.`,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A1A1A;">
      <h2 style="margin:0 0 16px;font-size:20px;">New quote request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#666;width:110px;">Service</td><td style="padding:6px 0;font-weight:600;">${escape(serviceName)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Timeline</td><td style="padding:6px 0;">${escape(timelineLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Location</td><td style="padding:6px 0;">${escape(location)}</td></tr>
        <tr><td colspan="2" style="padding:12px 0 6px;border-top:1px solid #eee;"></td></tr>
        <tr><td style="padding:6px 0;color:#666;">Name</td><td style="padding:6px 0;font-weight:600;">${escape(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;"><a href="tel:${escape(phone)}" style="color:#3B7DD8;">${escape(phone)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${escape(email)}" style="color:#3B7DD8;">${escape(email)}</a></td></tr>
      </table>
      <h3 style="margin:24px 0 8px;font-size:15px;">Project details</h3>
      <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.5;">${escape(details)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#888;">Reply directly to this email to respond to ${escape(name)}.</p>
    </div>
  `;

  const emailPromise = resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject,
    text,
    html,
  });

  const ntfyPromise = sendNtfy({ name, phone, email, city, serviceName, timelineLabel, details });

  try {
    const [emailResult, ntfyResult, leadResult] = await Promise.allSettled([
      emailPromise,
      ntfyPromise,
      leadPromise,
    ]);

    // Neither the push nor the database write is allowed to fail the
    // submission. Log and carry on — the email to Steve is the critical path.
    if (ntfyResult.status === "rejected") {
      console.error("ntfy error:", ntfyResult.reason);
    }
    if (leadResult.status === "rejected" || leadResult.value === null) {
      console.error("lead not persisted:", leadResult.status === "rejected" ? leadResult.reason : "insert returned null");
    }

    if (emailResult.status === "rejected") {
      console.error("Resend threw:", emailResult.reason);
      return { ok: false, error: "Something went wrong. Please call us instead." };
    }
    if (emailResult.value.error) {
      console.error("Resend error:", emailResult.value.error);
      return { ok: false, error: "Could not send your request. Please call us instead." };
    }

    return { ok: true };
  } catch (err) {
    console.error("submitQuote threw:", err);
    return { ok: false, error: "Something went wrong. Please call us instead." };
  }
}

async function sendNtfy(p: {
  name: string;
  phone: string;
  email: string;
  city: string;
  serviceName: string;
  timelineLabel: string;
  details: string;
}) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const body = [
    `${p.name} · ${p.phone}`,
    `${p.city} · ${p.timelineLabel}`,
    p.email,
  ].join("\n");

  const telDigits = p.phone.replace(/[^\d+]/g, "");
  const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Title: `New lead - ${p.serviceName}`,
      Priority: "4",
      Tags: "bell",
      Click: `tel:${telDigits}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`ntfy ${res.status}: ${await res.text()}`);
  }
}

/**
 * Write the lead row. Never throws — `createLead` swallows database failures
 * and returns null, so a submission can never be lost to a Neon hiccup.
 *
 * The IP is read from request headers server-side and never accepted from the
 * client: it exists as part of the TCPA consent record, and a value the
 * browser could set would be worthless as evidence.
 */
async function persistLead(p: {
  data: QuoteSubmission;
  name: string;
  phone: string;
  email: string;
  service: string;
  address: string | null;
}) {
  const consented = p.data.smsConsent === true;

  let ip: string | null = null;
  try {
    const h = await headers();
    ip =
      h.get("x-nf-client-connection-ip") ??
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;
  } catch {
    // headers() is unavailable outside a request scope. A null IP is fine;
    // a wrong one would be worse than none.
  }

  return createLead({
    name: p.name,
    email: p.email,
    phone: p.phone,
    // "Not sure yet" is stored as null rather than a fake slug, so counting
    // leads per service stays honest.
    service: p.service === SERVICE_UNSURE ? null : p.service,
    address: p.address,
    city: cityFromAddress(p.address),
    timeline: p.data.timeline?.trim() || null,
    details: p.data.details?.trim() || null,
    sourcePath: p.data.sourcePath?.trim() || null,
    sourceKind: p.data.sourceKind?.trim() || null,
    smsConsentAt: consented ? new Date() : null,
    smsConsentText: consented ? SMS_CONSENT_TEXT : null,
    smsConsentIp: consented ? ip : null,
  });
}
