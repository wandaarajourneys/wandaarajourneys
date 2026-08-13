import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/audit";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["Date", "Name", "Email", "Phone", "Interest", "Travel Dates", "Travelers", "Message", "Status"];
  const rows = inquiries.map((i) =>
    [
      i.createdAt.toISOString(),
      i.name,
      i.email,
      i.phone,
      i.interest ?? "",
      i.travelDates ?? "",
      i.travelers?.toString() ?? "",
      i.message,
      i.status,
    ]
      .map((v) => csvEscape(String(v)))
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  await logActivity({
    userId: user.id,
    userEmail: user.email,
    action: "export",
    entity: "Inquiry",
    metadata: { count: inquiries.length },
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wandaara-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
