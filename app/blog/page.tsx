import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and inspiration for your outdoor living projects. Expert advice from Lamorinda Pavers, the East Bay's trusted paver contractor.",
};

export default function BlogPage() {
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

      <section className="py-24 md:py-32 bg-warm-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl text-warm-gray-900 mb-4">
            Coming Soon
          </h2>
          <p className="text-warm-gray-500 font-sans mb-8">
            We&apos;re working on helpful content about paver installation, outdoor living
            design, and maintenance tips. Check back soon!
          </p>
          <Button href="/contact" variant="primary">
            Get a Free Estimate
          </Button>
        </div>
      </section>
    </>
  );
}
