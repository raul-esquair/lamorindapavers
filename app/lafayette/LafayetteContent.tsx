"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { cities } from "@/lib/data/cities";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { blurProps } from "@/lib/blur";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import QuoteButton from "@/components/ui/QuoteButton";
import FAQAccordion from "@/components/ui/FAQAccordion";
import PaverCrossSection from "@/components/ui/PaverCrossSection";
import FinalCTA from "@/components/sections/FinalCTA";
import { lafayetteNeighborhoods, lafayetteFaqs } from "./content";

const featuredServiceSlugs = [
  "paver-driveways",
  "patios",
  "retaining-walls",
  "pool-decks",
  "outdoor-kitchens",
];

const lafayetteServiceCopy: Record<string, string> = {
  "paver-driveways":
    "From estate motor courts in Happy Valley to standard residential driveways in Burton Valley, we replace cracked concrete and tired asphalt with engineered paver systems built for Lafayette's expansive clay. Every driveway includes a 6–8 inch compacted Class II base, edge restraints, and polymeric sand joints.",
  patios:
    "Lafayette backyards range from compact courtyards downtown to sprawling outdoor rooms in Reliez Valley. We design patios that fit how you actually use the space — dining, entertaining, fire feature seating — and integrate seamlessly with existing landscape, pools, and structures.",
  "retaining-walls":
    "Hillside Lafayette properties — especially in Springhill, Reliez Valley, and the upper Happy Valley slopes — almost always need engineered retaining walls. We build segmental block, natural stone, and structural walls with proper drainage and geogrid reinforcement to prevent the failures we see on cheap installs.",
  "pool-decks":
    "Replacing concrete pool decking with slip-resistant, heat-reflective pavers transforms how a Lafayette pool looks and feels underfoot. We work around existing pools without disturbing the structure, and detail the coping and edge profile so the deck looks designed, not patched.",
  "outdoor-kitchens":
    "Lafayette's mild climate makes outdoor entertaining a year-round option. We build full custom outdoor kitchens with built-in grills, granite or stone countertops, refrigerators, and integrated lighting — coordinated with electrical, plumbing, and gas line work.",
};

const otherServices = services.filter(
  (s) => !featuredServiceSlugs.includes(s.slug),
);

const sameCountyCities = cities.filter(
  (c) => c.county === "Contra Costa" && c.slug !== "lafayette",
);
const otherCountyCities = cities.filter((c) => c.county !== "Contra Costa");

const localTestimonials = testimonials.filter((t) =>
  ["Pleasant Hill, CA", "Concord, CA"].includes(t.city),
);

export default function LafayetteContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/areas/lafayette-hero.jpg"
            alt="Custom paver driveway leading to a Lafayette, CA home with mature oak and redwood landscaping"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 60%" }}
            sizes="100vw"
            {...blurProps("/images/areas/lafayette-hero.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-gray-900/65 via-warm-gray-900/55 to-warm-gray-900/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-sans text-warm-gray-300 uppercase tracking-wider">
                <li>
                  <Link href="/" className="hover:text-brand-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/areas" className="hover:text-brand-gold transition-colors">
                    Service Areas
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white">Lafayette, CA</li>
              </ol>
            </nav>
            <SectionLabel className="text-brand-gold">Lafayette, CA</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
              Paver Installation in{" "}
              <span className="text-brand-gold">Lafayette</span>, CA
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-100 font-sans mb-8">
              Custom paver driveways, patios, retaining walls, and outdoor living
              spaces — engineered for Lafayette&apos;s clay soils, hillside lots,
              and oak-shaded properties. Owner Steve Barsanti is on every job from
              first walk-through to final sweep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteButton variant="primary">
                Get a Free Lafayette Estimate
              </QuoteButton>
              <Button href={company.phoneHref} variant="outline-white" external>
                Call {company.phone}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <SectionLabel>Neighborhoods</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Hardscape & Paver Contractor Serving Every Lafayette Neighborhood
            </h2>
            <p className="text-warm-gray-500 font-sans leading-relaxed">
              Over 10+ years working in Lafayette, we&apos;ve learned that every
              neighborhood has its own quirks — soil conditions, lot grades,
              setback rules, tree canopies. Here&apos;s how those differences shape
              the work we do across the city.
            </p>
          </ScrollReveal>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {lafayetteNeighborhoods.map((n) => (
              <m.div
                key={n.name}
                variants={fadeUp}
                className="p-6 rounded-xl bg-cream border border-warm-gray-200"
              >
                <h3 className="text-xl font-serif text-warm-gray-900 mb-2">
                  {n.name}
                </h3>
                <p className="text-warm-gray-600 font-sans text-sm leading-relaxed">
                  {n.note}
                </p>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Soil & Terrain */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl mb-12 md:mb-16">
            <SectionLabel>The Local Reality</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              Why Lafayette&apos;s Soil and Terrain Demand Specialized Paver Work
            </h2>
            <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
              <p>
                Most of Lafayette sits on expansive clay — soil that swells
                when wet and shrinks when dry. It&apos;s the reason cheap concrete
                driveways crack within a few seasons and why paver installs
                with shallow base prep fail in the first heavy winter.
              </p>
              <p>
                We build for those conditions on every Lafayette project: a
                compacted Class II aggregate base (4–6 inches for patios, 6–8
                inches for driveways) installed in lifts, geogrid reinforcement
                behind retaining walls over 4 feet, and active drainage
                management on every hillside lot — French drains, swales, or
                perforated pipe routed away from foundations.
              </p>
              <p>
                The East Bay doesn&apos;t see much freeze-thaw, so the real
                enemy here is wet-season soil movement. Properly installed
                pavers flex with that movement; concrete cracks and asphalt
                ruts. That&apos;s why a paver install done right on Lafayette
                clay outlasts both alternatives by decades.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-warm-white rounded-xl p-6 md:p-10 border border-warm-gray-200">
              <div className="mb-8 md:mb-10 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-serif text-warm-gray-900 mb-2">
                  Our Lafayette Build Spec
                </h3>
                <p className="text-warm-gray-500 font-sans">
                  What sits under every paver driveway, patio, and walkway we install.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
                <PaverCrossSection className="w-full h-auto" />

                <ul className="space-y-4 lg:space-y-0 lg:relative lg:h-full font-sans">
                  {[
                    {
                      letter: "A",
                      title: "Pavers + Polymeric Sand Joints",
                      detail: "hand-laid, swept polymeric joints, sealed",
                      topPct: 16.38,
                    },
                    {
                      letter: "B",
                      title: "1\" Bedding Sand",
                      detail: "ASTM-spec, screeded level",
                      topPct: 29.31,
                    },
                    {
                      letter: "C",
                      title: "Class II Aggregate Base",
                      detail: "4–6\" patios, 6–8\" driveways, compacted in lifts",
                      topPct: 50.52,
                    },
                    {
                      letter: "D",
                      title: "Geotextile Fabric",
                      detail: "stabilizes the base on expansive clay",
                      topPct: 68.28,
                    },
                    {
                      letter: "E",
                      title: "Compacted Subgrade",
                      detail: "excavated to undisturbed grade, re-compacted",
                      topPct: 81.72,
                    },
                  ].map(({ letter, title, detail, topPct }) => (
                    <li
                      key={title}
                      className="lg:absolute lg:inset-x-0 lg:-translate-y-1/2 text-sm leading-snug flex items-start gap-3"
                      style={{ top: `${topPct}%` }}
                    >
                      <span
                        className="lg:hidden shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold text-warm-gray-900 text-xs font-bold mt-px"
                        aria-hidden="true"
                      >
                        {letter}
                      </span>
                      <span className="flex-1">
                        <strong className="text-warm-gray-900 font-semibold">
                          {title}
                        </strong>
                        <span className="text-warm-gray-500"> — {detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Permits & HOA */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Permits & Regulations</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              Lafayette Permit & Tree Ordinance Considerations
            </h2>
            <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
              <p>
                Most Lafayette homeowners are surprised by what triggers a permit
                — and what doesn&apos;t. We&apos;ve been pulling Lafayette
                Planning & Building permits long enough to know which projects
                need what, and we handle the entire submittal as part of our
                service. You don&apos;t navigate City Hall on your own.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">Grading permits</strong>{" "}
                    are required when a project moves significant earth or
                    alters site drainage. Most simple paver replacements
                    don&apos;t trigger one; hillside work and large new
                    installations often do.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Encroachment permits
                    </strong>{" "}
                    are needed for any work in the public right-of-way — driveway
                    aprons, sidewalk cuts, curb modifications — and require
                    Public Works approval before work starts.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Tree protection ordinance
                    </strong>{" "}
                    — Lafayette protects native and heritage trees, especially
                    oaks. Excavation inside a protected tree&apos;s drip line
                    requires hand-digging, root pruning protocols, and
                    coordination with the City Arborist on heritage specimens.
                    Routine on Lafayette Oaks, Reliez Valley, and Hidden Valley
                    projects.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Retaining walls over 4 feet
                    </strong>{" "}
                    require engineered plans and a building permit. We coordinate
                    with structural engineers and submit the package — not your
                    job to figure out.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-3xl">
            <SectionLabel>Featured Lafayette Project</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Custom Spiral Paver Walkway — Lafayette
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Hand-laid paver walkway with custom circular spiral medallion
              inlays, curvilinear edging, and integrated landscape borders. A
              real Lafayette project — designed and built start to finish by our
              team.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/projects/spiral-walkway.jpg"
                alt="Custom spiral paver walkway with medallion inlays in Lafayette, CA"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1200px, 100vw"
                {...blurProps("/images/projects/spiral-walkway.jpg")}
              />
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal>
              <h3 className="text-sm font-sans uppercase tracking-wider text-brand-blue mb-2">
                Scope
              </h3>
              <p className="font-sans text-warm-gray-600 leading-relaxed">
                Front-entry walkway with custom circular medallion inlays,
                curvilinear hand-cut edges, and integrated landscape borders.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h3 className="text-sm font-sans uppercase tracking-wider text-brand-blue mb-2">
                Build Detail
              </h3>
              <p className="font-sans text-warm-gray-600 leading-relaxed">
                4&quot; compacted Class II base, 1&quot; bedding sand, polymeric
                sand joints, spike-anchored edge restraints. Pattern hand-laid
                and saw-cut on site.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h3 className="text-sm font-sans uppercase tracking-wider text-brand-blue mb-2">
                Outcome
              </h3>
              <p className="font-sans text-warm-gray-600 leading-relaxed">
                Sculptural front entry that reads as a custom architectural
                feature — not a poured walkway. Built to outlast 30+ Lafayette
                wet seasons.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-brand-blue font-sans font-medium hover:gap-3 transition-all"
            >
              View more projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <SectionLabel>What We Build</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Paver & Hardscape Services We Install in Lafayette
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Full-service paver installation and outdoor living for Lafayette
              homes — driveways and patios are most of our work, but we build
              every category below.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
            {featuredServiceSlugs.map((slug) => {
              const svc = services.find((s) => s.slug === slug);
              if (!svc) return null;
              return (
                <ScrollReveal key={slug}>
                  <Link href={`/services/${slug}`} className="group block">
                    <h3 className="text-2xl font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-3">
                      {svc.name}
                    </h3>
                    <p className="font-sans text-warm-gray-600 leading-relaxed mb-3">
                      {lafayetteServiceCopy[slug]}
                    </p>
                    <span className="inline-flex items-center gap-1 text-brand-blue text-sm font-sans font-medium">
                      Learn more about {svc.name.toLowerCase()}
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-16 pt-10 border-t border-warm-gray-200">
            <h3 className="text-lg font-serif text-warm-gray-900 mb-5">
              Also installed in Lafayette:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherServices.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="group flex items-center gap-3 text-warm-gray-700 hover:text-brand-blue font-sans transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                    {svc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Materials & Brands</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              What We Install in Lafayette
            </h2>
            <p className="text-warm-gray-500 font-sans leading-relaxed mb-8">
              We work with established paver and segmental wall manufacturers
              with proven track records in Northern California — not whatever
              big-box pallets are cheapest that month. We bring physical
              samples to your consultation so you can see and feel the material
              before deciding.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Belgard",
                desc: "Premium paver lines including Mega-Arbel, Catalina Slate, and Bergerac for traditional and contemporary patio and driveway installations.",
              },
              {
                title: "Calstone",
                desc: "California-manufactured pavers and segmental retaining wall systems engineered for West Coast soil conditions.",
              },
              {
                title: "Basalite",
                desc: "Versatile paver and wall block lines with strong performance in driveway, patio, and structural retaining wall applications.",
              },
              {
                title: "Castlelite",
                desc: "California-made pavers and segmental wall systems with a clean, contemporary range well-suited to East Bay residential builds.",
              },
            ].map((brand) => (
              <ScrollReveal key={brand.title}>
                <div className="bg-warm-white rounded-xl p-6 border border-warm-gray-200 h-full">
                  <h3 className="text-lg font-serif text-warm-gray-900 mb-3">
                    {brand.title}
                  </h3>
                  <p className="text-sm font-sans text-warm-gray-500 leading-relaxed">
                    {brand.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10 max-w-3xl">
            <p className="text-warm-gray-500 font-sans text-sm leading-relaxed">
              <strong className="text-warm-gray-700">Permeable options:</strong>{" "}
              For projects where stormwater management is a priority — common on
              hillside Lafayette lots and properties near creeks — we install
              permeable paver systems that allow infiltration through the joint
              network into a structural drainage base.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us + Testimonials */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ScrollReveal>
              <SectionLabel>Why Lafayette Chooses Us</SectionLabel>
              <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
                Steve Barsanti On Every Lafayette Project — From Day One to Final Walkthrough
              </h2>
              <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
                <p>
                  Most paver companies in the East Bay run multiple crews and
                  rotate the owner between job sites. Steve doesn&apos;t work
                  that way. He personally walks every Lafayette property at the
                  estimate, designs the build, and is on-site every day during
                  construction. You get one point of contact start to finish —
                  not a project manager, not a sales rep.
                </p>
                <p>
                  That&apos;s the difference 10+ years of East Bay-only work
                  buys you: a contractor who&apos;s seen what fails on Lafayette
                  clay, what passes Lafayette permitting, and what holds up
                  through 30+ wet seasons.
                </p>
              </div>

              <ul className="mt-8 space-y-3 font-sans text-warm-gray-700">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  CA License #{company.license}
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                  </svg>
                  {company.warranty}
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Owner on-site every project
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  10+ years serving Contra Costa County
                </li>
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <QuoteButton variant="primary">
                  Get a Free Lafayette Estimate
                </QuoteButton>
                <Button href={company.phoneHref} variant="outline" external>
                  Call {company.phone}
                </Button>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {localTestimonials.map((t) => (
                <ScrollReveal key={t.name}>
                  <figure className="bg-cream rounded-xl p-8 border border-warm-gray-200">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-brand-gold"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="font-sans text-warm-gray-700 leading-relaxed mb-4">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <figcaption className="text-sm font-sans text-warm-gray-500">
                      <strong className="text-warm-gray-900">{t.name}</strong>
                      {" — "}
                      {t.city} · {t.service} · Yelp
                    </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
              <p className="text-xs font-sans text-warm-gray-500">
                Reviews from neighboring Contra Costa County clients.{" "}
                <a
                  href={company.social.yelp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline"
                >
                  Read all reviews on Yelp →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10">
            <SectionLabel>FAQs</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3">
              Frequently Asked Questions About Pavers in Lafayette
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={lafayetteFaqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* Nearby Cities */}
      <section className="py-16 md:py-24 bg-warm-white border-t border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 max-w-2xl">
            <SectionLabel>Nearby</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Other Contra Costa County Areas We Serve
            </h2>
            <p className="text-warm-gray-500 font-sans">
              We work throughout the East Bay — explore neighboring communities
              where we&apos;ve installed driveways, patios, and outdoor living
              spaces.
            </p>
          </ScrollReveal>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
            {sameCountyCities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="group flex items-center gap-3 text-warm-gray-700 hover:text-brand-blue font-sans transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          {otherCountyCities.length > 0 && (
            <p className="text-sm font-sans text-warm-gray-500 mt-8">
              Also serving{" "}
              {otherCountyCities.slice(0, 3).map((c, i) => (
                <span key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-brand-blue hover:underline"
                  >
                    {c.name}
                  </Link>
                  {i < Math.min(otherCountyCities.length, 3) - 1 ? ", " : ""}
                </span>
              ))}
              {" "}and the wider East Bay.{" "}
              <Link href="/areas" className="text-brand-blue hover:underline">
                View all areas →
              </Link>
            </p>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
