"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteDestination } from "@/lib/admin/actions/destinations";

interface Row {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  activityTypes: string[];
  heroImage: string;
  packageCount: number;
}

export function DestinationsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");

  const regions = useMemo(() => Array.from(new Set(rows.map((r) => r.region))), [rows]);

  const filtered = rows.filter((r) => {
    if (region !== "All" && r.region !== region) return false;
    if (query && !`${r.name} ${r.country} ${r.slug}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/40" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations..."
            className="w-full rounded-full border border-teal-700/20 bg-white pl-9 pr-4 py-2 text-sm outline-none focus-visible:border-terracotta-400"
          />
        </div>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-full border border-teal-700/20 bg-white px-3 py-2 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400"
        >
          <option value="All">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-teal-700/10 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-teal-700/10 text-left text-xs uppercase tracking-wide text-teal-700/50">
              <th className="px-5 py-3 font-semibold">Destination</th>
              <th className="px-5 py-3 font-semibold">Region</th>
              <th className="px-5 py-3 font-semibold">Activities</th>
              <th className="px-5 py-3 font-semibold">Packages</th>
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
                      <p className="font-medium text-teal-800">{row.name}</p>
                      <p className="text-xs text-teal-700/50">{row.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-teal-700/80">{row.region}</td>
                <td className="px-5 py-3 text-teal-700/80">{row.activityTypes.join(", ")}</td>
                <td className="px-5 py-3 text-teal-700/80">{row.packageCount}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/destinations/${row.id}/edit`}
                      className="rounded-full p-1.5 text-teal-700/50 hover:bg-teal-700/10 hover:text-teal-800 transition-colors"
                      aria-label={`Edit ${row.name}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmDeleteButton
                      itemLabel={row.name}
                      onDelete={() => deleteDestination(row.id)}
                      onDeleted={() => router.refresh()}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-teal-700/60">No destinations match your search.</p>
        ) : null}
      </div>
    </div>
  );
}
