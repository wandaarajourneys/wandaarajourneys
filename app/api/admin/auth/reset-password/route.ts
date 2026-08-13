import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation/admin/auth";
import { hashResetToken } from "@/lib/auth/resetToken";
import { hashPassword } from "@/lib/auth/password";
import { isAllowedOrigin } from "@/lib/admin/security";
import { logActivity } from "@/lib/admin/audit";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 2_000;

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const raw = await req.text();
    const parsed = resetPasswordSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form for errors.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const tokenHash = hashResetToken(parsed.data.token);
    const target = await prisma.adminUser.findFirst({ where: { resetTokenHash: tokenHash } });

    if (!target || !target.resetTokenExpiresAt || target.resetTokenExpiresAt < new Date()) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const newHash = await hashPassword(parsed.data.newPassword);
    await prisma.adminUser.update({
      where: { id: target.id },
      data: {
        passwordHash: newHash,
        forcePasswordChange: false,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await logActivity({
      userId: target.id,
      userEmail: target.email,
      action: "password_reset_completed",
      entity: "AdminUser",
      entityId: target.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/auth/reset-password] Unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
