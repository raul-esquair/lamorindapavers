import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/** True when the current request carries a valid dashboard session. */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  } catch {
    // Missing/short DASHBOARD_SESSION_SECRET throws — treat as unauthenticated
    // rather than 500ing, so a misconfigured deploy shows the login screen.
    return false;
  }
}

/**
 * For Server Actions, which are publicly reachable endpoints — the layout gate
 * protects the *page*, not the action. Returns an error message to show, or
 * null when the session is valid. Lives here rather than in a "use server"
 * file, where every export becomes a callable endpoint of its own.
 */
export async function dashboardAuthError(): Promise<string | null> {
  return (await isAuthenticated()) ? null : "Your session expired. Please sign in again.";
}
