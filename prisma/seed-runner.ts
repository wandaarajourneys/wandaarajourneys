// Seed runner extracted for use in the API seed route
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { destinations } from "@/lib/data/destinations.static";
import { packages } from "@/lib/data/packages.static";
import { testimonials } from "@/lib/data/testimonials.static";
import { blogPosts } from "@/lib/data/blog.static";
import { LABEL_TO_REGION, LABEL_TO_ACTIVITY } from "@/lib/enumMap";

const prisma = new PrismaClient();

export async function main() {
  console.log("Seeding destinations...");
  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        name: d.name,
        country: d.country,
        region: LABEL_TO_REGION[d.region],
        activityTypes: d.activityTypes.map((a) => LABEL_TO_ACTIVITY[a]),
        tagline: d.tagline,
        description: d.description,
        heroImage: d.heroImage,
        gallery: d.gallery,
        highlights: d.highlights,
        bestTimeToVisit: d.bestTimeToVisit,
      },
    });
  }

  console.log("Seeding packages...");
  for (const p of packages) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        destinations: { connect: p.destinationSlugs.map((slug) => ({ slug })) },
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        summary: p.summary,
        description: p.description,
        heroImage: p.heroImage,
        gallery: p.gallery,
        itinerary: p.itinerary as unknown as Prisma.InputJsonValue,
        inclusions: p.inclusions,
        exclusions: p.exclusions,
        pricing: p.pricing as unknown as Prisma.InputJsonValue,
        groupMinSize: p.groupDiscount.minSize,
        groupDiscountPercent: p.groupDiscount.discountPercent,
        difficulty: p.difficulty,
        activityTypes: p.activityTypes.map((a) => LABEL_TO_ACTIVITY[a]),
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured ?? false,
      },
    });
  }

  console.log("Seeding testimonials...");
  for (const t of testimonials) {
    const pkg = t.packageSlug ? await prisma.package.findUnique({ where: { slug: t.packageSlug } }) : null;
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name, quote: t.quote } });
    if (existing) continue;
    await prisma.testimonial.create({
      data: {
        name: t.name,
        location: t.location,
        quote: t.quote,
        rating: t.rating,
        packageId: pkg?.id,
      },
    });
  }

  console.log("Seeding blog posts...");
  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        author: b.author,
        tags: b.tags,
        readingTime: b.readingTime,
        status: "PUBLISHED",
        publishedAt: new Date(b.date),
      },
    });
  }

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@wandaaratours.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Wandaara2026!";

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Hesbon Njugi",
        role: "ADMIN",
        forcePasswordChange: true,
      },
    });
    console.log(`Seeded admin account: ${adminEmail}`);
  } else {
    console.log(`Admin account ${adminEmail} already exists, skipping.`);
  }

  await prisma.$disconnect();
}
