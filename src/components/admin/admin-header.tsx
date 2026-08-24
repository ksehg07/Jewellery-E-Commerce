"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

import { MobileAdminSidebar } from "./admin-sidebar";

type AdminHeaderProps = {
  adminName: string;
};

export function AdminHeader({ adminName }: AdminHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <MobileAdminSidebar />
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            Overview
          </p>
          <h1 className="font-display text-2xl sm:text-3xl">Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{adminName}</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
