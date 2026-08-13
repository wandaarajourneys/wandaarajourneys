import { prisma } from "@/lib/prisma";
import type { Testimonial } from "@/types";
import { testimonials as staticTestimonials } from "./testimonials.static";

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      include: { package: { select: { slug: true } } },
    });
    if (rows.length > 0) {
      return rows.map((t) => ({
        id: t.id,
        name: t.name,
        location: t.location,
        quote: t.quote,
        rating: t.rating,
        packageSlug: t.package?.slug,
      }));
    }
  } catch {
    // DB not reachable — fall back to static data
  }
  return staticTestimonials;
}
