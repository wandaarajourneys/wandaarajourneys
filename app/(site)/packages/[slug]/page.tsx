import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, TrendingUp, MapPin } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StarRating } from "@/components/StarRating";
import { PriceTable } from "@/components/PriceTable";
import { StickyPackageCTA } from "@/components/StickyPackageCTA";
import { JsonLd } from "@/components/JsonLd";
import { packageProductJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { getPackages, getPackageBySlug } from "@/lib/data/packages";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { siteConfig } from "@/lib/constants";

// Force server-side rendering so Prisma runs at request time on Vercel,
// not at build time when a live DB may not be reachable.
export const dynamic = "force-dynamic";

// Allow slugs not known at build time to be rendered on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const packages = await getPackages();
    return packages.map((p) => ({ slug: p.slug }));
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
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  return {
    title: pkg.name,
    description: pkg.summary,
    openGraph: {
      title: pkg.name,
      description: pkg.summary,
      images: [{ url: pkg.heroImage }],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const relatedDestinations = (
    await Promise.all(pkg.destinationSlugs.map((s) => getDestinationBySlug(s)))
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="pb-24 lg:pb-0">
      <JsonLd data={packageProductJsonLd(pkg)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: siteConfig.url },
          { name: "Packages", url: `${siteConfig.url}/packages` },
          { name: pkg.name, url: `${siteConfig.url}/packages/${pkg.slug}` },
        ])}
      />

      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <Image src={pkg.heroImage} alt={pkg.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/30 to-teal-900/10" />
        <div className="relative z-10 h-full container-page flex flex-col justify-end pb-12">
          <div className="flex flex-wrap items-center gap-4 text-sand-100/90 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={15} aria-hidden="true" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={15} aria-hidden="true" /> {pkg.difficulty}
            </span>
            {relatedDestinations.map((d) => (
              <span key={d.slug} className="flex items-center gap-1.5">
                <MapPin size={15} aria-hidden="true" /> {d.name}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl text-white text-balance max-w-2xl">
            {pkg.name}
          </h1>
          <div className="mt-3">
            <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl text-teal-800">Overview</h2>
              <p className="mt-4 text-teal-700/80 leading-relaxed">{pkg.description}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-12 font-display text-2xl text-teal-800">Day-by-Day Itinerary</h2>
              <ol className="mt-6 space-y-6 border-l-2 border-terracotta-200 pl-6">
                {pkg.itinerary.map((day) => (
                  <li key={day.day} className="relative">
                    <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-500 text-[10px] font-bold text-white">
                      {day.day}
                    </span>
                    <h3 className="font-semibold text-teal-800">Day {day.day}: {day.title}</h3>
                    <p className="mt-1.5 text-sm text-teal-700/80">{day.description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {pkg.gallery.length > 0 ? (
              <Reveal delay={0.15}>
                <h2 className="mt-12 font-display text-2xl text-teal-800">Gallery</h2>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {pkg.gallery.map((src, i) => (
                    <div key={src} className="relative h-32 sm:h-40 rounded-xl overflow-hidden">
                      <Image
                        src={src}
                        alt={`${pkg.name} gallery image ${i + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-24">
              <PriceTable pkg={pkg} />
            </div>
          </Reveal>
        </div>
      </section>

      {relatedDestinations.length > 0 ? (
        <section className="py-16 bg-sand-100">
          <div className="container-page">
            <SectionHeading eyebrow="Where You'll Go" title="Featured Destinations in This Package" />
            <div className="mt-8 flex flex-wrap gap-4">
              {relatedDestinations.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-teal-800 shadow-card hover:text-terracotta-600 transition-colors"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <StickyPackageCTA pkg={pkg} />
    </div>
  );
}
