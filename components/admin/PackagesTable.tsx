"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Pencil, Star } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deletePackage } from "@/lib/admin/actions/packages";
import { formatCurrency } from "@/lib/currency";

interface Row {
  id: string;
  slug: string;
  name: string;
  heroImage: string;
  destinations: string[];
  durationDays: number;
  durationNights: number;
  featured: boolean;
  pricing: { peak: { perPersonKES: number }; offPeak: { perPersonKES: number } };
}

export function PackagesTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => {
    if (!query) return true;
    return `${r.name} ${r.slug} ${r.destinations.join(" ")}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/40" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages..."
          className="w-full rounded-full border border-teal-700/20 bg-white pl-9 pr-4 py-2 text-sm outline-none focus-visible:border-terracotta-400"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-teal-700/10 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal-700/10 text-left text-xs uppercase tracking-wide text-teal-700/50">
              <th className="px-5 py-3 font-semibold">Package</th>
              <th className="px-5 py-3 font-semibold">Duration</th>
              <th className="px-5 py-3 font-semibold">Peak / Off-Peak</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-teal-700/5 last:border-0 hover:bg-sand-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-sand-100">
                      <Image src={row.heroImage} alt="" fill sizes="56px" className="object-cover" unoptimized />
                    </div>
                    <div>
                      <p className="font-medium text-teal-800 flex items-center gap-1.5">
                        {row.name}
                        {row.featured ? <Star size={13} className="text-terracotta-500 fill-terracotta-500" aria-label="Featured" /> : null}
                      </p>
                      <p className="text-xs text-teal-700/50">{row.destinations.join(", ")}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-teal-700/80">{row.durationDays}D / {row.durationNights}N</td>
                <td className="px-5 py-3 text-teal-700/80">
                  {formatCurrency(row.pricing.peak.perPersonKES, "KES")} / {formatCurrency(row.pricing.offPeak.perPersonKES, "KES")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/packages/${row.id}/edit`} className="rounded-full p-1.5 text-teal-700/50 hover:bg-teal-700/10 hover:text-teal-800 transition-colors" aria-label={`Edit ${row.name}`}>
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton itemLabel={row.name} onDelete={() => deletePackage(row.id)} onDeleted={() => router.refresh()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="px-5 py-8 text-center text-sm text-teal-700/60">No packages match your search.</p> : null}
      </div>
    </div>
  );
}
