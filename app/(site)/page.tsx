import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, Leaf } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PackageCard } from "@/components/PackageCard";
import { DestinationCard } from "@/components/DestinationCard";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { TrustBadges } from "@/components/TrustBadges";
import { getFeaturedPackages } from "@/lib/data/packages";
import { getDestinations } from "@/lib/data/destinations";
import { getTestimonials } from "@/lib/data/testimonials";

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

const pillars = [
  {
    icon: Compass,
    title: "Expert Local Guides",
    description: "Every itinerary is led by guides who grew up on this land and know it intimately.",
  },
  {
    icon: HeartHandshake,
    title: "Fair, Transparent Pricing",
    description: "No hidden fees — clear per-person pricing, group discounts, and custom quotes on request.",
  },
  {
    icon: Leaf,
    title: "Responsible Tourism",
    description: "Conservation fees paid in full, and partnerships that put money back into local communities.",
  },
];

export default async function HomePage() {
  const [featured, destinations, testimonials] = await Promise.all([
    getFeaturedPackages(),
    getDestinations(),
    getTestimonials(),
  ]);

  return (
    <>
      <HomeHero />

      <section className="py-20 bg-sand-50">
        <div className="container-page">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="text-center px-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                    <pillar.icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-teal-800">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-teal-700/70">{pillar.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <SectionHeading
                eyebrow="Featured Trips"
                title="Our Most-Loved Tour Packages"
                description="Hand-picked itineraries covering Kenya's iconic safaris, coastline, and mountains."
              />
              <Link
                href="/packages"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:underline"
              >
                View all packages <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={i * 0.1}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-sand-100">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <SectionHeading
                eyebrow="Where To Go"
                title="Explore Our Destinations"
                description="From the golden plains of the Mara to the coral coastline of Lamu."
              />
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:underline"
              >
                View all destinations <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.slice(0, 3).map((destination, i) => (
              <Reveal key={destination.slug} delay={i * 0.1}>
                <DestinationCard destination={destination} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Testimonials"
              title="Stories from the Trail"
              align="center"
              description="Real feedback from travelers who trusted us with their trip of a lifetime."
            />
          </Reveal>
          <div className="mt-12">
            <Reveal>
              <TestimonialsCarousel testimonials={testimonials} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-sand-100">
        <div className="container-page">
          <Reveal>
            <TrustBadges />
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-teal-800 text-white">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-balance max-w-2xl mx-auto">
              Ready to plan your East African adventure?
            </h2>
            <p className="mt-4 text-sand-100/80 max-w-xl mx-auto">
              Tell us your dates, budget, and dream destinations — our travel specialists will build a custom itinerary within 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
              >
                Start Planning
              </Link>
              <Link
                href="/packages"
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Browse Packages
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
