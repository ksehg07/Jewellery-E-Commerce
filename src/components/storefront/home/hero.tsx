import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="border-b border-border">
      <Container>
        <div className="grid min-h-[650px] overflow-hidden lg:grid-cols-2 lg:items-stretch">
          {/* Content */}
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-16">
            <p className="mb-5 text-xs font-medium tracking-[0.25em] text-accent uppercase">
              Crafted for Every Celebration
            </p>

            <h1 className="max-w-xl font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Jewellery that becomes part of your story.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Discover timeless pieces designed to celebrate the moments,
              memories, and traditions that matter most.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop Collection
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <Link href="/collections">
                  Explore Collections
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[450px] lg:min-h-full">
            <Image
              src="/images/hero-jewellery.jpg"
              alt="Premium jewellery collection"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}