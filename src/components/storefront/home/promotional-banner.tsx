import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function PromotionalBanner() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative min-h-[600px] overflow-hidden">
          <Image
            src="/images/festive-collection.jpg"
            alt="Festive jewellery collection"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="relative flex min-h-[600px] max-w-2xl flex-col justify-end p-8 text-white sm:p-12 lg:p-16">
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-white/80">
              Festive Collection
            </p>

            <h2 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
              Celebrate every tradition in timeless style.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Discover pieces created to bring a little more brilliance
              to every celebration.
            </p>

            <div className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/collections/festive">
                  Explore the Collection
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}