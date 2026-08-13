import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation/admin/auth";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/auth/resetToken";
import { sendAdminPasswordResetEmail } from "@/lib/email";
import { passwordResetRateLimit } from "@/lib/ratelimit";
import { getClientIp, isAllowedOrigin } from "@/lib/admin/security";
import { logActivity } from "@/lib/admin/audit";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 1_000;

// Always returns a generic success message, whether or not the email exists,
// so this endpoint can't be used to enumerate admin accounts.
const GENERIC_RESPONSE = {
  success: true,
  message: "If that email is registered, a password reset link has been sent.",
};

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const ip = getClientIp(req);
    const { success } = passwordResetRateLimit(`forgot-password:${ip}`);
    if (!success) {
      return NextResponse.json(GENERIC_RESPONSE); // still generic — don't reveal rate limiting either
    }

    const raw = await req.text();
    const parsed = forgotPasswordSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (user) {
      const { token, tokenHash } = generateResetToken();
      await prisma.adminUser.update({
        where: { id: user.id },
        data: {
          resetTokenHash: tokenHash,
          resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      });

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      const resetUrl = `${siteUrl}/admin/reset-password?token=${token}`;
      await sendAdminPasswordResetEmail(user.email, resetUrl);
      await logActivity({
        userId: user.id,
        userEmail: user.email,
        action: "password_reset_requested",
        entity: "AdminUser",
        entityId: user.id,
        metadata: { ip },
      });
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("[api/admin/auth/forgot-password] Unexpected error:", error);
    return NextResponse.json(GENERIC_RESPONSE);
  }
}
