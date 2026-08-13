"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/admin/session";
import { logAdminActivity } from "@/lib/admin/audit";
import type { InquiryStatus } from "@prisma/client";

type ActionResult<T = undefined> = { success: true; data: T } | { success: false; error: string };

export async function listInquiriesForAdmin() {
  await requireAdmin();
  return prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<ActionResult> {
  let user;
  try {
    user = await requireAdmin();
  } catch (e) {
    if (e instanceof UnauthorizedError) return { success: false, error: "Unauthorized." };
    throw e;
  }

  await prisma.inquiry.update({ where: { id }, data: { status } });
  await logAdminActivity(user, "update_status", "Inquiry", id, { status });
  revalidatePath("/admin/inquiries");
  return { success: true, data: undefined };
}
