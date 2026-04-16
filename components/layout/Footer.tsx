import Link from "next/link";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";

const quickLinks = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-gray-900 text-warm-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Lamorinda Pavers"
                width={180}
                height={50}
                className="h-10 w-auto brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-sm leading-relaxed text-warm-gray-400 mb-6">
              {company.description}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={company.phoneHref}
                className="hover:text-white transition-colors font-medium"
              >
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="hover:text-white transition-colors"
              >
                {company.email}
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-sans font-semibold text-sm tracking-wider uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {services.slice(0, 8).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-brand-gold hover:text-brand-gold-dark transition-colors font-medium"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-sans font-semibold text-sm tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5 5.012L16.18 20 10 16.428 3.82 20 5 13.6 0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                </svg>
                <span>Licensed #{company.license}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{company.warranty}</span>
              </div>
            </div>
          </div>

          {/* Service Area Column */}
          <div>
            <h3 className="text-white font-sans font-semibold text-sm tracking-wider uppercase mb-4">
              Service Area
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-gray-500 mb-2">Lamorinda</p>
                <ul className="space-y-1">
                  {company.serviceArea.primary.map((city) => (
                    <li key={city}>
                      <Link
                        href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-warm-gray-500 mb-2">Greater East Bay</p>
                <ul className="space-y-1">
                  {[...company.serviceArea.secondary, ...company.serviceArea.extended.slice(0, 4)].map((city) => (
                    <li key={city}>
                      <Link
                        href={`/${city.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-gray-500">
            &copy; {currentYear} {company.name}. All rights reserved.
          </p>
          <p className="text-xs text-warm-gray-500">
            Serving the East Bay &middot; CA License #{company.license}
          </p>
        </div>
      </div>
    </footer>
  );
}
