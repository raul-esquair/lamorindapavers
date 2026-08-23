"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth/session";

export type LoginResult = { ok: true } | { ok: false; error: string };

/**
 * A fixed delay on every attempt, success or failure. Serverless instances
 * don't share memory, so a counter-based rate limit would be trivially
 * bypassed by parallel requests — a constant cost per attempt is the honest
 * mitigation here. The real defence is a long random password.
 */
const ATTEMPT_DELAY_MS = 600;

export async function login(password: string): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, ATTEMPT_DELAY_MS));

  if (!password?.trim()) {
    return { ok: false, error: "Enter the password." };
  }

  let valid: boolean;
  try {
    valid = verifyPassword(password);
  } catch (err) {
    console.error("Dashboard auth misconfigured:", err);
    return { ok: false, error: "Dashboard is not configured. Check the server environment." };
  }

  if (!valid) {
    return { ok: false, error: "Incorrect password." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { ok: true };
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/dashboard/login");
}
