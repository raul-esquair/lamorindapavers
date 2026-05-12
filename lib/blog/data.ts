/**
 * Blog post data store + publish-gating helpers.
 *
 * The AI pipeline inserts new posts at the top of BLOG_POSTS. Consumer sites
 * shouldn't edit this file directly (other than seed posts on first install)
 * — the generate-post pipeline owns writes here.
 *
 * Publish gating: a post is "published" once its `date` is on or before
 * today (UTC). Future-dated posts exist in the array but are filtered out
 * of the listing route, detail route, and sitemap. This enables pre-writing
 * + scheduled releases.
 */
import type { BlogPost } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "paver-driveway-cost-east-bay-2026",
    featuredImage: "/images/blog-paver-driveway-cost-east-bay-2026.png",
    title: "Paver Driveway Cost in the East Bay: 2026 Pricing Guide",
    excerpt:
      "What does a paver driveway actually cost in Lafayette, Moraga, Orinda, and the broader East Bay in 2026? Real installed numbers from 100+ projects, broken down by size, pattern, and site conditions.",
    date: "2026-05-18",
    readingTime: "10 min read",
    relatedService: "paver-driveways",
    faqs: [
      {
        "question": "How much does a paver driveway cost per square foot in the East Bay in 2026?",
        "answer": "Paver driveway cost in the East Bay runs $18 to $32 per installed square foot in 2026. Standard interlocking concrete pavers on a flat lot with minimal demo land closer to $18–$22. Hillside lots in Lafayette or Orinda with deep base prep, drainage work, and premium paver selection push $26–$32 or higher. National average figures don't apply — Bay Area labor and clay-soil base prep add real cost."
      },
      {
        "question": "Why do paver driveway bids in Lafayette and Orinda cost more than in Walnut Creek?",
        "answer": "Lafayette and Orinda sit on expansive Moraga Formation clays that require 8–12 inches of compacted base aggregate instead of the 4-inch manufacturer minimum. Add slope, drainage engineering, and difficult lot access, and per-square-foot costs run 20–35% higher than comparable square footage on a flat Walnut Creek lot. The clay-soil base prep alone adds $3–$6 per square foot before a single paver is set."
      },
      {
        "question": "How long does a paver driveway installation take?",
        "answer": "Most East Bay paver driveway installations take 3–16 working days depending on size and scope. A small single-car driveway under 600 square feet runs 3–5 days. A large motor court or hillside installation above 1,200 square feet takes 9–16 days. These are working days from mobilization to final joint sand compaction — permit wait times (typically 1–4 weeks in Lafayette, Orinda, or Moraga) are separate."
      },
      {
        "question": "Are paver driveways worth the higher upfront cost compared to concrete?",
        "answer": "Yes, specifically on East Bay clay soil. Interlocking pavers flex with ground movement instead of cracking — on expansive clay lots in Lafayette and Orinda, poured concrete slabs typically develop hairline cracks within 3–5 years. Pavers also allow individual unit replacement without disturbing the field, and carry longer workmanship warranties (typically 5 years vs. 1–2 for concrete). The 20-year maintenance cost advantage generally offsets the higher installation price."
      },
      {
        "question": "Do I need a permit for a paver driveway in Lafayette, Orinda, or Moraga?",
        "answer": "Permit requirements vary by jurisdiction. Lafayette and Orinda both require encroachment permits when work touches the street approach or public right-of-way — fees typically run $200–$500. Grading permits apply for projects with significant slope work. Moraga requires review for larger installations with drainage implications. Build 2–4 weeks of permit review time into your project timeline, especially for hillside or motor-court scope."
      },
      {
        "question": "What's included in a 5-year workmanship warranty for a paver driveway?",
        "answer": "A 5-year workmanship warranty covers defects in installation quality: settling, joint sand loss, edge creep, and paver rocking caused by improper base prep or installation technique — not normal wear. It should be stated in the contract, not offered verbally. It's a reasonable baseline to demand from any East Bay paver contractor. Verify that it specifically covers base prep performance, not just surface appearance."
      },
      {
        "question": "How do I compare paver driveway bids and spot a low-ball estimate?",
        "answer": "Line up base prep depth specs first — it's the number that predicts long-term performance most accurately. A legitimate East Bay bid should specify base aggregate depth in inches, acknowledge soil conditions, list edge restraints and joint sand type, and include a written warranty. Bids under $14 per installed square foot in this market typically reflect underestimated base prep, unlicensed labor, or excluded line items like demo and disposal that will reappear as change orders."
      }
    ],
    content: `
## The Short Answer

**Paver driveway cost in the East Bay runs $18 to $32 per installed square foot in 2026.** Most projects in Lafayette, Moraga, Orinda, and the broader Contra Costa corridor land between $20,000 and $45,000. Hillside driveways with deep base prep, engineered drainage, or a circular motor-court layout push past $60,000. That's a wide range — but five specific variables move the number, and every one of them is nameable. This guide breaks down each one with real numbers from projects we've completed across the Lamorinda corridor.

If you're researching [paver driveway installation](/services/paver-driveways) for the first time, start here. If you're comparing bids, jump to the contractor vetting section — it's the part that saves people the most money.

---

## What Drives Paver Driveway Cost in the East Bay

Five things determine where your paver driveway cost lands in that range: size and slope, paver type and pattern, base preparation depth, demo and disposal of the existing surface, and drainage engineering. None of these are optional line items you can cut to hit a budget number — they're interdependent. Shorten the base prep to save money on clay soil, and you're repaving in four years.

### Driveway Size and Slope

Square footage is the obvious multiplier — more area means more material, more labor, and more base aggregate. Slope changes the math significantly. A flat 800-square-foot driveway near the 680 corridor in [Danville](/service-areas/danville) installs very differently than an 800-square-foot driveway on a 12% grade above Happy Valley Road in Lafayette.

On sloped lots, crews spend more time establishing a stable subgrade, cutting and filling, and installing edge restraints at intervals that prevent creep over time. Steeper grades also require step-down drainage channels between paver fields. That labor doesn't scale linearly — a moderately sloped 1,000-square-foot driveway can cost 20–30% more per square foot than a flat one of the same size.

Access is its own cost driver. If a compactor can't reach your pad from the street without a long carry, material costs go up. Many Orinda and Moraga lots have winding approaches that add half a day of labor before a single paver is set.

### Paver Type and Pattern (Herringbone, Running Bond, Modular Blends)

The paver itself ranges from roughly **$3.50 to $12 per square foot** in material cost, before installation. Standard interlocking concrete pavers in 60mm or 80mm thickness cover the lower end. Tumbled or textured finishes, larger-format pavers, porcelain-look units, or natural stone push toward the top.

Pattern affects labor cost too. A running bond or stacked bond lays faster than herringbone — a skilled crew sets herringbone roughly 20–25% slower because every piece requires precise angular alignment. For a 1,000-square-foot driveway, that difference translates to $800–$1,500 in additional labor. Herringbone earns that premium: the 45-degree interlocking geometry distributes load more evenly, and it's the pattern most commonly specified under ICPI (Interlocking Concrete Pavement Institute) guidelines for driveways that see regular vehicle traffic.

Modular blends — mixing two or three paver sizes in a random or structured layout — fall in between. They cost more than a single-size running bond but create a custom look that complements the Craftsman and Mediterranean architecture common in Orinda and Lafayette. If your goal is a [landscape design](/services/landscape-design) that reads as a coherent whole from the street, modular blends are worth pricing out.

### Base Preparation Depth (and Why East Bay Clay Soil Matters)

This is the line item that separates bids most dramatically — and the one most homeowners underestimate. Manufacturer specs call for a 4-inch compacted base aggregate under a paver driveway. On the expansive clays underlying most of Lafayette, Orinda, and Moraga, 4 inches isn't enough.

Expansive clay swells when wet and contracts in dry summers. The Bay Area's wet-dry seasonal cycle is particularly aggressive. A standard base installed over native clay will heave, settle unevenly, and show within two to three years as rocking pavers, dips, and joint sand loss. Fixing it means pulling and resetting — which costs more than doing it right the first time.

A properly engineered base on Lamorinda-area clay runs **8 to 12 inches** of compacted aggregate, often with a layer of decomposed granite or crushed concrete beneath. That base prep alone can add $3–$6 per square foot to the total. Any bid that cites a 4-inch base on a Moraga or Lafayette hillside lot without qualification deserves an immediate follow-up question. On [Lafayette paver projects](/service-areas/lafayette), we build to 8–12 inches as a baseline — not an upgrade.

### Demo and Disposal of Existing Concrete or Asphalt

Replacing an existing surface? Demo runs **$1.50 to $3.50 per square foot** depending on thickness and reinforcement. Unreinforced concrete comes out fast. A thickly poured, rebar-reinforced slab from the 1970s — common on older Lafayette and Orinda properties — takes significantly longer and generates more tonnage to haul.

Disposal fees in Contra Costa County have risen in recent years. Budget $500–$1,500 for hauling and dump fees on a mid-size driveway, on top of labor. Some contractors net this into their overall bid; others call it a separate line. Either way, make sure your proposal accounts for it explicitly — if it's missing, it reappears as a change order.

---

## 2026 Paver Driveway Cost Ranges by Project Size

**East Bay paver driveway cost scales predictably by square footage, but site conditions — slope, access, soil — can push any tier 15–25% higher.** Use this table as a planning baseline, not a final number.

| Project Size | Square Footage | Estimated Installed Cost | Typical Timeline | Common Scope |
|---|---|---|---|---|
| Small | Under 600 sq ft | $11,000 – $22,000 | 3–5 days | Single-car approach, replacement of existing asphalt or concrete, standard interlocking concrete pavers, running bond or herringbone |
| Mid-size | 600–1,200 sq ft | $22,000 – $42,000 | 5–9 days | Two-car driveway, possible grade work, upgraded paver selection, edge restraints, minor drainage |
| Large | 1,200+ sq ft | $42,000 – $75,000+ | 9–16 days | Motor court, circular layout, hillside drainage engineering, deep base prep, modular blend or premium paver |

These ranges assume standard base prep conditions. Add 15–25% on lots with significant slope, poor drainage, or difficult access. Timelines reflect working days from mobilization to final joint sand compaction — not permit wait times, which are covered below.

Paver driveway cost per square foot in the Bay Area trends higher than national averages due to labor rates, disposal costs, and the clay-soil base prep that most Lamorinda lots require. A national "average" of $10–$20 per square foot doesn't apply here.

---

## Paver vs. Concrete: The 20-Year Cost Comparison

**Poured concrete costs less to install. Interlocking pavers cost more upfront. On an East Bay clay lot over 20 years, the calculus shifts — and pavers typically win.** Here's the full comparison.

| Factor | Interlocking Concrete Pavers | Poured Concrete | Asphalt |
|---|---|---|---|
| Installed cost (per sq ft) | $18 – $32 | $8 – $14 | $4 – $8 |
| Expected lifespan | 25–50 years with maintenance | 15–25 years (clay soil accelerates cracking) | 15–20 years |
| Crack resistance on clay soil | High — flex with ground movement | Low — hairline cracks within 3–5 years on expansive clay | Moderate — softens in heat, ruts under load |
| Repairability | Individual pavers replaced without disturbing the field | Patch repairs visible; full replacement often needed | Patches visible; full overlay every 10–12 years |
| Maintenance cadence | Reseal every 3–5 years; joint sand refresh as needed | Reseal every 2–3 years to prevent spalling | Seal coat every 2–3 years; overlay every 10–12 years |
| 20-year maintenance cost (est., 1,000 sq ft) | $1,500 – $3,000 | $2,500 – $5,000 | $4,000 – $8,000 |

The structural argument for pavers in this region is specific to the soil. Interlocking pavers don't crack with ground movement because they're individual units set in joint sand rather than a monolithic slab. When the ground heaves in February and settles in September — which it does on most Orinda and Lafayette lots — the paver field moves with it and recovers. A poured slab develops stress fractures at the weakest points. Those cracks don't heal.

Individual pavers can also be lifted and reset if underground utility work ever requires access. On a poured slab, that repair leaves a permanent patch. It's a small thing until it isn't.

One more data point worth knowing: paver driveways carry a **5-year workmanship warranty** as a baseline from reputable East Bay contractors. Most concrete slab warranties in this market run 1–2 years. The gap reflects how differently the two surfaces perform on moving ground.

---

## What a Paver Driveway Project Looks Like in Lafayette vs. Orinda vs. Walnut Creek

**Geography shapes scope.** The same square footage costs and installs differently depending on where your property sits in the East Bay.

### Lafayette: Hillside Lots, Drainage as the Hidden Cost Driver

Lafayette's residential neighborhoods — particularly the hillside streets above Happy Valley Road and up into the ridgeline areas near Burton Valley — concentrate several cost-driving factors in one place: clay soil, grade, and mature trees whose root systems require careful navigation during base excavation.

Drainage is often the line item that surprises Lafayette homeowners most. A sloped driveway that drains onto the street or into a neighbor's property isn't just a nuisance — in some cases it triggers a grading or drainage condition from the city. Properly channeled drainage, including trench drains or slot drains set flush with the paver surface, adds $1,500–$4,000 to a typical hillside project but protects both the driveway and the base from washout. On steeper grades, [hillside retaining walls](/services/retaining-walls) are sometimes part of the same scope — terracing the approach or stabilizing a bank alongside the driveway pad.

[Lafayette paver projects](/service-areas/lafayette) tend to run toward the higher end of the cost range for their size, specifically because of base prep and drainage. Budget with that in mind and the final number won't surprise you.

### Orinda: Longer Driveways, Often with Circular or Motor-Court Layouts

Orinda properties in the hills often have longer approaches from the street — 60 to 120 feet isn't unusual — and many have circular turnaround areas or motor courts that add significant square footage. A circular motor court layout requires more cuts, more pattern planning, and sometimes a contrasting border or inlay to read well from the street.

On [Orinda driveway installations](/service-areas/orinda), the premium paver selection rate is higher than almost anywhere else in the Lamorinda corridor. Homeowners here tend to be choosing between tumbled travertine-look concrete, large-format porcelain-look pavers, and natural stone — not debating entry-level concrete pavers. That shifts material cost significantly. It doesn't change the base prep equation: the Orinda hills sit on the same expansive Moraga Formation clays as Lafayette.

Many Orinda projects also extend the hardscape investment beyond the driveway itself — connecting to a [paver patio](/services/patios) at the side or rear of the property, or incorporating an [outdoor kitchen](/services/outdoor-kitchens) area accessed from the motor court. When the driveway crew is already mobilized and the base work is done, it's the right moment to extend the scope.

### Walnut Creek: Flatter Lots, Faster Installs, Smaller Cost Variance

Walnut Creek's residential neighborhoods closer to the downtown corridor — and the flatter streets in areas like Northgate and Lakewood — present a more straightforward installation environment. Less slope means simpler drainage solutions, standard base prep depth (still worth specifying in writing), and faster crew mobilization.

[Walnut Creek paver driveways](/service-areas/walnut-creek) tend to land closer to the lower half of the installed cost range for their size tier. A 900-square-foot two-car driveway on a flat Walnut Creek lot with no demo required can come in under $25,000. The same project on a Lafayette hillside lot might run $32,000–$36,000.

For [Moraga](/service-areas/moraga) and [Danville](/service-areas/danville) homeowners reading this: Moraga's terrain and clay profile align closely with Lafayette and Orinda — budget accordingly. Danville's flatter lots near the 680 corridor behave more like Walnut Creek.

---

## How to Budget for Permits, Drainage, and the 'Unknowns'

**Permit costs and requirements vary across Contra Costa jurisdictions — and they affect both your budget and your timeline.** Here's what to expect in each city.

- **Lafayette**: Driveway replacement typically requires an encroachment permit if work touches the street approach or public right-of-way. Fee range is roughly $200–$500. Grading permits may apply on slopes over a certain threshold.
- **Orinda**: Similar encroachment permit process through the city. Larger projects with significant grading or drainage work may require a grading permit, adding engineering documentation and 2–4 weeks of review time.
- **Moraga**: Permit requirements vary with project scope; check with the town's Public Works Department. Motor-court or large circular installations with drainage implications are more likely to trigger review.
- **Walnut Creek and Danville**: Generally follow a similar encroachment permit process; larger projects near drainage easements may require additional documentation.

Build **10–15% contingency** into your budget. This isn't a hedge — it's an honest acknowledgment that subgrade conditions vary in ways no surface inspection reveals. Roots, old utility lines, buried concrete from a previous structure, or a soft spot requiring additional base aggregate can each add a day of labor and material. On a $30,000 project, 10% contingency is $3,000. It's well spent if you need it, yours to keep if you don't.

Drainage engineering, when required, runs $800–$3,500 depending on complexity. If your lot has a defined drainage problem today — pooling at the garage apron, runoff crossing a neighbor's property — solve it as part of this project. Retrofitting drainage after the driveway is set costs two to three times more.

---

## How to Vet a Paver Contractor's Bid (Red Flags + Green Flags)

**A complete paver driveway bid in the East Bay should specify base depth in inches, soil conditions, edge restraints, joint sand type, and warranty terms in writing.** If any of those are missing, ask before you sign.

**Green flags:**

- Base prep depth is specified in writing, in inches, with soil type acknowledged. "8-inch compacted Class II base, with 12-inch depth in clay sections" tells you the contractor has assessed your actual lot.
- ICPI certification listed for at least one crew member. The Interlocking Concrete Pavement Institute trains and certifies installers on proper installation practice — it's not the only credential that matters, but it's a real one with documented standards.
- A five-year workmanship warranty stated in the contract — covering settling, joint sand loss, and edge creep resulting from installation quality rather than normal wear. Written, not verbal.
- License and bond numbers you can verify. California Contractors State License Board (CSLB) verification takes two minutes at cslb.ca.gov. Run it.
- Joint sand type specified: polymeric sand over standard sand indicates the contractor is accounting for weed intrusion and ant activity, which matters more on shaded driveways under tree canopy.

**Red flags:**

- Base prep depth omitted or listed as "per manufacturer spec" without acknowledging site-specific soil conditions. On a Moraga or Orinda lot, that's a material problem.
- No demolition line item on a project that clearly requires demo. It's either excluded from scope (and will reappear as a change order) or unaccounted for entirely.
- Per-square-foot bids under $14 installed in this market. That figure usually reflects underestimated base prep, unlicensed labor, or material substitution.
- Verbal warranty only. If it's not in the contract, it doesn't exist.
- No mention of edge restraints in the scope. Plastic or aluminum edge restraints, spiked at regular intervals, are what keep the paver field from migrating at the perimeter over time. Any [paver driveway installation](/services/paver-driveways) that omits them will spread.

If you're evaluating multiple bids, line up the base prep specs side by side first. That single line item predicts long-term performance better than anything else in the document.

---

## Frequently Asked Questions

### How much does a paver driveway cost per square foot in the East Bay in 2026?

Paver driveway cost in the East Bay runs $18 to $32 per installed square foot in 2026. Standard interlocking concrete pavers on a flat lot with minimal demo land closer to $18–$22. Hillside lots in Lafayette or Orinda with deep base prep, drainage work, and premium paver selection push $26–$32 or higher. National average figures don't apply — Bay Area labor and clay-soil base prep add real cost.

### Why do paver driveway bids in Lafayette and Orinda cost more than in Walnut Creek?

Lafayette and Orinda sit on expansive Moraga Formation clays that require 8–12 inches of compacted base aggregate instead of the 4-inch manufacturer minimum. Add slope, drainage engineering, and difficult lot access, and per-square-foot costs run 20–35% higher than comparable square footage on a flat Walnut Creek lot. The clay-soil base prep alone adds $3–$6 per square foot before a single paver is set.

### How long does a paver driveway installation take?

Most East Bay paver driveway installations take 3–16 working days depending on size and scope. A small single-car driveway under 600 square feet runs 3–5 days. A large motor court or hillside installation above 1,200 square feet takes 9–16 days. These are working days from mobilization to final joint sand compaction — permit wait times (typically 1–4 weeks in Lafayette, Orinda, or Moraga) are separate.

### Are paver driveways worth the higher upfront cost compared to concrete?

Yes, specifically on East Bay clay soil. Interlocking pavers flex with ground movement instead of cracking — on expansive clay lots in Lafayette and Orinda, poured concrete slabs typically develop hairline cracks within 3–5 years. Pavers also allow individual unit replacement without disturbing the field, and carry longer workmanship warranties (typically 5 years vs. 1–2 for concrete). The 20-year maintenance cost advantage generally offsets the higher installation price.

### Do I need a permit for a paver driveway in Lafayette, Orinda, or Moraga?

Permit requirements vary by jurisdiction. Lafayette and Orinda both require encroachment permits when work touches the street approach or public right-of-way — fees typically run $200–$500. Grading permits apply for projects with significant slope work. Moraga requires review for larger installations with drainage implications. Build 2–4 weeks of permit review time into your project timeline, especially for hillside or motor-court scope.

### What's included in a 5-year workmanship warranty for a paver driveway?

A 5-year workmanship warranty covers defects in installation quality: settling, joint sand loss, edge creep, and paver rocking caused by improper base prep or installation technique — not normal wear. It should be stated in the contract, not offered verbally. It's a reasonable baseline to demand from any East Bay paver contractor. Verify that it specifically covers base prep performance, not just surface appearance.

### How do I compare paver driveway bids and spot a low-ball estimate?

Line up base prep depth specs first — it's the number that predicts long-term performance most accurately. A legitimate East Bay bid should specify base aggregate depth in inches, acknowledge soil conditions, list edge restraints and joint sand type, and include a written warranty. Bids under $14 per installed square foot in this market typically reflect underestimated base prep, unlicensed labor, or excluded line items like demo and disposal that will reappear as change orders.

---

## Get a Fixed-Price Proposal for Your Property

If you want a real paver driveway cost — not a range, but an actual project total for your specific lot — the only way to get there is a site visit. Slope, access, existing base condition, distance from the street, tree root proximity, and drainage all feed into the final number in ways a square-footage estimate can't capture.

We'll walk your lot, measure access constraints, evaluate the existing base, and assess drainage conditions. You'll have a written, fixed-price proposal within 48 hours of the visit. No estimate ranges, no "subject to subgrade conditions" asterisks — a number you can plan around.

Whether your project is a hillside driveway above Happy Valley, a motor court in the Orinda hills, or a straightforward [Walnut Creek paver driveway](/service-areas/walnut-creek) on flat ground, the process starts the same way: with someone who's actually stood on your property.

[Request your free on-site estimate](/contact) to get started.
    `.trim(),
  },

  // Seed posts go here, or remove this comment and start with an empty array.
];

export function isPublished(post: BlogPost): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return post.date <= today;
}

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(isPublished).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post || !isPublished(post)) return undefined;
  return post;
}
