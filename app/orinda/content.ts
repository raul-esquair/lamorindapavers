// Sourced from City of Orinda FAQs (cityoforinda.gov), OMC §15.36 grading
// rules, OMC Ch. 17.21 (Tree Management), Ord 25-03 (April 2025 update),
// Wikipedia/AEG study on the Orinda Formation, and CCC Clean Water (C.3).
// Specific numeric thresholds (slope %, wall heights, tree diameters,
// grading volumes) reflect city-published values as of May 2026 — confirm
// with the Planning counter (925-253-4210) before relying on any single
// number on a real submittal.

// Curated blog guides for the Orinda page. Tied to Orinda's soil/base lead
// hook (compaction + settling) plus one ROI angle — a DIFFERENT set and a
// different on-page placement than Lafayette's, per the anti-doorway rules.
export const orindaGuideSlugs = [
  "what-is-paver-base-compaction-and-why-it-matters",
  "how-to-prevent-paver-patio-sinking-2026",
  "paver-outdoor-living-roi-for-home-resale-in-2026",
];

export const orindaNeighborhoods = [
  {
    name: "Sleepy Hollow",
    note: "Winding tree-shaded roads through hilly terrain east of downtown. Long curving hillside driveways are the signature build here — paver work almost always includes grading, drainage, and retaining.",
  },
  {
    name: "Orinda Country Club",
    note: "Older established homes around the OCC golf course, founded 1924. Many driveways are first-replacement after 50+ years. Club-level architecture review applies to many parcels — we coordinate the package.",
  },
  {
    name: "Orinda Downs",
    note: "Prestigious large-lot estates north of Highway 24. Grading, motor courts, and engineered retaining are common at this scale. HOA design review presence varies — we verify scope before submittal.",
  },
  {
    name: "Glorietta",
    note: "Family-focused south Orinda neighborhood around Glorietta Elementary. Mix of flatter lots near the school and rolling lots elsewhere. Strong community feel and a steady flow of patio and walkway projects.",
  },
  {
    name: "Wilder",
    note: "Newer master-planned community of ~245 homes south of Highway 24 near Cal Shakes. Mid-century-modern, ranch, Spanish Mission, and Pueblo Revival architecture. Active HOA design review is mandatory before town permitting.",
  },
  {
    name: "El Toyonal",
    note: "Rustic, secluded large lots on steep terrain west of Camino Pablo. Significant geotechnical and access challenges — and the densest tree canopy in the city. Hand-dig and access logistics are baked into the scope.",
  },
  {
    name: "Orindawoods",
    note: "Townhome and condo enclave with community pool and tennis. Lower-maintenance scale but full HOA design review. Our work here tends to be patios, walkways, and entry features.",
  },
  {
    name: "Del Rey",
    note: "South Orinda neighborhood around Del Rey Elementary. Mid-century stock, many homes expanding outdoor living spaces in their second or third generation of ownership.",
  },
  {
    name: "Ivy Drive & Moraga Way Corridor",
    note: "Flatter pockets of south Orinda — mid-century ranches, expanded homes, more conventional suburban lots. Larger straightforward patio and driveway scopes are common here.",
  },
  {
    name: "Lost Valley & Donald Drive",
    note: "Smaller, rural-feel pockets at the edges of town. Long private drives, hillside features, and creek-adjacent lots that need careful drainage and riparian-tree attention.",
  },
];

// 5 featured services for Orinda — different mix from Moraga and Lafayette.
// Pool decks and water features are emphasized because Orinda's older
// established homes (especially in OCC and Sleepy Hollow) are often
// upgrading aging deck and pool surrounds.
export const orindaServiceCopy: Record<string, string> = {
  "paver-driveways":
    "From estate motor courts in Orinda Downs to long winding driveways in Sleepy Hollow and El Toyonal, we replace cracked concrete and tired asphalt with engineered paver systems built for hillside grades and Orinda Formation clay. Every driveway includes a 6–8 inch compacted Class II base over geotextile, edge restraints, and polymeric sand joints. Permeable paver systems are an option where stormwater management or creek-proximity matters.",
  "retaining-walls":
    "Hillside Orinda — Sleepy Hollow, El Toyonal, Orinda Country Club, Orinda Downs — almost always needs engineered retaining walls. We build segmental block, structural concrete, and natural stone walls with proper drainage and geogrid reinforcement. The city limits walls to 4 feet within 10 feet of a property line and 8 feet elsewhere; anything over those thresholds requires an Exception Permit, which we coordinate.",
  "pool-decks":
    "Many of Orinda's pools are 30 to 60 years old, with concrete decking that's cracked, faded, or never matched the home's architecture. Replacing it with slip-resistant, heat-reflective pavers transforms how the pool looks and feels underfoot. We work around the existing pool structure without disturbing it, and detail the coping and edge profile so the deck reads as designed, not patched on.",
  "water-features":
    "Orinda's older established lots — especially in OCC, Glorietta, and Sleepy Hollow — are ideal for integrated water features. Custom fountains, runnels, and pondless waterfalls work into paver patios and entry walkways with proper waterproofing, recirculation, and integrated lighting. We coordinate plumbing and electrical with the broader hardscape package.",
  "outdoor-kitchens":
    "Orinda's mild climate and large lots make outdoor entertaining a year-round option. We build custom outdoor kitchens with built-in grills, granite or stone countertops, refrigerators, and integrated lighting — coordinated with electrical, plumbing, and gas line work and detailed to match the home's architecture rather than reading as a kit.",
};

export const orindaSteveNote = `Orinda is the type locality of the Orinda Formation — the same expansive clay bedrock that runs under Moraga and Lafayette, but with the steepest developed terrain of the three. The Association of Engineering Geologists has documented Orinda as having the highest landslide-induced property damage of any U.S. community over the past century. That's not a sales line — it's why our specs run 6–8 inches of compacted aggregate base over geotextile on every driveway here, why we engineer drainage on every hillside lot, and why our retaining walls always carry geogrid. Done right, pavers outlast both concrete and asphalt by decades on this soil. — Steve Barsanti, Owner`;

export const orindaFaqs = [
  {
    question: "Do I need a permit to replace or expand my driveway in Orinda?",
    answer:
      "Any work that touches the public-street connection — curb cuts, driveway aprons, sidewalk modifications — requires an Encroachment Permit from Public Works. A like-for-like paver replacement that doesn't touch the curb usually doesn't need a building permit, but expansions, grade changes, and any project that alters site drainage may. We pull the Encroachment Permit on every project that needs one and handle the entire submittal at the city counter.",
  },
  {
    question: "My property is in the Ridgeline & Environmental Preservation Overlay. What extra review applies?",
    answer:
      "Properties inside the Ridgeline & Environmental Preservation Overlay District have to disclose the overlay on planning applications, and projects that affect ridge silhouettes, mature trees, or natural drainage patterns get additional Planning Department review. We confirm overlay status before scoping, design within the constraints, and submit the package as part of the project — you don't navigate it on your own.",
  },
  {
    question: "I have a 14-inch Coast Live Oak six feet from my proposed patio. Is that a permit-triggering tree?",
    answer:
      "Yes. On developed property, Orinda requires a tree permit for any oak species 12 inches in diameter or larger. Excavation inside the drip line — even for a paver subbase — typically triggers review. We coordinate arborist sign-off, hand-dig where machine excavation isn't safe for roots, and design the patio edge to respect the canopy. The April 2025 ordinance update (Ord 25-03) added review factors but didn't change the diameter thresholds.",
  },
  {
    question: "My lot is on a hillside in Sleepy Hollow or El Toyonal. When does Orinda require a grading permit?",
    answer:
      "A grading permit is required if the project moves 50 cubic yards or more of earth, or creates a cut slope steeper than 2:1 horizontal-to-vertical at heights over 7 feet. Most paver driveways and patios on hillside lots cross one or both thresholds. The permit requires a geotechnical report on most steep sites, which we coordinate. Budget 4–6 weeks of permitting time on hillside projects of any meaningful scope.",
  },
  {
    question: "I live in Wilder, Orindawoods, or Orinda Country Club. What's the design review path before I pull a city permit?",
    answer:
      "Wilder and Orindawoods both have active HOA design review with their own architectural guidelines — submittal package, sometimes a review meeting, and a stamp before town permitting. Orinda Country Club has club-level architecture review for many member parcels. We've been through these processes many times — we draft the submittal package, walk it through to approval, and then file with the city as part of the project.",
  },
  {
    question: "Will my new patio and walkways count toward Orinda's stormwater rules?",
    answer:
      "Most single-family residential projects fall well below the 10,000 square feet of impervious creation/replacement that triggers full Provision C.3 review. But Orinda's creek-proximity lots and the city's overall watershed sensitivity mean pervious paver systems are still a recognized compliance pathway and good neighbor practice — especially in Sleepy Hollow and Lost Valley where homes back onto Lauterwasser or San Pablo Creek tributaries.",
  },
  {
    question: "Are retaining walls allowed on the property line in Orinda?",
    answer:
      "Within 10 feet of a property line — or in any required setback, whichever is greater — retaining walls are limited to 4 feet in height. Elsewhere on the lot, walls can go up to 8 feet. Anything taller requires an Exception Permit. Walls over 3 feet require a building permit and engineered plans. We coordinate the structural engineer and the permit submittal; you don't manage the engineering chain.",
  },
  {
    question: "Why does Orinda's clay soil need different paver base prep than flatter parts of the East Bay?",
    answer:
      "Orinda is the type locality of the Orinda Formation — montmorillonite-rich expansive clay with documented landslide history and significant seasonal soil movement. Standard 4-inch aggregate base prep fails here within a few wet seasons. Our Orinda build spec uses a 6–8 inch compacted Class II aggregate base installed in lifts, geotextile separation fabric over compacted subgrade, edge restraints, and polymeric sand joints. Pavers flex with the soil; concrete cracks and asphalt ruts. That's why a properly built paver install on Orinda clay outlasts both alternatives by decades.",
  },
];
