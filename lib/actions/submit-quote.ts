"use server";

import { Resend } from "resend";
import { services } from "@/lib/data/services";

export interface QuoteSubmission {
  service: string;
  details: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  city: string;
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);

  const serviceName = services.find((s) => s.slug === service)?.name ?? service;
  const timelineLabel = data.timeline ? TIMELINE_LABELS[data.timeline] ?? data.timeline : "Not specified";
  const city = data.city?.trim() || "Not specified";
  const details = data.details?.trim() || "No additional details provided";

  const subject = `New quote request — ${serviceName} — ${name}`;

  const text = [
    `New quote request from the website.`,
    ``,
    `Service: ${serviceName}`,
    `Timeline: ${timelineLabel}`,
    `City: ${city}`,
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
        <tr><td style="padding:6px 0;color:#666;">City</td><td style="padding:6px 0;">${escape(city)}</td></tr>
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
    const [emailResult, ntfyResult] = await Promise.allSettled([emailPromise, ntfyPromise]);

    if (ntfyResult.status === "rejected") {
      console.error("ntfy error:", ntfyResult.reason);
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
