import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin requests (no CORS preflight) omit Origin on some clients
  const allowed = new Set(
    [
      process.env.NEXT_PUBLIC_SITE_URL,
      `http://${req.headers.get("host")}`,
      `https://${req.headers.get("host")}`,
    ].filter(Boolean),
  );
  return allowed.has(origin);
}
