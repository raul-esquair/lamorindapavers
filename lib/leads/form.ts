/**
 * Constants shared by the quote form and the Server Action behind it.
 *
 * They live here rather than in `lib/actions/submit-quote.ts` because a
 * `"use server"` module may only export async functions — exporting a plain
 * const from one fails the build with an error that points at the wrong line.
 */

/**
 * The value behind the "Not sure yet / a few things" option. Stored as **null**
 * on the lead row rather than as a slug, so counting leads per service stays
 * honest — a lead that declined to pick is not a lead for a service.
 */
export const SERVICE_UNSURE = "not-sure";
