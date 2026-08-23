import { company } from "@/lib/data/company";
import type { ReviewRequest } from "@/lib/db/schema";
import type { TouchNumber } from "./schedule";
import { daysBetween, todayInBusinessTz } from "./dates";

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
  unsubscribeUrl: string;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full.trim();
}

/** "paver driveway" — singular, lowercase. Null when Steve didn't set one. */
function projectNoun(request: ReviewRequest): string | null {
  const p = request.projectType?.trim();
  return p ? p.toLowerCase().replace(/s$/, "") : null;
}

/** "your paver driveway" — falls back to something neutral. */
function projectPhrase(request: ReviewRequest): string {
  const noun = projectNoun(request);
  return noun ? `your ${noun}` : "your project";
}

/**
 * Touch 1's opening line has to match how long ago the job actually finished.
 * With same-day sends now possible, "has had a few days to settle" is wrong
 * as often as it's right.
 */
function openingLine(request: ReviewRequest, phrase: string, today: string): string {
  const completed = request.completedAt;
  const age = completed ? daysBetween(completed, today) : null;

  if (age !== null && age <= 0) {
    return `Steve here from ${company.name}. We wrapped up ${phrase} today.`;
  }
  if (age !== null && age <= 7) {
    return `Steve here from ${company.name}. We finished ${phrase} a few days ago.`;
  }
  return `Steve here from ${company.name}. We finished ${phrase} a little while back, and I wanted to follow up.`;
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

export function renderReviewEmail(
  request: ReviewRequest,
  touch: TouchNumber,
  today: string = todayInBusinessTz(),
): RenderedEmail {
  const name = firstName(request.name);
  const project = projectPhrase(request);
  const noun = projectNoun(request);
  const feedbackUrl = `${company.domain}/feedback?t=${request.token}`;
  const unsubscribeUrl = `${company.domain}/unsubscribe?t=${request.token}`;

  let subject: string;
  let lines: string[];

  /**
   * Subject lines assume the work is good rather than asking whether it was.
   * "How did it turn out?" reads as a tradesman unsure of his own job — the
   * ask isn't whether the driveway is good, it's whether they'd say so
   * publicly. Each of the three also has to look distinct in an inbox; three
   * near-identical lines from one sender read as automation.
   */
  if (touch === 1) {
    subject = noun ? `A favor about your new ${noun}` : `A favor to ask you`;
    lines = [
      `Hi ${name},`,
      openingLine(request, project, today),
      `I'd be grateful if you'd take thirty seconds to say how it went. It goes straight to me, and word of mouth is how a small crew like ours keeps working.`,
    ];
  } else if (touch === 2) {
    subject = `Still hoping to hear from you, ${name}`;
    lines = [
      `Hi ${name},`,
      `I know how easily an email like this gets buried, so I wanted to send one more.`,
      `If anything about ${project} isn't right, I'd genuinely rather hear it from you than not hear it at all.`,
    ];
  } else {
    subject = `Last one from me, I promise`;
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
