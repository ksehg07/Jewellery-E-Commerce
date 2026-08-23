"use client";

import Link from "next/link";

import { useSyncExternalStore } from "react";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

import { CartItem } from "@/components/storefront/cart/cart-item";
import { useCartStore } from "@/features/cart/store";

export default function CartPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const items = useCartStore((state) => state.items);

  const subtotal = useCartStore((state) => state.getSubtotal());

  if (!mounted) {
    return (
      <Container className="py-12 sm:py-20">
        <h1 className="font-display text-5xl">Your Cart</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-md border border-border bg-secondary" />
            <div className="h-28 animate-pulse rounded-md border border-border bg-secondary" />
          </div>

          <div className="h-52 animate-pulse rounded-md border border-border bg-secondary" />
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />

          <h1 className="mt-6 font-display text-4xl">
            Your cart is empty
          </h1>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Discover timeless jewellery and find
            something worth treasuring.
          </p>

          <Button asChild className="mt-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-20">
      <h1 className="font-display text-5xl">Your Cart</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="h-fit border border-border p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order Summary</h2>

          <div className="mt-6 flex items-center justify-between border-b border-border pb-5">
            <span className="text-sm text-muted-foreground">Subtotal</span>

            <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="mt-6">
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  );
}