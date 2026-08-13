import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/types";
import type { BlogPost as DbBlogPost } from "@prisma/client";
import { blogPosts as staticBlogPosts, getBlogPostBySlug as getStaticBlogPostBySlug } from "./blog.static";

function mapBlogPost(b: DbBlogPost): BlogPost {
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverImage,
    author: b.author,
    date: (b.publishedAt ?? b.createdAt).toISOString().slice(0, 10),
    tags: b.tags,
    readingTime: b.readingTime,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) return rows.map(mapBlogPost);
  } catch {
    // DB not reachable — fall back to static data
  }
  return [...staticBlogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (row && row.status === "PUBLISHED") return mapBlogPost(row);
  } catch {
    // DB not reachable — fall back to static data
  }
  return getStaticBlogPostBySlug(slug);
}
