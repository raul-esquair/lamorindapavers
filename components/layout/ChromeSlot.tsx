"use client";

import { usePathname } from "next/navigation";

// Routes that render without the site chrome (header nav, footer, mobile
// bottom bar). /feedback is a single-decision page handed directly to
// customers — every competing link on it costs a response.
const BARE_ROUTES = new Set(["/feedback"]);

export function useIsBareRoute() {
  return BARE_ROUTES.has(usePathname());
}

/**
 * Renders its children on normal routes and nothing on bare routes. Children
 * may be server components — they are passed through as an RSC payload.
 */
export default function ChromeSlot({ children }: { children: React.ReactNode }) {
  return useIsBareRoute() ? null : <>{children}</>;
}
