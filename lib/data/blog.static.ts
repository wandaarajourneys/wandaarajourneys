import { seededImage } from "@/lib/images";
import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "when-to-see-the-great-migration",
    title: "When to See the Great Migration: A Month-by-Month Guide",
    excerpt:
      "The wildebeest never stop moving. Here's how to time your Maasai Mara safari to catch the river crossings.",
    coverImage: seededImage("blog-migration"),
    author: "Wandaara Editorial Team",
    date: "2026-05-12",
    readingTime: "6 min read",
    tags: ["Safari", "Planning"],
    content: [
      "The Great Migration is a year-round circuit, not a single event — over two million wildebeest, zebra, and gazelle move in a continuous loop between the Serengeti and the Maasai Mara, chasing rainfall and fresh grazing.",
      "From July through October, the herds are typically in the Mara, and this is when the dramatic Mara River crossings happen — crocodiles included. December through March, they're calving on the southern Serengeti plains, which brings its own spectacle of newborns and predator action.",
      "Our advice: if a river crossing is your must-see moment, book July–September and stay at least four nights, since crossings can't be scheduled — they depend on the herds' mood and the river's water levels.",
    ],
  },
  {
    slug: "what-to-pack-kenya-safari",
    title: "What to Pack for a Kenya Safari (and What to Leave at Home)",
    excerpt: "A practical packing list from guides who've seen every mistake in the book.",
    coverImage: seededImage("blog-packing"),
    author: "Wandaara Editorial Team",
    date: "2026-04-02",
    readingTime: "5 min read",
    tags: ["Planning", "Tips"],
    content: [
      "Neutral colors matter more than most travelers expect — khaki, olive, and sand tones blend into the bush, while bright colors and white can spook wildlife and show dust immediately.",
      "Layers are essential: mornings on game drives can dip below 10°C even in dry season, while midday sun is intense. A fleece or light jacket you can shed by 9am is ideal.",
      "Skip the hard-shell suitcase. Most light aircraft transfers between camps have soft-bag-only luggage restrictions (typically 15kg), so a duffel bag packs down safely for those internal flights.",
    ],
  },
  {
    slug: "diani-beach-vs-lamu",
    title: "Diani Beach vs. Lamu: Which Kenyan Coast Trip Is Right for You?",
    excerpt: "Two very different coastal experiences — here's how to choose between them.",
    coverImage: seededImage("blog-coast"),
    author: "Wandaara Editorial Team",
    date: "2026-03-18",
    readingTime: "4 min read",
    tags: ["Beach", "Planning"],
    content: [
      "Diani is built for resort-style relaxation and water sports — kitesurfing, diving, and a lively strip of beachfront restaurants make it ideal for couples and families who want convenience alongside adventure.",
      "Lamu is slower and more cultural. There are no cars on the island, the Old Town is a UNESCO World Heritage Site, and days revolve around dhow sailing and wandering coral-stone alleys rather than beach bars.",
      "If you want to do less and feel more, choose Lamu. If you want an active beach holiday with nightlife options nearby, Diani is the better fit.",
    ],
  },
  {
    slug: "mount-kenya-vs-kilimanjaro",
    title: "Mount Kenya vs. Kilimanjaro: An Honest Comparison for Trekkers",
    excerpt: "Fewer crowds, similar altitude challenge — here's what actually differs.",
    coverImage: seededImage("blog-mountains"),
    author: "Wandaara Editorial Team",
    date: "2026-02-25",
    readingTime: "7 min read",
    tags: ["Hiking", "Adventure"],
    content: [
      "Point Lenana on Mount Kenya (4,985m) is a trekking peak, not a technical climb, much like Kilimanjaro's Uhuru Peak (5,895m) — but Mount Kenya sees a fraction of the foot traffic.",
      "Because Mount Kenya is lower, altitude sickness risk is somewhat reduced, though a proper acclimatization schedule is still essential and non-negotiable on any of our itineraries.",
      "Scenically, Mount Kenya's Chogoria route through the gorges is considered by many guides to be more dramatic, mile for mile, than most of Kilimanjaro's standard routes.",
    ],
  },
  {
    slug: "kenya-visa-and-entry-guide",
    title: "Kenya Visa and Entry Requirements: What International Travelers Need to Know",
    excerpt: "A quick reference on eTA applications, yellow fever certificates, and border logistics.",
    coverImage: seededImage("blog-visa"),
    author: "Wandaara Editorial Team",
    date: "2026-01-30",
    readingTime: "5 min read",
    tags: ["Planning", "Tips"],
    content: [
      "Kenya requires most visitors to apply for an electronic travel authorization (eTA) in advance online. Approval typically takes a few business days, so apply at least two weeks before departure.",
      "A yellow fever vaccination certificate is required if you're arriving from, or have transited through, a country with risk of yellow fever transmission.",
      "If your itinerary crosses into Tanzania for a Serengeti extension, note that a separate Tanzanian visa is required — our team handles the documentation checklist as part of cross-border bookings.",
    ],
  },
  {
    slug: "responsible-tourism-kenya",
    title: "How Wandaara Approaches Responsible Tourism",
    excerpt: "Why community partnerships and conservation fees matter more than a discount price.",
    coverImage: seededImage("blog-responsible"),
    author: "Wandaara Editorial Team",
    date: "2025-12-11",
    readingTime: "4 min read",
    tags: ["Cultural", "Sustainability"],
    content: [
      "Every Wandaara safari itinerary includes park conservation fees paid in full and on time — these fees directly fund anti-poaching patrols and habitat protection.",
      "We partner directly with Maasai-owned conservancies and Swahili-run guesthouses rather than routing all margin through foreign-owned chains, so more of what you spend stays local.",
      "We cap group sizes on cultural visits, including Maasai village tours and Lamu Old Town walks, to reduce the strain of tourism on communities that host us.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((b) => b.slug === slug);
}
