/**
 * End-of-post CTA for the Lamorinda blog. Uses their warm-gray / cream
 * palette and links into their existing /contact route.
 */
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

interface BlogCTAProps {
  heading: string;
  subtext: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function BlogCTA({
  heading,
  subtext,
  buttonText = "Request a free estimate",
  buttonHref = "/contact",
}: BlogCTAProps) {
  return (
    <section className="bg-warm-gray-900 py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionLabel className="text-brand-gold">Next step</SectionLabel>
        <h2 className="text-4xl md:text-5xl text-warm-white mt-4 mb-5">
          {heading}
        </h2>
        <p className="text-lg text-warm-white/70 font-sans mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>
        <Link
          href={buttonHref}
          className="press inline-block bg-brand-gold hover:bg-brand-gold-dark text-warm-gray-900 font-medium px-8 py-4 rounded-md font-sans"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
