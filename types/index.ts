export type CurrencyCode = "KES" | "USD";

export type Region =
  | "Coast"
  | "Rift Valley"
  | "Maasai Mara"
  | "Northern Kenya"
  | "Central Kenya"
  | "International";

export type ActivityType =
  | "Safari"
  | "Beach"
  | "Hiking"
  | "Cultural"
  | "Wildlife"
  | "Honeymoon"
  | "Adventure"
  | "City Break";

export interface PriceTier {
  label: string;
  perPersonKES: number;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  region: Region;
  activityTypes: ActivityType[];
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  bestTimeToVisit: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface GroupDiscount {
  minSize: number;
  discountPercent: number;
}

export interface TourPackage {
  slug: string;
  name: string;
  destinationSlugs: string[];
  durationDays: number;
  durationNights: number;
  summary: string;
  tagline?: string;
  description: string;
  heroImage: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  pricing: {
    peak: PriceTier;
    offPeak: PriceTier;
  };
  groupDiscount: GroupDiscount;
  difficulty: "Easy" | "Moderate" | "Challenging";
  tier?: "Budget" | "Mid Range" | "Luxury";
  activityTypes: ActivityType[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  packageSlug?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "Booking" | "Payments" | "Travel" | "Safety" | "General";
}
