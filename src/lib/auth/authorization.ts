import "server-only";

import { UserRole, UserStatus } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma/client";
import { requireUser } from "./user";

export async function requireActiveUser() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new Error("ACCOUNT_INACTIVE");
  }

  return user;
}

export async function requireRole(...allowedRoles: UserRole[]) {
  const user = await requireActiveUser();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(UserRole.ADMIN);
}