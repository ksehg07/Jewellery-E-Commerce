import "server-only";

import { redirect } from "next/navigation";

import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";

import { getSession } from "./session";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (
    !user ||
    user.status !== UserStatus.ACTIVE ||
    user.role !== UserRole.ADMIN
  ) {
    redirect("/");
  }

  return user;
}