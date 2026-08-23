"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  useCartStore,
} from "@/features/cart/store";

import type {
  CartItem as CartItemType,
} from "@/features/cart/types";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({
  item,
}: CartItemProps) {
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity,
  );

  const removeItem = useCartStore(
    (state) => state.removeItem,
  );

  return (
    <article className="flex gap-4 border-b border-border py-5">
      <Link
        href={`/product/${item.slug}`}
        className="relative size-24 shrink-0 overflow-hidden bg-secondary"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-medium"
            >
              {item.name}
            </Link>

            {item.variantValue ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {item.variantName}:{" "}
                {item.variantValue}
              </p>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              removeItem(item.id)
            }
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1,
                )
              }
              className="inline-flex size-8 items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>

            <span className="flex w-8 justify-center text-sm">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity + 1,
                )
              }
              className="inline-flex size-8 items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <p className="text-sm font-medium">
            ₹
            {(
              item.price * item.quantity
            ).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </article>
  );
}