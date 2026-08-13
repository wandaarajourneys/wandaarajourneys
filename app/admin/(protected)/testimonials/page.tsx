import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listTestimonialsForAdmin } from "@/lib/admin/actions/testimonials";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const rows = await listTestimonialsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-teal-800">Testimonials</h1>
          <p className="mt-1 text-sm text-teal-700/60">{rows.length} testimonials</p>
        </div>
        <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors">
          <Plus size={16} aria-hidden="true" /> Add New
        </Link>
      </div>
      <div className="mt-6">
        <TestimonialsTable rows={rows} />
      </div>
    </div>
  );
}
