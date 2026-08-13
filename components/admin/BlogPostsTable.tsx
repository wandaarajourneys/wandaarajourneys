"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteBlogPost } from "@/lib/admin/actions/blog";

interface Row {
  slug: string;
  title: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
  author: string;
}

export function BlogPostsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => !query || `${r.title} ${r.author}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/40" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-full border border-teal-700/20 bg-white pl-9 pr-4 py-2 text-sm outline-none focus-visible:border-terracotta-400"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-teal-700/10 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal-700/10 text-left text-xs uppercase tracking-wide text-teal-700/50">
              <th className="px-5 py-3 font-semibold">Post</th>
              <th className="px-5 py-3 font-semibold">Author</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.slug} className="border-b border-teal-700/5 last:border-0 hover:bg-sand-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-sand-100">
                      <Image src={row.coverImage} alt="" fill sizes="56px" className="object-cover" unoptimized />
                    </div>
                    <p className="font-medium text-teal-800">{row.title}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-teal-700/80">{row.author}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === "PUBLISHED" ? "bg-forest-500/10 text-forest-600" : "bg-sand-200 text-teal-700/70"}`}>
                    {row.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/blog/${row.slug}/edit`} className="rounded-full p-1.5 text-teal-700/50 hover:bg-teal-700/10 hover:text-teal-800 transition-colors" aria-label={`Edit ${row.title}`}>
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton itemLabel={row.title} onDelete={() => deleteBlogPost(row.slug)} onDeleted={() => router.refresh()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="px-5 py-8 text-center text-sm text-teal-700/60">No posts match your search.</p> : null}
      </div>
    </div>
  );
}
