import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/types";
import type { BlogPost as DbBlogPost } from "@prisma/client";

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
  const rows = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  if (!row || row.status !== "PUBLISHED") return undefined;
  return mapBlogPost(row);
}
