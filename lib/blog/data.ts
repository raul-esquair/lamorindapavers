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
    slug: "11-diy-paver-patio-mistakes-that-ruin-drainage",
    featuredImage: "/images/blog-11-diy-paver-patio-mistakes-that-ruin-drainage.png",
    title: "11 DIY Paver Patio Mistakes That Ruin Drainage",
    excerpt:
      "Paver patio drainage problems come from 11 specific DIY mistakes — flat grading, wrong base aggregate, missing French drains, mortared joints, and more. Here's each one explained with the actual fix, calibrated for East Bay clay soil and hillside lots.",
    date: "2026-06-08",
    readingTime: "17 min read",
    relatedService: "patios",
    faqs: [
      {
        "question": "Why is water pooling on my paver patio?",
        "answer": "Water pooling on a paver patio usually comes from one of four causes: the subgrade was flat-graded instead of sloped at 1 inch per 8 feet away from the house; joint sand has eroded and water is ponding above a sealed base layer; base aggregate settled unevenly and created low spots; or a French drain has clogged. On East Bay clay-soil lots, the most common cause of paver patio standing water is flat grading combined with joint sand loss over time. Run a hose at the patio's high corner while watching the drainage edge — that test confirms which failure mode is active."
      },
      {
        "question": "How do you fix paver patio drainage?",
        "answer": "Fixing paver patio drainage starts with identifying the specific failure mode. Flat grading: pull the perimeter pavers, re-grade the base at 1 inch per 8 feet, and relay. Joint sand erosion: resand with Techniseal HP NextGel, Alliance Gator Maxx, or SEK Pro after cleaning at 1,200–1,500 PSI maximum. Base settlement creating low spots: lift affected pavers, add Class II aggregate or bedding sand to restore grade, and relay. French drain failure: camera the pipe, clear the blockage, or replace the perforated section. Many East Bay pooling problems are joint sand and minor settlement — a partial fix rather than a full rebuild."
      },
      {
        "question": "Should a paver patio slope toward or away from the house?",
        "answer": "Always away from the house. The industry-standard paver patio slope is 1 inch of fall per 8 feet (approximately 1% grade) directed away from any structure, toward the patio's lowest drainage point. Sloping toward the house routes water into the foundation, saturates adjacent clay, and causes seasonal expansion pressure against the structure. On hillside lots in Orinda or Lafayette where the house sits downhill from the patio, a catch basin at the foundation edge intercepts water before it reaches the wall — but the patio itself still slopes away from the foundation."
      },
      {
        "question": "Can you regrade a paver patio without removing the pavers?",
        "answer": "In some cases, yes — if settlement is localized. Pull the pavers in the affected area, add Class II aggregate or adjust the bedding sand layer to restore the correct slope, tamp lightly, and relay. Resand the joints with Techniseal HP NextGel, Alliance Gator Maxx, or SEK Pro. If the entire field is flat or sloped the wrong direction, a full paver pull and subgrade re-grade is unavoidable. Attempting to correct a system-wide paver patio grading mistake by shimming individual pavers introduces inconsistent bedding depth and new differential settlement."
      },
      {
        "question": "How much does it cost to fix paver patio drainage?",
        "answer": "Spot repairs — joint resanding, pulling and releveling a few pavers, clearing a French drain — run $500–$2,000 on a standard 400–600 square foot East Bay patio. Partial section rebuilds (pulling 25–40% of the field, re-grading base, relaying) run $3,000–$7,000 depending on scope. A full rebuild with correct base spec and drainage runs $18–28 per square foot in the current East Bay market. The main cost driver is base access — once pavers come up, base assessment determines whether you're doing a minor repair or a full reconstruction."
      },
      {
        "question": "What's the right slope for a paver patio?",
        "answer": "The correct slope for a paver patio is 1 inch of fall per 8 feet (1% grade minimum) sloped away from any structure, toward the patio's lowest drainage edge. That slope is steep enough to sheet water off the surface without visibly tilting the patio. On hillside Lafayette and Orinda lots where natural grade steepens, you can match the natural slope up to about 2% (1/4 inch per foot) before the patio starts to feel noticeably pitched underfoot. Above 2%, consider terracing with a retaining wall step rather than running a continuous slope across the entire patio footprint."
      }
    ],
    content: `
# 11 DIY Paver Patio Mistakes That Ruin Drainage

## The Short Answer

Paver patio drainage problems almost always come down to one of 11 specific DIY install mistakes — flat grading, wrong base aggregate, mortared joints, missing French drains, and seven more. Each has a clean fix. Together they explain 95% of pooling, sinking, and shifting on East Bay paver patios. If your patio is already showing standing water, rocking pavers, or perimeter separation, one of these 11 mistakes is almost certainly the cause — and knowing which one determines whether you need a repair or a full rebuild.

This post covers every failure mode in detail: what causes it, why it's worse on East Bay clay soil, and exactly how to fix it. For the full [paver patio installation](/services/patios) process from excavation through final jointing, see the [full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift). For a deep dive on base prep specifically, the [paver base compaction deep-dive](/blog/what-is-paver-base-compaction-and-why-it-matters) covers equipment, lift depth, and compaction targets in detail.

---

## Why Paver Patio Drainage Problems Are Worse in the East Bay Than Most Places

Paver patio drainage problems are worse in the East Bay because clay soils hold water at the surface instead of absorbing it, and hillside lots in Lafayette, Orinda, and Moraga concentrate winter runoff against the patio's perimeter.

**East Bay clay-soil lots get 18–25 inches of winter rain concentrated in 4–5 months.**

That compressed rainfall window — December through April — hits a subgrade that doesn't drain the way sandy soil would. Expansive clay is soil that swells when wet and shrinks when dry, with seasonal volume change of 5–10%. Every blocked drain path, every low spot that traps water, every cracked joint that lets water in — those failures compound fast when 20 inches of rain lands in 120 days. A drainage mistake that might show up as minor pooling on a Phoenix patio shows up as a sinking, cracking rebuild candidate in Orinda after two wet seasons.

The fixes below are specific to that reality. General paver drainage advice written for stable sandy lots in drier climates doesn't translate to East Bay conditions. Every mistake is calibrated to what actually fails here — on [Orinda](/orinda) hillside lots, on sloped [Moraga](/moraga) clay grades, and on the flatter but still clay-heavy lots of [Walnut Creek](/walnut-creek) and [Danville](/danville).

---

## Mistake 1: Skipping a Site Drainage Plan Before Any Digging Starts

Skipping a site drainage plan is the most common DIY paver patio drainage mistake — and the most expensive to fix later, because every other phase of the install depends on it.

A drainage plan answers one question: where does water go during a 1-inch-per-hour rain? On a flat Walnut Creek lot, the answer might be straightforward. On a sloped Orinda or Lafayette property, it's not — uphill runoff from a neighbor's lot, downspouts discharging near the patio footprint, and seasonal groundwater seeping through clay strata can all concentrate water against a patio that was designed without accounting for any of them.

The fix is simple but can't be skipped: before any excavation, run a garden hose at the highest point of the planned patio footprint and follow where the water goes. Do it again during one actual rain. Map the low spots, the concentrated flow paths, and any existing drainage outlets. Design the patio's slope and any supplemental drains — French drains, catch basins, or pop-up emitters — to route water toward those natural outlets. Once pavers and base aggregate are in place, you can't redesign the drainage logic without removing everything.

---

## Mistake 2: Flat-Grading the Subgrade Instead of Sloping Away from the House

Flat-grading a paver patio's subgrade is the second-most-common DIY paver patio drainage mistake — the industry standard is 1 inch of fall per 8 feet (roughly 1%) sloped away from the house.

**The industry-standard paver patio slope is 1 inch of fall per 8 feet sloped away from the house.**

The instinct to make the patio look "level" is understandable — a visibly tilted patio looks wrong to the eye. But a truly flat patio develops pooling within the first wet season. Water has nowhere to go, it sits on the surface, and on East Bay clay it takes hours to drain. That standing water works into any low joint, migrates into the base aggregate, and starts the wet-dry cycling that breaks down compaction.

The fix: set the finish grade at 1 inch of fall per 8 feet, confirmed with a 4-foot or 6-foot level and a marked grade block (a scrap of wood cut to the exact target drop). Verify slope at the subgrade level — if the subgrade is flat, the base and pavers follow it flat regardless of how carefully you screed.

---

## Mistake 3: Crowning the Patio Toward the House Instead of Away from It

Crowning a paver patio toward the house instead of away from it routes rainwater directly into the foundation — a paver patio grading mistake that causes thousands of dollars of foundation and crawlspace damage in East Bay clay soils.

This failure mode shows up on DIY installs more than you'd expect. The installer works to match the finished patio grade to the adjacent door threshold or interior floor, eyeballs the level, and ends up with a surface that pitches slightly toward the house. On a clay-soil lot in Lafayette or Orinda, that slope concentrates every inch of seasonal rain against the foundation. Water wicks through the slab edge, saturates the adjacent clay, and the seasonal swelling cycle begins pushing against the structure itself.

The fix is the same as Mistake 2: slope away from the house at 1 inch per 8 feet minimum, confirmed at the subgrade level with a physical grade block. On hillside lots where the house sits downhill from the patio, a catch basin at the foundation edge intercepts water before it reaches the wall — but the patio still slopes away from the foundation and toward the basin.

---

## Mistake 4: Installing Pavers Flush Against the Foundation Without an Expansion Gap

Pavers installed flush against a house foundation create a moisture trap and concentrate clay seasonal movement against the structure — leave a 1/2-inch expansion gap filled with a drainable backer rod and exterior-rated polyurethane sealant, or pack loosely with #57 stone.

Clay expands laterally in wet months. A paver field installed hard against a foundation gets pushed into it with measurable force during wet winters. That pressure cracks both foundation siding and joint sand at the perimeter, and once those joints open, water follows them straight down toward the footing. On a Moraga or Lafayette hillside lot with saturated subgrade, that moisture pathway matters.

The fix: leave a minimum 1/2-inch gap between the outermost paver row and the foundation, wall, or any fixed structure. Seal it with backer rod and a paintable, exterior-rated polyurethane sealant if aesthetics matter, or leave it loosely filled with 1/4-inch clean crushed stone for a draining gap that still looks intentional. Inspect annually and reseal when cracking appears.

---

## Mistake 5: Using Fine Sand or Decomposed Granite as Base Aggregate Instead of Class II

Fine sand and decomposed granite don't drain like Class II aggregate — they hold water at the bedding layer and accelerate clay subgrade movement.

Class II aggregate is a Caltrans-spec graded crushed stone with particles ranging from 3/4-inch down to fines, engineered to interlock under compaction and drain freely between particles. Fine sand and decomposed granite compact into dense, low-permeability layers that water sits on top of rather than flowing through. When winter rain infiltrates paver joints — and it always does — the drainage path hits a DG or fine-sand base and stops. That water either ponds at the bedding layer or routes laterally toward the perimeter, undercutting edge restraints and washing bedding sand outward.

The fix: spec Caltrans Class II road base for the structural lift in every [paver patio installation](/services/patios). ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements) — the U.S. trade standard published by ICPI (the Interlocking Concrete Pavement Institute) — names Class II as the correct material for residential paver applications. Not DG, not play sand, not "crusher run" without a published spec. For a full breakdown of aggregate selection, compaction equipment, and lift counts, see the [paver base compaction deep-dive](/blog/what-is-paver-base-compaction-and-why-it-matters).

---

## Mistake 6: Mortaring or Grouting the Joints to "Seal" Them

Mortared paver joints look clean for one season, then crack everywhere as clay seasonally moves under the patio — and once cracked, mortared joints trap water and accelerate base damage.

Interlocking pavers are designed as a flexible system. The paver field moves slightly with clay expansion and contraction, with seasonal temperature changes, and with minor base settlement. That micro-movement is normal and harmless when joints are filled with polymeric sand, which flexes with the field. Rigid mortar joints don't flex — they crack. And cracked mortar joints are worse than open joints: the fractured mortar holds water above the crack line and funnels it into the base along the fracture face.

The fix: polymeric joint sand, applied per manufacturer instructions. Techniseal HP NextGel, Alliance Gator Maxx, and SEK Pro are three products with consistent performance records in East Bay wet-dry cycling conditions. All three bind without going rigid, shed water at the surface, and resist weed germination. Expect 5–7 years of service before resealing is needed.

---

## Mistake 7: Skipping or Undersizing French Drains on Hillside Lafayette and Orinda Lots

Hillside paver patios in Lafayette, Orinda, and Moraga need French drains routed under or around the patio footprint to intercept winter rain before it saturates the subgrade — skipping this step is the single most common drainage failure mode on East Bay hillside installs.

A French drain is a perforated pipe buried in gravel that collects subsurface water and routes it to a daylight outlet. On a flat [Danville](/danville) lot with good natural drainage, a French drain may not be necessary. On a sloped lot in the Orinda hills or up Happy Valley Road in Lafayette, it almost always is — hillside properties receive not just rainfall on the patio footprint but concentrated subsurface flow from the uphill grade, neighboring properties, and seasonal groundwater movement through clay strata.

The fix: 4-inch perforated PVC pipe in clean #57 stone, wrapped in non-woven geotextile to prevent clay fines from clogging the gravel over time. Route it to a hillside daylight outlet or to a connection with the municipal storm drain system. Contra Costa County drainage requirements specify that drainage from hardscape improvements must not be directed onto adjacent properties or increase runoff onto streets beyond pre-development levels — French drain outlet placement must account for that. Undersizing is a real failure mode too: on a steeply sloped lot, a single 4-inch drain may be insufficient during a concentrated rain event. Err toward two drains or a 6-inch main.

For the full subsurface drainage picture in a new install, read [the full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift). For hillside-specific structural context, our [retaining walls](/services/retaining-walls) service page covers how wall and patio drainage systems integrate on sloped lots.

---

## Mistake 8: Skipping Edge Restraints — Water Seeps Laterally Under the Paver Field

Paver patios installed without PVC edge restraints fail laterally — water gets under the perimeter pavers, undermines the base aggregate, and the entire field walks outward over time.

Edge restraints aren't decorative trim. They're a structural component that holds the paver field in compression. Without them, winter rain saturates the soil at the perimeter, clay movement pushes outward, and the perimeter pavers follow. Once they start moving — typically 1/4 to 1/2 inch per wet season on an unrestrained East Bay clay lot — the bedding sand layer opens at the perimeter and water infiltrates directly into the base. Joint sand follows. Field separation accelerates.

Concrete edge curbs are not a substitute. Concrete cracks at clay-movement joints, and once cracked, the gap between a concrete curb and the paver field becomes a direct water pathway into the base aggregate. The correct spec: PVC spike-down edge restraints with 10-inch galvanized spikes at 10-inch spacing, driven fully flush. Shorter spikes pull out. Wider spacing allows flex. Both produce the same result — a perimeter that walks outward and leaves the base exposed. See [preventing paver patio sinking and settling](/blog/how-to-prevent-paver-patio-sinking-2026) for how edge restraint failure presents at the surface.

---

## Mistake 9: Applying Polymeric Sand During a Rain Window or in Extreme Heat

Polymeric sand cures correctly only within a narrow temperature and moisture window — apply it within 24 hours of forecasted rain or above 80°F and the cure fails, creating porous joint fill that lets water under the pavers.

Polymeric joint sand activates with a fine water mist and then cures hard over 24 hours. Heavy rain during cure doesn't just slow the process — it physically washes the uncured polymer binder onto paver faces (where it hazes permanently) and unevenly flushes it through the joint depth, leaving the lower portion of each joint under-bonded. Those under-bonded joints look solid on the surface and fail through the middle — exactly the failure mode that routes water straight to the bedding sand layer.

Heat above 80°F creates the opposite problem: the polymer skin-cures at the surface too fast, trapping moisture below and leaving the bottom of each joint uncured. That hollow-below-the-crust joint cracks under foot traffic within months.

**Apply polymeric sand at 50–80°F with at least 36 hours of clear forecast after installation.** In the East Bay, that window exists reliably from April through October. Avoid application during heat spikes in inland Walnut Creek and Danville, where afternoons regularly exceed 85°F in summer. If the day cools below 80°F by mid-afternoon, schedule application for morning so the misting and cure period falls in the cooler part of the day. Techniseal HP NextGel, Alliance Gator Maxx, and SEK Pro all have consistent performance records across East Bay climate cycling.

---

## Mistake 10: Aggressive Power-Washing That Blasts Joint Sand Out

**Power-washing paver patios above 1,500 PSI strips joint sand out of the joints.**

Many homeowners power-wash their paver patio annually thinking they're doing the right maintenance — and they are, at the right pressure. Above 1,500 PSI, the stream cuts directly into the joint, eroding polymeric sand and bedding sand below it. The joint empties progressively over two or three annual washings until water flows freely into the base with every rain.

Both Belgard and Calstone — two major paver manufacturers whose products are common in East Bay installs — specify a maximum of 1,200–1,500 PSI for cleaning, with the wand held at least 12 inches from the paver surface. A direct-stream nozzle is never appropriate; use a rotating or fan nozzle.

The fix: clean at 1,200–1,500 PSI maximum, fan or rotating nozzle, wand 12 inches minimum from the surface. After cleaning, inspect every joint — joints visibly lower than the paver chamfer need refilling. Sweep dry polymeric sand into low joints and activate with a fine mist before the next rain. If joint sand has been power-washed out over multiple years, a full joint resand with Techniseal HP NextGel, Alliance Gator Maxx, or SEK Pro is the correct repair. This is also the most common preventable cause of [paver patio standing water](#) that develops slowly rather than immediately after install.

---

## Mistake 11: Not Resealing Polymeric Joint Sand Every 5–7 Years

**Polymeric joint sand lasts 5–7 years in East Bay weather before it cracks and needs resealing.**

Most homeowners — and many contractors — treat polymeric sand as install-and-forget. It isn't. The polymer binder that gives joint sand its weather resistance and weed suppression degrades over time, accelerated by UV exposure, wet-dry cycling, and East Bay temperature swings. After 5–7 years, even correctly installed polymeric sand shows visible crazing, surface erosion, and weed germination in joints where the binder has degraded.

Those cracked, eroded joints are open water pathways. Water enters, migrates to the bedding sand layer, carries fine particles toward the perimeter, and undermines the base from the inside — the same failure sequence as every other joint-related mistake on this list.

The fix: budget a full resand and reseal every 5–7 years. Signs it's overdue include visible joint crazing, weed germination directly in the joint (not at the paver edge — in the joint itself), and surface erosion where sand sits more than 1/8 inch below the paver chamfer. A reseal is a 1-day maintenance operation, not a rebuild — it protects the base investment already in the ground. On a correctly built East Bay paver patio, the base spec and drainage system should outlast multiple reseal cycles.

---

## How to Verify Your Paver Patio Drainage Actually Works

A paver patio's drainage works correctly if water sheets off the surface within 30 seconds of a 1-inch-per-hour rain and no puddle exceeds 1/4 inch deep anywhere on the field.

Here's how to verify it:

1. **Hose test at the high point.** Run a garden hose at full flow at the highest corner of the patio. Water should sheet across the surface and exit cleanly at the low edge in under 30 seconds. Any point where flow slows to a standing puddle identifies a grading low spot or drainage block.

2. **Live rain observation.** Walk the patio during a moderate East Bay winter rain — not a drizzle. Hard rain reveals pooling spots that a hose test misses, especially at the foundation perimeter and at grading seams where one section meets another at a slightly different pitch.

3. **Foundation perimeter inspection.** After the first few wet-season rains, check the foundation siding and any visible crawlspace vents for water staining or efflorescence. Both indicate water is routing toward the structure — a grading or expansion-gap failure.

4. **Joint sand inspection twice a year.** In spring and fall, walk the patio and look at joint fill levels. Joints should be flush with the paver chamfer. Visible low joints mean water (or power-washing, or both) has eroded joint sand, and the base below is getting more water exposure than designed.

For a full post-install verification checklist tied to each install phase, see [the full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift). And if you're seeing joint sand loss that correlates with patio movement, [preventing paver patio sinking and settling](/blog/how-to-prevent-paver-patio-sinking-2026) walks through how those two failure modes interact.

---

## Should You DIY a Paver Patio in the East Bay, or Hire It Out?

A DIY paver patio in flat, sandy soil is achievable for a competent homeowner with rented equipment — but on East Bay clay-soil lots, especially the hillside terrain of Lafayette, Orinda, and Moraga, the drainage engineering and base prep usually require professional spec.

**The honest breakdown:**

**DIY advantages:** You save 40–60% on labor. You control the timeline. For a small, flat patio on stable soil with no drainage complications, a skilled DIYer with a rented vibratory plate compactor can produce a result that holds up.

**Where DIY fails in the East Bay:** Rental compactors from hardware stores typically run 2,000–2,500 lbs of vibratory force — well below the 3,500 lb minimum for Class II aggregate compaction to 95% Proctor density on clay subgrades. Drainage planning on a hillside lot is genuine civil engineering work: where to locate a French drain, how to size it for site runoff, how to route it to a compliant outlet under Contra Costa County drainage requirements. Those decisions have consequences that show up 18 months after install, not 18 days. A misread subgrade condition — clay wetter than expected, a buried irrigation line, a shallow seasonal water table — compounds quickly when the drainage system was designed for drier conditions.

The rebuild cost for a DIY patio that fails at the base runs $18–25 per square foot in the East Bay market. That number typically exceeds what professional installation would have cost on a 400–600 square foot patio.

Lamorinda Pavers builds paver patios across Lafayette, Orinda, and Walnut Creek — see our [paver patio installation](/services/patios) and [Lafayette hillside paver projects](/lafayette) pages — where most homeowners ultimately decide the drainage engineering is worth professional install. For [Moraga](/moraga) and [Orinda](/orinda) hillside lots in particular, the site-specific drainage work — French drain routing, catch basin placement, hillside runoff interception — is where the cost of getting it wrong is highest. Every install Lamorinda Pavers completes carries a 5-year workmanship warranty; if drainage fails due to any installation defect within that window, we fix it. That warranty exists because we've done the drainage engineering correctly from the ground up.

---

## Frequently Asked Questions

### Why is water pooling on my paver patio?

Water pooling on a paver patio usually comes from one of four causes: the subgrade was flat-graded instead of sloped at 1 inch per 8 feet away from the house; joint sand has eroded and water is ponding above a sealed base layer; base aggregate settled unevenly and created low spots; or a French drain has clogged. On East Bay clay-soil lots, the most common cause of paver patio standing water is flat grading combined with joint sand loss over time. Run a hose at the patio's high corner while watching the drainage edge — that test confirms which failure mode is active.

### How do you fix paver patio drainage?

Fixing paver patio drainage starts with identifying the specific failure mode. Flat grading: pull the perimeter pavers, re-grade the base at 1 inch per 8 feet, and relay. Joint sand erosion: resand with Techniseal HP NextGel, Alliance Gator Maxx, or SEK Pro after cleaning at 1,200–1,500 PSI maximum. Base settlement creating low spots: lift affected pavers, add Class II aggregate or bedding sand to restore grade, and relay. French drain failure: camera the pipe, clear the blockage, or replace the perforated section. Many East Bay pooling problems are joint sand and minor settlement — a partial fix rather than a full rebuild.

### Should a paver patio slope toward or away from the house?

Always away from the house. The industry-standard paver patio slope is 1 inch of fall per 8 feet (approximately 1% grade) directed away from any structure, toward the patio's lowest drainage point. Sloping toward the house routes water into the foundation, saturates adjacent clay, and causes seasonal expansion pressure against the structure. On hillside lots in Orinda or Lafayette where the house sits downhill from the patio, a catch basin at the foundation edge intercepts water before it reaches the wall — but the patio itself still slopes away from the foundation.

### Can you regrade a paver patio without removing the pavers?

In some cases, yes — if settlement is localized. Pull the pavers in the affected area, add Class II aggregate or adjust the bedding sand layer to restore the correct slope, tamp lightly, and relay. Resand the joints with Techniseal HP NextGel, Alliance Gator Maxx, or SEK Pro. If the entire field is flat or sloped the wrong direction, a full paver pull and subgrade re-grade is unavoidable. Attempting to correct a system-wide paver patio grading mistake by shimming individual pavers introduces inconsistent bedding depth and new differential settlement.

### How much does it cost to fix paver patio drainage?

Spot repairs — joint resanding, pulling and releveling a few pavers, clearing a French drain — run $500–$2,000 on a standard 400–600 square foot East Bay patio. Partial section rebuilds (pulling 25–40% of the field, re-grading base, relaying) run $3,000–$7,000 depending on scope. A full rebuild with correct base spec and drainage runs $18–28 per square foot in the current East Bay market. The main cost driver is base access — once pavers come up, base assessment determines whether you're doing a minor repair or a full reconstruction.

### What's the right slope for a paver patio?

The correct slope for a paver patio is 1 inch of fall per 8 feet (1% grade minimum) sloped away from any structure, toward the patio's lowest drainage edge. That slope is steep enough to sheet water off the surface without visibly tilting. On hillside Lafayette and Orinda lots where natural grade steepens, you can match the natural slope up to about 2% (1/4 inch per foot) before the patio starts to feel noticeably pitched underfoot. Above 2%, consider terracing with a [retaining wall](/services/retaining-walls) step rather than running a continuous slope across the entire patio footprint.

---

## Already Seeing One of These Failure Modes?

If your existing paver patio shows pooling, perimeter separation, rocking pavers, or joint sand loss, a free on-site assessment from Lamorinda Pavers will tell you whether it's a repair or a partial rebuild — and which of the 11 mistakes above is driving it.

We'll walk the patio with you, probe the joint sand depth, run a hose test at the high corner, and check edge restraint condition and base stability at the perimeter. Within 48 hours you'll have a fixed-price proposal in writing — repair scope, materials, timeline, and cost — before you commit to anything. If the base is sound and the fix is joint resanding or a section relevel, that's what we'll tell you. If the base is compromised and a section rebuild is the right call, the proposal will name it explicitly: base depth, lift count, aggregate product, polymeric sand brand, and warranty terms.

If you're planning a new install and want to see what drainage-engineered paver patio construction looks like from the ground up, Lamorinda Pavers builds paver patios across Lafayette, Orinda, and Walnut Creek using the same drainage-first design approach — French drain routing mapped before excavation, Class II base to ICPI Tech Spec 2 standards, polymeric sand applied in the correct weather window, and a 5-year workmanship warranty on every install. [Contact us](/contact) to schedule your site visit, or browse [Lafayette hillside paver projects](/lafayette) to see finished work on the terrain where drainage engineering matters most.
    `.trim(),
  },

  {
    slug: "what-is-paver-base-compaction-and-why-it-matters",
    featuredImage: "/images/blog-what-is-paver-base-compaction-and-why-it-matters.png",
    title: "What Is Paver Base Compaction and Why It Matters",
    excerpt:
      "Paver base compaction is the single biggest determinant of whether a paver patio lasts 5 years or 50. Here's what it actually is, what equipment and technique it requires, and how to verify your contractor is doing it right on East Bay clay soil.",
    date: "2026-06-01",
    readingTime: "12 min read",
    relatedService: "patios",
    faqs: [
      {
        "question": "What is paver base compaction?",
        "answer": "Paver base compaction is the mechanical process of densifying graded aggregate beneath a paver patio into an interlocking load-bearing matrix using a vibratory plate compactor working in 3-inch lifts. It converts loose aggregate — which has 20–30% void space and shifts under load — into a rigid foundation with 5–10% void space that transfers traffic loads evenly into the subgrade. It's the phase of paver patio installation that determines whether the surface holds level for 25 years or begins settling within two to three seasons."
      },
      {
        "question": "How deep should paver base compaction be?",
        "answer": "In East Bay clay soil — Lafayette, Moraga, Orinda, Walnut Creek, and surrounding Contra Costa lots — the correct compacted base depth is 6–8 inches of Class II aggregate, installed in 3-inch lifts. That spec aligns with ICPI Tech Spec 2 guidelines for expansive-soil conditions and ASTM D698 Proctor density standards. The 4-inch minimum in general paver specifications applies to stable, well-draining soil. East Bay clay doesn't qualify."
      },
      {
        "question": "Can you compact paver base by hand?",
        "answer": "No. A hand tamper generates roughly 200 lbs of force per strike — far below the 3,500 lbs minimum vibratory output required to compact Class II aggregate to 95% Proctor density. Hand-tamped base achieves 70–80% density at best, which looks fine at installation and settles progressively under load. On an Orinda or Moraga clay-soil lot, hand-tamped base typically shows visible failure within two wet seasons."
      },
      {
        "question": "What does properly compacted paver base feel like?",
        "answer": "A properly compacted paver base feels completely rigid underfoot — no give, no footprint indent, no flex when you shift your weight. Walk the surface in normal shoes: any impression, even shallow, means the base isn't ready. Tap it with a framing hammer: it should ring sharp and solid, not thud dully. Both field tests can be run by a homeowner before pavers go down."
      },
      {
        "question": "How long does paver base compaction take?",
        "answer": "For a standard residential patio in the East Bay — 300 to 600 square feet — paver base compaction takes one full day. That covers placing and compacting two to three lifts of Class II aggregate at 3 inches each, with 4–6 plate-compactor passes per lift in alternating directions. If a contractor quotes a one-day total install on a clay-soil lot, they're not doing the base work correctly."
      },
      {
        "question": "What happens if a paver base isn't compacted enough?",
        "answer": "Under-compacted base settles after install on a predictable timeline. By year two, minor edge dipping and water pooling appear. By year five, joint sand washes out, perimeter pavers tilt, and furniture wobbles on localized low spots. By year ten, sections drop an inch or more, pavers crack at stressed edges, and full removal and rebuild is the only fix — typically running $18–28 per square foot in the East Bay market."
      }
    ],
    content: `
## The Short Answer

Paver base compaction is the mechanical process of densifying graded aggregate beneath a paver patio into an interlocking load-bearing matrix using a vibratory plate compactor working in 3-inch lifts. Done right — 6–8 inches of Class II road base compacted to 95% Proctor density — it determines whether your [paver patio installation](/services/patios) lasts 5 years or 50. It's the single most-skipped install detail on low-bid jobs, and the failure it causes is slow enough that most homeowners don't connect the sinking patio to the shortcut until it's far too late to hold anyone accountable.

---

## What Is Paver Base Compaction?

Paver base compaction is the mechanical process of densifying graded aggregate beneath a paver patio into an interlocking load-bearing matrix, using a vibratory plate compactor working in 3-inch lifts.

Here's the physics: loose Class II aggregate has 20–30% void space between particles when first dumped into an excavation. Those voids are air pockets and weak points. A vibratory plate compactor transmits thousands of cycles per minute through the aggregate, forcing particles to reorient, nest, and lock together. After proper compaction, void space drops to 5–10%. The result isn't just denser aggregate — it's a fundamentally different material. Loose aggregate shifts under load. Compacted aggregate transfers load laterally across the entire base matrix and into the subgrade below.

**Loose Class II aggregate has 20–30% void space; properly compacted aggregate has 5–10%.**

Class II aggregate is a Caltrans-spec graded crushed stone with particles from 3/4 inch down to fines, designed to interlock under compaction. The angular, crushed particle shape is what makes Class II work — angular particles bite against each other when compressed, unlike rounded gravel or sand grains that roll past each other under load. It's the material specified in ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements), the U.S. standard for interlocking concrete paver installation. ICPI (the Interlocking Concrete Pavement Institute) is the U.S. trade body that sets installation standards for interlocking concrete pavers.

Proctor density is the laboratory-measured maximum dry density of compacted soil, used as the standard for verifying field compaction. The ASTM D698 Standard Proctor compaction test establishes that maximum — and field compaction should reach 95% of it. Below 95%, the base retains enough void space to compress further under repeated load, which is how gradual post-install settlement starts.

For the full install sequence that paver base compaction feeds into, read [the full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift).

---

## Why Does Paver Base Compaction Matter More Than the Pavers Themselves?

A premium paver on a poorly compacted base will fail in 3–5 years. A budget paver on a properly compacted base will hold for 25 years. The aggregate matrix carries 95% of the load — the pavers ride on top.

**The aggregate base carries 95% of a paver patio's load — the pavers ride on top.**

Think through the loads a backyard patio actually sees: foot traffic, outdoor furniture, container planters running 300–500 lbs when filled, an occasional appliance being moved across the surface, and on many Lamorinda properties, a grill or [outdoor kitchen](/services/outdoor-kitchens) setup with significant static weight. None of that load dissipates at the paver surface. It transfers downward — through the paver, through the 1-inch bedding sand layer, and into the base aggregate. A properly compacted base distributes that force horizontally across a wide footprint. An under-compacted base concentrates it.

Stress concentration is where early failures originate. When a base can't distribute load evenly, stress concentrates at paver edges and corners — the thinnest, most vulnerable geometry. That's why you see edge chips and corner cracks on patios with weak bases, even when the pavers themselves are structurally sound. The paver didn't fail. The system beneath it did.

Expansive clay is soil that swells when wet and shrinks when dry, with seasonal volume change of 5–10%. Lamorinda Pavers builds paver patios across Lafayette, Orinda, and Moraga where expansive clay makes paver base compaction even more critical than on flat sandy lots. A base that might hold for 8 years on stable sandy soil in [Danville](/danville) fails in 3 years on the clay-heavy lots common in the [Orinda](/orinda) hills. The physics don't negotiate.

---

## What Equipment Is Needed to Compact a Paver Base Correctly?

### Why a vibratory plate compactor is non-negotiable

A vibratory plate compactor is the only tool that achieves the 95% Proctor density required for a structural paver base. The machine works by transmitting high-frequency vibration through a flat steel plate into the aggregate below, forcing particles to settle and interlock in a way static weight alone can't produce.

**Minimum plate-compactor force for paver base work is 3,500 lbs of vibratory output.**

Professional-grade machines that meet this spec include the Wacker Neuson WP1550 and the BOMAG BVP 18/45. Both deliver sufficient vibratory force to fully penetrate a 3-inch aggregate lift and compact it from top to bottom. That penetration depth matters — if the compactor's energy doesn't reach the bottom of the lift, the lower half stays under-compacted and becomes a slip plane under load.

### Why hand tampers and DIY rentals usually fail

A hand tamper — the manual square plate on a stick — generates roughly 200 lbs of force per strike. That's enough to lightly consolidate bedding sand or tamp a small patch repair. It's two orders of magnitude below what Class II aggregate compaction requires. Pavers installed over a hand-tamped base don't fail slowly; they settle predictably, usually within the first two wet seasons.

DIY rentals are a different trap. Hardware-store rental yards often carry homeowner-grade plate compactors in the 2,000–2,500 lb range. They're marketed as "pro" equipment and look the part. They're not. Running a 2,200 lb compactor over East Bay clay-soil base prep produces under-compaction that reaches 80–85% Proctor density — looks solid on install day, then begins settling three to six months into the first wet season.

A rammer compactor (jumping jack) is also not a substitute. Rammers compact cohesive soils like clay in trench work — their high-impact, narrow footprint is the wrong energy profile for the broad, loose-aggregate base a paver patio requires. Using a jumping jack on Class II aggregate produces uneven compaction with localized peaks and valleys rather than a uniform density field. Plate compactors and rammer compactors are not interchangeable tools.

---

## How Do You Compact a Paver Base — The Actual Technique?

Proper paver base compaction means 6–8 inches of Class II in 3-inch lifts, 4–6 passes per lift in alternating directions, with each lift verified before the next goes in.

**Proper paver base compaction requires 6–8 inches of Class II aggregate in 3-inch lifts compacted to 95% Proctor density.**

The process in sequence: place 3 inches of Class II aggregate across the geotextile-covered subgrade. Run the plate compactor in 4–6 overlapping passes — north-south first, then east-west, then a diagonal pass if the patio geometry allows it. Alternating directions is non-negotiable: single-direction passes leave compaction shadows (under-compacted strips between the compactor's path lines) that show up as long, linear low spots after install. Repeat for each subsequent lift until you reach 6–8 inches of total compacted depth.

Moisture content matters more than most installers discuss. Slightly damp aggregate compacts best — water acts as a lubricant that lets particles slide into a tighter arrangement under vibration. Bone-dry aggregate compacts poorly because particles bounce against each other rather than locking. Soaking-wet aggregate smears and doesn't compact at all; on East Bay clay-soil subgrades, it also pushes moisture into the subgrade and softens it. The target is aggregate that holds its shape when squeezed but doesn't leave water on your palm.

ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements) is the reference document governing this process. It specifies base depth by soil type and load category, names Class II aggregate as the correct material for residential paver applications, and establishes 95% Proctor density — measured against ASTM D698 — as the field standard. These aren't preferences; they're the published requirements for a correctly built interlocking paver system.

For context on how this phase connects to grading, bedding sand, and edge restraints, see [the full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift).

---

## What Does Insufficient Paver Base Compaction Look Like at 2, 5, and 10 Years?

Failure from under-compacted base doesn't announce itself all at once. It develops on a timeline that's predictable once you know what to watch for — and frustrating because each stage is easy to rationalize until repair is unavoidable.

**Year 2:** Hairline settling appears at patio edges and corners — typically 1/8 to 1/4 inch dips visible when water pools after rain. Joint sand may show slight washout in low spots. Nothing looks catastrophically wrong. Most homeowners assume it's normal settling and move on.

**Year 5:** Visible joint sand washout spreads across the field. Perimeter pavers have tilted outward by 1/4 to 1/2 inch. Furniture wobbles in fixed spots — chair legs and table bases are sitting on localized low points where load concentration has compressed the base further than the surrounding field. If edge restraints were undersized or spaced too widely, perimeter separation is now obvious.

**Year 10:** Structural failure. Sections of the patio drop an inch or more. Individual pavers crack at stress-concentrated edges. The base has been contaminated by clay migration from below (if geotextile was skipped) and the aggregate no longer holds density under load. At this point, repair means removing every paver, excavating and replacing the base from subgrade up, and reinstalling. Rebuilding a failed patio in the East Bay market typically runs $18–28 per square foot.

The compounding effect is what makes under-compaction so expensive: once the base fails, you can't correct it without removing everything above it. For guidance on diagnosing how far along failure already is, read the guide on [preventing paver patio sinking](/blog/how-to-prevent-paver-patio-sinking-2026).

---

## How Can a Homeowner Verify Paver Base Compaction Before Pavers Go Down?

A homeowner can verify paver base compaction with three field tests: the walk test, the hammer ring test, and asking for compaction documentation.

1. **Walk test.** Walk the compacted base surface in your normal shoes. There should be zero footprint indent under your full body weight. Any impression — even shallow — means the surface density isn't there yet. Lamorinda Pavers walks every [Lafayette paver project](/lafayette), [Orinda install](/orinda), and [Walnut Creek](/walnut-creek) install through this verification with the homeowner before pavers go down.

2. **Hammer ring test.** Tap the compacted surface with a framing hammer. A properly compacted base rings solid with a sharp, hard sound. An under-compacted base thuds dully. The difference is unmistakable once you've heard both. This is a field method — it doesn't replace density measurement, but it catches obvious failures fast.

3. **Compaction documentation.** Ask your contractor whether they Proctor-tested the base material or used a nuclear density gauge on-site. A nuclear density gauge gives a real-time reading of field density against the Proctor maximum. It's uncommon on residential installs but a genuine green flag when a contractor uses one. At minimum, confirm the specific base aggregate is a named Class II material — "gravel" or "crushed rock" without a spec is a yellow flag.

4. **Photograph each lift.** Three lifts means three rounds of photos. Ask the crew to notify you when each lift is placed and compacted before the next one starts. Once pavers go down, there's no way to verify what's underneath without pulling them up.

These verification steps aren't adversarial — they're the same due diligence you'd apply to any significant home project. A contractor who objects to them is telling you something. Browse [completed Lamorinda paver projects](/projects) to see documented installs where these steps were applied on every job.

---

## Common Shortcuts That Destroy Paver Base Compaction

Each of these failure modes produces predictable damage on a timeline your contractor won't mention when they hand you the low bid.

1. **Placing more than 3 inches of aggregate per lift.** A vibratory plate compactor's energy penetrates 3–4 inches into aggregate. Dump 6 inches at once and only the top half compacts; the lower half stays loose and settles after install. It's the most common shortcut because it cuts Day 2 work nearly in half.

2. **Using a hand tamper or jumping jack instead of a plate compactor.** Wrong tool, wrong density profile. A rammer compactor is built for compacting cohesive soil in trenches — not for creating a uniform density field in granular aggregate. Hand tampers don't generate anywhere near the 3,500 lbs of vibratory force the spec requires.

3. **Compacting over wet clay subgrade.** Clay subgrade needs to be dry enough to hold its shape under compaction. Wet clay smears and creates a slick plane between subgrade and base aggregate — a slip plane that becomes a failure surface the first time winter rain re-saturates it. If rain interrupts excavation on a [Moraga](/moraga) or Lafayette clay-soil lot, the correct move is to wait.

4. **Skipping geotextile fabric.** Non-woven geotextile fabric between subgrade and base aggregate prevents clay fines from migrating upward into the aggregate — a process called subgrade contamination. Without it, 2–5 wet seasons slowly clog the aggregate's drainage capacity and reduce base density from below. By the time the surface shows movement, the base is already compromised.

5. **Using decomposed granite or crushed miscellaneous base as aggregate.** Decomposed granite is a landscaping material with a particle shape and grading curve that doesn't interlock under compaction the way Class II does. It softens when wet, loses density, and fails to distribute load across the base matrix. Class II aggregate costs roughly $1.50–2.50 per square foot more in material. Rebuilding a DG-based patio after two to three seasons costs far more.

These failure modes aren't hypothetical — they're what drives the repair calls. The guide on [preventing paver patio sinking](/blog/how-to-prevent-paver-patio-sinking-2026) walks through how each one presents at the surface level and what a correct diagnosis looks like.

---

## Frequently Asked Questions

### What is paver base compaction?

Paver base compaction is the mechanical process of densifying graded aggregate beneath a paver patio into an interlocking load-bearing matrix using a vibratory plate compactor working in 3-inch lifts. It converts loose aggregate — which has 20–30% void space and shifts under load — into a rigid foundation with 5–10% void space that transfers traffic loads evenly into the subgrade. It's the phase of paver patio installation that determines whether the surface holds level for 25 years or begins settling within two to three seasons.

### How deep should paver base compaction be?

In East Bay clay soil — Lafayette, Moraga, Orinda, Walnut Creek, and surrounding Contra Costa lots — the correct compacted base depth is 6–8 inches of Class II aggregate, installed in 3-inch lifts. That spec aligns with ICPI Tech Spec 2 guidelines for expansive-soil conditions and ASTM D698 Proctor density standards. The 4-inch minimum in general paver specifications applies to stable, well-draining soil. East Bay clay doesn't qualify.

### Can you compact paver base by hand?

No. A hand tamper generates roughly 200 lbs of force per strike — far below the 3,500 lbs minimum vibratory output required to compact Class II aggregate to 95% Proctor density. Hand-tamped base achieves 70–80% density at best, which looks fine at installation and settles progressively under load. On an Orinda or Moraga clay-soil lot, hand-tamped base typically shows visible failure within two wet seasons.

### What does properly compacted paver base feel like?

A properly compacted paver base feels completely rigid underfoot — no give, no footprint indent, no flex when you shift your weight. Walk the surface in normal shoes: any impression, even shallow, means the base isn't ready. Tap it with a framing hammer: it should ring sharp and solid, not thud dully. Both field tests can be run by a homeowner before pavers go down.

### How long does paver base compaction take?

For a standard residential patio in the East Bay — 300 to 600 square feet — paver base compaction takes one full day. That covers placing and compacting two to three lifts of Class II aggregate at 3 inches each, with 4–6 plate-compactor passes per lift in alternating directions. If a contractor quotes a one-day total install on a clay-soil lot, they're not doing the base work correctly.

### What happens if a paver base isn't compacted enough?

Under-compacted base settles after install on a predictable timeline. By year two, minor edge dipping and water pooling appear. By year five, joint sand washes out, perimeter pavers tilt, and furniture wobbles on localized low spots. By year ten, sections drop an inch or more, pavers crack at stressed edges, and full removal and rebuild is the only fix — typically running $18–28 per square foot in the East Bay market.

---

## Want the Full Install Context? Read the Hub Posts

Paver base compaction is one phase of a four-day [paver patio installation](/services/patios) — and one failure mode out of several. For the complete drainage, grading, bedding sand, edge restraint, and polymeric sand picture, read [the full paver patio install walkthrough](/blog/how-to-install-a-level-paver-patio-that-wont-shift). If you're dealing with an existing patio that's already showing settlement signs, the guide on [preventing paver patio sinking](/blog/how-to-prevent-paver-patio-sinking-2026) walks through how to diagnose which system failed and whether repair or rebuild is the right call.

---

## Start with the Phase That Matters Most

If you're planning a paver patio and want a contractor who treats paver base compaction as the install's most important phase — not the fastest one to finish — request a free on-site estimate from Lamorinda Pavers. We'll walk the property, assess soil conditions, and run a Proctor test on the subgrade if conditions warrant it. Within 48 hours, you'll have a fixed-price proposal that names the base depth, lift count, compaction spec, aggregate product, and 5-year workmanship warranty terms in writing — before you commit to anything.

Lamorinda Pavers builds paver patios across [Lafayette](/lafayette), [Orinda](/orinda), [Moraga](/moraga), [Walnut Creek](/walnut-creek), and [Danville](/danville) — on the expansive-clay lots where base compaction isn't a formality. It's what determines whether the patio you invest in this spring still looks right five winters from now. Browse [completed Lamorinda paver projects](/projects) to see documented installs, or [contact us](/contact) to schedule your estimate.
    `.trim(),
  },

  {
    slug: "how-to-install-a-level-paver-patio-that-wont-shift",
    featuredImage: "/images/blog-how-to-install-a-level-paver-patio-that-wont-shift.png",
    title: "How to Install a Level Paver Patio That Won't Shift",
    excerpt:
      "A well-installed paver patio is a four-day, five-phase process — and every phase has a step that bad installers skip. Here's what a Lamorinda crew does on a Lafayette, Orinda, or Walnut Creek install day by day, with the homeowner punch list you can use to verify your contractor's doing it right.",
    date: "2026-05-25",
    readingTime: "16 min read",
    relatedService: "patios",
    faqs: [
      {
        "question": "How long does it take to install a paver patio?",
        "answer": "A standard residential paver patio installation takes 4 days under normal East Bay conditions: one day for excavation and grading, one day for base aggregate compaction, one day for bedding sand and paver placement, and one day for polymeric sand and finishing. Add a day for significant drainage work or buried obstacles. Add another if rain interrupts the base compaction window. A contractor quoting a one- or two-day install on a clay lot is either working very small square footage or skipping the base prep the job actually needs."
      },
      {
        "question": "What does paver patio installation involve step by step?",
        "answer": "Paver patio installation involves five phases. (1) Site assessment: walk the lot, test the soil, map drainage. (2) Day 1: Excavate to 10–12 inches below finished grade, grade subgrade at 1 inch per 8 feet, install non-woven geotextile fabric with 12-inch overlaps. (3) Day 2: Install 6–8 inches of Class II road base in 3-inch lifts, plate-compact each lift to 95%+ density with a minimum 3,500-lb vibratory compactor. (4) Day 3: Screed 1 inch of ASTM C33 bedding sand, set pavers hand-tight, install PVC edge restraints with 10-inch galvanized spikes at 10-inch spacing. (5) Day 4: Sweep and activate polymeric joint sand, run final compaction pass, complete homeowner walk-through and warranty sign-off."
      },
      {
        "question": "What's the difference between cheap and expensive paver patio installation?",
        "answer": "The price gap between a low-bid install and a spec-correct install in the East Bay typically runs $8–14 per square foot. That difference is almost entirely base preparation: aggregate depth (4 inches vs. 6–8 inches), compaction equipment (hand tamper vs. vibratory plate compactor at 3,500 lbs minimum), and joint sand (plain silica vs. polymeric). The pavers themselves are usually the same product. The cheap install looks identical for the first one to two seasons — then base compression and clay movement start showing up as rocking surfaces, perimeter separation, and joint-sand washout."
      },
      {
        "question": "How do I know if my paver patio is being installed correctly?",
        "answer": "Nine checkpoints confirm a correct paver patio installation: test pit depth at 10–12 inches below finished grade, geotextile coverage photographed before base goes in, three-lift base with visible compaction after each lift, ASTM C33 bedding sand (not play sand), pavers placed hand-tight without tapping, wet-saw cuts on perimeter pieces, PVC edge restraints with 10-inch galvanized spikes at 10-inch spacing, named-brand polymeric sand (not generic), and a 6-foot level walk showing under 1/4 inch deviation across the finished field. If a contractor refuses any of these verification steps, that's your answer."
      },
      {
        "question": "What's the best time of year to install a paver patio in the East Bay?",
        "answer": "April through October is the safest installation window — dry enough for reliable polymeric sand cure, warm enough for normal compaction. Late spring (April–May) and early fall (September–October) are ideal: temperatures stay under 80°F, rain is unlikely, and winter soil moisture has dried to workable levels. Summer is workable, but polymeric sand shouldn't be activated above 80°F. Winter installs aren't impossible, but wet subgrade and rain forecasts within 24 hours of polymeric application are genuine constraints that can stretch a 4-day paver patio installation to 7 days or more."
      },
      {
        "question": "Can I install a paver patio myself?",
        "answer": "On a stable, flat lot with sandy soil and modest square footage, a skilled DIYer can produce a serviceable result. On a Lafayette, Moraga, or Orinda clay lot, base preparation is where DIY installations fail — and it's the hardest part to get right without a vibratory plate compactor, a laser level, and experience reading soil conditions. Renting equipment is possible. Knowing whether your subgrade needs geotextile, how wet is too wet to compact, and whether a drainage constraint requires a French drain is harder to rent. The rebuild cost for a DIY patio that fails at the base ($18–25 per square foot for a full reinstall) typically exceeds what professional installation would have cost."
      }
    ],
    content: `
## The Short Answer

A great [paver patio installation](/services/patios) takes four days and five phases: site assessment, excavation and grading, base aggregate compaction in 3-inch lifts, paver placement with edge restraints, and polymeric jointing. Each phase has at least one step that shortcut installers skip — and each skipped step produces a specific, predictable failure within 18 to 36 months.

A typical East Bay paver patio install takes 4 days. The homeowner verification checklist in the "How Can a Homeowner Verify Each Phase" section below tells you exactly what to confirm at each phase so you're not guessing after the fact.

---

## What Happens Before Day 1 — Site Assessment, Soil Testing, and Design Decisions

The work that determines whether a paver patio lasts 25 years happens before any tool hits the ground. A proper pre-install assessment isn't a formality — on East Bay clay lots, it's where the whole base spec gets set, the drainage path gets mapped, and the pattern choice gets locked against the correct excavation depth.

### Walking the Lot and Identifying Drainage Constraints

Drainage constraints get identified first — before excavation depth, before pattern selection, before anything else. A competent crew walks your property and reads it: where does water pool after a storm, where does runoff from an uphill neighbor cross your lot, and are there downspouts discharging near the patio footprint?

On a sloped Lafayette property along Happy Valley Road, those answers determine whether the job needs a French drain, a catch basin, or simply a steeper pitch in one quadrant. A [Walnut Creek patio install](/walnut-creek) on a flat lot near the downtown corridor has different drainage math than an Orinda hillside property — but both need the drainage path mapped before excavation begins. Skipping this walk is how crews end up cutting drainage into a design that can't accommodate it, or grading a patio that holds water against the house. If drainage work is needed, it belongs in the original bid — not in a change order after excavation starts.

### Soil Testing: Why East Bay Clay Changes Everything

The subgrade is the native soil beneath a paver installation, after topsoil has been removed. In most of Lamorinda — and across a wide swath of Contra Costa — that subgrade is expansive clay. Expansive clay is soil that swells when wet and shrinks when dry, with seasonal volume change of 5–10%. A quick soil test (or a test pit dug to subgrade depth) tells a crew whether they're working in stable sandy loam or in clay that needs a deeper base, geotextile fabric, and a drainage component.

ICPI (the Interlocking Concrete Pavement Institute) is the U.S. trade body that sets installation standards for interlocking concrete pavers. Their reference document, ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements), explicitly calls for increased base depth on expansive, poor-draining soils — which is exactly what the [Orinda](/orinda) hills, [Moraga's](/moraga) clay slopes, and most of the Lamorinda corridor deliver.

**6–8 inches of compacted Class II aggregate in 3-inch lifts is the proven base spec for East Bay clay-soil patios.**

### Choosing Pattern, Color, and Material — and What Your Sub-Base Needs to Support It

Pattern selection affects base depth — it's not purely aesthetic. A 45-degree herringbone pattern requires 1 to 2 inches more base depth than a running bond or stack bond layout. Herringbone transfers load diagonally across the paver field, which amplifies any base inconsistency. It's one of the most structurally stable patterns for a patio or [paver driveway](/services/paver-driveways), but on a clay lot it demands the deeper spec. Running bond and basket weave patterns are more forgiving of minor bedding-sand variation, though they still need the full base treatment on East Bay clay.

Material choice interacts with base prep differently, too. Porcelain pavers are heavier per square foot than interlocking concrete pavers and have zero water absorption — which means bedding-sand drainage matters more, not less. Natural stone varies in thickness and needs careful screeding. Get the material choice locked before excavation so the crew knows exactly what depth to dig to. Those decisions also feed into your broader [landscape design](/services/landscape-design) — if the patio is part of a larger hardscape project, they all need to be coordinated before the first shovel goes in.

---

## Day 1 — Excavation, Grading, and Geotextile Installation

Day 1 sets every dimension that follows. Topsoil and any existing material are removed to 10–12 inches below finished grade — deeper on hillside lots in [Orinda](/orinda) and [Moraga](/moraga) where the full 8-inch compacted depth plus extra buffer for the 1-inch bedding-sand layer and paver thickness are required. That total stack (subgrade → geotextile → 6–8 inches base → 1 inch sand → paver) determines the dig depth. Get it wrong and finished grade is either proud of the lawn or sunk below it.

Once at depth, the subgrade gets graded at 1 inch of fall per 8 feet, directed away from the house. This isn't optional on East Bay clay — a flat or reverse-pitched subgrade holds water against the structure through the entire wet season.

Geotextile fabric is a non-woven synthetic membrane that prevents clay from migrating up into the base aggregate. It goes across the entire excavated footprint, lapped 12 inches at seams, with edges folded up against the excavation walls. No gaps. No spot coverage. Every inch of the subgrade gets covered because every inch is in contact with clay that will try to migrate upward through seasonal wet-dry cycling.

**End-of-day homeowner verification:** The subgrade should be smooth, visibly sloped away from the house, and fully covered with geotextile — no bare clay showing, no overlap gaps under 12 inches. Photograph it before base aggregate goes in. That photo is your documentation that the fabric was installed correctly if questions arise later.

---

## Day 2 — Base Aggregate Compaction (The Phase Bad Installers Skip)

Base aggregate compaction is the phase that separates a 25-year patio from a 5-year repair project — and it's the phase most low-bid contractors cut short. Class II road base (3/4-inch minus, angular-crush aggregate) goes in at 6–8 inches total compacted depth, installed in 3-inch lifts — not dumped all at once. Compacting in lifts is non-negotiable: each layer must achieve 95%+ density before the next one goes down, and you can't compact 8 inches of loose aggregate to uniform density in a single pass.

Each 3-inch lift gets plate-compacted with a vibratory plate compactor. The correct equipment for East Bay paver base work is a Wacker Neuson WP1550 or equivalent machine.

**Minimum plate-compactor force for paver base work is 3,500 lbs of vibratory force.**

A smaller machine doesn't generate enough force to reach the bottom of a 3-inch lift, which means the lower portion stays under-compacted and settles post-install. This is the spec called out in ICPI Tech Spec 2 — not a preference, a standard.

**Each lift gets 4–6 passes with the plate compactor, alternating directions — north-south passes followed by east-west passes on the next round.**

Alternating directions catches compaction shadows that single-direction passes leave behind. Then the next lift goes down and the process repeats.

The difference between correct plate compaction and hand-tamper compaction is the difference between a base that stays rigid under load and one that slowly deforms. A hand tamper achieves 70–80% of required density at best. At 70% density, the base compresses slightly under repeated traffic — not enough to see right away, but enough to cause differential settlement within two seasons on an Orinda or Moraga clay lot. This is also why the [sinking and shifting prevention](/blog/how-to-prevent-paver-patio-sinking-2026) failures you read about almost always trace back to Day 2.

**End-of-day homeowner verification:** Walk the compacted base and tap the surface with a hammer — it should ring solid, not thud. Stand on it: no footprint impression under your full body weight. If you sink even slightly, the surface density isn't there yet.

---

## Day 3 — Bedding Sand, Paver Placement, and Edge Restraints

Day 3 is where the paver patio installation becomes visible — but the work that matters most on this day is still below the surface.

A 1-inch layer of ASTM C33 concrete sand gets screeded across the compacted base. ASTM C33 is the U.S. specification for concrete sand — a clean, coarse, angular sand that holds its position under the weight of pavers and drains freely when water infiltrates the joint. Do not substitute play sand or fine silica sand. Fine sand loses its screeded profile the moment a paver compresses it unevenly, which creates a rolling surface that's nearly impossible to correct without lifting the field.

Screeding is done with straight-edged rails set to the 1-inch depth. The bedding sand layer does not get compacted — it stays loose and screeded so pavers can be set into it at consistent depth. Once screeded, don't walk on it before paver placement begins.

Pavers go down hand-tight — each unit placed against its neighbors with no gap and no tapping to seat. Tapping creates uneven bedding compression that shows up as high and low spots across the field. Edge cuts are made with a wet saw, not a guillotine splitter. A guillotine can cut pavers in under ten seconds; a wet saw takes longer and produces a precise, tight cut edge that fits cleanly against the border. On curved edges and on paver pool decks, that precision difference is immediately visible.

**Industry level tolerance for a paver patio is 1/4 inch of deviation over an 8-foot span.**

Verify this during Day 3 with a 6-foot mason's level walked across the field in three directions — two diagonals and one straight-line center pass. Anything over 1/4 inch deviation gets addressed before edge restraints go in.

PVC edge restraints get installed around the entire perimeter after the field is set and verified level. Correct installation: 10-inch galvanized spikes at 10-inch spacing, driven fully flush. Shorter spikes pull out under seasonal clay pressure. Wider spacing allows flex at the perimeter, which lets the field edge walk outward — typically 1/4 to 1/2 inch per year on East Bay clay without adequate restraint. Once it walks, you can't push it back without lifting the entire perimeter section. The same edge restraint standard applies whether you're installing a [paver patio](/services/patios), a [pool deck](/services/pool-decks), or a driveway — the clay doesn't care what's sitting on top.

---

## Day 4 — Polymeric Sand, Final Compaction, and Homeowner Walk-Through

Day 4 finishes the paver patio installation and locks the system together.

Polymeric sand — Techniseal HP NextGel or Alliance Gator Maxx are the two products with a consistent performance record in East Bay wet-dry cycling conditions — gets swept fully into joints in two passes, then brushed off the paver surface completely. Sand left on the surface after wetting hazes the paver face and requires mechanical removal. It's a ten-minute step that installers who are rushing skip.

Once swept in and brushed off, the sand activates with a fine water mist in three passes — not a flood. Flooding washes polymer out of the joint before it binds. The correct technique is a fine spray that penetrates the joint without displacing material. Wait for visible surface moisture to absorb between passes.

**Avoid polymeric sand installation in temperatures above 80°F.** In high heat, the polymer activates too fast before water can fully penetrate the joint depth, leaving the lower portion of each joint under-bonded.

**Avoid polymeric sand installation within 24 hours of a rain forecast.** Rain on fresh polymer sand before cure is complete washes the binder out of the joint — you end up with expensive silica sand and no polymer bond.

24-hour cure window before any foot traffic. 48 hours before furniture. Both numbers assume temperatures between 50–75°F. Cooler weather slows cure.

After the sand activates and before cure completes, the crew runs a final plate-compaction pass over the entire field with a foam-padded shoe attached to the plate to prevent surface scoring. This seats each paver firmly into the bedding sand layer and closes any minor joint variation that opened during paver placement.

The homeowner walk-through at the end of Day 4 covers five things: level verification with the mason's level, edge restraint spike inspection, joint-sand fill confirmation (joints should look fully packed, not hollow), drainage pitch check with a water hose, and written review of warranty terms. Lamorinda Pavers backs [paver patio installation](/services/patios) across Lafayette, Walnut Creek, and Orinda with a 5-year workmanship warranty — that document gets signed and handed over at the walk-through, not mailed two weeks later.

---

## What Does "Level" Mean for a Paver Patio (and How Do Good Installers Verify It)?

Industry level tolerance for a paver patio is 1/4 inch of deviation over an 8-foot span. Tighter than that pools water at low joints; looser is a tripping hazard over time.

Good installers verify levelness with a 6-foot or 8-foot mason's level walked across the field in a pattern that covers the whole surface — think three overlapping X lines spanning the patio's length and width. That pattern catches high and low spots that a single straight-line pass misses, including the bowl-shaped settling that develops when base compaction is uneven across a field.

Most paver patio install failures show up as deviations greater than 1/2 inch within 18 months. That's the threshold where a flat surface develops a noticeable rock underfoot or a visible dip visible from a chair. At 1/4 inch or less, the surface feels solid and reads flat from every angle.

Levelness is also where drainage and aesthetics interact. A patio that's level in the absolute sense — zero pitch in any direction — pools water. Correct "level" for a patio means consistently pitched at 1 inch per 8 feet toward a drainage edge, with less than 1/4 inch of random deviation around that pitch line. When Lamorinda Pavers completes a [Walnut Creek patio install](/walnut-creek) or a hillside project in [Lafayette](/lafayette), this graded pitch is what we verify before the walk-through hose test. A surface that pools is a grading failure, not a cosmetic issue.

---

## How Can a Homeowner Verify Each Phase of a Paver Patio Install?

Every phase of a paver patio installation has a verifiable checkpoint — and asking for verification isn't adversarial, it's the same due diligence you'd apply to any significant home project. Here's what to confirm, in order:

1. **Ask to see the test pit depth before excavation is complete.** The hole should reach 10–12 inches below your planned finished grade. Photograph it with something for scale.

2. **Photograph geotextile coverage before base aggregate goes in.** Fabric should cover the full footprint with no bare spots and 12-inch overlaps at seams. Once base goes in, you can't verify it's there.

3. **Photograph each base lift after compaction.** Three lifts means three rounds of photos. Ask the crew to tell you when each lift is down and compacted before the next one starts.

4. **Ask which polymeric sand brand is being used and confirm it before install.** Techniseal HP NextGel and Alliance Gator Maxx are both proven in East Bay conditions. Generic or private-label polymeric sand is not a substitute.

5. **Ask before Day 3 what sand product they're using for bedding.** The answer should be ASTM C33 concrete sand. "Sand" or "fine sand" without a spec is a yellow flag.

6. **Ask the installer to walk a 6-foot level across the finished surface in front of you.** Any point showing more than 1/4 inch of deviation over 8 feet should be addressed before you sign off on the work.

7. **Verify edge restraint type and spike length before installation.** PVC spike-down restraints with 10-inch galvanized spikes at 10-inch spacing is the correct spec. Ask to see the spikes and the spacing before they're driven.

8. **Get the warranty terms in writing before final payment.** A 5-year workmanship warranty should name what's covered (base settling, edge restraint failure, surface movement) and what's excluded. Verbal warranties aren't warranties.

9. **Run a hose over the finished surface and watch where water goes.** Water should move cleanly away from the house toward the drainage edge. Any pooling in the field or against the foundation is a grading issue that's far cheaper to fix today than after the warranty conversation.

You can see how all of this comes together by browsing [completed Lamorinda paver projects](/projects) — including finished patios in Lafayette, Orinda, and Walnut Creek where the base spec and drainage work are documented. If you're earlier in the planning process, the [full services overview](/services) gives you a sense of how patio work integrates with retaining walls, outdoor kitchens, and other hardscape.

---

## What Happens When a Paver Patio Install Gets Disrupted?

A 4-day paver patio install can stretch to 5–7 days when weather, soil surprises, or buried utilities require the crew to adapt. That's not a planning failure — it's what honest sequencing looks like on East Bay lots that weren't built to be perfectly predictable.

The most common disruptions, and what a good crew does with each:

**Rain during excavation or base install.** Wet subgrade loses its compactability. If rain saturates the excavated subgrade before geotextile and base go in, the correct move is to wait — not compact wet clay and cover it. Compressed wet clay rebounds when it dries, pushing the base from below. A crew that pushes through is setting up the kind of failure you won't see for 18 months. [Sinking and shifting](/blog/how-to-prevent-paver-patio-sinking-2026) after a wet winter is almost always traceable to this decision.

**Discovering an old slab.** Concrete or asphalt buried under the existing surface is common on Lamorinda properties with patios built and covered over multiple renovation cycles. Slab removal adds a day and requires a concrete saw, a dumpster, and a reassessment of excavation depth.

**Hidden irrigation or utilities.** The Orinda hills and older [Lafayette paver work](/lafayette) sites have irrigation lines, low-voltage lighting cables, and drainage pipes in places no as-built drawing captures. A competent crew hand-digs the last 2 inches to finished subgrade near any utility markings and calls for a re-mark if something turns up. Projects that also include [retaining walls](/services/retaining-walls) or [outdoor kitchens](/services/outdoor-kitchens) carry additional buried-utility risk — all of it gets mapped before excavation.

**Clay wetter than expected.** Even a good soil test is a sample — a wide clay lot can have pockets that drain poorly and stay saturated well into spring. If the test pit showed manageable clay but excavation reveals a saturated zone, the correct spec changes: deeper base, additional geotextile, possibly a subsurface drain added to the original plan.

Every [Lafayette paver work](/lafayette) bid from Lamorinda Pavers carries a 10–15% contingency for buried-condition surprises. That number is built into the fixed-price proposal so you're not fielding a change-order call mid-project when a buried condition turns up. The contingency either gets used or it doesn't — but you know about it upfront. [Learn more about how Steve runs Lamorinda Pavers](/about) and why fixed-price proposals are a core part of the process.

---

## Frequently Asked Questions

### How long does it take to install a paver patio?

A standard residential paver patio installation takes 4 days under normal East Bay conditions: one day for excavation and grading, one day for base aggregate compaction, one day for bedding sand and paver placement, and one day for polymeric sand and finishing. Add a day for significant drainage work or buried obstacles. Add another if rain interrupts the base compaction window. A contractor quoting a one- or two-day install on a clay lot is either working very small square footage or skipping the base prep the job actually needs.

### What does paver patio installation involve step by step?

Paver patio installation involves five phases. (1) Site assessment: walk the lot, test the soil, map drainage. (2) Day 1: Excavate to 10–12 inches below finished grade, grade subgrade at 1 inch per 8 feet, install non-woven geotextile fabric with 12-inch overlaps. (3) Day 2: Install 6–8 inches of Class II road base in 3-inch lifts, plate-compact each lift to 95%+ density with a minimum 3,500-lb vibratory compactor. (4) Day 3: Screed 1 inch of ASTM C33 bedding sand, set pavers hand-tight, install PVC edge restraints with 10-inch galvanized spikes at 10-inch spacing. (5) Day 4: Sweep and activate polymeric joint sand, run final compaction pass, complete homeowner walk-through and warranty sign-off.

### What's the difference between cheap and expensive paver patio installation?

The price gap between a low-bid install and a spec-correct install in the East Bay typically runs $8–14 per square foot. That difference is almost entirely base preparation: aggregate depth (4 inches vs. 6–8 inches), compaction equipment (hand tamper vs. vibratory plate compactor at 3,500 lbs minimum), and joint sand (plain silica vs. polymeric). The pavers themselves are usually the same product. The cheap install looks identical for the first one to two seasons — then base compression and clay movement start showing up as rocking surfaces, perimeter separation, and joint-sand washout.

### How do I know if my paver patio is being installed correctly?

Nine checkpoints confirm a correct paver patio installation: test pit depth at 10–12 inches below finished grade, geotextile coverage photographed before base goes in, three-lift base with visible compaction after each lift, ASTM C33 bedding sand (not play sand), pavers placed hand-tight without tapping, wet-saw cuts on perimeter pieces, PVC edge restraints with 10-inch galvanized spikes at 10-inch spacing, named-brand polymeric sand (not generic), and a 6-foot level walk showing under 1/4 inch deviation across the finished field. If a contractor refuses any of these verification steps, that's your answer.

### What's the best time of year to install a paver patio in the East Bay?

April through October is the safest installation window — dry enough for reliable polymeric sand cure, warm enough for normal compaction. Late spring (April–May) and early fall (September–October) are ideal: temperatures stay under 80°F, rain is unlikely, and winter soil moisture has dried to workable levels. Summer is workable, but polymeric sand shouldn't be activated above 80°F. Winter installs aren't impossible, but wet subgrade and rain forecasts within 24 hours of polymeric application are genuine constraints that can stretch a 4-day paver patio installation to 7 days or more.

### Can I install a paver patio myself?

On a stable, flat lot with sandy soil and modest square footage, a skilled DIYer can produce a serviceable result. On a Lafayette, Moraga, or Orinda clay lot, base preparation is where DIY installations fail — and it's the hardest part to get right without a vibratory plate compactor, a laser level, and experience reading soil conditions. Renting equipment is possible. Knowing whether your subgrade needs geotextile, how wet is too wet to compact, and whether a drainage constraint requires a French drain is harder to rent. The rebuild cost for a DIY patio that fails at the base ($18–25 per square foot for a full reinstall) typically exceeds what professional installation would have cost.

---

## Plan Your Patio Install with a Fixed-Price Proposal

Now that you know exactly what a correct paver patio installation looks like — phase by phase, lift by lift, spec by spec — the next step is finding the contractor who actually does it that way.

Request a free on-site estimate from Lamorinda Pavers. We'll walk the property, dig a test pit to assess your soil conditions, measure and map your drainage constraints, and return a fixed-price proposal within 48 hours. That proposal names the base depth, lift count, compactor spec, polymeric sand brand, edge restraint type, and warranty terms — in writing, before you commit to anything. No open-ended line items. No vague bids.

Lamorinda Pavers crews install paver patios across Lafayette, Walnut Creek, and Orinda using this same four-day phase structure. Every install is backed by a 5-year workmanship warranty covering base settling, edge restraint failure, and surface movement. [See completed Lamorinda paver projects](/projects) to review finished installs with documented specs, or [contact us](/contact) to schedule your on-site estimate. If you're in [Danville](/danville) or the broader Contra Costa corridor, we work there too — same spec, same warranty, same crew.
    `.trim(),
  },

  {
    slug: "how-to-prevent-paver-patio-sinking-2026",
    featuredImage: "/images/blog-how-to-prevent-paver-patio-sinking-2026.png",
    title: "How to Prevent Paver Patio Sinking in 2026",
    excerpt:
      "Paver patios sink for a handful of fixable reasons — undersized base, poor grading, missing edge restraints, and the wrong joint sand. Here's what real-world installation does differently across Lafayette, Moraga, and Orinda's clay-soil lots in 2026.",
    date: "2026-05-18",
    readingTime: "14 min read",
    relatedService: "patios",
    faqs: [
      {
        "question": "Why is my paver patio sinking?",
        "answer": "Paver patio sinking is caused by one or more of these: insufficient base depth over expansive clay, missing geotextile fabric that allowed clay to contaminate the aggregate, poor grading that holds water against the subgrade, absent or failed edge restraints, or standard silica sand in the joints that has washed out. The paver itself almost never fails — the system beneath it does. Identifying which cause applies to your specific patio determines whether you need spot repair or a full base rebuild."
      },
      {
        "question": "How deep should the base be for a paver patio in clay soil?",
        "answer": "In East Bay clay soil — Lafayette, Moraga, Orinda, Walnut Creek, and surrounding Contra Costa lots — the correct base depth is 6–8 inches of compacted Class II aggregate installed in 3-inch lifts over non-woven geotextile fabric. That's consistent with ICPI Tech Spec 2 guidelines for expansive-soil conditions. The 4-inch minimum in general paver specifications applies to stable, well-draining soil — not the clay-heavy lots common across Lamorinda."
      },
      {
        "question": "How long do paver patios last?",
        "answer": "A paver patio with correct base prep, edge restraints, and polymeric joint sand lasts 25 to 30 years with routine maintenance. Individual pavers can be replaced if damaged without disturbing the rest of the field — a structural advantage concrete doesn't offer. The 25-year figure assumes the 5-to-7-year reseal cadence and periodic joint sand maintenance described in the maintenance schedule above."
      },
      {
        "question": "Can sunken pavers be fixed without redoing the whole patio?",
        "answer": "Yes — if the base itself is intact. Isolated sunken sections can be repaired by lifting the affected pavers, re-grading the bedding sand layer, re-laying the pavers, and resanding the joints. If the base aggregate has been contaminated by clay migration or has lost density due to water saturation, the repair requires replacing the base in that section — more involved, but still not a whole-patio redo. A contractor who won't assess the base before quoting a repair is guessing at scope."
      },
      {
        "question": "Does polymeric sand prevent paver patio shifting?",
        "answer": "Polymeric sand prevents lateral joint failure — it locks pavers in place horizontally by binding the joint material into a semi-flexible mass. It doesn't substitute for edge restraints or adequate base prep. Think of it as the last line of lateral defense: edge restraints hold the perimeter, base prep holds the field vertically, and polymeric joint sand holds each paver against its neighbor. All three components work together; none replaces the others."
      },
      {
        "question": "How much does it cost to fix a sunken paver patio?",
        "answer": "Spot repair of isolated sunken pavers (lift, re-level bedding sand, relay, resand) typically runs $400–900 for a small section in the East Bay market. Partial base repair — where aggregate must be removed and replaced in a 20–40 square foot area — runs $1,200–2,500 depending on depth and access. Full patio removal, base rebuild, and relay is priced by square footage: typically $18–28 per square foot in the East Bay, depending on paver type, base spec, and drainage work required."
      }
    ],
    content: `
## The Short Answer

Paver patios sink because of installation shortcuts, not paver defects. Five things prevent it: deep base prep over expansive clay, slope toward drainage, PVC edge restraints, polymeric joint sand, and a French-drain plan on hillside lots. Get all five right and a [paver patio installation](/services/patios) holds level for 25 years or more. Miss any one of them on a Lafayette or Orinda clay lot, and you'll be lifting pavers within two to three seasons.

Expansive clay is soil that swells when wet and shrinks when dry, with seasonal volume change of 5–10%. Every section below ties back to that single fact — because clay behavior is the root cause behind most of the sinking, settling, and shifting that East Bay homeowners call us about.

---

## Why Do Paver Patios Sink in the East Bay?

The Lamorinda hills and the broader Contra Costa corridor don't have forgiving soil. What looks like a stable backyard in August is a slowly moving mass by February. Understanding why patios fail here starts with knowing what's under them.

### Inadequate base preparation

A thin or poorly compacted base is the single most common cause of [paver patio installation](/services/patios) failure in the East Bay. When the aggregate layer beneath a paver field doesn't have enough depth or density, traffic loads and soil movement push through it — and the surface follows. Most DIY installations and budget installs use 3 to 4 inches of base aggregate, which is fine for stable sandy soil and entirely inadequate for the clay-heavy lots common in Lafayette, Moraga, and Orinda. The base doesn't just support weight — it distributes it. Without enough depth and proper compaction in lifts, you get uneven settlement concentrated wherever load is highest: chair legs, a heavy grill, foot traffic paths.

### Expansive clay soil and seasonal movement

Expansive clay in Lafayette, Moraga, and Orinda moves 2–4 inches between wet and dry seasons. Lafayette, Moraga, and Orinda all sit on expansive clay belts that stretch across the Lamorinda hills and into the broader Contra Costa corridor. That movement isn't distributed evenly across a patio — it concentrates where drainage is poor, where shade keeps soil wet longer, and where the base layer is thinnest. A paver field installed directly over expansive clay without geotextile fabric and a deep aggregate buffer is essentially floating on a surface that changes shape twice a year.

### Poor drainage and surface grading

Standing water after rain is a warning sign that a patio's subgrade is saturating — and saturated subgrade loses its load-bearing capacity. When water infiltrates the base aggregate and has nowhere to go, it softens the material that's supposed to stay rigid under load. On Moraga's clay slopes and in the Orinda hills, winter rain totals of 25–30 inches hit soil that already drains slowly. A flat-graded or reverse-pitched patio holds that water against the structure instead of shedding it. The result isn't dramatic collapse — it's gradual, uneven sinking that worsens every wet season. Proper grading and drainage are part of every [Moraga hardscape work](/moraga) and [Orinda paver patio](/orinda) spec we write.

### Missing or failing edge restraints

Without edge restraints, the perimeter of a paver field spreads outward under repeated traffic and seasonal soil pressure — and once the perimeter moves, the whole field loses its constraint. Edge restraints are the mechanical boundary that keeps every paver locked in its intended position. Remove them (or skip them on the install), and a paver field walks 1/4 to 1/2 inch per year, with perimeter pavers separating first and interior pavers following. It's one of the most-skipped details on East Bay paver bids, and one of the most expensive to correct after the fact.

---

## What Base Depth Does a Paver Patio Actually Need in East Bay Clay Soil?

A paver patio in East Bay clay soil needs 6–8 inches of compacted Class II aggregate in 3-inch lifts over non-woven geotextile fabric — roughly double the manufacturer minimum. 6–8 inches of compacted Class II in 3-inch lifts is the proven base spec for East Bay clay-soil patios.

ICPI (the Interlocking Concrete Pavement Institute) is the U.S. trade body that sets installation standards for interlocking concrete pavers. Their reference document, ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements), specifies base preparation requirements by soil type — and explicitly calls for increased base depth on poor-draining, expansive soils. East Bay clay qualifies on both counts.

| Spec | Manufacturer minimum | East Bay clay-soil spec | What fails with the minimum |
|---|---|---|---|
| Base aggregate depth | 4 inches compacted Class II | 6–8 inches compacted Class II in 3-inch lifts | Base punches through under traffic; clay swells into aggregate layer |
| Geotextile fabric | Optional | Required — non-woven over subgrade | Clay fines migrate up into aggregate, destroying drainage capacity |
| Bedding sand layer | 1 inch screeded | 1 inch screeded (same) | Not the failure point if base is correct |
| Compaction equipment | Hand tamper acceptable | Vibratory plate compactor required | Hand tamper never achieves required base density; base settles post-install |
| Subgrade prep | Grade and compact | Grade, compact, and assess clay expansion potential | Flat subgrade holds water against base; clay movement concentrates at low spots |

The geotextile fabric layer is frequently omitted on lower-bid installs. Its job is to prevent clay fines from migrating upward into the aggregate layer over time — a process called subgrade contamination that destroys drainage capacity quietly over two to three years. By the time you see surface movement, the base aggregate is already compromised from below.

For [paver patio installation](/services/patios) on the expansive-clay lots common across [Lafayette patio projects](/lafayette), [Walnut Creek](/walnut-creek), and surrounding Contra Costa areas, treating the ICPI minimum as a floor — not a target — is what separates a 25-year patio from a 5-year repair project.

---

## How Does Proper Grading and Drainage Stop Paver Patio Settling and Shifting?

Grading prevents paver patio settling by sloping water away before it saturates the subgrade, and by ensuring traffic load compacts the base uniformly. The industry standard is 1 inch of fall per 8 feet, increased on hillside Lafayette and Orinda lots where winter runoff volume is significantly higher.

### The 1-inch-per-8-feet rule (and when to break it)

One inch of fall per 8 feet of patio run is the baseline grading standard for paver surfaces — enough to move surface water without creating a noticeable pitch underfoot. Industry tolerance for a paver patio is 1/4 inch of deviation over 8 feet, which means your grading needs to be precise, not approximate. On a flat [Danville](/danville) lot near the freeway, that standard grade is usually sufficient. On a sloped property along Happy Valley Road in Lafayette or in the Orinda hills, you need more. Shallow grades on hillside lots funnel water from uphill onto the patio instead of past it, and no amount of good base prep compensates for a subgrade that stays saturated from November through March.

Flat-graded patios — level in every direction — fail unevenly because furniture legs, foot traffic, and grill positioning concentrate load in fixed spots. Those spots compress the base more than surrounding areas, and the differential settlement shows up as a wave or dip that's usually impossible to correct without lifting the field. It's a non-obvious failure mode: the patio looks fine at install and develops a permanent low spot 18 months later.

### French drains, surface runoff, and clay's role in winter rain

On hillside lots in Orinda and Moraga, surface grading alone isn't enough — subsurface water needs a managed exit path. A French drain (perforated pipe in a gravel trench, wrapped in filter fabric) installed at the patio perimeter intercepts water moving through the soil before it reaches the subgrade. Without it, winter rain saturates clay that has no fast drainage path, the clay swells, and the aggregate base gets pushed from below. The patio rocks. The joints open. Perimeter pavers tip outward first.

Clay's specific problem with winter rain isn't volume alone — it's timing. Contra Costa clay saturates quickly and drains slowly. A single heavy storm in January can keep a clay subgrade wet for three to four weeks. During that window, any load on the surface — even foot traffic — transfers unevenly to a softened base. That's why [Orinda paver patios](/orinda) and [Moraga hardscape work](/moraga) on sloped lots almost always include a French-drain component in the drainage spec. The same logic applies to [Walnut Creek](/walnut-creek) properties that back up to hillside terrain.

If your property also involves significant grade changes, a [retaining wall](/services/retaining-walls) paired with the patio drainage plan keeps soil movement contained on both sides of the structure.

---

## Why Are Edge Restraints Critical for a Paver Patio?

Edge restraints prevent a paver patio from spreading outward under traffic and seasonal clay movement. Without them, a paver field walks 1/4 to 1/2 inch per year and the perimeter fails first.

The correct installation standard: PVC spike-down restraints installed with 10-inch galvanized spikes at 10-inch spacing. That spike length and spacing is what holds the restraint in place when clay-soil pressure pushes against the patio's perimeter during wet-season expansion. Shorter spikes pull out. Wider spacing allows flex. Either failure lets the perimeter creep, and once the perimeter moves, the whole field unlocks.

Edge restraint is the single most-skipped install detail on East Bay paver bids. It adds a few hundred dollars to a project and is invisible once the job is done — which makes it easy to omit on a competitive bid without the client noticing until 18 months later. What you see when it's missing: perimeter pavers that have separated from the field, joint gaps that open progressively outward, and a surface that rocks underfoot near the edges while the center stays stable.

Concrete borders are sometimes pitched as an alternative. They work for aesthetics but fail as a restraint mechanism on clay-soil lots — the concrete moves with the clay, and you end up with a border that's shifted as a unit rather than individual PVC restraints holding a flexible field in place. You can see how we integrate edge restraints into finished [paver patio installations in our completed project gallery](/projects).

---

## Polymeric vs. Regular Joint Sand: Which One Prevents Paver Patio Failure in Clay Soil?

Polymeric joint sand prevents paver patio joint failure in East Bay clay; regular silica sand washes out within 2–3 winters. The polymer forms a flexible bond that locks pavers laterally without going rigid — it moves with the paver field under thermal expansion and minor clay movement instead of cracking out. This is one of the highest-impact decisions in the entire paver patio installation process, and one of the most frequently underestimated.

Three products that perform in East Bay conditions: **Techniseal HP NextGel**, **Alliance Gator Maxx**, and **SEK Pro**. All three activate with water to form a semi-flexible binder in the joint. All three are rated for the wet-dry cycles common in Lamorinda winters.

The cost difference is real and worth understanding:

- **Regular silica sand:** approximately $0.40 per square foot to install
- **Polymeric joint sand:** approximately $1.20 per square foot to install

That $0.80/sf premium buys 3–4x the service life. Silica sand washes out, ant colonies move in, joints open, and pavers lose lateral restraint from below. When that happens on a clay-soil lot, you're paying to lift pavers, recompact settled areas, and resand — typically $8–15 per square foot for a partial repair, depending on how much disturbance the base took.

Polymeric joint sand needs maintenance, not replacement. The correct cadence: resand and reseal every 5–7 years. At year five to seven, surface sealer has degraded and the polymer in the joints has weathered enough to accept a fresh application. It's a half-day project on most residential patios, not a reconstruction.

If you're pairing a patio with an [outdoor kitchen](/services/outdoor-kitchens) or [fire pit](/services/fire-pits-and-fire-features), specify polymeric sand across the entire connected paver field — grease and heat cycling make silica sand failure happen even faster in those zones.

---

## What DIY Paver Patio Installation Mistakes Cause Early Sinking?

Each of these mistakes produces visible sinking or shifting within 18 to 36 months on East Bay clay soil. The remediation costs below are what East Bay homeowners actually pay when a patio gets redone — not estimates pulled from national averages.

1. **Skipping geotextile fabric over expansive clay.** Fabric costs roughly $0.15–0.25 per square foot installed. Without it, clay fines migrate into the aggregate base within two to three wet seasons, contaminating the drainage layer and softening the base from below. Remediation requires lifting the entire patio, removing and replacing the base, and reinstalling — typically $18–25 per square foot.

2. **Using decomposed granite as base aggregate.** DG is a landscaping material, not a structural base. It doesn't compact to the density required for a load-bearing paver base, and it softens when wet. Class II crushed aggregate (3/4-inch minus, angular) is the correct material per ICPI Tech Spec 2 — it interlocks under compaction and holds density when saturated. Swapping DG for Class II costs roughly $1.50–2.50 more per square foot in material. Fixing a DG-based patio after two years costs far more.

3. **Compacting with a hand tamper instead of a vibratory plate compactor.** A hand tamper achieves 70–80% of required base density at best. A vibratory plate compactor reaches 95%+ in each 3-inch lift, which is what ICPI Tech Spec 2 requires for pedestrian and light-traffic surfaces. Post-install settlement from under-compaction shows up as a uniform subsidence — the whole patio drops — rather than the localized sinking caused by soil movement.

4. **Mortaring joints instead of using joint sand.** Mortared joints trap moisture at the joint base and prevent the paver field from moving as a unit under thermal expansion and clay pressure. The result is cracked mortar within one to two seasons, open joints that channel water directly into the base, and accelerated damage at clay-movement boundaries. Interlocking concrete pavers are engineered to flex as a system — mortar defeats that behavior.

5. **Flat-grading instead of pitching toward drainage.** A perfectly level patio looks right in the moment and fails gradually. Water pools, saturates the subgrade, clay expands unevenly, and the flat surface develops a rocking low point wherever drainage is worst. Correcting grade after the patio is installed requires a full lift-and-relay — $15–22 per square foot depending on paver type and field complexity.

These same mistakes appear in [paver driveway installations](/services/paver-driveways) and [pool deck projects](/services/pool-decks) — anywhere interlocking concrete pavers sit over clay subgrade, the base prep principles are identical.

---

## What Maintenance Schedule Keeps a Paver Patio Level for 25+ Years?

A properly installed paver patio on East Bay clay soil doesn't need constant intervention — it needs the right attention at the right intervals. Here's the realistic arc:

1. **Year 1:** Walk the patio after the first wet season. Look for edge separation, joint-sand washout, or any low spots that weren't present at install. This is the window where any workmanship issues surface — and the time when a warranty matters. Lamorinda Pavers backs [paver patio installation](/services/patios) across [Lafayette](/lafayette), [Moraga](/moraga), [Orinda](/orinda), and [Walnut Creek](/walnut-creek) with a 5-year workmanship warranty, so any base or grading issues discovered in year one are covered.

2. **Year 3:** Visual joint sand check. Run your hand across the joints — they should feel flush and firm. If you see gaps wider than 1/8 inch or areas where sand has clearly washed, spot-treat with polymeric sand before the next wet season. Catching it at year three prevents joint failure from propagating across the field.

3. **Year 5–7:** Full polymeric resand and reseal. Surface sealer has degraded through UV exposure and wet-dry cycling; polymeric sand in the joints has weathered. A full reseal restores water repellency, refreshes the joint binder, and gives you another 5–7 years of protection. Budget $3–6 per square foot for professional reseal depending on patio size and product used.

4. **Year 10:** Walk the patio systematically and probe for any soft spots or rocking pavers. On a correctly installed base, this should find nothing — or at most one or two isolated pavers near a downspout or irrigation head that need re-leveling. Re-leveling isolated pavers (lift, add bedding sand, relay, tamp, resand) runs $200–500 for a small section and doesn't require disturbing the rest of the field.

5. **Year 20+:** Cosmetic refresh if the paver surface has faded significantly. Some homeowners reseal at this point primarily for color; others let the natural weathering stand. The structural integrity of a correctly built patio at 20 years should be indistinguishable from year five.

A paver patio doesn't maintain itself forever — but the maintenance it does need is predictable, low-cost, and completely unlike the unpredictable repair cycle of cracked concrete. That's the core structural advantage of interlocking concrete pavers: individual units replace without disturbing the field, and the system tolerates minor clay movement rather than cracking through it. Explore what a full outdoor transformation looks like in [our completed paver projects](/projects) — patios, driveways, walls, and drainage work across the East Bay.

---

## Frequently Asked Questions

### Why is my paver patio sinking?

Paver patio sinking is caused by one or more of these: insufficient base depth over expansive clay, missing geotextile fabric that allowed clay to contaminate the aggregate, poor grading that holds water against the subgrade, absent or failed edge restraints, or standard silica sand in the joints that has washed out. The paver itself almost never fails — the system beneath it does. Identifying which cause applies to your specific patio determines whether you need spot repair or a full base rebuild.

### How deep should the base be for a paver patio in clay soil?

In East Bay clay soil — Lafayette, Moraga, Orinda, Walnut Creek, and surrounding Contra Costa lots — the correct base depth is 6–8 inches of compacted Class II aggregate installed in 3-inch lifts over non-woven geotextile fabric. That's consistent with ICPI Tech Spec 2 (Construction of Interlocking Concrete Pavements) guidelines for expansive-soil conditions. The 4-inch minimum in general paver specifications applies to stable, well-draining soil — not the clay-heavy lots common across Lamorinda.

### How long do paver patios last?

A paver patio with correct base prep, edge restraints, and polymeric joint sand lasts 25 to 30 years with routine maintenance. Individual pavers can be replaced if damaged without disturbing the rest of the field — a structural advantage concrete doesn't offer. The 25-year figure assumes the 5-to-7-year reseal cadence and periodic joint sand maintenance described above.

### Can sunken pavers be fixed without redoing the whole patio?

Yes — if the base itself is intact. Isolated sunken sections can be repaired by lifting the affected pavers, re-grading the bedding sand layer, re-laying the pavers, and resanding the joints. If the base aggregate has been contaminated by clay migration or has lost density due to water saturation, the repair requires replacing the base in that section — more involved, but still not a whole-patio redo. A contractor who won't assess the base before quoting a repair is guessing at scope. See [our completed paver projects](/projects) for examples of both repair types.

### Does polymeric sand prevent paver patio shifting?

Polymeric sand prevents lateral joint failure — it locks pavers in place horizontally by binding the joint material into a semi-flexible mass. It doesn't substitute for edge restraints or adequate base prep. Think of it as the last line of lateral defense: edge restraints hold the perimeter, base prep holds the field vertically, and polymeric joint sand holds each paver against its neighbor. All three components work together; none replaces the others.

### How much does it cost to fix a sunken paver patio?

Spot repair of isolated sunken pavers (lift, re-level bedding sand, relay, resand) typically runs $400–900 for a small section in the East Bay market. Partial base repair — where aggregate must be removed and replaced in a 20–40 square foot area — runs $1,200–2,500 depending on depth and access. Full patio removal, base rebuild, and relay is priced by square footage: typically $18–28 per square foot in the East Bay, depending on paver type, base spec, and drainage work required. A soil assessment before agreeing to scope is how you avoid paying for a full rebuild when spot repair would have held.

---

## Plan Your 2026 Patio with a Free On-Site Estimate

If you're planning a [paver patio installation](/services/patios) in 2026 and want to know exactly what base prep your specific lot requires, request a free on-site estimate. Lamorinda Pavers will walk the property, dig a test pit to assess soil conditions, measure grade, and return a fixed-price proposal within 48 hours — with the base depth, drainage spec, edge-restraint plan, and 5-year warranty terms in writing.

Lamorinda Pavers builds paver patios on the expansive-clay lots common in Lafayette, Moraga, and Orinda — and we're familiar with the drainage patterns, soil conditions, and grading constraints specific to each neighborhood. [Lafayette patio projects](/lafayette) often require a deeper base spec and French-drain component. [Orinda paver patios](/orinda) on hillside lots need additional grading analysis. [Moraga hardscape work](/moraga) on clay slopes involves subsurface drainage that doesn't show up on a standard bid. We also serve [Walnut Creek](/walnut-creek), [Danville](/danville), and surrounding Contra Costa communities — [see the full service area](/areas).

The proposal we send names every spec. No open-ended line items. [Contact us](/contact) to schedule your estimate.
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

export function getRelatedPosts(
  currentSlug: string,
  relatedService: string | undefined,
  limit = 3,
): BlogPost[] {
  if (!relatedService) return [];
  return getPublishedPosts()
    .filter((p) => p.slug !== currentSlug && p.relatedService === relatedService)
    .slice(0, limit);
}
