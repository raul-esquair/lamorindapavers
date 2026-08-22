import type { Metadata } from "next";
import FeedbackPageContent from "./FeedbackPageContent";

// Intentionally kept out of the index and out of app/sitemap.ts. This is a
// link handed to customers directly (texts, invoices, email signatures), not
// a search asset — and it should not sit in the site's crawlable footprint.
// Note: do NOT add /feedback to robots.ts `disallow`; a blocked URL can't be
// crawled, so Google would never see the noindex below.
export const metadata: Metadata = {
  title: "Share Your Experience",
  description: "Tell us how your project went.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function FeedbackPage() {
  return <FeedbackPageContent />;
}
