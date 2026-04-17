export interface Service {
  slug: string;
  name: string;
  icon?: string;
  image?: string;
  imagePosition?: string;
  shortDescription: string;
  description: string;
  features: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const services: Service[] = [
  {
    slug: "paver-driveways",
    name: "Paver Driveways",
    icon: "/images/icons/paver-driveways.png",
    image: "/images/services/paver-driveways.jpg",
    imagePosition: "center 70%",
    shortDescription:
      "Elevate your home's curb appeal with a custom-designed paver driveway built to last.",
    description:
      "Your driveway is the first thing guests see when they arrive. We design and install stunning paver driveways that combine beauty with durability, using premium interlocking pavers that withstand the test of time. From elegant herringbone patterns to modern linear designs, we craft driveways that transform the entire look of your property.",
    features: [
      "Custom pattern and color selection",
      "Interlocking paver systems for maximum durability",
      "Proper grading and drainage engineering",
      "Reinforced edge restraints",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "How long does a paver driveway installation take?",
        answer:
          "Most residential driveway projects take 3-5 days depending on size and complexity. We handle everything from excavation to final sealing.",
      },
      {
        question: "Are pavers more durable than concrete?",
        answer:
          "Yes. Interlocking pavers are 3-4 times stronger than poured concrete and flex with ground movement instead of cracking. Individual pavers can also be replaced if ever damaged.",
      },
      {
        question: "Do paver driveways require maintenance?",
        answer:
          "Minimal maintenance is needed. We recommend occasional sweeping and re-sealing every 2-3 years to keep your driveway looking its best.",
      },
    ],
    relatedSlugs: ["patios", "retaining-walls", "landscape-design"],
  },
  {
    slug: "retaining-walls",
    name: "Retaining Walls",
    image: "/images/services/retaining-walls.jpg",
    imagePosition: "center 15%",
    shortDescription:
      "Functional and beautiful retaining walls that transform sloped terrain into usable outdoor space.",
    description:
      "Retaining walls do more than hold back soil — they create definition, add dimension, and unlock usable space on your property. Whether you need a structural wall to manage a hillside or a decorative wall to frame a garden bed, we engineer every wall for lasting strength and visual impact.",
    features: [
      "Structural engineering for hillside properties",
      "Multiple material options: block, stone, natural rock",
      "Integrated drainage systems",
      "Terraced multi-level designs",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "Do retaining walls need a permit?",
        answer:
          "Walls over 4 feet typically require a building permit and engineered plans. We handle the entire permitting process for you.",
      },
      {
        question: "How long do retaining walls last?",
        answer:
          "A properly built retaining wall lasts 50-100 years. The key is proper drainage and a solid foundation, both of which we engineer into every project.",
      },
    ],
    relatedSlugs: ["landscape-design", "patios", "paver-driveways"],
  },
  {
    slug: "patios",
    name: "Patios",
    icon: "/images/icons/patios.webp",
    image: "/images/services/patios.jpg",
    imagePosition: "center 20%",
    shortDescription:
      "Create your perfect outdoor living space with a custom paver patio designed for your lifestyle.",
    description:
      "A beautifully designed patio extends your living space into the outdoors. We create custom paver patios that serve as the foundation for entertaining, relaxing, and making memories. From intimate courtyard patios to expansive outdoor rooms, every project is tailored to your vision and lifestyle.",
    features: [
      "Custom layouts tailored to your space",
      "Wide selection of paver styles and colors",
      "Seamless integration with fire features, kitchens, and seating walls",
      "Proper slope and drainage for all-weather enjoyment",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "What size patio do I need?",
        answer:
          "We recommend a minimum of 200 sq ft for a dining area, 300+ sq ft for a full outdoor living area. During your free consultation, we'll help design the perfect size for your space and needs.",
      },
      {
        question: "Can you work with my existing landscaping?",
        answer:
          "Absolutely. We regularly design patios that integrate with existing landscapes, pools, and structures. We'll work around what you love and enhance the overall design.",
      },
    ],
    relatedSlugs: ["outdoor-kitchens", "fire-pits-and-fire-features", "pool-decks"],
  },
  {
    slug: "artificial-turf",
    name: "Artificial Turf",
    image: "/images/services/artificial-turf.jpg",
    imagePosition: "center 70%",
    shortDescription:
      "Enjoy a lush, green lawn year-round with zero watering, mowing, or maintenance.",
    description:
      "Say goodbye to brown patches, water bills, and weekend mowing. Our premium artificial turf installations give you a pristine lawn that stays green 365 days a year. We use the highest-quality synthetic turf with realistic blade variation and proper drainage engineering for a result that looks and feels like the real thing.",
    features: [
      "Premium turf with realistic blade technology",
      "Proper base preparation and drainage",
      "Pet-friendly and child-safe materials",
      "Dramatic water savings",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "Does artificial turf get hot in the sun?",
        answer:
          "Modern turf uses heat-reflective technology that significantly reduces surface temperature compared to older products. It's comparable to natural grass in moderate climates like the East Bay.",
      },
      {
        question: "How long does artificial turf last?",
        answer:
          "Quality artificial turf lasts 15-20 years with minimal maintenance. It's a long-term investment that pays for itself through water savings alone.",
      },
    ],
    relatedSlugs: ["putting-greens", "landscape-design", "patios"],
  },
  {
    slug: "landscape-design",
    name: "Landscape Design",
    icon: "/images/icons/landscape-design.png",
    image: "/images/services/landscape-design.jpg",
    shortDescription:
      "Comprehensive landscape design that brings your outdoor vision to life from concept to completion.",
    description:
      "Great outdoor spaces start with great design. Our landscape design service takes your ideas and transforms them into a cohesive plan that maximizes your property's potential. We consider every element — grading, drainage, hardscaping, softscaping, lighting, and flow — to create outdoor environments that are as functional as they are beautiful.",
    features: [
      "Full property assessment and consultation",
      "Custom design plans with material selections",
      "3D visualization of your project",
      "Phased implementation options",
      "Coordination of all trades and materials",
    ],
    faqs: [
      {
        question: "Do I need a full landscape design?",
        answer:
          "For projects involving multiple elements (paving, walls, planting, lighting), a design plan ensures everything works together cohesively and avoids costly changes mid-project.",
      },
      {
        question: "How long does the design process take?",
        answer:
          "From initial consultation to final design, expect 1-2 weeks. We want to get it right, and we'll revise until you're thrilled with the plan.",
      },
    ],
    relatedSlugs: ["patios", "retaining-walls", "paver-driveways"],
  },
  {
    slug: "fire-pits-and-fire-features",
    name: "Fire Pits & Fire Features",
    icon: "/images/icons/fire-pits-and-fire-features.png",
    image: "/images/services/fire-pits-and-fire-features.jpg",
    imagePosition: "center 35%",
    shortDescription:
      "Add warmth and ambiance to your outdoor space with a custom fire pit or fire feature.",
    description:
      "Nothing draws people together like fire. Our custom fire pits and fire features become the centerpiece of your outdoor living area — perfect for cool East Bay evenings, entertaining guests, or quiet nights under the stars. From rustic stone fire pits to sleek modern fire tables, we design and build features that match your style.",
    features: [
      "Gas and wood-burning options",
      "Custom stone, block, or modern designs",
      "Safe, code-compliant gas line installation",
      "Integrated seating walls",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "Gas or wood-burning — which is better?",
        answer:
          "Gas fire features offer instant on/off convenience and cleaner burning. Wood-burning pits provide the classic campfire experience. We'll help you choose based on your lifestyle and local regulations.",
      },
      {
        question: "Do I need a permit for a fire pit?",
        answer:
          "Gas fire features typically require a permit for the gas line. We handle all permitting and inspections as part of our service.",
      },
    ],
    relatedSlugs: ["patios", "outdoor-kitchens", "landscape-design"],
  },
  {
    slug: "outdoor-kitchens",
    name: "Outdoor Kitchens",
    image: "/images/services/outdoor-kitchens.jpg",
    imagePosition: "center 30%",
    shortDescription:
      "Take your entertaining to the next level with a fully equipped custom outdoor kitchen.",
    description:
      "Why cook inside when you can have a fully equipped kitchen in your backyard? Our custom outdoor kitchens are built to handle everything from casual weeknight grilling to elaborate dinner parties. We design kitchens with premium materials that withstand the elements while looking stunning year after year.",
    features: [
      "Custom island and countertop design",
      "Built-in grills, burners, and appliance integration",
      "Granite, tile, or natural stone countertops",
      "Electrical and plumbing coordination",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "What appliances can be included?",
        answer:
          "Built-in grills, side burners, refrigerators, sinks, pizza ovens, kegerators — virtually any outdoor-rated appliance can be integrated into your kitchen design.",
      },
      {
        question: "How much does an outdoor kitchen cost?",
        answer:
          "Outdoor kitchens range widely based on size and features. We'll design options at different levels during your free consultation so you can choose what fits your budget.",
      },
    ],
    relatedSlugs: ["patios", "fire-pits-and-fire-features", "landscape-design"],
  },
  {
    slug: "pool-decks",
    name: "Pool Decks",
    image: "/images/services/pool-decks.jpg",
    imagePosition: "center 25%",
    shortDescription:
      "Transform the area around your pool with slip-resistant, heat-reflective paver decking.",
    description:
      "Your pool deck should be as inviting as the pool itself. We install premium paver pool decks that are slip-resistant, heat-reflective, and absolutely beautiful. Whether you're renovating an existing pool surround or designing a new pool area from scratch, we create decks that are safe, durable, and designed for barefoot comfort.",
    features: [
      "Slip-resistant paver surfaces",
      "Heat-reflective materials for barefoot comfort",
      "Proper drainage away from the pool",
      "Coping and edge detail options",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "Are pavers safe around a pool?",
        answer:
          "Yes — we specifically select slip-resistant pavers with textured surfaces rated for pool areas. They're safer than poured concrete or smooth tile when wet.",
      },
      {
        question: "Can you work around an existing pool?",
        answer:
          "Absolutely. We regularly remove old concrete decking and replace it with pavers without affecting the pool structure. We protect your pool throughout the entire process.",
      },
    ],
    relatedSlugs: ["patios", "landscape-design", "artificial-turf"],
  },
  {
    slug: "putting-greens",
    name: "Putting Greens",
    shortDescription:
      "Practice your short game at home with a professionally installed custom putting green.",
    description:
      "Bring the country club to your backyard. Our custom putting greens are professionally graded and installed with premium synthetic turf that provides a true, consistent roll. Whether you want a simple practice green or a multi-hole course with sand traps and contours, we build greens that serious golfers love.",
    features: [
      "Professional-grade putting turf",
      "Custom contours and breaks",
      "Fringe and rough areas for chipping practice",
      "Integrated cup and flag systems",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "How realistic is the putting surface?",
        answer:
          "Very. We use professional-grade turf that provides a true roll at stimp speeds comparable to a well-maintained country club green.",
      },
      {
        question: "What size green do I need?",
        answer:
          "A functional putting green starts at around 200 sq ft. For chipping and multiple holes, we recommend 400+ sq ft. We'll design the ideal layout for your space during your free consultation.",
      },
    ],
    relatedSlugs: ["artificial-turf", "landscape-design", "patios"],
  },
  {
    slug: "water-features",
    name: "Water Features",
    shortDescription:
      "Add the soothing sound of water to your landscape with custom ponds, fountains, and waterfalls.",
    description:
      "Water features bring a sense of tranquility and natural beauty to any outdoor space. From bubbling fountains and cascading waterfalls to koi ponds and stream beds, we design and install water features that become the focal point of your landscape. Every installation includes proper filtration, circulation, and maintenance access.",
    features: [
      "Custom ponds, fountains, and waterfalls",
      "Professional filtration and circulation systems",
      "Natural stone and boulder placement",
      "LED lighting for evening ambiance",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "How much maintenance do water features require?",
        answer:
          "Modern filtration systems make maintenance minimal — periodic filter cleaning and seasonal adjustments. We design every feature with easy maintenance access.",
      },
      {
        question: "Will a water feature increase my water bill?",
        answer:
          "Recirculating systems use the same water continuously, so the impact is minimal — comparable to filling a bathtub once a month to account for evaporation.",
      },
    ],
    relatedSlugs: ["landscape-design", "patios", "pool-decks"],
  },
  {
    slug: "arbors",
    name: "Arbors & Pergolas",
    shortDescription:
      "Define your outdoor space with elegant aluminum or fixed arbors and pergola structures.",
    description:
      "Arbors and pergolas add architectural interest, shade, and structure to your outdoor living areas. We install premium aluminum and fixed arbor systems that frame your patio, define your outdoor rooms, and provide relief from the California sun. Clean lines, durable materials, and expert installation ensure a structure that enhances your home for decades.",
    features: [
      "Aluminum and wood construction options",
      "Adjustable louvered roof systems available",
      "Custom sizing to fit any space",
      "Integrated lighting and fan options",
      "5-year workmanship warranty",
    ],
    faqs: [
      {
        question: "Aluminum or wood — which is better?",
        answer:
          "Aluminum is virtually maintenance-free, won't rot or warp, and lasts indefinitely. Wood offers a more traditional aesthetic but requires periodic staining/sealing. We'll help you choose based on your style and maintenance preferences.",
      },
      {
        question: "Do arbors require permits?",
        answer:
          "Structures attached to the home or over a certain size typically require permits. We handle all permitting as part of our service.",
      },
    ],
    relatedSlugs: ["patios", "outdoor-kitchens", "landscape-design"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): Service[] {
  return slugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => s !== undefined);
}
