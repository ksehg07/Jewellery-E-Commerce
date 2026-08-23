import Link from "next/link";

import { ArrowLeft, Gem } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <Gem className="mx-auto size-10 text-accent" />

        <p className="mt-8 text-sm font-medium tracking-[0.25em] text-muted-foreground uppercase">
          Error 404
        </p>

        <h1 className="mt-3 font-display text-5xl">
          This piece is no longer here
        </h1>

        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          The page you&apos;re looking for may have moved, been
          removed, or perhaps it never existed.
        </p>

        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  );
}