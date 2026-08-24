import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";
import { getSession } from "@/lib/auth/session";

export default async function AdminLoginPage() {
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-8 shadow-sm sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            NPJ Jewellery
          </p>

          <h1 className="mt-4 font-display text-4xl">
            Admin workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in to manage the store.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}