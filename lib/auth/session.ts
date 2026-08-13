import { SignJWT, jwtVerify } from "jose";
import type { AdminRole } from "@prisma/client";

export const SESSION_COOKIE = "wandaara_admin_session";
export const CSRF_COOKIE = "wandaara_admin_csrf";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export interface SessionPayload {
  sub: string;
  email: string;
  role: AdminRole;
  name: string;
  forcePasswordChange: boolean;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set (or too short). Set a random 32+ char value in your environment.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string" &&
      typeof payload.name === "string"
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role as AdminRole,
        name: payload.name,
        forcePasswordChange: Boolean(payload.forcePasswordChange),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAgeSeconds = SESSION_TTL_SECONDS) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function csrfCookieOptions(maxAgeSeconds = SESSION_TTL_SECONDS) {
  return {
    name: CSRF_COOKIE,
    httpOnly: false, // must be readable by client JS to echo back as a header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function generateCsrfToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}
