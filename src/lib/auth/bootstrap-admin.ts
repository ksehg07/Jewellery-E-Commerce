"use server";

import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getSession } from "./session";

export async function bootstrapCurrentUserAsAdmin(
  bootstrapSecret: string,
) {
  if (!process.env.ADMIN_BOOTSTRAP_SECRET) {
    throw new Error("ADMIN_BOOTSTRAP_SECRET is not configured.");
  }

  if (bootstrapSecret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
    throw new Error("Invalid bootstrap secret.");
  }

  const session = await getSession();

  if (!session) {
    throw new Error("You must be signed in first.");
  }

  const existingAdmin = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (existingAdmin > 0) {
    throw new Error("An administrator already exists.");
  }

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return user;
}