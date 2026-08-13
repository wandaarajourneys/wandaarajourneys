import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, CSRF_COOKIE } from "@/lib/auth/session";
import { getSessionUser } from "@/lib/admin/session";
import { logActivity } from "@/lib/admin/audit";
import { verifyCsrf } from "@/lib/auth/csrf";
import { isAllowedOrigin } from "@/lib/admin/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req) || !verifyCsrf(req)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  const user = await getSessionUser();

  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(CSRF_COOKIE);

  if (user) {
    await logActivity({ userId: user.id, userEmail: user.email, action: "logout", entity: "AdminUser", entityId: user.id });
  }

  return NextResponse.json({ success: true });
}
