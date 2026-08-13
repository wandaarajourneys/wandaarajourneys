import "server-only";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/admin/session";
import type { Prisma } from "@prisma/client";

interface LogActivityParams {
  userId: string | null;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
}

export async function logActivity(params: LogActivityParams) {
  await prisma.adminActivityLog.create({
    data: {
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      metadata: params.metadata,
    },
  });
}

// Convenience wrapper for the common case: an authenticated admin performing
// a CRUD mutation. Login/logout/failed-login events go through logActivity
// directly since they don't always have a full session.
export async function logAdminActivity(
  user: SessionUser,
  action: string,
  entity: string,
  entityId?: string | null,
  metadata?: Prisma.InputJsonValue,
) {
  await logActivity({ userId: user.id, userEmail: user.email, action, entity, entityId, metadata });
}
