import { prisma } from "@/lib/prisma";
import { ACTIVITY_TO_LABEL } from "@/lib/enumMap";
import type { TourPackage } from "@/types";
import type { Prisma } from "@prisma/client";
import { packages as staticPackages, getPackageBySlug as getStaticPackageBySlug, getFeaturedPackages as getStaticFeaturedPackages } from "./packages.static";

const packageInclude = { destinations: { select: { slug: true } } } satisfies Prisma.PackageInclude;
type PackageWithDestinations = Prisma.PackageGetPayload<{ include: typeof packageInclude }>;

function mapPackage(p: PackageWithDestinations): TourPackage {
  return {
    slug: p.slug,
    name: p.name,
    destinationSlugs: p.destinations.map((d) => d.slug),
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    summary: p.summary,
    description: p.description,
    heroImage: p.heroImage,
    gallery: p.gallery,
    itinerary: p.itinerary as unknown as TourPackage["itinerary"],
    inclusions: p.inclusions,
    exclusions: p.exclusions,
    pricing: p.pricing as unknown as TourPackage["pricing"],
    groupDiscount: { minSize: p.groupMinSize, discountPercent: p.groupDiscountPercent },
    difficulty: p.difficulty,
    activityTypes: p.activityTypes.map((a) => ACTIVITY_TO_LABEL[a]),
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
  };
}

export async function getPackages(): Promise<TourPackage[]> {
  try {
    const rows = await prisma.package.findMany({ orderBy: { name: "asc" }, include: packageInclude });
    if (rows.length > 0) return rows.map(mapPackage);
  } catch {
    // DB not reachable — fall back to static data
  }
  return staticPackages;
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | undefined> {
  try {
    const row = await prisma.package.findUnique({ where: { slug }, include: packageInclude });
    if (row) return mapPackage(row);
  } catch {
    // DB not reachable — fall back to static data
  }
  return getStaticPackageBySlug(slug);
}

export async function getFeaturedPackages(): Promise<TourPackage[]> {
  try {
    const rows = await prisma.package.findMany({
      where: { featured: true },
      orderBy: { name: "asc" },
      include: packageInclude,
    });
    if (rows.length > 0) return rows.map(mapPackage);
  } catch {
    // DB not reachable — fall back to static data
  }
  return getStaticFeaturedPackages();
}
