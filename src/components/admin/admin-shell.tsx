import type { ReactNode } from "react";

import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  adminName: string;
  children: ReactNode;
};

export function AdminShell({ adminName, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader adminName={adminName} />
        <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
