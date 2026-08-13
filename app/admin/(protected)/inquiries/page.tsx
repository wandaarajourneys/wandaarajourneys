import type { Metadata } from "next";
import { listInquiriesForAdmin } from "@/lib/admin/actions/inquiries";
import { InquiriesTable } from "@/components/admin/InquiriesTable";

export const metadata: Metadata = { title: "Inquiries" };
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const rows = await listInquiriesForAdmin();
  const newCount = rows.filter((r) => r.status === "NEW").length;

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Inquiries</h1>
      <p className="mt-1 text-sm text-teal-700/60">{rows.length} total · {newCount} new</p>
      <div className="mt-6">
        <InquiriesTable rows={rows} />
      </div>
    </div>
  );
}
