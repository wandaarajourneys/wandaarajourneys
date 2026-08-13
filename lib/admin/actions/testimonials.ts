"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { logAdminActivity } from "@/lib/admin/audit";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/admin/testimonial";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function listTestimonialsForAdmin() {
  await requireAdmin();
  const rows = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: { select: { name: true } } },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
    photo: t.photo,
    packageName: t.package?.name ?? null,
  }));
}

export async function getTestimonialForAdmin(id: string): Promise<TestimonialInput & { id: string }> {
  await requireAdmin();
  const t = await prisma.testimonial.findUniqueOrThrow({ where: { id } });
  return {
    id: t.id,
    name: t.name,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
    photo: t.photo ?? "",
    packageId: t.packageId ?? "",
  };
}

function revalidatePublicTestimonials() {
  revalidatePath("/");
  revalidatePath("/packages");
}

function toTestimonialData(input: TestimonialInput) {
  return {
    name: input.name,
    location: input.location,
    quote: input.quote,
    rating: input.rating,
    photo: input.photo || null,
    packageId: input.packageId || null,
  };
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const created = await prisma.testimonial.create({ data: toTestimonialData(parsed.data) });
  await logAdminActivity(user, "create", "Testimonial", created.id, { name: created.name });
  revalidatePublicTestimonials();
  return { success: true, data: { id: created.id } };
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<ActionResult<{ id: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const updated = await prisma.testimonial.update({ where: { id }, data: toTestimonialData(parsed.data) });
  await logAdminActivity(user, "update", "Testimonial", id, { name: updated.name });
  revalidatePublicTestimonials();
  return { success: true, data: { id: updated.id } };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const deleted = await prisma.testimonial.delete({ where: { id } });
  await logAdminActivity(user, "delete", "Testimonial", id, { name: deleted.name });
  revalidatePublicTestimonials();
  return { success: true, data: undefined };
}
