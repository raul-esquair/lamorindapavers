import { company } from "@/lib/data/company";
import type { ReviewRequest } from "@/lib/db/schema";
import type { TouchNumber } from "./schedule";

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
  unsubscribeUrl: string;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full.trim();
}

/** "your paver driveway" — falls back to something neutral. */
function projectPhrase(request: ReviewRequest): string {
  const p = request.projectType?.trim();
  if (!p) return "your project";
  return `your ${p.toLowerCase().replace(/s$/, "")}`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Deliberately plain. These read as an email one contractor typed to one
 * customer — no logo banner, no button graphics, no columns. A designed
 * marketing template converts worse here and is more likely to be filtered.
 */
function wrap(bodyHtml: string, feedbackUrl: string, unsubscribeUrl: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1A1A1A;max-width:520px;">
${bodyHtml}
  <p style="margin:24px 0;">
    <a href="${feedbackUrl}" style="color:#3B7DD8;font-weight:600;">${escape(feedbackUrl)}</a>
  </p>
  <p style="margin:24px 0 4px;">Thanks,<br>Steve Barsanti<br>
    <span style="color:#666;">${escape(company.name)} &middot; CA Lic. #${escape(company.license)}</span><br>
    <a href="${company.phoneHref}" style="color:#3B7DD8;">${escape(company.phone)}</a>
  </p>
  <p style="margin:28px 0 0;font-size:12px;color:#999;">
    Don't want these? <a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe</a>.
  </p>
</div>`.trim();
}

export function renderReviewEmail(request: ReviewRequest, touch: TouchNumber): RenderedEmail {
  const name = firstName(request.name);
  const project = projectPhrase(request);
  const feedbackUrl = `${company.domain}/feedback?t=${request.token}`;
  const unsubscribeUrl = `${company.domain}/unsubscribe?t=${request.token}`;

  let subject: string;
  let lines: string[];

  if (touch === 1) {
    subject = `How did ${project} turn out?`;
    lines = [
      `Hi ${name},`,
      `Steve here from ${company.name}. Now that ${project} has had a few days to settle, I wanted to check that you're happy with how it came out.`,
      `If you have thirty seconds, would you let me know? It goes straight to me.`,
    ];
  } else if (touch === 2) {
    subject = `Quick follow-up on ${project}`;
    lines = [
      `Hi ${name},`,
      `I know how easily an email like this gets buried, so I wanted to send one more.`,
      `If anything about ${project} isn't right, I'd genuinely rather hear it from you than not hear it at all.`,
    ];
  } else {
    subject = `Last note from me`;
    lines = [
      `Hi ${name},`,
      `This is the last time I'll ask, I promise.`,
      `If ${project} turned out well, a quick word from you helps a small crew like ours more than just about anything else. And if it didn't, I'd still like the chance to put it right.`,
    ];
  }

  const text = [
    ...lines,
    ``,
    feedbackUrl,
    ``,
    `Thanks,`,
    `Steve Barsanti`,
    `${company.name} · CA Lic. #${company.license}`,
    company.phone,
    ``,
    `Don't want these? Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const html = wrap(
    lines.map((l) => `  <p style="margin:0 0 16px;">${escape(l)}</p>`).join("\n"),
    feedbackUrl,
    unsubscribeUrl,
  );

  return { subject, text, html, unsubscribeUrl };
}
