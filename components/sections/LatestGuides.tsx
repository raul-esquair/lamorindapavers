import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import BlogCard from "@/components/blog/BlogCard";

/**
 * Homepage "Latest Guides" strip. Beyond UX, this is the site's fastest
 * auto-discovery path for new posts: the homepage is crawled ~daily, so a post
 * linked here gets found within a crawl cycle of publishing — far faster than
 * waiting for Googlebot to reach the /blog index. Editorial content only (no
 * CTA button) to respect the single-hero-CTA design decision.
 */
export default function LatestGuides({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12 max-w-2xl">
          <SectionLabel>From the Blog</SectionLabel>
          <h2 className="text-3xl md:text-5xl text-warm-gray-900 mt-3 mb-4">
            Planning &amp; Buying Guides
          </h2>
          <p className="text-warm-gray-500 font-sans text-lg">
            Cost, hiring, and design guides from Steve Barsanti — written from
            1,000+ East Bay paver installs.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <ScrollReveal key={post.slug}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-blue font-sans font-medium hover:gap-3 transition-all"
          >
            View all guides
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
