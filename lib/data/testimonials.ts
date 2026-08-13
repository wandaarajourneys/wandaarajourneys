import { prisma } from "@/lib/prisma";
import type { Testimonial } from "@/types";

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: { select: { slug: true } } },
  });
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
    packageSlug: t.package?.slug,
  }));
}
