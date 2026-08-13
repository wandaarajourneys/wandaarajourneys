import type { NextRequest } from "next/server";
import { CSRF_COOKIE } from "@/lib/auth/session";

// Double-submit cookie CSRF check, layered on top of the SameSite=Strict session
// cookie for defense in depth on authenticated mutation routes. The token is
// issued at login (readable, non-HttpOnly cookie) and must be echoed back by
// the client as a custom header — a cross-site request can trigger the cookie
// to be sent automatically, but cannot read it to set the matching header.
export function verifyCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get("x-csrf-token");
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}
