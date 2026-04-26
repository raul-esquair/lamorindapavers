export interface Testimonial {
  name: string;
  city: string;
  rating: number;
  text: string;
  service: string;
  source: "yelp" | "google" | "direct";
}

// Real Yelp reviews — lightly trimmed for the carousel display. Full reviews at:
// https://www.yelp.com/biz/lamorinda-pavers-lafayette
export const testimonials: Testimonial[] = [
  {
    name: "Ashley N.",
    city: "Twentynine Palms, CA",
    rating: 5,
    text: "Working with Steve and his team was an amazing experience from start to finish. He's professional, honest and extremely knowledgeable. He genuinely cares about the quality of his work, and delivered exactly what we envisioned. Our new turf and pavers turned out beautifully and completely transformed the space.",
    service: "Artificial Turf",
    source: "yelp",
  },
  {
    name: "Marie D.",
    city: "Pleasant Hill, CA",
    rating: 5,
    text: "Great work! They went above and beyond. We had a concrete patio installed 10 years ago and the color and finish was worn away — I wasn't sure it could be restored. Steve and Randy did wonders and it looks brand new! Quality work, integrity, and pride in a job well done. They won't stop until it is just right.",
    service: "Patios",
    source: "yelp",
  },
  {
    name: "Wade P.",
    city: "Concord, CA",
    rating: 5,
    text: "We hired Steve years ago to do our original driveway and went with him again to expand our driveway for our RV access. He did a fantastic job both times. Well worth working with him. Very professional.",
    service: "Paver Driveways",
    source: "yelp",
  },
  {
    name: "Sharon B.",
    city: "Los Altos, CA",
    rating: 5,
    text: "We are so glad we found Steve! He listened and did what I wanted but added his input that was helpful in making my decision. His knowledge and experience really made a difference for our project. His crew was skillful, professional and courteous. They did a great job in a timely manner!",
    service: "Landscape Design",
    source: "yelp",
  },
];
