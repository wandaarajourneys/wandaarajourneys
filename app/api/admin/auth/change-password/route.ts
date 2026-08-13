import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/admin/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { changePasswordSchema } from "@/lib/validation/admin/auth";
import { logActivity } from "@/lib/admin/audit";
import { verifyCsrf } from "@/lib/auth/csrf";
import { isAllowedOrigin } from "@/lib/admin/security";
import { signSession, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 2_000;

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req) || !verifyCsrf(req)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const raw = await req.text();
    const parsed = changePasswordSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form for errors.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const dbUser = await prisma.adminUser.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const currentValid = await verifyPassword(parsed.data.currentPassword, dbUser.passwordHash);
    if (!currentValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const newHash = await hashPassword(parsed.data.newPassword);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newHash, forcePasswordChange: false },
    });

    // Re-issue the session with the cleared flag so the forced-change redirect
    // (driven by the JWT claim in middleware) lifts immediately, without
    // requiring the admin to log out and back in.
    const token = await signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      forcePasswordChange: false,
    });
    const store = await cookies();
    store.set({ ...sessionCookieOptions(), value: token });

    await logActivity({
      userId: user.id,
      userEmail: user.email,
      action: "password_changed",
      entity: "AdminUser",
      entityId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/auth/change-password] Unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
