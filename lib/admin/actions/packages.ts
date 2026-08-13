"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { logAdminActivity } from "@/lib/admin/audit";
import { packageSchema, type PackageInput } from "@/lib/validation/admin/package";
import { LABEL_TO_ACTIVITY, ACTIVITY_TO_LABEL } from "@/lib/enumMap";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function listPackagesForAdmin() {
  await requireAdmin();
  const rows = await prisma.package.findMany({
    orderBy: { name: "asc" },
    include: { destinations: { select: { name: true } } },
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    heroImage: p.heroImage,
    destinations: p.destinations.map((d) => d.name),
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    featured: p.featured,
    pricing: p.pricing as unknown as PackageInput["pricing"],
  }));
}

export async function listPackageOptions() {
  await requireAdmin();
  return prisma.package.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export async function getPackageForAdmin(id: string): Promise<PackageInput & { id: string }> {
  await requireAdmin();
  const p = await prisma.package.findUniqueOrThrow({
    where: { id },
    include: { destinations: { select: { slug: true } } },
  });
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    destinationSlugs: p.destinations.map((d) => d.slug),
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    summary: p.summary,
    description: p.description,
    heroImage: p.heroImage,
    gallery: p.gallery,
    itinerary: p.itinerary as unknown as PackageInput["itinerary"],
    inclusions: p.inclusions,
    exclusions: p.exclusions,
    pricing: p.pricing as unknown as PackageInput["pricing"],
    groupMinSize: p.groupMinSize,
    groupDiscountPercent: p.groupDiscountPercent,
    difficulty: p.difficulty,
    activityTypes: p.activityTypes.map((a) => ACTIVITY_TO_LABEL[a]),
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
  };
}

function revalidatePublicPackages(slug?: string) {
  revalidatePath("/packages");
  revalidatePath("/");
  revalidatePath("/destinations");
  if (slug) revalidatePath(`/packages/${slug}`);
}

function toPackageData(input: PackageInput, mode: "create" | "update") {
  return {
    slug: input.slug,
    name: input.name,
    destinations:
      mode === "create"
        ? { connect: input.destinationSlugs.map((slug) => ({ slug })) }
        : { set: input.destinationSlugs.map((slug) => ({ slug })) },
    durationDays: input.durationDays,
    durationNights: input.durationNights,
    summary: input.summary,
    description: input.description,
    heroImage: input.heroImage,
    gallery: input.gallery,
    itinerary: input.itinerary as unknown as Prisma.InputJsonValue,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    pricing: input.pricing as unknown as Prisma.InputJsonValue,
    groupMinSize: input.groupMinSize,
    groupDiscountPercent: input.groupDiscountPercent,
    difficulty: input.difficulty,
    activityTypes: input.activityTypes.map((a) => LABEL_TO_ACTIVITY[a]),
    rating: input.rating,
    reviewCount: input.reviewCount,
    featured: input.featured,
  };
}

export async function createPackage(input: PackageInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const created = await prisma.package.create({ data: toPackageData(parsed.data, "create") });
    await logAdminActivity(user, "create", "Package", created.id, { slug: created.slug });
    revalidatePublicPackages(created.slug);
    return { success: true, data: { id: created.id } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A package with that slug already exists." };
    console.error("[createPackage]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updatePackage(id: string, input: PackageInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const existing = await prisma.package.findUnique({ where: { id } });
    const updated = await prisma.package.update({ where: { id }, data: toPackageData(parsed.data, "update") });
    await logAdminActivity(user, "update", "Package", id, { slug: updated.slug });
    revalidatePublicPackages(updated.slug);
    if (existing && existing.slug !== updated.slug) revalidatePublicPackages(existing.slug);
    return { success: true, data: { id: updated.id } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A package with that slug already exists." };
    console.error("[updatePackage]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deletePackage(id: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  try {
    const deleted = await prisma.package.delete({ where: { id } });
    await logAdminActivity(user, "delete", "Package", id, { slug: deleted.slug });
    revalidatePublicPackages(deleted.slug);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    console.error("[deletePackage]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002");
}
