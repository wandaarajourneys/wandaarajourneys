import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, sessionCookieOptions, csrfCookieOptions, generateCsrfToken } from "@/lib/auth/session";
import { isLocked, registerFailedLogin, registerSuccessfulLogin } from "@/lib/admin/lockout";
import { logActivity } from "@/lib/admin/audit";
import { loginRateLimit } from "@/lib/ratelimit";
import { getClientIp, isAllowedOrigin } from "@/lib/admin/security";
import { loginSchema } from "@/lib/validation/admin/auth";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 2_000;
const GENERIC_ERROR = "Invalid email or password.";

// A fixed dummy hash so a login for a non-existent email still runs bcrypt.compare,
// keeping response timing similar to a real (wrong-password) attempt.
const DUMMY_HASH = "$2b$12$8P5YnVeUDuDR8wBK6o0Im.7z18qv6H/vDf9X5s8GccwWY4.RmmCEO";

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
    const { success } = loginRateLimit(`login:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts from this network. Please try again in a few minutes." },
        { status: 429 },
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const parsed = loginSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      await verifyPassword(password, DUMMY_HASH); // constant-time-ish decoy
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    if (isLocked(user)) {
      return NextResponse.json(
        {
          error:
            "This account is temporarily locked due to repeated failed sign-in attempts. Please try again later.",
        },
        { status: 423 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await registerFailedLogin(user.id, user.failedLoginAttempts);
      await logActivity({
        userId: user.id,
        userEmail: user.email,
        action: "login_failed",
        entity: "AdminUser",
        entityId: user.id,
        metadata: { ip },
      });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    await registerSuccessfulLogin(user.id);

    const token = await signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      forcePasswordChange: user.forcePasswordChange,
    });
    const csrfToken = generateCsrfToken();

    const store = await cookies();
    store.set({ ...sessionCookieOptions(), value: token });
    store.set({ ...csrfCookieOptions(), value: csrfToken });

    await logActivity({
      userId: user.id,
      userEmail: user.email,
      action: "login_success",
      entity: "AdminUser",
      entityId: user.id,
      metadata: { ip },
    });

    return NextResponse.json({
      success: true,
      forcePasswordChange: user.forcePasswordChange,
    });
  } catch (error) {
    console.error("[api/admin/auth/login] Unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
