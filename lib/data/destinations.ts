import { prisma } from "@/lib/prisma";
import { REGION_TO_LABEL, ACTIVITY_TO_LABEL } from "@/lib/enumMap";
import type { Destination } from "@/types";
import type { Destination as DbDestination } from "@prisma/client";
import { destinations as staticDestinations, getDestinationBySlug as getStaticDestinationBySlug } from "./destinations.static";

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
  try {
    const rows = await prisma.destination.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) return rows.map(mapDestination);
  } catch {
    // DB not reachable — fall back to static data
  }
  return staticDestinations;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  try {
    const row = await prisma.destination.findUnique({ where: { slug } });
    if (row) return mapDestination(row);
  } catch {
    // DB not reachable — fall back to static data
  }
  return getStaticDestinationBySlug(slug);
}
