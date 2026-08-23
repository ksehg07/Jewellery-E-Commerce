"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type ShopToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function ShopToolbar({
  searchQuery,
  onSearchChange,
}: ShopToolbarProps) {
  return (
    <div className="border-y border-border">
      <div className="container flex items-center justify-between gap-4 py-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchQuery}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search jewellery..."
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}