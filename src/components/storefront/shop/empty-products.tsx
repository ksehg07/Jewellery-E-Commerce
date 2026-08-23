import Link from "next/link";

import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyProducts() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <SearchX className="size-10 text-muted-foreground" />

      <h2 className="mt-5 font-display text-3xl">
        No jewellery found
      </h2>

      <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
        We couldn&apos;t find any pieces matching your selection.
        Try exploring another category.
      </p>

      <Button asChild variant="outline" className="mt-6">
        <Link href="/shop">
          View All Jewellery
        </Link>
      </Button>
    </div>
  );
}