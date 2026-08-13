"use client";

import { useState, useTransition } from "react";
import { Search, CheckCircle2, Archive, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { updateInquiryStatus } from "@/lib/admin/actions/inquiries";

interface Row {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string | null;
  travelDates: string | null;
  travelers: number | null;
  message: string;
  status: "NEW" | "RESPONDED" | "ARCHIVED";
  createdAt: Date;
}

const statusStyles: Record<Row["status"], string> = {
  NEW: "bg-terracotta-500/10 text-terracotta-600",
  RESPONDED: "bg-forest-500/10 text-forest-600",
  ARCHIVED: "bg-sand-200 text-teal-700/60",
};

export function InquiriesTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | Row["status"]>("All");
  const [isPending, startTransition] = useTransition();

  const filtered = rows.filter((r) => {
    if (status !== "All" && r.status !== status) return false;
    if (query && !`${r.name} ${r.email} ${r.message}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function setInquiryStatus(id: string, next: Row["status"]) {
    startTransition(async () => {
      const result = await updateInquiryStatus(id, next);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/40" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full rounded-full border border-teal-700/20 bg-white pl-9 pr-4 py-2 text-sm outline-none focus-visible:border-terracotta-400"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "All" | Row["status"])}
          className="rounded-full border border-teal-700/20 bg-white px-3 py-2 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400"
        >
          <option value="All">All Statuses</option>
          <option value="NEW">New</option>
          <option value="RESPONDED">Responded</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <a
          href="/api/admin/inquiries/export"
          className="ml-auto rounded-full border border-teal-700/20 px-4 py-2 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((row) => (
          <div key={row.id} className="rounded-2xl border border-teal-700/10 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-teal-800">{row.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[row.status]}`}>
                    {row.status === "NEW" ? "New" : row.status === "RESPONDED" ? "Responded" : "Archived"}
                  </span>
                </div>
                <p className="text-xs text-teal-700/50 mt-0.5">
                  {row.email} · {row.phone} · {format(row.createdAt, "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {row.status !== "RESPONDED" ? (
                  <button
                    onClick={() => setInquiryStatus(row.id, "RESPONDED")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-forest-500/30 px-3 py-1.5 text-xs font-semibold text-forest-600 hover:bg-forest-500/10 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle2 size={13} /> Mark Responded
                  </button>
                ) : null}
                {row.status !== "ARCHIVED" ? (
                  <button
                    onClick={() => setInquiryStatus(row.id, "ARCHIVED")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-700/20 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-700/5 transition-colors disabled:opacity-60"
                  >
                    <Archive size={13} /> Archive
                  </button>
                ) : (
                  <button
                    onClick={() => setInquiryStatus(row.id, "NEW")}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-700/20 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-700/5 transition-colors disabled:opacity-60"
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                )}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-teal-700/60">
              <div>
                <dt className="font-semibold text-teal-700/40 uppercase tracking-wide">Interest</dt>
                <dd>{row.interest || "—"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-teal-700/40 uppercase tracking-wide">Travel Dates</dt>
                <dd>{row.travelDates || "—"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-teal-700/40 uppercase tracking-wide">Travelers</dt>
                <dd>{row.travelers ?? "—"}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-teal-700/80">{row.message}</p>
          </div>
        ))}
        {filtered.length === 0 ? <p className="text-center text-sm text-teal-700/60 py-8">No inquiries match your search.</p> : null}
      </div>
    </div>
  );
}
