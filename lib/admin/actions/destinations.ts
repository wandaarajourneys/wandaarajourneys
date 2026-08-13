"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { logAdminActivity } from "@/lib/admin/audit";
import { destinationSchema, type DestinationInput } from "@/lib/validation/admin/destination";
import { LABEL_TO_REGION, LABEL_TO_ACTIVITY, REGION_TO_LABEL, ACTIVITY_TO_LABEL } from "@/lib/enumMap";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function listDestinationsForAdmin() {
  await requireAdmin();
  const rows = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { packages: true } } },
  });
  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    country: d.country,
    region: REGION_TO_LABEL[d.region],
    activityTypes: d.activityTypes.map((a) => ACTIVITY_TO_LABEL[a]),
    heroImage: d.heroImage,
    packageCount: d._count.packages,
  }));
}

export async function listDestinationOptions() {
  await requireAdmin();
  const rows = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });
  return rows;
}

export async function getDestinationForAdmin(id: string): Promise<DestinationInput & { id: string }> {
  await requireAdmin();
  const d = await prisma.destination.findUniqueOrThrow({ where: { id } });
  return {
    id: d.id,
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

function revalidatePublicDestinations(slug?: string) {
  revalidatePath("/destinations");
  revalidatePath("/");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

export async function createDestination(input: DestinationInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = destinationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const created = await prisma.destination.create({
      data: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        country: parsed.data.country,
        region: LABEL_TO_REGION[parsed.data.region],
        activityTypes: parsed.data.activityTypes.map((a) => LABEL_TO_ACTIVITY[a]),
        tagline: parsed.data.tagline,
        description: parsed.data.description,
        heroImage: parsed.data.heroImage,
        gallery: parsed.data.gallery,
        highlights: parsed.data.highlights,
        bestTimeToVisit: parsed.data.bestTimeToVisit,
      },
    });

    await logAdminActivity(user, "create", "Destination", created.id, { slug: created.slug });
    revalidatePublicDestinations(created.slug);
    return { success: true, data: { id: created.id } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A destination with that slug already exists." };
    }
    console.error("[createDestination]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateDestination(id: string, input: DestinationInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = destinationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const existing = await prisma.destination.findUnique({ where: { id } });
    const updated = await prisma.destination.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        country: parsed.data.country,
        region: LABEL_TO_REGION[parsed.data.region],
        activityTypes: parsed.data.activityTypes.map((a) => LABEL_TO_ACTIVITY[a]),
        tagline: parsed.data.tagline,
        description: parsed.data.description,
        heroImage: parsed.data.heroImage,
        gallery: parsed.data.gallery,
        highlights: parsed.data.highlights,
        bestTimeToVisit: parsed.data.bestTimeToVisit,
      },
    });

    await logAdminActivity(user, "update", "Destination", id, { slug: updated.slug });
    revalidatePublicDestinations(updated.slug);
    if (existing && existing.slug !== updated.slug) revalidatePublicDestinations(existing.slug);
    return { success: true, data: { id: updated.id } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A destination with that slug already exists." };
    }
    console.error("[updateDestination]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteDestination(id: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  try {
    const deleted = await prisma.destination.delete({ where: { id } });
    await logAdminActivity(user, "delete", "Destination", id, { slug: deleted.slug });
    revalidatePublicDestinations(deleted.slug);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    console.error("[deleteDestination]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002");
}
