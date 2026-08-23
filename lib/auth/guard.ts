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
