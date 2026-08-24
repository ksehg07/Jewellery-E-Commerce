import { redirect } from "next/navigation";

import { AdminSetupForm } from "@/components/admin/admin-setup-form";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma/client";

export default async function AdminSetupPage() {
  const adminCount = await prisma.user.count({
    where: {
      role: UserRole.ADMIN,
    },
  });

  if (adminCount > 0) {
    redirect("/admin/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-8 shadow-sm sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            First-time setup
          </p>

          <h1 className="mt-4 font-display text-4xl">
            Create administrator
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This setup is available only while the database has no
            administrator.
          </p>

          <div className="mt-8">
            <AdminSetupForm />
          </div>
        </div>
      </div>
    </main>
  );
}