import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const metadata: Metadata = { title: "New Post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">New Post</h1>
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
