"use client";

import Link from "next/link";
import Image from "next/image";
import { cities } from "@/lib/data/cities";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { blurProps } from "@/lib/blur";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ScrollStagger from "@/components/animations/ScrollStagger";
import Button from "@/components/ui/Button";
import QuoteButton from "@/components/ui/QuoteButton";
import FAQAccordion from "@/components/ui/FAQAccordion";
import FinalCTA from "@/components/sections/FinalCTA";
import {
  moragaNeighborhoods,
  moragaServiceCopy,
  moragaSteveNote,
  moragaFaqs,
} from "./content";

// Different featured-service mix from Lafayette to avoid templated feel
// across city pages — see CLAUDE.md design decision on city-page variation.
const featuredServiceSlugs = [
  "paver-driveways",
  "retaining-walls",
  "patios",
  "fire-pits",
  "artificial-turf",
];

const otherServices = services.filter(
  (s) => !featuredServiceSlugs.includes(s.slug),
);

// Adjacent-city linking only — research showed dump-all-cities footers
// trigger thin-content suppression. Lafayette + Orinda + Walnut Creek are
// the geographically adjacent picks.
const adjacentSlugs = ["lafayette", "orinda", "walnut-creek"];
const nearbyCities = cities.filter((c) => adjacentSlugs.includes(c.slug));
const otherCountyCities = cities.filter(
  (c) => !adjacentSlugs.includes(c.slug) && c.slug !== "moraga",
);

// No Moraga-specific Yelp testimonials yet — using Contra Costa County
// neighbors (Pleasant Hill + Concord) as the closest-affinity proof.
const localTestimonials = testimonials.filter((t) =>
  ["Pleasant Hill, CA", "Concord, CA"].includes(t.city),
);

export default function MoragaContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/areas/moraga-hero.jpg"
            alt="Custom curving paver walkway with landscape lighting through lush plantings at a Moraga, CA home"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 55%" }}
            sizes="100vw"
            {...blurProps("/images/areas/moraga-hero.jpg")}
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
                <li className="text-white">Moraga, CA</li>
              </ol>
            </nav>
            <SectionLabel className="text-brand-gold">Moraga, CA</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mt-4 mb-6">
              Paver Installation in{" "}
              <span className="text-brand-gold">Moraga</span>, CA
            </h1>
            <p className="text-lg md:text-xl text-warm-gray-100 font-sans mb-8 leading-relaxed">
              Custom paver driveways, retaining walls, patios, and outdoor
              living spaces — engineered for Moraga&apos;s expansive clay,
              hillside grades, GHAD parcels, and the Town&apos;s pervious-paving
              code. Owner Steve Barsanti is on every job from first walk-through
              to final sweep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteButton variant="primary">
                Get a Free Moraga Estimate
              </QuoteButton>
              <Button href={company.phoneHref} variant="outline-white" external>
                Call {company.phone}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lead hook — Moraga's pervious-driveway rule. This is the
          unique-to-Moraga angle that no other city page can replicate. */}
      <section className="py-16 md:py-24 bg-warm-white border-y border-warm-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ScrollReveal>
              <SectionLabel>Moraga&apos;s Pervious Code</SectionLabel>
              <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
                Why Long Driveways in Moraga Have to Be Permeable
              </h2>
              <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
                <p>
                  Most Moraga homeowners don&apos;t know this until they start
                  designing: per the Town&apos;s municipal code, driveway paving
                  longer than 50 feet or wider than 16 feet must use pervious
                  materials. Most estate driveways here cross one or both
                  thresholds — Sanders Ranch, Carr Ranch, the Bluffs, Bellavista,
                  the older Rheem Boulevard properties.
                </p>
                <p>
                  We install permeable paver systems that satisfy the code,
                  infiltrate stormwater into a structural drainage base, and
                  read as finished hardscape — not a compromise. The base
                  buildup is more involved than a standard install: an open-graded
                  aggregate reservoir, geotextile separation, and outflow
                  controls sized to the drive area.
                </p>
                <p>
                  For shorter driveways under both thresholds, we build the
                  standard interlocking-paver spec — 6–8 inches of compacted
                  Class II base over geotextile, edge restraints, and polymeric
                  sand joints. Either way, you get a written estimate with the
                  permit path called out before work starts.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-cream rounded-xl p-8 border border-warm-gray-200">
                <h3 className="text-xl font-serif text-warm-gray-900 mb-6">
                  The Moraga Driveway Decision Tree
                </h3>
                <ul className="space-y-5 font-sans">
                  <li>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        1
                      </span>
                      <div>
                        <p className="font-semibold text-warm-gray-900">
                          Under 50 ft long AND under 16 ft wide
                        </p>
                        <p className="text-sm text-warm-gray-500">
                          Standard interlocking pavers. Base spec built for
                          expansive clay.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        2
                      </span>
                      <div>
                        <p className="font-semibold text-warm-gray-900">
                          Over 50 ft long OR over 16 ft wide
                        </p>
                        <p className="text-sm text-warm-gray-500">
                          Pervious paver system required by code. Open-graded
                          base + outflow controls.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        3
                      </span>
                      <div>
                        <p className="font-semibold text-warm-gray-900">
                          Wider than the garage opening
                        </p>
                        <p className="text-sm text-warm-gray-500">
                          Planning Commission approval required regardless of
                          length. We submit the package.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-brand-gold text-warm-gray-900 text-xs font-bold flex items-center justify-center mt-0.5">
                        +
                      </span>
                      <div>
                        <p className="font-semibold text-warm-gray-900">
                          Touches the curb or right-of-way
                        </p>
                        <p className="text-sm text-warm-gray-500">
                          Encroachment Permit from the Town Engineer. Always.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-12 max-w-3xl">
            <SectionLabel>Neighborhoods</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-4">
              Hardscape & Paver Contractor Serving Every Moraga Neighborhood
            </h2>
            <p className="text-warm-gray-500 font-sans leading-relaxed">
              Over 10+ years working in Moraga, we&apos;ve learned that every
              neighborhood has its own quirks — soil conditions, lot grades, HOA
              rules, GHAD overlays. Here&apos;s how those differences shape the
              work we do across the town.
            </p>
          </ScrollReveal>

          <ScrollStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moragaNeighborhoods.map((n) => (
              <div
                key={n.name}
                className="p-6 rounded-xl bg-warm-white border border-warm-gray-200 h-full"
              >
                <h3 className="text-xl font-serif text-warm-gray-900 mb-2">
                  {n.name}
                </h3>
                <p className="text-warm-gray-600 font-sans text-sm leading-relaxed">
                  {n.note}
                </p>
              </div>
            ))}
          </ScrollStagger>
        </div>
      </section>

      {/* Permits & Regulations */}
      <section className="py-16 md:py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <SectionLabel>Permits & Regulations</SectionLabel>
            <h2 className="text-3xl md:text-4xl text-warm-gray-900 mt-3 mb-6">
              Moraga Permit, GHAD, and Tree Ordinance Considerations
            </h2>
            <div className="space-y-4 text-warm-gray-600 font-sans leading-relaxed">
              <p>
                Most Moraga projects involve at least one of these — pervious
                paving, hillside grading, GHAD coordination, or tree protection.
                We pull every permit as part of the project. You don&apos;t
                navigate the planning counter on your own.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Hillside Development Permit
                    </strong>{" "}
                    — required for any project on a slope of 20% or steeper.
                    Triggers a geotechnical report peer-reviewed by the
                    Town&apos;s consultant. Slopes ≥25% go to the Planning
                    Commission. Adds 4–8 weeks to permitting.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Grading permit
                    </strong>{" "}
                    — required for earthwork over 50 cubic yards or any cut/fill
                    deeper than 3 feet. Most paver driveways on hillside lots
                    cross this threshold.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Retaining walls
                    </strong>{" "}
                    — building permit required over 3 feet. Maximum 5 feet (3
                    feet if visible from off-site). Stacked walls must terrace
                    at 2× the height of the larger wall and sit at least 3 feet
                    from the property line.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Encroachment Permit
                    </strong>{" "}
                    — required from the Town Engineer for any work in the public
                    right-of-way: curb cuts, driveway aprons, sidewalk
                    modifications.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Native tree permit
                    </strong>{" "}
                    — Moraga regulates removal of and excavation near native
                    trees including Coast Live Oak, valley oak, bay, redwood,
                    and knobcone pine. Drip-line excavation triggers
                    hand-digging and may require arborist sign-off.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      Moraga GHAD overlay
                    </strong>{" "}
                    — Bellavista, Hetfield Estates, and Palos Colorados parcels
                    sit inside the Geologic Hazard Abatement District. Earthwork
                    must respect the GHAD Plan of Control; we coordinate with
                    the GHAD manager.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                  <span>
                    <strong className="text-warm-gray-900">
                      HOA design review
                    </strong>{" "}
                    — required for Moraga Country Club and Sanders Ranch
                    properties. We draft the submittal and walk it through
                    review before town permitting.
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
              Paver & Hardscape Services We Install in Moraga
            </h2>
            <p className="text-warm-gray-500 font-sans">
              Full-service paver installation and outdoor living for Moraga
              homes — driveways and retaining walls are most of our work, but
              we build every category below.
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
                      {moragaServiceCopy[slug]}
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
              Also installed in Moraga:
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
                Why Moraga Homes Last 30+ Years on Our Spec
              </h2>
              <blockquote className="font-serif text-xl md:text-2xl text-warm-gray-900 leading-relaxed mb-6 border-l-2 border-brand-gold pl-6">
                {moragaSteveNote.replace(/ — Steve Barsanti, Owner$/, "")}
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
                  Get a Free Moraga Estimate
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
              Frequently Asked Questions About Pavers in Moraga
            </h2>
          </ScrollReveal>

          <ScrollReveal>
            <FAQAccordion faqs={moragaFaqs} />
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
              Moraga sits at the heart of Lamorinda. We work the same way in
              the neighboring communities below.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyCities.map((c) => (
              <ScrollReveal key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="group block p-6 rounded-xl bg-cream border border-warm-gray-200 hover:border-brand-blue/40 hover:shadow-sm transition-[color,background-color,border-color,box-shadow] duration-200 ease-out h-full"
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
