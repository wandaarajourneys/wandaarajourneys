import { seededImage } from "@/lib/images";
import type { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    slug: "maasai-mara",
    name: "Maasai Mara National Reserve",
    country: "Kenya",
    region: "Maasai Mara",
    activityTypes: ["Safari", "Wildlife", "Cultural"],
    tagline: "Home of the Great Migration",
    description:
      "The Maasai Mara is Kenya's crown jewel — vast golden savannah where wildebeest thunder across the plains each year in the Great Migration, and the Big Five roam freely. Wandaara's guided game drives put you close to the action while respecting the land and the Maasai communities who call it home.",
    heroImage: seededImage("maasai-mara-hero"),
    gallery: [seededImage("maasai-mara-1"), seededImage("maasai-mara-2"), seededImage("maasai-mara-3")],
    highlights: [
      "Witness the Great Migration river crossings (Jul–Oct)",
      "Big Five game drives at dawn and dusk",
      "Visit an authentic Maasai village",
      "Hot air balloon safaris over the plains",
    ],
    bestTimeToVisit: "July – October",
  },
  {
    slug: "diani-beach",
    name: "Diani Beach",
    country: "Kenya",
    region: "Coast",
    activityTypes: ["Beach", "Honeymoon", "Adventure"],
    tagline: "Powder-white sand, turquoise Indian Ocean",
    description:
      "Diani Beach is repeatedly ranked among Africa's best beaches — a 17km stretch of soft white sand backed by palm forest and coral cliffs. Whether you want to dive the reef, kitesurf the trade winds, or simply do nothing at all, Diani delivers.",
    heroImage: seededImage("diani-beach-hero"),
    gallery: [seededImage("diani-1"), seededImage("diani-2"), seededImage("diani-3")],
    highlights: [
      "Snorkeling and diving at Kisite-Mpunguti Marine Park",
      "Dhow sunset cruises",
      "Kitesurfing lessons",
      "Colobus monkey conservation walks",
    ],
    bestTimeToVisit: "December – March",
  },
  {
    slug: "mount-kenya",
    name: "Mount Kenya",
    country: "Kenya",
    region: "Central Kenya",
    activityTypes: ["Hiking", "Adventure"],
    tagline: "Africa's second-highest peak",
    description:
      "Mount Kenya's jagged glacial peaks and alpine moorland offer some of East Africa's finest trekking without the crowds of Kilimanjaro. Wandaara's routes are led by certified mountain guides with full acclimatization schedules.",
    heroImage: seededImage("mount-kenya-hero"),
    gallery: [seededImage("mount-kenya-1"), seededImage("mount-kenya-2"), seededImage("mount-kenya-3")],
    highlights: [
      "Summit Point Lenana (4,985m)",
      "Sirimon–Chogoria traverse route",
      "Alpine lakes and unique afro-montane flora",
      "Experienced high-altitude guides and porters",
    ],
    bestTimeToVisit: "January – March, June – October",
  },
  {
    slug: "amboseli",
    name: "Amboseli National Park",
    country: "Kenya",
    region: "Rift Valley",
    activityTypes: ["Safari", "Wildlife"],
    tagline: "Elephants under the shadow of Kilimanjaro",
    description:
      "Amboseli offers arguably Africa's most iconic photograph: free-roaming elephant herds framed by the snowcapped peak of Mount Kilimanjaro. The park's swamps draw huge concentrations of wildlife year-round.",
    heroImage: seededImage("amboseli-hero"),
    gallery: [seededImage("amboseli-1"), seededImage("amboseli-2"), seededImage("amboseli-3")],
    highlights: [
      "Iconic Kilimanjaro backdrop photography",
      "Large free-ranging elephant herds",
      "Observation Hill panoramic viewpoint",
      "Maasai cultural encounters",
    ],
    bestTimeToVisit: "June – October, January – February",
  },
  {
    slug: "lamu-island",
    name: "Lamu Island",
    country: "Kenya",
    region: "Coast",
    activityTypes: ["Cultural", "Beach", "Honeymoon"],
    tagline: "A UNESCO Swahili time capsule",
    description:
      "Lamu's Old Town is the oldest and best-preserved Swahili settlement in East Africa — a maze of coral-stone alleys, carved doors, and donkey carts with no cars in sight. Pair it with the dunes of Shela Beach for a slower, soulful escape.",
    heroImage: seededImage("lamu-hero"),
    gallery: [seededImage("lamu-1"), seededImage("lamu-2"), seededImage("lamu-3")],
    highlights: [
      "UNESCO World Heritage Old Town walking tour",
      "Traditional dhow sailing",
      "Shela Beach dunes",
      "Swahili cuisine and craft markets",
    ],
    bestTimeToVisit: "October – March",
  },
  {
    slug: "serengeti",
    name: "Serengeti National Park",
    country: "Tanzania",
    region: "International",
    activityTypes: ["Safari", "Wildlife"],
    tagline: "Endless plains, endless wildlife",
    description:
      "Just across the border from the Mara, the Serengeti's limitless horizons host one of the greatest concentrations of wildlife left on Earth. Wandaara's cross-border itineraries combine both ecosystems for the ultimate East African safari.",
    heroImage: seededImage("serengeti-hero"),
    gallery: [seededImage("serengeti-1"), seededImage("serengeti-2"), seededImage("serengeti-3")],
    highlights: [
      "Big cat sightings — lion, leopard, cheetah",
      "Seronera Valley year-round game viewing",
      "Ngorongoro Crater day trip add-on",
      "Luxury tented camps under the stars",
    ],
    bestTimeToVisit: "June – September",
  },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
