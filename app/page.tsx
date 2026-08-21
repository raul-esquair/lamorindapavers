import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ServicesOverview from "@/components/sections/ServicesOverview";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import AboutPreview from "@/components/sections/AboutPreview";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import ServiceArea from "@/components/sections/ServiceArea";
import LatestGuides from "@/components/sections/LatestGuides";
import FinalCTA from "@/components/sections/FinalCTA";
import { getPublishedPosts } from "@/lib/blog/data";

// Self-referencing canonical. Resolves against metadataBase (set in the root
// layout) to https://lamorindapaving.com/ — the single signal that consolidates
// the http:// and https:// variants Google was indexing separately.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const latestPosts = getPublishedPosts().slice(0, 3);

  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <FeaturedProjects />
      <AboutPreview />
      <Testimonials />
      <Process />
      <ServiceArea />
      <LatestGuides posts={latestPosts} />
      <FinalCTA />
    </>
  );
}
