import { NextResponse } from "next/server";
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { destinations } from "@/lib/data/destinations.static";
import { packages } from "@/lib/data/packages.static";
import { blogPosts } from "@/lib/data/blog.static";
import { LABEL_TO_REGION, LABEL_TO_ACTIVITY } from "@/lib/enumMap";

// TEMPORARY one-time seed endpoint for production database population.
// Visit GET /api/admin/seed once after your first deploy, then DELETE this file.

export async function GET() {
  const prisma = new PrismaClient();
  try {
    // Seed destinations
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

    // Seed packages
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

    // Seed blog posts
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

    // Seed admin account
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
          role: "SUPER_ADMIN",
          forcePasswordChange: true,
        },
      });
    }

    await prisma.$disconnect();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully! IMPORTANT: Delete the file app/api/admin/seed/route.ts from your project for security.",
    });
  } catch (error) {
    await prisma.$disconnect();
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
