import "server-only";
import { prisma } from "@/lib/prisma";

const LOCK_THRESHOLD = 5;
const MAX_BACKOFF_MINUTES = 60;

export function isLocked(user: { lockedUntil: Date | null }): boolean {
  return Boolean(user.lockedUntil && user.lockedUntil > new Date());
}

// Exponential backoff once the failure threshold is hit: 2, 4, 8, 16... minutes,
// capped at an hour, so repeated guessing gets progressively more expensive
// without permanently locking a legitimate owner out.
export async function registerFailedLogin(userId: string, currentAttempts: number) {
  const attempts = currentAttempts + 1;
  const data: { failedLoginAttempts: number; lockedUntil?: Date } = { failedLoginAttempts: attempts };

  if (attempts >= LOCK_THRESHOLD) {
    const backoffMinutes = Math.min(2 ** (attempts - LOCK_THRESHOLD + 1), MAX_BACKOFF_MINUTES);
    data.lockedUntil = new Date(Date.now() + backoffMinutes * 60_000);
  }

  await prisma.adminUser.update({ where: { id: userId }, data });
}

export async function registerSuccessfulLogin(userId: string) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
}
