import { services } from "@/lib/data/services";
import { SERVICE_UNSURE } from "@/lib/leads/form";

/**
 * Sending a quote request to the Esquair hub.
 *
 * This used to be a Server Action that wrote to Neon and emailed Steve from
 * here. Both now happen in the hub, which owns the lead, the contact record
 * and the alert — see the hub's app/api/leads/route.ts.
 *
 * Deliberately a plain browser `fetch`, not a Server Action:
 *
 *  - `/dashboard/*` is already proxied to the hub by the signed redirect in
 *    netlify.toml, so a same-origin POST from the page is picked up by
 *    Netlify's CDN, signed, and handed to the hub as this site. No new
 *    config, and no secret in this repo.
 *  - A request made from the browser carries the visitor's real IP in the
 *    header the hub trusts. A Server Action would have put this site's own
 *    function there instead, and the lead's audit row would record the
 *    server rather than the person.
 *
 * The call signature is unchanged, so QuoteModal and ContactPageContent call
 * it exactly as before.
 */

const ENDPOINT = "/dashboard/api/leads";

export interface QuoteSubmission {
  service: string;
  details: string;
  name: string;
  phone: string;
  email: string;
  /** Page the form was submitted from, for attribution. */
  sourcePath?: string;
  /** "modal" | "contact-page" — which surface produced it. */
  sourceKind?: string;
  /**
   * Stable for one submission and regenerated after it succeeds, so a
   * double-tapped button or a retry after a flaky response is one lead. The
   * browser supplies it because only the browser knows what counts as a
   * retry; the hub rejects a request without one rather than inventing it.
   */
  submissionId: string;
}

export type QuoteResult = { ok: true } | { ok: false; error: string };

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

  // One name field on the form, two columns on a contact. Everything after
  // the first space is the surname, so "Mary Jane Watson" keeps "Jane Watson"
  // rather than losing it.
  const [firstName, ...rest] = name.split(/\s+/);

  /**
   * "Not sure yet" is sent as no service at all rather than as a slug —
   * Steve's rule, kept: a lead that declined to pick is not a lead for a
   * service, and counting it as one makes the per-service numbers lie.
   */
  const fields: Record<string, string> = {};
  if (service !== SERVICE_UNSURE) {
    fields.service = services.find((s) => s.slug === service)?.name ?? service;
  }
  const details = data.details?.trim();
  if (details) fields.details = details;

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName: rest.join(" "),
        email,
        phone,
        fields,
        pagePath: data.sourcePath,
        sourceLabel: data.sourceKind,
        idempotencyKey: data.submissionId,
      }),
    });
  } catch {
    // Offline, or the request never landed. Safe to retry: the same
    // submissionId means a lead that did get through isn't duplicated.
    return { ok: false, error: "We couldn't send that. Please check your connection and try again." };
  }

  if (!res.ok) {
    const message = await res
      .json()
      .then((body: unknown) =>
        typeof body === "object" && body !== null && typeof (body as { error?: unknown }).error === "string"
          ? (body as { error: string }).error
          : null,
      )
      .catch(() => null);

    console.error("quote submission failed", res.status, message);
    // A 4xx is something the visitor can fix; anything else is ours and
    // shouldn't be dressed up as their mistake.
    return {
      ok: false,
      error:
        res.status >= 400 && res.status < 500 && message
          ? message
          : "Something went wrong on our end. Please call us instead — we'd hate to miss you.",
    };
  }

  return { ok: true };
}
