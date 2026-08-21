/**
 * Shared schema.org entity IDs and the canonical Steve Barsanti Person object.
 *
 * The whole point is ONE authoritative entity graph: the business defines Steve
 * as its `founder` (full object, rendered on every page via LocalBusinessJsonLd),
 * and blog posts reference that same Steve by `@id` as their author. Google then
 * consolidates "Steve Barsanti, blog author" and "Steve Barsanti, owner of
 * Lamorinda Pavers" into a single trusted entity — the E-E-A-T signal that a
 * bare, disconnected author name can't carry.
 */
import { company } from "@/lib/data/company";

export const BUSINESS_ID = `${company.domain}/#business`;
export const STEVE_ID = `${company.domain}/#steve`;

/** Full Person definition — rendered once per page inside LocalBusiness.founder. */
export const stevePerson = {
  "@type": "Person",
  "@id": STEVE_ID,
  name: company.owner,
  url: `${company.domain}/about`,
  jobTitle: "Owner",
  worksFor: { "@id": BUSINESS_ID },
  knowsAbout: [
    "Paver installation",
    "Hardscape construction",
    "Outdoor living design",
    "Retaining walls",
    "Paver driveways",
  ],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    name: `California CSLB Contractor License #${company.license}`,
  },
  sameAs: [company.social.yelp],
};

/** Reference-only handle used where the full Person is already on the page. */
export const stevePersonRef = { "@id": STEVE_ID };
