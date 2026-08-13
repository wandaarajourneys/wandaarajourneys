import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120)
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(2, "Title is required.").max(160),
  excerpt: z.string().trim().min(10, "Excerpt should be at least 10 characters.").max(300),
  content: z.array(z.string().trim().min(1).max(4000)).min(1, "Add at least one paragraph."),
  coverImage: z.string().trim().url("Cover image must be a valid URL."),
  author: z.string().trim().min(2, "Author is required.").max(120),
  tags: z.array(z.string().trim().min(1).max(40)).max(10),
  readingTime: z.string().trim().min(1, "e.g. 5 min read").max(30),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
