import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PackageCard } from "@/components/PackageCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getDestinations, getDestinationBySlug } from "@/lib/data/destinations";
import { getPackages } from "@/lib/data/packages";
import { siteConfig } from "@/lib/constants";

// Force server-side rendering so Prisma runs at request time on Vercel,
// not at build time when a live DB may not be reachable.
export const dynamic = "force-dynamic";

// Allow slugs not known at build time to be rendered on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const destinations = await getDestinations();
    return destinations.map((d) => ({ slug: d.slug }));
  } catch {
    // DB unavailable at build time — Vercel will SSR these pages at request time.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};

  return {
    title: destination.name,
    description: destination.description.slice(0, 155),
    openGraph: {
      title: destination.name,
      description: destination.tagline,
      images: [{ url: destination.heroImage }],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const allPackages = await getPackages();
  const relatedPackages = allPackages.filter((p) => p.destinationSlugs.includes(destination.slug));

  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: "Destinations", url: `${siteConfig.url}/destinations` },
          { name: destination.name, url: `${siteConfig.url}/destinations/${destination.slug}` },
        ])}
      />

      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/30 to-teal-900/10" />
        <div className="relative z-10 h-full container-page flex flex-col justify-end pb-12">
          <div className="flex items-center gap-2 text-sand-100/90 text-sm">
            <MapPin size={15} aria-hidden="true" /> {destination.country} · {destination.region}
          </div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl text-white text-balance max-w-2xl">
            {destination.name}
          </h1>
          <p className="mt-3 text-lg text-sand-100/90 max-w-xl">{destination.tagline}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl text-teal-800">Overview</h2>
              <p className="mt-4 text-teal-700/80 leading-relaxed">{destination.description}</p>

              <h3 className="mt-10 font-display text-xl text-teal-800">Highlights</h3>
              <ul className="mt-4 space-y-2.5">
                {destination.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-teal-700/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {destination.gallery.length > 0 ? (
                <div className="mt-10">
                  <h3 className="font-display text-xl text-teal-800">Gallery</h3>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {destination.gallery.map((src, i) => (
                      <div key={src} className="relative h-32 sm:h-40 rounded-xl overflow-hidden">
                        <Image
                          src={src}
                          alt={`${destination.name} gallery image ${i + 1}`}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-sand-100 p-6 lg:sticky lg:top-24">
              <h3 className="font-display text-lg text-teal-800 flex items-center gap-2">
                <Calendar size={18} aria-hidden="true" /> Best Time to Visit
              </h3>
              <p className="mt-2 text-teal-700/80">{destination.bestTimeToVisit}</p>

              <h3 className="mt-6 font-display text-lg text-teal-800">Activities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {destination.activityTypes.map((type) => (
                  <span key={type} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-teal-800">
                    {type}
                  </span>
                ))}
              </div>

              <Link
                href={`/contact?destination=${destination.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
              >
                Inquire About This Destination <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {relatedPackages.length > 0 ? (
        <section className="py-16 bg-sand-100">
          <div className="container-page">
            <Reveal>
              <SectionHeading eyebrow="Book This Destination" title="Packages That Include This Trip" />
            </Reveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((pkg, i) => (
                <Reveal key={pkg.slug} delay={i * 0.1}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
