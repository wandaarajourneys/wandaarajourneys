import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Heart, Globe2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBadges } from "@/components/TrustBadges";
import { seededImage } from "@/lib/images";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Wandaara Tours and Travel's mission, story, and the local guides behind every safari, beach escape, and trek we run.",
};

const team = [
  { name: "Hesbon Njugi", role: "Founder & Lead Safari Guide", seed: "team-hesbon" },
  { name: "Felix Gachogu", role: "Operations & Logistics Director", seed: "team-felix" },
  { name: "Eric Waiyaki", role: "Senior Tour Coordinator", seed: "team-eric" },
  { name: "Esther Muthoni", role: "Head of Customer Experience & Guest Relations", seed: "team-esther" },
];

const values = [
  {
    icon: Compass,
    title: "Local Expertise",
    description:
      "Every guide on our team was raised near the parks, reefs, and trails they lead you through.",
  },
  {
    icon: Heart,
    title: "Genuine Care",
    description: "We plan every trip as if it were for our own family, because many of our clients become just that.",
  },
  {
    icon: Globe2,
    title: "Sustainable Impact",
    description: "Conservation fees, fair wages, and community partnerships are built into every itinerary, not an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={seededImage("about-hero", 1920, 1000)}
          alt="Wandaara Tours guides preparing for a safari departure"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/60" />
        <div className="relative z-10 h-full container-page flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-terracotta-300">About Us</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl md:text-5xl text-white text-balance">
            Founded on a love for this land, and the people who call it home
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Our Story"
              title={`${siteConfig.founded}, a small idea and a big country`}
            />
            <div className="mt-6 space-y-4 text-teal-700/80 leading-relaxed">
              <p>
                Wandaara Tours and Travel started with a single Land Cruiser and a founder who couldn&apos;t
                understand why so many visitors left Kenya having only seen it through a coach window. We
                set out to build slower, more personal trips, with small groups, real guides, and itineraries
                shaped around what travelers actually want to see.
              </p>
              <p>
                Over the years, we&apos;ve grown into a dedicated team covering safaris,
                coastal escapes, and mountain treks across East Africa. Yet our philosophy hasn&apos;t
                changed. Every trip is still planned by someone who has actually been there.
              </p>
              <p>
                Today, our mission remains simple: design trips that are unforgettable for travelers and
                genuinely beneficial for the communities and ecosystems that make them possible.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-card">
              <Image
                src={seededImage("about-story", 1000, 1200)}
                alt="A Wandaara guide pointing out wildlife to guests"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-sand-100">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="What We Believe" title="Our Values" align="center" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl bg-white p-8 shadow-card text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                    <value.icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-teal-800">{value.title}</h3>
                  <p className="mt-2 text-sm text-teal-700/70">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="Meet the Team" title="The People Behind Your Trip" align="center" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div className="text-center">
                  <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden shadow-card">
                    <Image
                      src={seededImage(member.seed, 400, 400)}
                      alt={member.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-teal-800">{member.name}</h3>
                  <p className="text-sm text-teal-700/60">{member.role}</p>
                </div>
              </Reveal>
            ))}
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
    </div>
  );
}
