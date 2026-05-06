// Sourced from City of Moraga FAQs (moraga.ca.us), MOFD abatement rules,
// Moraga GHAD (moragaghad.org), Moraga Country Club ARC rules, and the
// AEG Orinda Formation landslide study. Specific numeric thresholds
// (slope %, wall heights, driveway widths, tree-permit triggers) reflect
// city-published values as of May 2026 — confirm with the planning counter
// (925-888-7040) before relying on any single number on a real submittal.

export const moragaNeighborhoods = [
  {
    name: "Moraga Country Club",
    note: "Gated community wrapped around the private golf course. ARC design review is required before any driveway, patio, or wall work — we handle the HOA submittal in parallel with town permitting.",
  },
  {
    name: "Sanders Ranch",
    note: "1980s development on the east side near Donald Drive. Larger lots, hillside grades, and HOA design review. Retaining walls and graded driveway approaches are routine here.",
  },
  {
    name: "Campolindo",
    note: "The neighborhood band around Campolindo High. Mid-century ranch homes on level-to-rolling lots with mature oak canopy — many original aggregate-concrete driveways are now end-of-life.",
  },
  {
    name: "Rheem Valley",
    note: "The 1960s heart of Moraga, around Rheem Boulevard. Ranch, split-level, and Mediterranean homes on flatter lots. Most driveways are approaching 60 years old and overdue for replacement.",
  },
  {
    name: "The Bluffs",
    note: "Hillside homes with views — slope work, drainage management, and engineered retaining walls are part of nearly every project up here.",
  },
  {
    name: "Carr Ranch",
    note: "Smaller enclave of custom homes on hillside lots. Each project is one-of-one — we design the hardscape to fit the architecture, not a template.",
  },
  {
    name: "Corliss, Sonsara & Countrystone",
    note: "Mid 1970s–80s subdivisions inside the central loop. Moderate slopes mean most patio and driveway scopes include small retaining or grade transitions.",
  },
  {
    name: "Saint Mary's Gardens & School Street",
    note: "Older homes on narrower lots near Saint Mary's College, with mature trees that constrain excavation. Hand-dig protocols and root protection are standard here.",
  },
  {
    name: "Sandringham",
    note: "Small upscale subdivision tucked off Moraga Road. Detail-driven projects — entry walkways, courtyard patios, and architectural lighting integration.",
  },
  {
    name: "Bellavista, Hetfield Estates & Palos Colorados",
    note: "These newer hillside developments are inside the Moraga GHAD (geologic hazard abatement district). Any earthwork has to respect the GHAD's Plan of Control — we coordinate with the GHAD manager on every project here.",
  },
];

// 5 featured services for the Moraga page — different mix from Lafayette
// to avoid a templated feel across city pages. Driveways leads with the
// town's pervious-paving rule, which is the most distinctive Moraga hook.
export const moragaServiceCopy: Record<string, string> = {
  "paver-driveways":
    "Moraga's municipal code requires pervious paving on any driveway longer than 50 feet or wider than 16 feet — and most estate driveways here cross one or both thresholds. We install permeable paver systems that satisfy the code, infiltrate stormwater into a structural drainage base, and still look like a finished hardscape. For shorter drives, we install standard interlocking pavers over a 6–8 inch compacted Class II base built for Moraga's expansive clay.",
  "retaining-walls":
    "Most of Moraga's hillside neighborhoods — Sanders Ranch, The Bluffs, Carr Ranch, the upper Rheem slopes — need engineered retaining walls. We build segmental block, structural concrete, and natural stone walls with proper drainage and geogrid reinforcement. Walls over 3 feet require a building permit; walls over 4 feet on slopes ≥20% bring in the Hillside Development Permit. We engineer and submit; you don't navigate the code.",
  patios:
    "From Campolindo families wanting an outdoor dining and turf zone for the kids, to estate clients in Sanders Ranch building full outdoor entertaining rooms — we design patios around how Moraga households actually use their backyard. Saint Mary's College area lots tend toward courtyard-scale; the older Rheem core has the flat lots that support sprawling entertainment patios.",
  "fire-pits":
    "Moraga's long warm-weather season makes a fire feature one of the highest-use additions to a backyard. We integrate gas and wood-burning pits into paver patios with proper combustion clearance to surrounding wood, vegetation, and structures — and we coordinate with MOFD's defensible space rules so the feature doesn't conflict with your perimeter clearance.",
  "artificial-turf":
    "On Campolindo and Rheem lots with kids and dogs, premium artificial turf solves the lawn problem permanently — no irrigation, no mowing, no winter mud. We integrate turf zones with paver patios, walkways, and edging so the transition reads as designed landscape, not a square of green. Drainage is engineered to Moraga's clay subsoil so water doesn't pond after a storm.",
};

// 100-word signed paragraph from Steve. The rule of thumb from 2026
// Helpful Content guidance: a city page that includes a first-person,
// specific paragraph from the owner is one of the strongest E-E-A-T
// signals available. TODO(steve): edit this to your own voice and
// confirm specifics — published with your name, so the words should
// be yours.
export const moragaSteveNote = `I've been pulling permits at the Moraga town counter for over a decade. The two things people don't expect: the pervious-paving requirement on longer driveways, and how much paperwork the GHAD parcels in Bellavista, Hetfield, and Palos Colorados add. I handle both as part of the project. On the build side, what fails most installs in Moraga isn't the pavers — it's shallow base prep on expansive clay. Every driveway we put down here gets a 6–8 inch compacted aggregate base over geotextile fabric, edge restraints, and active drainage. That's why our work outlasts the seasons. — Steve Barsanti, Owner`;

export const moragaFaqs = [
  {
    question: "Do I need a Town of Moraga permit to replace my existing concrete driveway with pavers?",
    answer:
      "For a like-for-like replacement that doesn't touch the curb, expand the driveway, or alter site drainage, a building permit usually isn't required. The catch: any work in the public right-of-way (curb cuts, driveway aprons) requires an Encroachment Permit from the Town Engineer. And per Moraga Municipal Code, paving longer than 50 feet or wider than 16 feet must use pervious materials. We pull the encroachment permit and handle pervious-paver design when scope requires it.",
  },
  {
    question: "I live in Moraga Country Club / Sanders Ranch. What's the HOA review process?",
    answer:
      "Both communities require Architectural Review Committee approval before town permitting. Plans need to be HOA-stamped or accompanied by a signed approval letter. The review covers design, materials, color, and how the work integrates with the surrounding properties. We've been through this submittal cycle many times — we draft the package, attend the review if needed, and walk it through to approval as part of the project.",
  },
  {
    question: "My back yard slopes more than 20%. What does Moraga's Hillside Development Permit add?",
    answer:
      "Once a project is on a slope of 20% or steeper (1:5 vertical-to-horizontal), Moraga requires a Hillside Development Permit. That means a geotechnical report from a qualified engineer, peer-reviewed by the town's geotech consultant at applicant cost. Slopes of 25% or steeper at predevelopment go to the Planning Commission. Adds 4–8 weeks to the timeline. We coordinate the geotech and submit the package — most clients never see the Planning Commission counter.",
  },
  {
    question: "I'm in Bellavista, Hetfield Estates, or Palos Colorados. Does the Moraga GHAD affect my paver project?",
    answer:
      "Yes. These three subdivisions are inside the Moraga Geologic Hazard Abatement District. Any earthwork — excavation, grading, retaining wall construction — has to respect the GHAD's Plan of Control, and projects that affect drainage or slope stability need GHAD manager review. We coordinate that review as part of the project. It rarely changes the design, but it always adds to the documentation package, and it's not optional.",
  },
  {
    question: "My driveway runs under a row of Coast Live Oaks. When do I need a tree permit?",
    answer:
      "Moraga regulates removal of native trees including Coast Live Oak, Interior Live Oak, valley oak, blue oak, California bay, redwood, and knobcone pine. Excavation inside a protected tree's drip line requires hand-digging in those zones, root pruning protocols, and may trigger arborist sign-off depending on tree health and proximity. We've worked under mature oak canopies in Campolindo, Saint Mary's Gardens, and Rheem for years — it's part of the standard scope here.",
  },
  {
    question: "What's the threshold for a retaining wall permit in Moraga?",
    answer:
      "Building permit is required for any retaining wall over 3 feet. Maximum allowed height is 5 feet — or 3 feet if the wall is visible from off-site. Stacked walls require a horizontal terrace at least twice the height of the larger wall, and walls must sit at least 3 feet off the property line. Engineered plans are required on anything over 4 feet, and we coordinate the structural engineer when needed.",
  },
  {
    question: "Will the Moraga-Orinda Fire District (MOFD) defensible space rules affect my new driveway?",
    answer:
      "On lots inside MOFD, you're required to maintain 100 feet of defensible space around structures (or full-parcel if your lot is under an acre). For driveway approaches specifically: 15 feet of vertical canopy clearance, and no juniper or bamboo within 10 feet. If your existing driveway runs through a wooded approach, we'll flag what needs to come out and coordinate with your landscaper or arborist before we start.",
  },
  {
    question: "Why does Moraga's clay soil need different paver base prep than flatter parts of the East Bay?",
    answer:
      "Moraga sits on the Orinda Formation — expansive clays with documented landslide history and high seasonal soil movement. The standard West Bay 4-inch aggregate base fails here within a few wet seasons. Our Moraga build spec uses a compacted Class II aggregate base (6–8 inches for driveways, 4–6 inches for patios) installed in lifts, geotextile separation fabric over compacted subgrade, edge restraints, and polymeric sand joints. It's why our installs flex with the soil instead of cracking.",
  },
];
