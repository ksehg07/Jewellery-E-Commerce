"use client";

import Image from "next/image";

import { useSyncExternalStore } from "react";

import { useCartStore } from "@/features/cart/store";

export function OrderSummary() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const items = useCartStore((state) => state.items);

  const subtotal = useCartStore((state) => state.getSubtotal());

  if (!mounted) {
    return (
      <aside className="border border-border p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl">Order Summary</h2>

        <div className="mt-6 space-y-5">
          <div className="h-20 animate-pulse rounded-md bg-secondary" />
          <div className="h-20 animate-pulse rounded-md bg-secondary" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="border border-border p-6 lg:sticky lg:top-24">
      <h2 className="font-display text-2xl">Order Summary</h2>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden bg-secondary">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>

              {item.variantValue ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.variantName}: {item.variantValue}
                </p>
              ) : null}

              <p className="mt-1 text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="text-sm font-medium">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4 border-t border-border pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>

          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>

          <span className="text-muted-foreground">Calculated later</span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="font-medium">Total</span>

          <span className="text-lg font-medium">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </aside>
  );
}
