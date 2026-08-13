interface Bucket {
  count: number;
  resetAt: number;
}

// In-memory fixed-window limiter, fine for a single-instance deployment.
// For multi-instance/serverless production deployments, swap this for a shared
// store such as @upstash/ratelimit backed by Upstash Redis (see .env.example).
function createLimiter(windowMs: number, maxRequests: number) {
  const buckets = new Map<string, Bucket>();

  function limit(key: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (bucket.count >= maxRequests) {
      return { success: false, remaining: 0 };
    }

    bucket.count += 1;
    return { success: true, remaining: maxRequests - bucket.count };
  }

  if (typeof setInterval !== "undefined") {
    setInterval(() => {
      const now = Date.now();
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt < now) buckets.delete(key);
      }
    }, windowMs).unref?.();
  }

  return limit;
}

// Public forms (inquiry, newsletter): 5 requests/minute/IP.
export const rateLimit = createLimiter(60_000, 5);

// Admin login: much stricter — 8 attempts per 5 minutes per IP, on top of the
// per-account exponential lockout in lib/admin/lockout.ts.
export const loginRateLimit = createLimiter(5 * 60_000, 8);

// Admin password reset requests: 3 per 15 minutes per IP, to prevent using the
// endpoint as an email-enumeration or mail-bombing oracle.
export const passwordResetRateLimit = createLimiter(15 * 60_000, 3);
