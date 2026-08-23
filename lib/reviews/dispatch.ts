import { Resend } from "resend";
import { renderReviewEmail } from "./emails";
import {
  attachProviderId,
  closeCompletedSequences,
  findDueRequests,
  recordTouch,
} from "./queries";

const FROM = `Steve Barsanti <steve@lamorindapaving.com>`;
/** Replies go where Steve actually reads mail. */
const REPLY_TO = "stevebarsanti@icloud.com";

/**
 * Per-run send cap. Two reasons it exists:
 *  1. Deliverability — a domain that normally sends a handful of
 *     transactional emails suddenly emitting 40 looks like a compromised
 *     account to receiving servers.
 *  2. Netlify scheduled functions time out at 30s.
 */
const DEFAULT_BATCH_LIMIT = 8;

export interface DispatchResult {
  attempted: number;
  sent: number;
  failed: number;
  skipped: number;
  closed: number;
  errors: string[];
  dryRun: boolean;
}

export async function dispatchReviewEmails(
  options: { limit?: number; dryRun?: boolean } = {},
): Promise<DispatchResult> {
  const envLimit = Number(process.env.REVIEW_BATCH_LIMIT);
  const limit =
    options.limit ?? (Number.isFinite(envLimit) && envLimit > 0 ? envLimit : DEFAULT_BATCH_LIMIT);
  const dryRun = options.dryRun ?? false;

  const result: DispatchResult = {
    attempted: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    closed: 0,
    errors: [],
    dryRun,
  };

  const due = await findDueRequests(limit);
  result.attempted = due.length;

  if (due.length === 0) {
    result.closed = await closeCompletedSequences();
    return result;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dryRun) {
    result.errors.push("RESEND_API_KEY is not set — nothing sent.");
    result.failed = due.length;
    return result;
  }

  const resend = apiKey ? new Resend(apiKey) : null;

  for (const { request, touch } of due) {
    const email = renderReviewEmail(request, touch);

    if (dryRun) {
      result.sent++;
      continue;
    }

    /**
     * Claim the touch BEFORE sending. If the process dies mid-run, the worst
     * case is a customer misses one email — invisible and recoverable.
     * Recording afterwards would risk sending the same email twice, which is
     * neither. The unique index makes the claim atomic.
     */
    const claimed = await recordTouch(request.id, touch);
    if (!claimed) {
      result.skipped++;
      continue;
    }

    try {
      const sendResult = await resend!.emails.send({
        from: FROM,
        to: request.email,
        replyTo: REPLY_TO,
        subject: email.subject,
        text: email.text,
        html: email.html,
        headers: {
          // Improves deliverability and gives Gmail/Outlook a native
          // unsubscribe affordance.
          "List-Unsubscribe": `<${email.unsubscribeUrl}>`,
        },
      });

      if (sendResult.error) {
        result.failed++;
        result.errors.push(`${request.email} touch ${touch}: ${sendResult.error.message}`);
        continue;
      }

      // Backfill the message id now that we have it. Best-effort — the email
      // is already out, so a failure here must not be reported as a failure.
      if (sendResult.data?.id) {
        try {
          await attachProviderId(request.id, touch, sendResult.data.id);
        } catch (err) {
          console.error(`Could not record provider id for ${request.email}:`, err);
        }
      }

      result.sent++;
    } catch (err) {
      result.failed++;
      result.errors.push(
        `${request.email} touch ${touch}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  result.closed = await closeCompletedSequences();
  return result;
}

