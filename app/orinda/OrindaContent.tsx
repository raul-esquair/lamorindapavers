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
import {
  orindaNeighborhoods,
  orindaServiceCopy,
  orindaSteveNote,
  orindaFaqs,
} from "./content";

// Different featured-service mix from Lafayette and Moraga to avoid
// templated feel. Pool decks and water features lead because Orinda's
// older established homes (OCC, Sleepy Hollow, Glorietta) frequently
// upgrade aging deck and pool surrounds.
const featuredServiceSlugs = [
  "paver-driveways",
  "retaining-walls",
  "pool-decks",
  "water-features",
  "outdoor-kitchens",
];

const otherServices = services.filter(
  (s) => !featuredServiceSlugs.includes(s.slug),
);

const adjacentSlugs = ["lafayette", "moraga", "walnut-creek"];
const nearbyCities = cities.filter((c) => adjacentSlugs.includes(c.slug));
const otherCountyCities = cities.filter(
  (c) => !adjacentSlugs.includes(c.slug) && c.slug !== "orinda",
);

const localTestimonials = testimonials.filter((t) =>
  ["Pleasant Hill, CA", "Concord, CA"].includes(t.city),
);

export default function OrindaContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/areas/orinda-hero.jpg"
            alt="Custom paver patio with circular stone-walled tree planter and integrated landscape lighting at an Orinda, CA home"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 55%" }}
            sizes="100vw"
            {...blurProps("/images/areas/orinda-hero.jpg")}
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
                <li className="text-white">Orinda, CA</li>
              </ol>
            </nav>
            <SectionLabel className="text-brand-gold">Orinda, CA</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
              Paver Installation in{" "}
              <span className="text-brand-gold">Orinda</span>, CA
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-100 font-sans mb-8 leading-relaxed">
              Custom paver driveways, retaining walls, pool decks, and outdoor
              living spaces — engineered for Orinda&apos;s steep terrain,
              expansive Orinda Formation clay, and the city&apos;s strict tree
              and ridgeline ordinances. Owner Steve Barsanti is on every
              project from estimate to final walkthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteButton variant="primary">
                Get a Free Orinda Estimate
              </QuoteButton>
              <Button href={company.phoneHref} variant="outline-white" external>
                Call {company.phone}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lead hook — the Orinda Formation soil story + cross-section diagram.
          This is Orinda's unique angle: it's the type locality of the
          formation that defines the East Bay's expansive-clay problem. */}
      <section className="py-16 md:py-24 bg-warm-white border-y border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl mb-12 md:mb-16">
            <SectionLabel>The Orinda Formation</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              Why Pavers in Orinda Need a Different Spec Than Almost Anywhere Else
            </h2>
            <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
              <p>
                Orinda is the type locality of the Orinda Formation — the
                Miocene-era expansive clay bedrock that runs under most of
                Lamorinda. The Association of Engineering Geologists has
                documented Orinda as having the highest landslide-induced
                property damage of any U.S. community over the past century.
                It&apos;s the soil story most paver companies don&apos;t want
                to tell you, because the standard install spec doesn&apos;t
                hold up to it.
              </p>
              <p>
                The clay swells in winter and shrinks in summer. Concrete
                driveways laid over it crack within a few seasons. Asphalt
                ruts. Even pavers fail if the base is built to the West Bay
                norm — 4 inches of aggregate is not enough on this soil. We
                run the numbers up: 6 to 8 inches of compacted Class II base,
                installed in lifts, over geotextile separation fabric over
                compacted subgrade. Every driveway. Every patio over 4
                inches deep.
              </p>
              <p>
                Properly installed pavers flex with seasonal soil movement
                instead of cracking. That&apos;s why a paver install done
                right on Orinda clay outlasts both poured concrete and
                asphalt by decades, and it&apos;s why our 5-year workmanship
                warranty is meaningful here when shorter warranties from
                cheaper installs don&apos;t survive their own term.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-cream rounded-xl p-6 md:p-10 border border-warm-gray-200">
              <div className="mb-8 md:mb-10 max-w-2xl mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-serif text-warm-gray-900 mb-2">
                  Our Orinda Build Spec
                </h3>
                <p className="text-warm-gray-500 font-sans">
                  What sits under every paver driveway, patio, and walkway we
                  install on Orinda Formation clay.
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
                      detail: "6–8\" driveways, 4–6\" patios, compacted in lifts",
                      topPct: 50.52,
                    },
                    {
                      letter: "D",
                      title: "Geotextile Fabric",
                      detail: "stabilizes base on Orinda Formation clay",
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

      {/* Neighborhoods */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <SectionLabel>Neighborhoods</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Hardscape & Paver Contractor Serving Every Orinda Neighborhood
            </h2>
            <p className="text-warm-gray-500 font-sans leading-relaxed">
              Over 10+ years working in Orinda, we&apos;ve learned that every
              neighborhood has its own quirks — slope, soil, tree canopy, HOA
              design rules, ridgeline overlays. Here&apos;s how those
              differences shape the work we do across the city.
            </p>
          </ScrollReveal>

          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {orindaNeighborhoods.map((n) => (
              <m.div
                key={n.name}
                variants={fadeUp}
                className="p-6 rounded-xl bg-warm-white border border-warm-gray-200"
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

      {/* Permits & Tree Ordinance */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Permits & Regulations</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              Orinda Permit, Tree Ordinance, and Ridgeline Considerations
            </h2>
            <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
              <p>
                Orinda&apos;s development code is among the strictest in
                Contra Costa County — for good reason, given the soil and
                slope. We pull every permit as part of the project and have
                been through these submittals enough times to know what each
                planner is looking for.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Tree protection (OMC Ch. 17.21)
                    </strong>{" "}
                    — on developed property, any oak species 12 inches in
                    diameter or larger requires a permit. Riparian trees 4.5
                    inches or larger within 30 feet of a watercourse also
                    require a permit. Drip-line excavation typically triggers
                    arborist sign-off. The April 2025 Ord 25-03 update added
                    review factors but kept the diameter thresholds.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Grading permit (OMC §15.36)
                    </strong>{" "}
                    — required for earthwork over 50 cubic yards or any cut
                    slope steeper than 2:1 horizontal-to-vertical at heights
                    over 7 feet. Most hillside paver scopes cross at least
                    one threshold.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Retaining walls
                    </strong>{" "}
                    — building permit over 3 feet. Maximum 4 feet within 10
                    feet of a property line or in a required setback;
                    maximum 8 feet elsewhere. Anything taller requires an
                    Exception Permit, which we coordinate.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Ridgeline & Environmental Preservation Overlay
                    </strong>{" "}
                    — properties inside this overlay get additional
                    Planning Department review covering ridge silhouettes,
                    mature trees, and natural drainage. We confirm overlay
                    status before scoping any project.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Encroachment Permit
                    </strong>{" "}
                    — required from Public Works for any work touching the
                    public-street connection: curb cuts, driveway aprons,
                    sidewalk modifications. Pulled on every applicable
                    project.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      HOA / club design review
                    </strong>{" "}
                    — Wilder, Orindawoods, and Orinda Country Club parcels
                    require architectural sign-off before town permitting. We
                    draft the submittal package and walk it through review
                    as part of the project.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <SectionLabel>What We Build</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Paver & Hardscape Services We Install in Orinda
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Full-service paver installation and outdoor living for Orinda
              homes — driveways, retaining walls, and pool deck upgrades on
              older established lots are most of our work, but we build every
              category below.
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
                      {orindaServiceCopy[slug]}
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
              Also installed in Orinda:
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

      {/* Signed note from Steve + testimonials */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ScrollReveal>
              <SectionLabel>From the Owner</SectionLabel>
              <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
                Why Orinda&apos;s Soil Story Shapes Every Spec We Write
              </h2>
              <blockquote className="font-serif text-xl md:text-2xl text-warm-gray-900 leading-relaxed mb-6 border-l-2 border-brand-gold pl-6">
                {orindaSteveNote.replace(/ — Steve Barsanti, Owner$/, "")}
              </blockquote>
              <p className="font-sans text-warm-gray-500 text-sm">
                — Steve Barsanti, Owner · CA License #{company.license}
              </p>

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
                  Get a Free Orinda Estimate
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
              Frequently Asked Questions About Pavers in Orinda
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={orindaFaqs} />
          </ScrollReveal>
        </div>
      </section>

      {/* Nearby Cities — adjacent only */}
      <section className="py-16 md:py-24 bg-warm-white border-t border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 max-w-2xl">
            <SectionLabel>Nearby</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Adjacent Communities We Also Serve
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Orinda anchors the western edge of Lamorinda. We work the same
              way in the neighboring communities below.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyCities.map((c) => (
              <ScrollReveal key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="group block p-6 rounded-xl bg-cream border border-warm-gray-200 hover:border-brand-blue/40 hover:shadow-sm transition-all h-full"
                >
                  <h3 className="text-xl font-serif text-warm-gray-900 group-hover:text-brand-blue transition-colors mb-2">
                    {c.name}
                  </h3>
                  <p className="text-sm font-sans text-warm-gray-500 mb-3">
                    {c.county} County
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-sans font-medium text-brand-blue">
                    See {c.name} page
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {otherCountyCities.length > 0 && (
            <p className="text-sm font-sans text-warm-gray-500 mt-10">
              We also serve the wider East Bay including{" "}
              {otherCountyCities.slice(0, 4).map((c, i) => (
                <span key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-brand-blue hover:underline"
                  >
                    {c.name}
                  </Link>
                  {i < Math.min(otherCountyCities.length, 4) - 1 ? ", " : ""}
                </span>
              ))}
              .{" "}
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
