import { prisma } from "@/lib/prisma";
import { REGION_TO_LABEL, ACTIVITY_TO_LABEL } from "@/lib/enumMap";
import type { Destination } from "@/types";
import type { Destination as DbDestination } from "@prisma/client";

function mapDestination(d: DbDestination): Destination {
  return {
    slug: d.slug,
    name: d.name,
    country: d.country,
    region: REGION_TO_LABEL[d.region],
    activityTypes: d.activityTypes.map((a) => ACTIVITY_TO_LABEL[a]),
    tagline: d.tagline,
    description: d.description,
    heroImage: d.heroImage,
    gallery: d.gallery,
    highlights: d.highlights,
    bestTimeToVisit: d.bestTimeToVisit,
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapDestination);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const row = await prisma.destination.findUnique({ where: { slug } });
  return row ? mapDestination(row) : undefined;
}
