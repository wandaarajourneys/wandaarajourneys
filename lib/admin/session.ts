import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import type { AdminUser } from "@prisma/client";

export type SessionUser = Pick<
  AdminUser,
  "id" | "email" | "name" | "role" | "forcePasswordChange"
>;

// Re-checks the session against the database on every call (not just the JWT
// signature) so a deleted/locked account or a role change takes effect
// immediately, without waiting for token expiry. Middleware does the fast,
// DB-free redirect; this is the authoritative server-side check every admin
// route handler and server action must call before doing anything mutating.
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, forcePasswordChange: true, lockedUntil: true },
  });

  if (!user) return null;
  if (user.lockedUntil && user.lockedUntil > new Date()) return null;

  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
