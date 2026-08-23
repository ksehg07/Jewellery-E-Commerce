import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { mockProducts } from "@/features/products/data/mock-products";

const collections = Array.from(
  mockProducts.reduce((map, product) => {
    const existing = map.get(product.category) ?? {
      name: product.category,
      image: product.image,
      count: 0,
    };

    existing.count += 1;
    map.set(product.category, existing);

    return map;
  }, new Map<string, { name: string; image: string; count: number }>()),
  ([, collection]) => collection,
);

export default function CollectionsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Curated Collections
        </p>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Jewellery for every chapter of life.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
          Discover refined essentials and statement pieces designed to celebrate
          moments that deserve lasting beauty, from everyday rituals to life&apos;s
          grandest occasions.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {collections.map((collection) => (
          <Link
            key={collection.name}
            href="/shop"
            className="group relative block overflow-hidden rounded-2xl border border-border bg-secondary"
          >
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
                  Collection
                </p>
                <h2 className="mt-2 font-display text-3xl leading-none">
                  {collection.name}
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <span>{collection.count} Pieces</span>
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
