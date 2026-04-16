export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  text: string;
  service: string;
  source: "yelp" | "google" | "direct";
}

// TODO: Replace with real Yelp reviews from Steve
export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    city: "Lafayette",
    rating: 5,
    text: "Steve and his crew transformed our backyard into an absolute paradise. The paver patio is stunning and the attention to detail is incredible. He was on-site every single day overseeing the work. Couldn't be happier!",
    service: "Patios",
    source: "yelp",
  },
  {
    name: "Michael R.",
    city: "Orinda",
    rating: 5,
    text: "We had our entire driveway replaced with pavers and the result exceeded our expectations. The crew was professional, clean, and finished on schedule. Our neighbors keep stopping to compliment it.",
    service: "Paver Driveways",
    source: "yelp",
  },
  {
    name: "Jennifer L.",
    city: "Walnut Creek",
    rating: 5,
    text: "From the initial consultation to the final walkthrough, the experience was flawless. Steve's design eye is remarkable — he suggested a retaining wall detail that completely made the project. Highly recommend.",
    service: "Retaining Walls",
    source: "yelp",
  },
  {
    name: "David K.",
    city: "Moraga",
    rating: 5,
    text: "Best investment we've made in our home. The outdoor kitchen and patio area Steve designed has become the heart of our home. We entertain out there every weekend now.",
    service: "Outdoor Kitchens",
    source: "yelp",
  },
  {
    name: "Lisa T.",
    city: "Danville",
    rating: 5,
    text: "We replaced our water-guzzling lawn with artificial turf and couldn't be happier. Looks perfectly green year-round and our water bill dropped dramatically. Steve's team did an amazing job with the installation.",
    service: "Artificial Turf",
    source: "yelp",
  },
];
