"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { blurProps } from "@/lib/blur";
import QuoteButton from "@/components/ui/QuoteButton";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/areas", label: "Areas" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <m.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-warm-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="relative z-10 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Lamorinda Pavers"
                width={220}
                height={60}
                priority
                className={`h-12 lg:h-16 w-auto transition-all duration-500 ${
                  isScrolled ? "" : "brightness-0 invert"
                }`}
                {...blurProps("/images/logo.png")}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-sans font-medium tracking-wide transition-colors ${
                    isScrolled
                      ? "text-warm-gray-700 hover:text-brand-blue"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA + Phone */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={company.phoneHref}
                className={`text-sm font-sans font-medium transition-colors ${
                  isScrolled
                    ? "text-warm-gray-600 hover:text-brand-blue"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {company.phone}
              </a>
              <QuoteButton size="sm">Get a Free Quote</QuoteButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-10 w-10 h-10 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 flex flex-col gap-1.5">
                <m.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className={`block h-0.5 w-full transition-colors ${
                    isMobileMenuOpen ? "bg-white" : isScrolled ? "bg-warm-gray-800" : "bg-white"
                  }`}
                />
                <m.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`block h-0.5 w-full transition-colors ${
                    isMobileMenuOpen ? "bg-white" : isScrolled ? "bg-warm-gray-800" : "bg-white"
                  }`}
                />
                <m.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className={`block h-0.5 w-full transition-colors ${
                    isMobileMenuOpen ? "bg-white" : isScrolled ? "bg-warm-gray-800" : "bg-white"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </m.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-warm-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <m.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-serif text-white hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </m.div>
              ))}

              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.08 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <a
                  href={company.phoneHref}
                  className="text-lg font-sans text-warm-gray-300 hover:text-white transition-colors"
                >
                  {company.phone}
                </a>
                <QuoteButton size="md">Get a Free Quote</QuoteButton>
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
