"use client";

import { useState } from "react";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCartStore } from "@/features/cart/store";

import type {
  MockProduct,
  MockProductVariant,
} from "@/features/products/data/mock-products";

type ProductInfoProps = {
  product: MockProduct;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<MockProductVariant | null>(product.variants?.[0] ?? null);

  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant?.price ?? product.price;

  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    const cartItemId = `${product.id}-${selectedVariant?.id ?? "default"}`;

    addItem({
      id: cartItemId,

      productId: product.id,

      variantId: selectedVariant?.id,

      name: product.name,

      slug: product.slug,

      image: product.image,

      price,

      quantity,

      variantName: selectedVariant?.name,

      variantValue: selectedVariant?.value,
    });
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {product.category}
          </p>

          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            ₹{price.toLocaleString("en-IN")}
          </p>

          {product.shortDescription ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              {product.shortDescription}
            </p>
          ) : null}
        </div>

        {product.variants && product.variants.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium">{product.variants[0].name}</p>

            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`min-w-12 border px-4 py-2 text-sm transition-colors ${
                    selectedVariant?.id === variant.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Quantity</p>

          <div className="flex w-fit items-center border border-border">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex size-11 items-center justify-center hover:bg-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>

            <span className="flex size-11 items-center justify-center text-sm">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="inline-flex size-11 items-center justify-center hover:bg-secondary"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
