"use client";

import Link from "next/link";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { siteConfig } from "@/config/site";

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85%] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl">
            Parth Jewellers
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-10 flex flex-col">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-border py-4 text-base transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 space-y-3 text-sm text-muted-foreground">
          <p>Timeless jewellery for every celebration.</p>

          <Link
            href="/account"
            className="block text-foreground hover:text-accent"
          >
            My Account
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}