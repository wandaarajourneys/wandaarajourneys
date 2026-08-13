import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostForAdmin } from "@/lib/admin/actions/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostForAdmin(slug).catch(() => null);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Edit Post</h1>
      <div className="mt-6">
        <BlogPostForm originalSlug={slug} initial={post} />
      </div>
    </div>
  );
}
