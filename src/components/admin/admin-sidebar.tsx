"use client";

import Link from "next/link";

import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Settings,
  Tags,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    available: true,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: PackageSearch,
    available: true,
  },
  {
    label: "Categories",
    icon: Tags,
    available: false,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
    available: true,
  },
  {
    label: "Inventory",
    icon: Boxes,
    available: false,
  },
  {
    label: "Settings",
    icon: Settings,
    available: false,
  },
] as const;

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Admin navigation">
      {navigation.map((item) => {
        const Icon = item.icon;

        if (!item.available) {
          return (
            <span
              key={item.label}
              className="flex cursor-not-allowed items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground/60"
              aria-disabled="true"
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
              <span className="ml-auto text-[10px] uppercase tracking-[0.16em]">
                Soon
              </span>
            </span>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-3 bg-secondary px-3 py-2.5 text-sm font-medium text-foreground"
          >
            <Icon className="size-4 text-accent" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/40 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-6">
        <Link href="/admin" className="font-display text-3xl">
          {siteConfig.name}
        </Link>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Admin workspace
        </p>

        <Separator className="my-8" />
        <Navigation />
      </div>
    </aside>
  );
}

export function MobileAdminSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-9 items-center justify-center border border-border lg:hidden"
        aria-label="Open admin navigation"
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="font-display text-3xl font-normal">
            {siteConfig.name}
          </SheetTitle>
          <p className="text-left text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Admin workspace
          </p>
        </SheetHeader>
        <Separator className="my-6" />
        <Navigation />
      </SheetContent>
    </Sheet>
  );
}
