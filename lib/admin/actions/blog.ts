"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { logAdminActivity } from "@/lib/admin/audit";
import { blogPostSchema, type BlogPostInput } from "@/lib/validation/admin/blogPost";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function listBlogPostsForAdmin() {
  await requireAdmin();
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true, coverImage: true, status: true, publishedAt: true, author: true },
  });
}

export async function getBlogPostForAdmin(slug: string): Promise<BlogPostInput> {
  await requireAdmin();
  const b = await prisma.blogPost.findUniqueOrThrow({ where: { slug } });
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverImage,
    author: b.author,
    tags: b.tags,
    readingTime: b.readingTime,
    status: b.status,
  };
}

function revalidatePublicBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(input: BlogPostInput): Promise<ActionResult<{ slug: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const created = await prisma.blogPost.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        author: parsed.data.author,
        tags: parsed.data.tags,
        readingTime: parsed.data.readingTime,
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    await logAdminActivity(user, "create", "BlogPost", created.slug);
    revalidatePublicBlog(created.slug);
    return { success: true, data: { slug: created.slug } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A post with that slug already exists." };
    console.error("[createBlogPost]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function updateBlogPost(originalSlug: string, input: BlogPostInput): Promise<ActionResult<{ slug: string }>> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { slug: originalSlug } });
    const wasPublished = existing?.status === "PUBLISHED";
    const updated = await prisma.blogPost.update({
      where: { slug: originalSlug },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        coverImage: parsed.data.coverImage,
        author: parsed.data.author,
        tags: parsed.data.tags,
        readingTime: parsed.data.readingTime,
        status: parsed.data.status,
        publishedAt:
          parsed.data.status === "PUBLISHED" ? (wasPublished ? existing?.publishedAt : new Date()) : null,
      },
    });
    await logAdminActivity(user, "update", "BlogPost", updated.slug);
    revalidatePublicBlog(updated.slug);
    if (originalSlug !== updated.slug) revalidatePublicBlog(originalSlug);
    return { success: true, data: { slug: updated.slug } };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) return { success: false, error: "A post with that slug already exists." };
    console.error("[updateBlogPost]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteBlogPost(slug: string): Promise<ActionResult> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  await prisma.blogPost.delete({ where: { slug } });
  await logAdminActivity(user, "delete", "BlogPost", slug);
  revalidatePublicBlog(slug);
  return { success: true, data: undefined };
}

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002");
}
