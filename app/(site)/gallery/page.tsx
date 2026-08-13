import type { Metadata } from "next";
import { FaInstagram } from "react-icons/fa6";
import { SectionHeading } from "@/components/SectionHeading";
import { GalleryGrid, type GalleryItem } from "@/components/GalleryGrid";
import { getDestinations } from "@/lib/data/destinations";
import { getPackages } from "@/lib/data/packages";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and video highlights from Wandaara Tours' safaris, beach escapes, and mountain treks.",
};

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [destinations, packages] = await Promise.all([getDestinations(), getPackages()]);

  const galleryItems: GalleryItem[] = [
    ...destinations.flatMap((d) =>
      d.gallery.map((src, i) => ({
        src,
        alt: `${d.name} — photo ${i + 1}`,
        category: d.region,
      })),
    ),
    ...packages.slice(0, 3).flatMap((p) =>
      p.gallery.map((src, i) => ({
        src,
        alt: `${p.name} — highlight ${i + 1}`,
        category: p.activityTypes[0],
        isVideo: i === 0,
      })),
    ),
  ];

  return (
    <div className="py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from the Road"
            description="A look at what awaits — captured by our guides and guests across every region we cover."
          />
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-teal-700/20 px-5 py-2.5 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
          >
            <FaInstagram size={16} aria-hidden="true" /> Follow @wandaaratours
          </a>
        </div>

        <div className="mt-12">
          <GalleryGrid items={galleryItems} />
        </div>
      </div>
    </div>
  );
}
