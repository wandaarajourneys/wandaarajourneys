"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Pencil } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteTestimonial } from "@/lib/admin/actions/testimonials";

interface Row {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  packageName: string | null;
}

export function TestimonialsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => !query || `${r.name} ${r.location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/40" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search testimonials..."
          className="w-full rounded-full border border-teal-700/20 bg-white pl-9 pr-4 py-2 text-sm outline-none focus-visible:border-terracotta-400"
        />
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((row) => (
          <div key={row.id} className="rounded-2xl border border-teal-700/10 bg-white p-5 shadow-card flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-teal-800">{row.name}</p>
                <span className="text-xs text-teal-700/50">{row.location}</span>
              </div>
              <div className="mt-1"><StarRating rating={row.rating} /></div>
              <p className="mt-2 text-sm text-teal-700/70 max-w-xl">&ldquo;{row.quote}&rdquo;</p>
              {row.packageName ? <p className="mt-2 text-xs text-teal-700/50">Linked: {row.packageName}</p> : null}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link href={`/admin/testimonials/${row.id}/edit`} className="rounded-full p-1.5 text-teal-700/50 hover:bg-teal-700/10 hover:text-teal-800 transition-colors" aria-label={`Edit ${row.name}`}>
                <Pencil size={16} />
              </Link>
              <ConfirmDeleteButton itemLabel={row.name} onDelete={() => deleteTestimonial(row.id)} onDeleted={() => router.refresh()} />
            </div>
          </div>
        ))}
        {filtered.length === 0 ? <p className="text-center text-sm text-teal-700/60 py-8">No testimonials match your search.</p> : null}
      </div>
    </div>
  );
}
