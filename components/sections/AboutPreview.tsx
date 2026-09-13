"use client";

import Image from "next/image";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";

const OWNER_PHOTO = "/images/steve-barsanti-family.jpg";

const differentiators = [
  {
    title: "Owner On-Site",
    description: "Steve Barsanti personally oversees every project from start to finish.",
  },
  {
    title: "Decade of Expertise",
    description: "Over 10 years of trusted craftsmanship in the East Bay.",
  },
  {
    title: "Premium Materials",
    description: "We source only the highest quality pavers and materials for lasting results.",
  },
  {
    title: "Full-Service",
    description: "From design consultation to final walkthrough — we handle everything.",
  },
];

export default function AboutPreview() {
  return (
    <section className="py-20 md:py-32 bg-warm-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <ScrollReveal direction="left">
            <div className="relative">
              {/* 4:3 to match the photo — it's a landscape group shot, and a
                  portrait crop would cut off one of the three people. */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-warm-gray-200">
                <Image
                  src={OWNER_PHOTO}
                  alt={`${company.owner}, owner of ${company.name}, with his wife and son`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...blurProps(OWNER_PHOTO)}
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:bottom-8 md:-right-6 bg-brand-blue text-white rounded-xl p-6 shadow-xl">
                <span className="text-3xl font-serif font-bold block">{company.yearsInBusiness}</span>
                <span className="text-sm font-sans">Years of<br />Excellence</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Content Side */}
          <ScrollReveal direction="right">
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="text-4xl md:text-5xl text-warm-gray-900 mt-4 mb-6">
              Built on Trust,<br />Driven by Craft
            </h2>
            <p className="text-lg text-warm-gray-500 font-sans mb-8 leading-relaxed">
              When you choose {company.name}, you get more than a contractor — you get
              a partner invested in transforming your vision into reality. Owner Steve
              Barsanti built this company on word-of-mouth referrals, and that reputation
              for quality drives everything we do.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {differentiators.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-gold mt-2 shrink-0" />
                  <div>
                    <h4 className="font-sans font-semibold text-warm-gray-800 text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-warm-gray-500 font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button href="/about" variant="outline">
              More About Us
            </Button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
