import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Heart, Globe2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBadges } from "@/components/TrustBadges";
import { seededImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the Wandaara team. We are a small, passionate group of Kenyan travel specialists who believe the best trips are built on real knowledge, genuine care, and deep respect for the land.",
};

const team = [
  { name: "Hesbon Njugi", role: "Founder and Lead Safari Guide", seed: "team-hesbon" },
  { name: "Felix Gachogu", role: "Operations and Logistics Director", seed: "team-felix" },
  { name: "Eric Waiyaki", role: "Senior Tour Coordinator", seed: "team-eric" },
  { name: "Esther Muthoni", role: "Head of Guest Experience and Relations", seed: "team-esther" },
];

const values = [
  {
    icon: Compass,
    title: "We Know This Land",
    description:
      "Every member of our team grew up close to the parks, coastlines, and highlands we take you through. This is not a job for us. It is home.",
  },
  {
    icon: Heart,
    title: "We Genuinely Care",
    description:
      "We plan every single trip as if a close friend asked us to organize it. Because of this, many of our first time guests come back year after year.",
  },
  {
    icon: Globe2,
    title: "We Think Long Term",
    description:
      "Conservation fees, fair wages for local staff, and community partnerships are part of every itinerary. Not an add on. Not a talking point. Just how we operate.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={seededImage("about-hero", 1920, 1000)}
          alt="The Wandaara team preparing vehicles for a morning safari departure in the Maasai Mara"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/60" />
        <div className="relative z-10 h-full container-page flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-terracotta-300">Our Story</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl md:text-5xl text-white text-balance">
            Built from love for this land and the people who call it home
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Who We Are"
              title="Born in Kenya. Built for Curious Travelers."
            />
            <div className="mt-6 space-y-5 text-teal-700/80 leading-relaxed text-base">
              <p>
                Wandaara was founded in 2026 by Hesbon Njugi, a safari guide who had spent years watching international
                visitors see Kenya through coach windows and leave having barely scratched the surface of what this
                country actually is. He wanted to build something different. Smaller groups. Real guides. Trips designed
                around what travelers actually care about rather than what is easiest to sell.
              </p>
              <p>
                Today Wandaara is a small, tight knit team based in Nairobi. We cover safaris across the Maasai Mara
                and Amboseli, beach escapes to Diani and Lamu, mountain treks on Mount Kenya, and international
                getaways to Zanzibar, Seychelles, Dubai, and Cape Town. What connects all of it is the same principle
                Hesbon started with: every trip should be planned by someone who has actually been there and genuinely
                loves it.
              </p>
              <p>
                We are not a big agency. We are not trying to be. Our size means your trip gets real attention from
                real people, and when something comes up (because something always comes up when you travel), you
                have a team that picks up the phone.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-card">
              <Image
                src={seededImage("about-story", 1000, 1200)}
                alt="Hesbon leading a morning game drive in the Maasai Mara"
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
            <SectionHeading eyebrow="What Drives Us" title="Three Things We Actually Believe" align="center" />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl bg-white p-8 shadow-card text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                    <value.icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-teal-800">{value.title}</h3>
                  <p className="mt-2 text-sm text-teal-700/70 leading-relaxed">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-page">
          <Reveal>
            <SectionHeading eyebrow="The Team" title="The People Who Plan Your Trip" align="center" />
            <p className="mt-4 text-center text-teal-700/70 max-w-xl mx-auto text-sm leading-relaxed">
              We are a small team and proud of it. When you book with Wandaara, you are not talking to a call centre.
              You are talking to one of us.
            </p>
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
