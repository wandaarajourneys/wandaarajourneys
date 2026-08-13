import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

// Public within the /admin and /api/admin namespaces — reachable without a
// session so a user can actually log in / reset a forgotten password.
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/reset-password",
  "/api/admin/auth/login",
  "/api/admin/auth/forgot-password",
  "/api/admin/auth/reset-password",
  "/api/admin/seed",
]);

// Fast, DB-free gate: verifies the JWT signature/expiry and redirects
// unauthenticated requests before they ever reach a page or API route. The
// authoritative check (DB lookup, lockout, forced-password-change) happens in
// requireAdmin()/getSessionUser() on the server for every actual request.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.has(pathname);

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Forced password change: this JWT claim can go stale for up to one
  // session (it's refreshed on every successful password change), which is
  // an acceptable trade-off for not hitting the DB on every request here —
  // getSessionUser() re-checks the authoritative DB value for real mutations.
  if (session.forcePasswordChange && pathname !== "/admin/settings" && !pathname.startsWith("/api/admin/auth")) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Password change required." }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin/settings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
