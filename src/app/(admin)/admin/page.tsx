import { redirect } from "next/navigation";

import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getSession } from "@/lib/auth/session";

export default async function AdminEntryPage() {
  const session = await getSession();

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
        status: true,
      },
    });

    if (
      user?.role === UserRole.ADMIN &&
      user.status === UserStatus.ACTIVE
    ) {
      redirect("/admin/dashboard");
    }
  }

  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (adminCount === 0) {
    redirect("/admin/setup");
  }

  redirect("/admin/login");
}