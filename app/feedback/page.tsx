import type { Metadata } from "next";
import { Suspense } from "react";
import FeedbackPageContent from "./FeedbackPageContent";

// Intentionally kept out of the index and out of app/sitemap.ts. This is a
// link handed to customers directly (texts, invoices, email signatures), not
// a search asset — and it should not sit in the site's crawlable footprint.
// Note: do NOT add /feedback to robots.ts `disallow`; a blocked URL can't be
// crawled, so Google would never see the noindex below.
export const metadata: Metadata = {
  title: "Share Your Experience",
  description: "Tell Steve how your project went — it takes about thirty seconds.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Deliberately still statically generated. The ?t= token is read on the
 * client via useSearchParams rather than server-side, so this page stays on
 * the CDN — it's opened from a text message on a phone, and putting a
 * scale-to-zero database cold start in front of first paint would be the
 * wrong trade. Suspense is required because useSearchParams suspends.
 */
export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <FeedbackPageContent />
    </Suspense>
  );
}
