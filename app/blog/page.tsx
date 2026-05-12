import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { getPublishedPosts } from "@/lib/blog/data";
import { loadBlogConfig } from "@/lib/blog-config";
import SectionLabel from "@/components/ui/SectionLabel";
import BlogCard from "@/components/blog/BlogCard";
import BlogCTA from "@/components/blog/BlogCTA";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadBlogConfig();
  return generatePageMetadata({
    title: `Blog | ${config.site.brand.short}`,
    description: `Insights and guides from ${config.site.brand.full} — paver driveways, patios, retaining walls, and outdoor living for East Bay homeowners.`,
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>Blog</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-warm-gray-900 mt-4 mb-6">
              Insights &amp; Inspiration
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-500 font-sans">
              Expert tips, project guides, and outdoor living inspiration from the
              Lamorinda Pavers team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-warm-gray-500 font-sans">No posts published yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BlogCTA
        heading="Ready to start your outdoor project?"
        subtext="Tell us about your property and we'll come walk it with you — free estimate, no pressure."
        buttonText="Request a free estimate"
        buttonHref="/contact"
      />
    </>
  );
}
