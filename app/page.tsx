import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ServicesOverview from "@/components/sections/ServicesOverview";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import AboutPreview from "@/components/sections/AboutPreview";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import ServiceArea from "@/components/sections/ServiceArea";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
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
      <FinalCTA />
    </>
  );
}
