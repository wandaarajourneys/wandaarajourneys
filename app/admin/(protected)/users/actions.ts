"use server";

import { revalidatePath } from "next/cache";
import { AdminRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUsers() {
  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      }
    });
    return { success: true, users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as AdminRole;

  try {
    // Mock hash
    const passwordHash = `mock-hash-${password}`;

    await prisma.adminUser.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
        isActive: true,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to add user:", error);
    return { success: false, error: "Failed to add user" };
  }
}

export async function updateUserRole(userId: string, role: AdminRole) {
  try {
    await prisma.adminUser.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update role" };
  }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  try {
    await prisma.adminUser.update({
      where: { id: userId },
      data: { isActive },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const passwordHash = `mock-hash-${newPassword}`;
    await prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash, forcePasswordChange: true },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reset password" };
  }
}
