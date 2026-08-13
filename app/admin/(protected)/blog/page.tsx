import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listBlogPostsForAdmin } from "@/lib/admin/actions/blog";
import { BlogPostsTable } from "@/components/admin/BlogPostsTable";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const rows = await listBlogPostsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-teal-800">Blog</h1>
          <p className="mt-1 text-sm text-teal-700/60">{rows.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors">
          <Plus size={16} aria-hidden="true" /> Add New
        </Link>
      </div>
      <div className="mt-6">
        <BlogPostsTable rows={rows} />
      </div>
    </div>
  );
}
