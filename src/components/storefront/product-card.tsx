import Image from "next/image";
import Link from "next/link";

import { Heart } from "lucide-react";

import type { MockProduct } from "@/features/products/data/mock-products";

type ProductCardProps = {
  product: MockProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.badge ? (
          <span className="absolute left-3 top-3 z-10 bg-background px-3 py-1 text-[10px] font-medium tracking-widest uppercase">
            {product.badge}
          </span>
        ) : null}

        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center bg-background/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="space-y-2 pt-4">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium transition-colors hover:text-accent"
        >
          {product.name}
        </Link>

        <p className="text-sm text-muted-foreground">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}