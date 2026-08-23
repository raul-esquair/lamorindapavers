"use client";

import { usePathname } from "next/navigation";

// Routes that render without the site chrome (header nav, footer, mobile
// bottom bar). /feedback is a single-decision page handed directly to
// customers — every competing link on it costs a response. /unsubscribe
// renders its own logo, and showing someone a "Get a Free Estimate" CTA
// while they opt out is the wrong note. The dashboard is an internal tool
// with its own header.
const BARE_ROUTES = new Set(["/feedback", "/unsubscribe"]);

// Everything beneath these paths is bare, including nested routes.
const BARE_PREFIXES = ["/dashboard"];

function isBare(pathname: string): boolean {
  if (BARE_ROUTES.has(pathname)) return true;
  return BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function useIsBareRoute() {
  return isBare(usePathname());
}

/**
 * Renders its children on normal routes and nothing on bare routes. Children
 * may be server components — they are passed through as an RSC payload.
 */
export default function ChromeSlot({ children }: { children: React.ReactNode }) {
  return useIsBareRoute() ? null : <>{children}</>;
}
